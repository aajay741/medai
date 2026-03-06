<?php

class ZohoInvoiceService {
    private static $accessToken = null;

    // ── AUTH ────────────────────────────────────────────────────────────────────
    public static function getAccessToken() {
        if (self::$accessToken !== null) return self::$accessToken;

        $cacheFile = __DIR__ . '/zoho_token_cache.json';
        if (file_exists($cacheFile)) {
            $cache = json_decode(file_get_contents($cacheFile), true);
            if ($cache && isset($cache['access_token']) && $cache['expires_at'] > time() + 60) {
                self::$accessToken = $cache['access_token'];
                return self::$accessToken;
            }
        }

        error_log("Zoho: Fetching fresh access token...");
        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL            => ZOHO_AUTH_URL,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => http_build_query([
                'refresh_token' => ZOHO_REFRESH_TOKEN,
                'client_id'     => ZOHO_CLIENT_ID,
                'client_secret' => ZOHO_CLIENT_SECRET,
                'grant_type'    => 'refresh_token'
            ]),
            CURLOPT_IPRESOLVE      => CURL_IPRESOLVE_V4,
            CURLOPT_CONNECTTIMEOUT => 5
        ]);

        $rawResponse = curl_exec($curl);
        $response = json_decode($rawResponse, true);
        curl_close($curl);

        if (isset($response['access_token'])) {
            self::$accessToken = $response['access_token'];
            file_put_contents($cacheFile, json_encode([
                'access_token' => self::$accessToken,
                'expires_at'   => time() + ($response['expires_in'] ?? 3550)
            ]));
            return self::$accessToken;
        }

        error_log("Zoho Auth Failed: " . $rawResponse);
        throw new Exception("Failed to get Zoho Access Token: " . ($response['error'] ?? 'Unknown error'));
    }

    // ── CUSTOMER ────────────────────────────────────────────────────────────────
    public static function getOrCreateCustomer($bookingData) {
        $name  = $bookingData['name'];
        $email = $bookingData['email'];
        $phone = $bookingData['phone'];
        $token = self::getAccessToken();

        error_log("Zoho: Searching/Creating customer for $email");

        // 1. Check dedicated cache table (ULTRA FAST)
        try {
            $db = Database::getInstance()->getConnection();
            $stmt = $db->prepare("SELECT zoho_customer_id FROM zoho_customers WHERE email = ? LIMIT 1");
            $stmt->execute([$email]);
            $cachedId = $stmt->fetchColumn();
            if ($cachedId) {
                error_log("Item found in dedicated cache: $cachedId");
                return $cachedId;
            }

            // Fallback to bookings table for legacy
            $stmt = $db->prepare("SELECT zoho_customer_id FROM bookings WHERE email = ? AND zoho_customer_id IS NOT NULL ORDER BY id DESC LIMIT 1");
            $stmt->execute([$email]);
            $cachedId = $stmt->fetchColumn();
            if ($cachedId) {
                // Sync to dedicated table
                $db->prepare("INSERT IGNORE INTO zoho_customers (email, zoho_customer_id, name, phone) VALUES (?, ?, ?, ?)")
                   ->execute([$email, $cachedId, $name, $phone]);
                return $cachedId;
            }
        } catch (Exception $e) {
            error_log("Zoho Cache check failed: " . $e->getMessage());
        }

        // 2. Search by email in Zoho
        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL            => ZOHO_BASE_URL . "/contacts?email=" . urlencode($email) . "&organization_id=" . ZOHO_ORGANIZATION_ID,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_IPRESOLVE      => CURL_IPRESOLVE_V4,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_HTTPHEADER     => ["Authorization: Zoho-oauthtoken $token"]
        ]);
        $response = json_decode(curl_exec($curl), true);
        curl_close($curl);

        if (!empty($response['contacts'])) {
            $contactId = $response['contacts'][0]['contact_id'];
            error_log("Zoho: Found existing contact by email: $contactId");
            return $contactId;
        }

        // 2b. Secondary Search: By Contact Name (Zoho requires unique names in many orgs)
        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL            => ZOHO_BASE_URL . "/contacts?contact_name=" . urlencode($name) . "&organization_id=" . ZOHO_ORGANIZATION_ID,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_IPRESOLVE      => CURL_IPRESOLVE_V4,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_HTTPHEADER     => ["Authorization: Zoho-oauthtoken $token"]
        ]);
        $response = json_decode(curl_exec($curl), true);
        curl_close($curl);

        if (!empty($response['contacts'])) {
            $contactId = $response['contacts'][0]['contact_id'];
            error_log("Zoho: Found existing contact by name: $contactId");
            return $contactId;
        }

        error_log("Zoho: Creating new customer...");
        // 3. Create new customer
        $curl = curl_init();
        
        $billing_addr = mb_substr($bookingData['billing_address'] ?? '', 0, 80);
        $city = mb_substr($bookingData['city'] ?? '', 0, 40);
        $state = mb_substr($bookingData['state'] ?? '', 0, 40);
        
        $contactData = [
            'contact_name'    => $name,
            'company_name'    => $bookingData['company_name'] ?? '',
            'contact_type'    => 'customer',
            'gst_no'          => $bookingData['gst_number'] ?? '',
            'contact_persons' => [[
                'first_name'         => $name,
                'email'              => $email,
                'phone'              => $phone,
                'is_primary_contact' => true
            ]],
            'billing_address' => [
                'address' => $billing_addr,
                'city'    => $city,
                'state'   => $state,
                'zip'     => mb_substr($bookingData['zip'] ?? '', 0, 15),
                'country' => 'India'
            ]
        ];

        curl_setopt_array($curl, [
            CURLOPT_URL            => ZOHO_BASE_URL . "/contacts?organization_id=" . ZOHO_ORGANIZATION_ID,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => json_encode($contactData),
            CURLOPT_IPRESOLVE      => CURL_IPRESOLVE_V4,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_HTTPHEADER     => [
                "Authorization: Zoho-oauthtoken $token",
                "Content-Type: application/json"
            ]
        ]);

        $response = json_decode(curl_exec($curl), true);
        curl_close($curl);

        if (isset($response['contact']['contact_id'])) {
            $cid = $response['contact']['contact_id'];
            error_log("Zoho: Created new customer ID: " . $cid);
            
            // Persistent cache
            try {
                $db->prepare("INSERT IGNORE INTO zoho_customers (email, zoho_customer_id, name, phone) VALUES (?, ?, ?, ?)")
                   ->execute([$email, $cid, $name, $phone]);
            } catch(Exception $e) {}

            return $cid;
        }

        // 3b. Handle "Contact Name already exists" error by re-searching one last time
        if (isset($response['message']) && strpos($response['message'], 'already exists') !== false) {
             error_log("Zoho: Creation failed because name exists. Retrying search...");
             $curl = curl_init();
             curl_setopt_array($curl, [
                 CURLOPT_URL            => ZOHO_BASE_URL . "/contacts?contact_name=" . urlencode($name) . "&organization_id=" . ZOHO_ORGANIZATION_ID,
                 CURLOPT_RETURNTRANSFER => true,
                 CURLOPT_IPRESOLVE      => CURL_IPRESOLVE_V4,
                 CURLOPT_HTTPHEADER     => ["Authorization: Zoho-oauthtoken $token"]
             ]);
             $response = json_decode(curl_exec($curl), true);
             curl_close($curl);
             if (!empty($response['contacts'])) {
                 return $response['contacts'][0]['contact_id'];
             }
        }

        error_log("Zoho: Failed to create customer - " . json_encode($response));
        throw new Exception("Failed to create Zoho Contact: " . ($response['message'] ?? 'Unknown error'));
    }

    // ── CREATE INVOICE ──────────────────────────────────────────────────────────
    public static function createInvoice($bookingData) {
        error_log("Zoho: Starting createInvoice process...");
        $token      = self::getAccessToken();
        $customerId = self::getOrCreateCustomer($bookingData);

        $description = "Booking: " . $bookingData['event_date'] . " at " . $bookingData['event_time']
                     . " | " . $bookingData['ticket_type'] . " × " . $bookingData['quantity'];
        
        if (!empty($bookingData['special_requests'])) {
            $description .= " | " . $bookingData['special_requests'];
        }
        
        $description .= " | Ref: " . $bookingData['booking_reference'];

        $lineItem = [
            'name'           => $bookingData['show_title'] . " — " . $bookingData['location'],
            'description'    => $description,
            'rate'           => $bookingData['price_per_unit'],
            'quantity'       => $bookingData['quantity'],
            'tax_name'       => 'GST (18%)',
            'tax_percentage' => 18
        ];

        // Attach GST tax if configured
        if (defined('ZOHO_GST_TAX_ID') && ZOHO_GST_TAX_ID) {
            $lineItem['tax_id'] = ZOHO_GST_TAX_ID;
        }

        $invoiceData = [
            'customer_id'      => $customerId,
            'reference_number' => $bookingData['booking_reference'],
            'date'             => date('Y-m-d'),
            'payment_terms'    => 0,
            'notes'            => 'Thank you for booking with MEDAI!',
            'line_items'       => [$lineItem]
        ];

        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL            => ZOHO_BASE_URL . "/invoices?organization_id=" . ZOHO_ORGANIZATION_ID,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => json_encode($invoiceData),
            CURLOPT_IPRESOLVE      => CURL_IPRESOLVE_V4,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_TIMEOUT        => 10,
            CURLOPT_HTTPHEADER     => [
                "Authorization: Zoho-oauthtoken $token",
                "Content-Type: application/json"
            ]
        ]);

        $rawResponse = curl_exec($curl);
        if (curl_errno($curl)) {
            error_log("Zoho Invoice Posting CURL Error: " . curl_error($curl));
            throw new Exception("CURL Error: " . curl_error($curl));
        }
        $response = json_decode($rawResponse, true);
        curl_close($curl);

        if (isset($response['code']) && $response['code'] === 0 && isset($response['invoice']['invoice_id'])) {
            $invoice = $response['invoice'];
            error_log("Zoho: Invoice created successfully: " . $invoice['invoice_id']);
            return [
                'invoice_id'     => $invoice['invoice_id'],
                'invoice_url'    => $invoice['invoice_url'] ?? null,
                'invoice_number' => $invoice['invoice_number'] ?? null,
                'customer_id'    => $customerId
            ];
        }

        error_log("Zoho: Invoice creation failed - " . $rawResponse);
        throw new Exception("Zoho Invoice Error: " . ($response['message'] ?? $rawResponse));
    }

    // ── SEND INVOICE EMAIL VIA ZOHO ─────────────────────────────────────────────
    public static function sendInvoiceEmail($invoiceId, $token = null) {
        try {
            if (!$token) $token = self::getAccessToken();

            $curl = curl_init();
            curl_setopt_array($curl, [
                CURLOPT_URL            => ZOHO_BASE_URL . "/invoices/{$invoiceId}/email?organization_id=" . ZOHO_ORGANIZATION_ID,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST           => true,
                CURLOPT_POSTFIELDS     => json_encode([
                    'send_from_org_email_id' => false,
                    'to_mail_ids'            => [], // uses customer email from invoice
                    'subject'                => 'Your MEDAI Booking Invoice',
                    'body'                   => "Dear Customer,\n\nThank you for your booking with MEDAI!\nPlease find your invoice attached.\n\nWarm regards,\nMEDAI Team"
                ]),
                CURLOPT_HTTPHEADER     => [
                    "Authorization: Zoho-oauthtoken $token",
                    "Content-Type: application/json"
                ]
            ]);

            $response = json_decode(curl_exec($curl), true);
            curl_close($curl);

            return isset($response['code']) && $response['code'] === 0;

        } catch (Exception $e) {
            error_log("Zoho Email Error: " . $e->getMessage());
            return false;
        }
    }

    // ── GET INVOICE PDF DOWNLOAD URL ────────────────────────────────────────────
    public static function getInvoicePdfUrl($invoiceId) {
        try {
            $token = self::getAccessToken();
            // Zoho direct PDF link
            return ZOHO_BASE_URL . "/invoices/{$invoiceId}?organization_id=" . ZOHO_ORGANIZATION_ID
                 . "&accept=pdf&authtoken=" . $token;
        } catch (Exception $e) {
            error_log("Zoho PDF URL Error: " . $e->getMessage());
            return null;
        }
    }

    // ── GET INVOICE PORTAL / PUBLIC LINK ────────────────────────────────────────
    public static function getInvoicePortalUrl($invoiceId) {
        try {
            $token = self::getAccessToken();

            $curl = curl_init();
            curl_setopt_array($curl, [
                CURLOPT_URL            => ZOHO_BASE_URL . "/invoices/{$invoiceId}?organization_id=" . ZOHO_ORGANIZATION_ID,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_HTTPHEADER     => ["Authorization: Zoho-oauthtoken $token"]
            ]);
            $response = json_decode(curl_exec($curl), true);
            curl_close($curl);

            // Return the invoice_url if available
            if (!empty($response['invoice']['invoice_url'])) {
                return $response['invoice']['invoice_url'];
            }

            return null;
        } catch (Exception $e) {
            error_log("Zoho Invoice Portal URL Error: " . $e->getMessage());
            return null;
        }
    }
}

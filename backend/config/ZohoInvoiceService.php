<?php

class ZohoInvoiceService {
    private static $accessToken = null;

    /**
     * Get a fresh access token using the refresh token
     */
    private static function getAccessToken() {
        if (self::$accessToken !== null) return self::$accessToken;

        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => ZOHO_AUTH_URL,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => http_build_query([
                'refresh_token' => ZOHO_REFRESH_TOKEN,
                'client_id' => ZOHO_CLIENT_ID,
                'client_secret' => ZOHO_CLIENT_SECRET,
                'grant_type' => 'refresh_token'
            ])
        ]);

        $response = json_decode(curl_exec($curl), true);
        curl_close($curl);

        if (isset($response['access_token'])) {
            self::$accessToken = $response['access_token'];
            return self::$accessToken;
        }

        throw new Exception("Failed to get Zoho Access Token: " . ($response['error'] ?? 'Unknown error'));
    }

    /**
     * Search for an existing customer or create a new one
     */
    public static function getOrCreateCustomer($name, $email, $phone) {
        $token = self::getAccessToken();
        
        // Search by email
        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => ZOHO_BASE_URL . "/contactpersons?email=" . urlencode($email) . "&organization_id=" . ZOHO_ORGANIZATION_ID,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => ["Authorization: Zoho-oauthtoken $token"]
        ]);
        
        $response = json_decode(curl_exec($curl), true);
        curl_close($curl);

        if (!empty($response['contact_persons'])) {
            return $response['contact_persons'][0]['contact_id'];
        }

        // Create new customer if not found
        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => ZOHO_BASE_URL . "/contacts?organization_id=" . ZOHO_ORGANIZATION_ID,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode([
                'contact_name' => $name,
                'contact_type' => 'customer',
                'contact_persons' => [[
                    'first_name' => $name,
                    'email' => $email,
                    'phone' => $phone,
                    'is_primary_contact' => true
                ]]
            ]),
            CURLOPT_HTTPHEADER => [
                "Authorization: Zoho-oauthtoken $token",
                "Content-Type: application/json"
            ]
        ]);

        $response = json_decode(curl_exec($curl), true);
        curl_close($curl);

        if (isset($response['contact']['contact_id'])) {
            return $response['contact']['contact_id'];
        }

        throw new Exception("Failed to create Zoho Contact: " . ($response['message'] ?? 'Unknown error'));
    }

    /**
     * Create an invoice for a booking
     */
    public static function createInvoice($bookingData) {
        try {
            $token = self::getAccessToken();
            $customerId = self::getOrCreateCustomer($bookingData['name'], $bookingData['email'], $bookingData['phone']);

            $invoiceData = [
                'customer_id' => $customerId,
                'reference_number' => $bookingData['booking_reference'],
                'date' => date('Y-m-d'),
                'line_items' => [[
                    'name' => $bookingData['show_title'] . " - " . $bookingData['location'],
                    'description' => "Booking for " . $bookingData['event_date'] . " at " . $bookingData['event_time'] . " (" . $bookingData['ticket_type'] . " x " . $bookingData['quantity'] . ")",
                    'rate' => $bookingData['price_per_unit'],
                    'quantity' => $bookingData['quantity'],
                    'tax_name' => 'GST',
                    'tax_percentage' => 18
                ]],
                'reason' => 'Online Booking'
            ];

            $curl = curl_init();
            curl_setopt_array($curl, [
                CURLOPT_URL => ZOHO_BASE_URL . "/invoices?organization_id=" . ZOHO_ORGANIZATION_ID,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => json_encode($invoiceData),
                CURLOPT_HTTPHEADER => [
                    "Authorization: Zoho-oauthtoken $token",
                    "Content-Type: application/json"
                ]
            ]);

            $response = json_decode(curl_exec($curl), true);
            curl_close($curl);

            if ($response['code'] === 0) {
                return $response['invoice']['invoice_id'];
            }

            throw new Exception("Zoho Invoice Error: " . ($response['message'] ?? 'Unknown error'));
        } catch (Exception $e) {
            error_log("Zoho Integration Error: " . $e->getMessage());
            return null; // Don't break the booking flow if invoice fails
        }
    }
}

<?php
/**
 * get_invoice_status.php
 * Checks if a Zoho invoice exists for a booking ref.
 * If not, attempts to generate it on-the-fly.
 * Frontend polls this every 3 s after payment confirmation.
 */

ob_start();
register_shutdown_function(function () {
    $error = error_get_last();
    if ($error && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        ob_clean();
        http_response_code(500);
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode(['success' => false, 'ready' => false, 'message' => 'Server error: ' . $error['message']]);
    }
});

require_once '../config/config.php';
setCorsHeaders();

$ref = trim($_GET['ref'] ?? '');
if (!$ref) {
    ob_end_clean();
    sendResponse(false, null, 'Booking reference required', 400);
}

try {
    $db = Database::getInstance()->getConnection();

    // 1. Check if invoice ID already stored in special_requests
    $stmt = $db->prepare("SELECT id, name, email, phone, location, event_date, event_time,
                           ticket_type, quantity, total_amount, special_requests,
                           company_name, gst_number, billing_address, city, state, zip_code
                           FROM bookings WHERE booking_reference = ? LIMIT 1");
    $stmt->execute([$ref]);
    $booking = $stmt->fetch();

    if (!$booking) {
        ob_end_clean();
        sendResponse(false, null, 'Booking not found', 404);
    }

    // Parse existing Zoho Invoice ID from special_requests if stored
    $zohoInvoiceId  = null;
    $zohoInvoiceUrl = null;
    if (preg_match('/Zoho Invoice ID:\s*(\S+)/i', $booking['special_requests'] ?? '', $m)) {
        $zohoInvoiceId = trim($m[1]);
    }

    // 2. If already have it, return immediately
    if ($zohoInvoiceId) {
        ob_end_clean();
        sendResponse(true, [
            'ready'               => true,
            'zohoInvoiceId'       => $zohoInvoiceId,
            'invoiceDownloadPath' => '/backend/api/invoice_download.php?invoice_id=' . urlencode($zohoInvoiceId)
        ], 'Invoice ready');
    }

    // 3. Not yet generated — try to create it now
    require_once '../config/ZohoInvoiceService.php';

    // Calculate unit rate
    $ticketType = $booking['ticket_type'];
    $loc        = strtoupper($booking['location']);
    $unitRate   = 799;
    if ($ticketType === 'Space Rental') {
        if ($loc === 'CHENNAI')                             $unitRate = 15000;
        elseif ($loc === 'BANGALORE' || $loc === 'BENGALURU') $unitRate = 45000;
        elseif ($loc === 'COIMBATORE')                      $unitRate = 30000;
        else                                                 $unitRate = 15000;
    } else {
        $prices   = ['General Admission' => 799, 'VIP' => 1500, 'Premium' => 2500];
        $unitRate = $prices[$ticketType] ?? 799;
    }

    $zohoData = ZohoInvoiceService::createInvoice([
        'name'              => $booking['name'],
        'email'             => $booking['email'],
        'phone'             => $booking['phone'],
        'booking_reference' => $ref,
        'show_title'        => 'MEDAI Performance',
        'location'          => $booking['location'],
        'event_date'        => $booking['event_date'],
        'event_time'        => $booking['event_time'],
        'ticket_type'       => $ticketType,
        'quantity'          => (int)$booking['quantity'],
        'price_per_unit'    => $unitRate,
        'company_name'      => $booking['company_name']    ?? '',
        'gst_number'        => $booking['gst_number']      ?? '',
        'billing_address'   => $booking['billing_address'] ?? '',
        'city'              => $booking['city']             ?? '',
        'state'             => $booking['state']            ?? '',
        'zip'               => $booking['zip_code']         ?? ''
    ]);

    if ($zohoData && isset($zohoData['invoice_id'])) {
        $zohoInvoiceId  = $zohoData['invoice_id'];
        $zohoInvoiceUrl = $zohoData['invoice_url'] ?? '';

        // Persist into DB so next poll is instant
        $upd = $db->prepare("UPDATE bookings SET special_requests = CONCAT(IFNULL(special_requests,''), '\nZoho Invoice ID: ', ?) WHERE booking_reference = ?");
        $upd->execute([$zohoInvoiceId, $ref]);

        ob_end_clean();
        sendResponse(true, [
            'ready'               => true,
            'zohoInvoiceId'       => $zohoInvoiceId,
            'invoiceDownloadPath' => '/backend/api/invoice_download.php?invoice_id=' . urlencode($zohoInvoiceId)
        ], 'Invoice ready');
    }

    // Zoho not ready yet (shouldn't normally reach here)
    ob_end_clean();
    sendResponse(true, ['ready' => false], 'Invoice still generating');

} catch (Exception $e) {
    error_log('get_invoice_status.php error: ' . $e->getMessage());
    ob_end_clean();
    // Return not-ready instead of error so the frontend keeps polling
    sendResponse(true, ['ready' => false, 'error' => $e->getMessage()], 'Still generating');
}
?>

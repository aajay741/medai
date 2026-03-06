<?php
/**
 * get_invoice_status.php
 * Checks if a Zoho invoice exists for a booking ref.
 * If not, attempts to generate it on-the-fly.
 * Optimized for speed and concurrency.
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
ignore_user_abort(true);
set_time_limit(60);

$ref = trim($_GET['ref'] ?? '');
if (!$ref) {
    ob_end_clean();
    sendResponse(false, null, 'Booking reference required', 400);
}

try {
    $db = Database::getInstance()->getConnection();

    // 1. FAST CHECK: Is it already done?
    $stmt = $db->prepare("SELECT id, name, email, phone, location, show_title, event_date, event_time,
                           ticket_type, quantity, total_amount, special_requests,
                           company_name, gst_number, billing_address, city, state, zip_code,
                           zoho_invoice_id FROM bookings WHERE booking_reference = ? LIMIT 1");
    $stmt->execute([$ref]);
    $booking = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$booking) {
        ob_end_clean();
        sendResponse(false, null, 'Booking not found', 404);
    }

    if ($booking['zoho_invoice_id']) {
        ob_end_clean();
        sendResponse(true, [
            'ready'               => true,
            'zohoInvoiceId'       => $booking['zoho_invoice_id'],
            'invoiceDownloadPath' => '/backend/api/invoice_download.php?invoice_id=' . urlencode($booking['zoho_invoice_id'])
        ], 'Invoice ready');
    }

    // 2. GENERATION START
    require_once '../config/ZohoInvoiceService.php';

    $qty = (float)$booking['quantity'];
    $total = (float)$booking['total_amount'];
    // total = (unitRate * qty) * 1.18 => unitRate = total / 1.18 / qty
    $unitRate = ($qty > 0) ? round(($total / 1.18) / $qty, 4) : 0;

    $zohoData = ZohoInvoiceService::createInvoice([
        'name'              => $booking['name'],
        'email'             => $booking['email'],
        'phone'             => $booking['phone'],
        'booking_reference' => $ref,
        'show_title'        => $booking['show_title'] ?: ($booking['ticket_type'] === 'Space Rental' ? 'Space Booking' : 'MEDAI Performance'),
        'location'          => $booking['location'],
        'event_date'        => $booking['event_date'],
        'event_time'        => $booking['event_time'],
        'ticket_type'       => $booking['ticket_type'],
        'quantity'          => (int)$booking['quantity'],
        'price_per_unit'    => $unitRate,
        'special_requests'  => $booking['special_requests'] ?? '',
        'company_name'      => $booking['company_name']    ?? '',
        'gst_number'        => $booking['gst_number']      ?? '',
        'billing_address'   => $booking['billing_address'] ?? '',
        'city'              => $booking['city']             ?? '',
        'state'             => $booking['state']            ?? '',
        'zip'               => $booking['zip_code']         ?? ''
    ]);

    if ($zohoData && isset($zohoData['invoice_id'])) {
        $zohoInvoiceId  = $zohoData['invoice_id'];
        $zohoCustomerId = $zohoData['customer_id'] ?? null;

        // Persist into DB specialized columns
        $upd = $db->prepare("UPDATE bookings SET zoho_invoice_id = ?, zoho_customer_id = ? WHERE booking_reference = ?");
        $upd->execute([$zohoInvoiceId, $zohoCustomerId, $ref]);

        ob_end_clean();
        sendResponse(true, [
            'ready'               => true,
            'zohoInvoiceId'       => $zohoInvoiceId,
            'invoiceDownloadPath' => '/backend/api/invoice_download.php?invoice_id=' . urlencode($zohoInvoiceId)
        ], 'Invoice created');
    }

    ob_end_clean();
    sendResponse(true, ['ready' => false], 'Still generating');

} catch (Exception $e) {
    error_log('get_invoice_status.php error: ' . $e->getMessage());
    ob_end_clean();
    sendResponse(true, ['ready' => false, 'error' => $e->getMessage()], 'Retrying...');
}
?>

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

    // 1. Check if invoice ID already stored in database (FAST)
    $stmt = $db->prepare("SELECT id, name, email, phone, location, event_date, event_time,
                           ticket_type, quantity, total_amount, special_requests,
                           company_name, gst_number, billing_address, city, state, zip_code,
                           zoho_invoice_id, zoho_customer_id
                           FROM bookings WHERE booking_reference = ? LIMIT 1");
    $stmt->execute([$ref]);
    $booking = $stmt->fetch();

    if (!$booking) {
        ob_end_clean();
        sendResponse(false, null, 'Booking not found', 404);
    }

    $zohoInvoiceId = $booking['zoho_invoice_id'];

    // If not in the new column, check special_requests (backwards compatibility)
    if (!$zohoInvoiceId && preg_match('/Zoho Invoice ID:\s*(\S+)/i', $booking['special_requests'] ?? '', $m)) {
        $zohoInvoiceId = trim($m[1]);
        // Fast-fix: Migrating it to the new column now
        $db->prepare("UPDATE bookings SET zoho_invoice_id = ? WHERE id = ?")->execute([$zohoInvoiceId, $booking['id']]);
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

    // Calculate unit rate from DB (more accurate than hardcoding)
    $qty = (int)$booking['quantity'];
    $total = (int)$booking['total_amount'];
    // total = (unitRate * qty) * 1.18
    // unitRate = (total / 1.18) / qty
    $unitRate = ($qty > 0) ? floor(($total / 1.18) / $qty) : 799;

    $zohoData = ZohoInvoiceService::createInvoice([
        'name'              => $booking['name'],
        'email'             => $booking['email'],
        'phone'             => $booking['phone'],
        'booking_reference' => $ref,
        'show_title'        => $ticketType === 'Space Rental' ? 'Space Booking' : 'MEDAI Performance',
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
        $zohoCustomerId = $zohoData['customer_id'] ?? null;

        // Persist into DB specialized columns
        $sql = "UPDATE bookings SET zoho_invoice_id = ?, zoho_customer_id = ? WHERE booking_reference = ?";
        $upd = $db->prepare($sql);
        $upd->execute([$zohoInvoiceId, $zohoCustomerId, $ref]);

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

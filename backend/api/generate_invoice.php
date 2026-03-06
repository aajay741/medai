<?php
/**
 * generate_invoice.php
 * Handles the background generation of Zoho Invoices.
 * Called by the Frontend after the booking is confirmed.
 */

ob_start();
register_shutdown_function(function () {
    $error = error_get_last();
    if ($error && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        ob_clean();
        http_response_code(500);
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode([
            'success'   => false,
            'message'   => 'Invoicing Fatal: ' . $error['message'],
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    }
});

require_once '../config/config.php';
require_once '../config/ZohoInvoiceService.php';

setCorsHeaders();
ignore_user_abort(true);
set_time_limit(120);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, null, 'Method not allowed', 405);
}

$input = json_decode(file_get_contents('php://input'), true);
$bookingRef = sanitizeInput($input['bookingReference'] ?? '');

if (!$bookingRef) {
    sendResponse(false, null, 'Booking reference is required', 400);
}

// ── Fetch Booking from DB ───────────────────────────────────────────────────
$db = Database::getInstance()->getConnection();
$stmt = $db->prepare("SELECT id, name, email, phone, location, show_title, event_date, event_time, 
                       ticket_type, quantity, total_amount, special_requests, 
                       company_name, gst_number, billing_address, city, state, zip_code,
                       zoho_invoice_id FROM bookings WHERE booking_reference = ? LIMIT 1");
$stmt->execute([$bookingRef]);
$booking = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$booking) {
    sendResponse(false, null, 'Booking not found', 404);
}

// ── FAST PATH: If already generated, return it ──────────────────────────────
if (!empty($booking['zoho_invoice_id'])) {
    sendResponse(true, [
        'zohoInvoiceId'     => $booking['zoho_invoice_id'],
        'invoiceDownloadPath' => '/backend/api/invoice_download.php?invoice_id=' . urlencode($booking['zoho_invoice_id'])
    ], 'Invoice already exists');
}

// ── Calculate Unit Rate Consistency ─────────────────────────────────────────
$qty = (float)($booking['quantity'] ?? 1);
$total = (float)($booking['total_amount'] ?? 0);
// unitRate = total / 1.18 / qty (to reverse the GST from DB total)
$unitRate = ($qty > 0) ? round(($total / 1.18) / $qty, 4) : 0;

// ── Generate Invoice ────────────────────────────────────────────────────────
try {
    $zohoData = ZohoInvoiceService::createInvoice([
        'name'            => $booking['name'],
        'email'           => $booking['email'],
        'phone'           => $booking['phone'],
        'booking_reference' => $bookingRef,
        'show_title'      => 'MEDAI Booking',
        'location'        => $booking['location'],
        'event_date'      => $booking['event_date'],
        'event_time'      => $booking['event_time'],
        'ticket_type'     => $booking['ticket_type'],
        'quantity'        => $booking['quantity'],
        'price_per_unit'  => $unitRate,
        'company_name'    => $booking['company_name'],
        'gst_number'      => $booking['gst_number'],
        'billing_address' => $booking['billing_address'],
        'city'            => $booking['city'],
        'state'           => $booking['state'],
        'zip'             => $booking['zip_code']
    ]);

    if ($zohoData && isset($zohoData['invoice_id'])) {
        $zohoInvoiceId  = $zohoData['invoice_id'];
        $zohoInvoiceUrl = $zohoData['invoice_url'] ?? '';
        $zohoCustomerId = $zohoData['customer_id'] ?? null;

        $upd = $db->prepare("UPDATE bookings SET zoho_invoice_id = ?, zoho_customer_id = ? WHERE booking_reference = ?");
        $upd->execute([$zohoInvoiceId, $zohoCustomerId, $bookingRef]);

        // ── Send Confirmation Email using PHP mail() ──
        $to = $booking['email'];
        $subject = "Booking Confirmation: MEDAI - " . $bookingRef;
        
        $fromEmail = "no-reply@medaithestage.com";
        $headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        $headers .= "From: MEDAI Hub <$fromEmail>" . "\r\n";
        $headers .= "Reply-To: $fromEmail" . "\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();

        $body = "
        <html>
        <body style='font-family: Arial, sans-serif; color: #333; line-height: 1.6;'>
            <div style='max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 10px;'>
                <h2 style='color: #A78BFA;'>Your Space is Booked!</h2>
                <p>Hi {$booking['name']},</p>
                <p>Your payment was successful and your slot is confirmed at <b>{$booking['location']}</b>.</p>
                <div style='background: #f9f9f9; padding: 15px; border-radius: 8px;'>
                    <p><b>Booking Reference:</b> {$bookingRef}</p>
                    <p><b>Date:</b> {$booking['event_date']}</p>
                    <p><b>Time:</b> {$booking['event_time']}</p>
                </div>
                <p>You can download your official invoice here:<br>
                <a href='{$zohoInvoiceUrl}' style='display: inline-block; margin-top: 10px; padding: 10px 20px; background: #A78BFA; color: white; text-decoration: none; border-radius: 5px;'>Download Invoice</a></p>
                <p>We look forward to seeing you!</p>
                <p>Best regards,<br><b>The MEDAI Team</b></p>
            </div>
        </body>
        </html>
        ";

        // Send email (suppressing errors to ensure JSON response isn't blocked)
        @mail($to, $subject, $body, $headers);

        sendResponse(true, [
            'zohoInvoiceId'     => $zohoInvoiceId,
            'zohoInvoiceUrl'    => $zohoInvoiceUrl,
            'invoiceDownloadPath' => '/backend/api/invoice_download.php?invoice_id=' . urlencode($zohoInvoiceId)
        ], 'Invoice generated & email sent');
    }

    sendResponse(false, null, 'Failed to generate Zoho invoice');

} catch (Exception $e) {
    error_log('Zoho Generation Error: ' . $e->getMessage());
    sendResponse(false, null, $e->getMessage(), 500);
}

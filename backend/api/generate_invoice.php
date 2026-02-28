<?php
/**
 * generate_invoice.php
 * Handles the background generation of Zoho Invoices.
 * Called by the Frontend after the booking is confirmed.
 */

require_once '../config/config.php';
require_once '../config/ZohoInvoiceService.php';

setCorsHeaders();

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
$stmt = $db->prepare("SELECT * FROM bookings WHERE booking_reference = ?");
$stmt->execute([$bookingRef]);
$booking = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$booking) {
    sendResponse(false, null, 'Booking not found', 404);
}

// ── Calculate Unit Rate ─────────────────────────────────────────────────────
$unitRate = 0;
$loc = strtoupper($booking['location']);
if ($booking['ticket_type'] === 'Space Rental') {
    if ($loc === 'CHENNAI') $unitRate = 15000;
    elseif ($loc === 'BANGALORE' || $loc === 'BENGALURU') $unitRate = 45000;
    elseif ($loc === 'COIMBATORE') $unitRate = 30000;
    else $unitRate = 15000;
} else {
    $prices = ['General Admission' => 799, 'VIP' => 1500, 'Premium' => 2500];
    $unitRate = $prices[$booking['ticket_type']] ?? 799;
}

// ── Generate Invoice ────────────────────────────────────────────────────────
try {
    $zohoInvoiceId = ZohoInvoiceService::createInvoice([
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

    if ($zohoInvoiceId) {
        $upd = $db->prepare("UPDATE bookings SET special_requests = CONCAT(special_requests, '\nZoho Invoice ID: ', ?) WHERE booking_reference = ?");
        $upd->execute([$zohoInvoiceId, $bookingRef]);

        $zohoInvoiceUrl = ZohoInvoiceService::getInvoicePortalUrl($zohoInvoiceId);

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

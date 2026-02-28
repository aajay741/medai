<?php
/**
 * send_email.php
 * Sends confirmation email from medaipvtltd@gmail.com
 */

require_once '../config/config.php';
setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, null, 'Method not allowed', 405);
}

$input = json_decode(file_get_contents('php://input'), true);
$email = filter_var($input['email'] ?? '', FILTER_VALIDATE_EMAIL);
$name  = sanitizeInput($input['name'] ?? 'Customer');
$ref   = sanitizeInput($input['bookingReference'] ?? '');

if (!$email || !$ref) {
    sendResponse(false, null, 'Email and Reference are required', 400);
}

// ── Build Email Content ──────────────────────────────────────────────────────
$subject = "Your MEDAI Booking Confirmation - $ref";
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: medaipvtltd@gmail.com" . "\r\n";

$body = "
<html>
<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
    <div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;'>
        <h2 style='color: #A78BFA;'>Booking Confirmed!</h2>
        <p>Dear <b>$name</b>,</p>
        <p>Your booking with MEDAI has been successfully confirmed. We've attached your details below:</p>
        <hr>
        <p><b>Booking Reference:</b> $ref</p>
        <p>Your invoice has been generated and is attached to your account. You can also download it from the confirmation screen on our website.</p>
        <br>
        <p>We look forward to seeing you!</p>
        <p>Best regards,<br><b>The MEDAI Team</b></p>
    </div>
</body>
</html>
";

// ── Send Email ──────────────────────────────────────────────────────────────
// Currently using PHP mail() - for Gmail SMTP production, PHPMailer is recommended
$sent = mail($email, $subject, $body, $headers);

if ($sent) {
    sendResponse(true, null, 'Confirmation email sent successfully');
} else {
    sendResponse(false, null, 'Failed to send confirmation email');
}
?>

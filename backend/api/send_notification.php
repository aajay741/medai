<?php
/**
 * send_notification.php
 * Sends a WhatsApp message (and SMS fallback) to the customer's phone
 * using MSG91's WhatsApp Business API.
 *
 * Expects POST JSON:
 *   phone          – 10-digit Indian mobile number (no country code)
 *   name           – customer name
 *   bookingRef     – e.g. MEDAI-XXXXXXXX
 *   location       – venue
 *   eventDate      – e.g. "28 FEB"
 *   eventTime      – e.g. "07:00 AM – 10:00 AM"
 *   totalAmount    – e.g. 17700
 *   invoiceUrl     – Zoho invoice public URL (optional)
 */

require_once '../config/config.php';
setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, null, 'Method not allowed', 405);
}

$input = json_decode(file_get_contents('php://input'), true);

$phone      = preg_replace('/[^0-9]/', '', $input['phone'] ?? '');
$name       = $input['name']        ?? 'Customer';
$bookingRef = $input['bookingRef']  ?? '';
$location   = $input['location']    ?? '';
$eventDate  = $input['eventDate']   ?? '';
$eventTime  = $input['eventTime']   ?? '';
$amount     = $input['totalAmount'] ?? '';
$invoiceUrl = $input['invoiceUrl']  ?? '';

if (strlen($phone) === 10) {
    $phone = '91' . $phone;   // prepend India country code
}

if (strlen($phone) < 12) {
    sendResponse(false, null, 'Invalid phone number', 400);
}

// ── Build message text ────────────────────────────────────────────────────────
$message  = "🎭 *MEDAI Booking Confirmed!*\n\n";
$message .= "Hello *{$name}*,\n\n";
$message .= "Your booking has been successfully confirmed.\n\n";
$message .= "📌 *Booking Reference:* {$bookingRef}\n";
$message .= "📍 *Venue:* {$location}\n";
$message .= "📅 *Date:* {$eventDate}\n";
$message .= "⏰ *Time:* {$eventTime}\n";
$message .= "💰 *Amount Paid:* ₹" . number_format($amount) . "\n\n";

if ($invoiceUrl) {
    $message .= "🧾 *Invoice:* {$invoiceUrl}\n\n";
}

$message .= "Thank you for choosing MEDAI!\n";
$message .= "For support: admin@medai.in";

// ── MSG91 WhatsApp Send ───────────────────────────────────────────────────────
$result = ['whatsapp' => false, 'sms' => false, 'errors' => []];

if (defined('MSG91_AUTH_KEY') && MSG91_AUTH_KEY) {

    // WhatsApp via MSG91
    $waPayload = json_encode([
        'integrated_number' => MSG91_WHATSAPP_NUMBER,
        'content_type'      => 'template',
        'payload'           => [
            'to'                  => $phone,
            'type'                => 'text',
            'messaging_product'   => 'whatsapp',
            'recipient_type'      => 'individual',
            'text'                => ['body' => $message]
        ]
    ]);

    $ch = curl_init('https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $waPayload,
        CURLOPT_HTTPHEADER     => [
            'authkey: '   . MSG91_AUTH_KEY,
            'Content-Type: application/json'
        ]
    ]);
    $waResp = json_decode(curl_exec($ch), true);
    curl_close($ch);

    if (isset($waResp['type']) && $waResp['type'] === 'success') {
        $result['whatsapp'] = true;
    } else {
        $result['errors'][] = 'WhatsApp: ' . ($waResp['message'] ?? json_encode($waResp));

        // SMS Fallback via MSG91
        $smsPayload = json_encode([
            'sender'   => 'MEDAI',
            'route'    => '4',
            'country'  => '91',
            'sms'      => [[
                'message' => "MEDAI Booking Confirmed!\nRef: {$bookingRef}\nVenue: {$location}\nDate: {$eventDate} {$eventTime}\nAmt: Rs{$amount}\nSupport: admin@medai.in",
                'to'      => [$phone]
            ]]
        ]);

        $ch2 = curl_init('https://api.msg91.com/api/v2/sendsms');
        curl_setopt_array($ch2, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => $smsPayload,
            CURLOPT_HTTPHEADER     => [
                'authkey: '   . MSG91_AUTH_KEY,
                'Content-Type: application/json'
            ]
        ]);
        $smsResp = json_decode(curl_exec($ch2), true);
        curl_close($ch2);

        if (isset($smsResp['type']) && $smsResp['type'] === 'success') {
            $result['sms'] = true;
        } else {
            $result['errors'][] = 'SMS: ' . ($smsResp['message'] ?? json_encode($smsResp));
        }
    }

} else {
    // No MSG91 key — log the message as a fallback (useful for testing)
    error_log("MEDAI Notification (no MSG91 key) → {$phone}: " . $message);
    $result['errors'][] = 'MSG91_AUTH_KEY not configured. Message logged to server.';
}

sendResponse(
    $result['whatsapp'] || $result['sms'],
    $result,
    $result['whatsapp'] ? 'WhatsApp sent' : ($result['sms'] ? 'SMS sent (WhatsApp failed)' : 'Notification queued (check MSG91 config)')
);
?>

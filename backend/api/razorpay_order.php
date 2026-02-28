<?php
require_once '../config/config.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, null, 'Method not allowed', 405);
}

$input = json_decode(file_get_contents('php://input'), true);

$amount = isset($input['amount']) ? (int)$input['amount'] : 0;   // Amount in paise (INR * 100)
$currency = $input['currency'] ?? 'INR';
$receipt  = $input['receipt'] ?? ('rcpt_' . uniqid());
$notes    = $input['notes'] ?? [];

if ($amount <= 0) {
    sendResponse(false, null, 'Invalid amount', 400);
}

// Build Razorpay Orders API request
$url  = 'https://api.razorpay.com/v1/orders';
$body = json_encode([
    'amount'   => $amount,
    'currency' => $currency,
    'receipt'  => $receipt,
    'notes'    => $notes
]);

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
curl_setopt($ch, CURLOPT_USERPWD, RAZORPAY_KEY_ID . ':' . RAZORPAY_KEY_SECRET);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

$response   = curl_exec($ch);
$httpStatus = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError  = curl_error($ch);
curl_close($ch);

if ($curlError) {
    sendResponse(false, null, 'cURL Error: ' . $curlError, 500);
}

$data = json_decode($response, true);

if ($httpStatus !== 200 || empty($data['id'])) {
    $errMsg = $data['error']['description'] ?? 'Failed to create Razorpay order';
    sendResponse(false, null, $errMsg, 500);
}

sendResponse(true, [
    'order_id'  => $data['id'],
    'amount'    => $data['amount'],
    'currency'  => $data['currency'],
    'key_id'    => RAZORPAY_KEY_ID
], 'Order created successfully');
?>

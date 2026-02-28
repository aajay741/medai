<?php
require_once '../config/config.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, null, 'Method not allowed', 405);
}

$input = json_decode(file_get_contents('php://input'), true);

// ── 1. VERIFY RAZORPAY SIGNATURE ─────────────────────────────────────────────
$razorpayOrderId   = $input['razorpay_order_id']   ?? '';
$razorpayPaymentId = $input['razorpay_payment_id'] ?? '';
$razorpaySignature = $input['razorpay_signature']  ?? '';

if (!$razorpayOrderId || !$razorpayPaymentId || !$razorpaySignature) {
    sendResponse(false, null, 'Missing payment verification fields', 400);
}

$expectedSignature = hash_hmac(
    'sha256',
    $razorpayOrderId . '|' . $razorpayPaymentId,
    RAZORPAY_KEY_SECRET
);

if (!hash_equals($expectedSignature, $razorpaySignature)) {
    sendResponse(false, null, 'Payment verification failed — invalid signature', 400);
}

// ── 2. SAVE BOOKING TO DATABASE ───────────────────────────────────────────────
$db = Database::getInstance()->getConnection();

$required = ['name', 'email', 'phone', 'location', 'eventDate', 'eventTime', 'ticketType', 'quantity'];
foreach ($required as $field) {
    if (empty($input[$field])) {
        sendResponse(false, null, "Field '$field' is required", 400);
    }
}

$name           = sanitizeInput($input['name']);
$email          = filter_var($input['email'], FILTER_SANITIZE_EMAIL);
$phone          = sanitizeInput($input['phone']);
$location       = sanitizeInput($input['location']);
$eventDate      = sanitizeInput($input['eventDate']);
$eventTime      = sanitizeInput($input['eventTime']);
$ticketType     = sanitizeInput($input['ticketType']);
$quantity       = (int)$input['quantity'];
$specialReqs    = sanitizeInput($input['specialRequests'] ?? '');
$companyName    = sanitizeInput($input['companyName'] ?? '');
$gstNumber      = sanitizeInput($input['gstNumber'] ?? '');
$billingAddress = sanitizeInput($input['billingAddress'] ?? '');
$city           = sanitizeInput($input['city'] ?? '');
$state          = sanitizeInput($input['state'] ?? '');
$zipCode        = sanitizeInput($input['zip'] ?? '');
$purpose        = sanitizeInput($input['purpose'] ?? '');
$totalAmount    = (int)$input['totalAmount'];   // already calculated on FE; re-use for record

if ($purpose) {
    $specialReqs = "Purpose: $purpose. " . $specialReqs;
}

$bookingRef = generateBookingReference();

$stmt = $db->prepare("
    INSERT INTO bookings
    (booking_reference, name, email, phone, location, event_date, event_time,
     ticket_type, quantity, total_amount, special_requests,
     company_name, gst_number, billing_address, city, state, zip_code, purpose,
     booking_status, payment_status, razorpay_order_id, razorpay_payment_id)
    VALUES
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', 'paid', ?, ?)
");

$stmt->execute([
    $bookingRef, $name, $email, $phone, $location, $eventDate,
    $eventTime, $ticketType, $quantity, $totalAmount, $specialReqs,
    $companyName, $gstNumber, $billingAddress, $city, $state, $zipCode, $purpose,
    $razorpayOrderId, $razorpayPaymentId
]);

// ── 3. RETURN SUCCESS IMMEDIATELY ───────────────────────────────────────────
sendResponse(true, [
    'bookingReference'  => $bookingRef,
    'totalAmount'       => $totalAmount,
    'razorpayPaymentId' => $razorpayPaymentId,
    'name'              => $name,
    'email'             => $email,
    'phone'             => $phone
], 'Payment verified & booking confirmed', 201);

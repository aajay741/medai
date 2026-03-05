<?php
// ── Guarantee JSON output even on fatal errors ────────────────────────────────
ob_start();
register_shutdown_function(function () {
    $error = error_get_last();
    if ($error && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        ob_clean();
        http_response_code(500);
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode([
            'success'   => false,
            'message'   => 'Server error: ' . $error['message'],
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    }
});

require_once '../config/config.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    ob_end_clean();
    sendResponse(false, null, 'Method not allowed', 405);
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    ob_end_clean();
    sendResponse(false, null, 'Invalid JSON input', 400);
}

// ── 1. VERIFY RAZORPAY SIGNATURE ─────────────────────────────────────────────
$razorpayOrderId   = $input['razorpay_order_id']   ?? '';
$razorpayPaymentId = $input['razorpay_payment_id'] ?? '';
$razorpaySignature = $input['razorpay_signature']  ?? '';

if (!$razorpayOrderId || !$razorpayPaymentId || !$razorpaySignature) {
    ob_end_clean();
    sendResponse(false, null, 'Missing payment verification fields', 400);
}

$expectedSignature = hash_hmac(
    'sha256',
    $razorpayOrderId . '|' . $razorpayPaymentId,
    RAZORPAY_KEY_SECRET
);

if (!hash_equals($expectedSignature, $razorpaySignature)) {
    ob_end_clean();
    sendResponse(false, null, 'Payment verification failed — invalid signature', 400);
}

try {
    // ── 2. CONNECT & ENSURE COLUMNS EXIST ────────────────────────────────────
    $db = Database::getInstance()->getConnection();

    // Auto-create any missing columns so the INSERT never fails on missing fields
    $alterSql = "
        ALTER TABLE bookings
            ADD COLUMN IF NOT EXISTS company_name    VARCHAR(255) NULL,
            ADD COLUMN IF NOT EXISTS gst_number      VARCHAR(50)  NULL,
            ADD COLUMN IF NOT EXISTS billing_address TEXT         NULL,
            ADD COLUMN IF NOT EXISTS city            VARCHAR(100) NULL,
            ADD COLUMN IF NOT EXISTS state           VARCHAR(100) NULL,
            ADD COLUMN IF NOT EXISTS zip_code        VARCHAR(20)  NULL,
            ADD COLUMN IF NOT EXISTS purpose         VARCHAR(255) NULL
    ";
    try { $db->exec($alterSql); } catch (Exception $altErr) {
        error_log('Column migration warning: ' . $altErr->getMessage());
    }

    // ── 3. VALIDATE & SANITIZE ────────────────────────────────────────────────
    $required = ['name', 'email', 'phone', 'location', 'eventDate', 'eventTime', 'ticketType', 'quantity'];
    foreach ($required as $field) {
        if (empty($input[$field])) {
            ob_end_clean();
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
    $totalAmount    = (int)$input['totalAmount'];

    if ($purpose) $specialReqs = "Purpose: $purpose. " . $specialReqs;

    $bookingRef = generateBookingReference();

    // ── 4. INSERT BOOKING ─────────────────────────────────────────────────────
    $stmt = $db->prepare("
        INSERT INTO bookings
        (booking_reference, name, email, phone, location, event_date, event_time,
         ticket_type, quantity, total_amount, special_requests,
         company_name, gst_number, billing_address, city, state, zip_code, purpose,
         booking_status, payment_status, razorpay_order_id, razorpay_payment_id)
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', 'completed', ?, ?)
    ");

    $stmt->execute([
        $bookingRef, $name, $email, $phone, $location, $eventDate,
        $eventTime, $ticketType, $quantity, $totalAmount, $specialReqs,
        $companyName, $gstNumber, $billingAddress, $city, $state, $zipCode, $purpose,
        $razorpayOrderId, $razorpayPaymentId
    ]);

    // ── 5. GENERATE ZOHO INVOICE (OFFLOADED TO POLLING) ──────────────────────
    /* 
    We no longer block the payment response waiting for Zoho.
    The frontend polls get_invoice_status.php which handles the generation.
    This makes the "Payment Verified" transition feel instant.
    */
    $invoiceId = null;
    $invoicePath = null;

    // ── 6. RETURN SUCCESS WITH INVOICE DATA ──────────────────────────────────
    ob_end_clean();
    sendResponse(true, [
        'bookingReference'    => $bookingRef,
        'totalAmount'         => $totalAmount,
        'razorpayPaymentId'   => $razorpayPaymentId,
        'name'                => $name,
        'email'               => $email,
        'phone'               => $phone,
        'invoiceReady'        => ($invoiceId !== null),
        'invoiceDownloadPath' => $invoicePath
    ], 'Payment verified & booking confirmed', 201);

} catch (Exception $e) {
    error_log('razorpay_verify.php DB error: ' . $e->getMessage());
    ob_end_clean();
    sendResponse(false, null, 'Booking save failed: ' . $e->getMessage(), 500);
}
?>

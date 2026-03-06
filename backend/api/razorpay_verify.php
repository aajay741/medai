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
    // ── 2. CONNECT ───────────────────────────────────────────────────────────
    $db = Database::getInstance()->getConnection();

    // ── 3. VALIDATE & SANITIZE ────────────────────────────────────────────────
    $required = ['name', 'email', 'phone', 'location', 'eventDate', 'eventTime', 'ticketType', 'quantity', 'totalAmount'];
    foreach ($required as $field) {
        if (isset($input[$field]) === false || $input[$field] === '') {
            ob_end_clean();
            sendResponse(false, null, "Field '$field' is required", 400);
        }
    }

    $name           = sanitizeInput($input['name']);
    $email          = filter_var($input['email'], FILTER_SANITIZE_EMAIL);
    $phone          = sanitizeInput($input['phone']);
    $location       = sanitizeInput($input['location']);
    $showTitle      = sanitizeInput($input['showTitle'] ?? 'Performance Session');
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
    $totalAmount    = (float)$input['totalAmount'];

    if ($purpose) $specialReqs = "Purpose: $purpose. " . $specialReqs;

    $bookingRef = generateBookingReference();

    // ── 4. INSERT BOOKING ─────────────────────────────────────────────────────
    $stmt = $db->prepare("
        INSERT INTO bookings
        (booking_reference, name, email, phone, location, show_title, event_date, event_time,
         ticket_type, quantity, total_amount, special_requests,
         company_name, gst_number, billing_address, city, state, zip_code, purpose,
         booking_status, payment_status, razorpay_order_id, razorpay_payment_id)
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', 'completed', ?, ?)
    ");

    $stmt->execute([
        $bookingRef, $name, $email, $phone, $location, $showTitle, $eventDate,
        $eventTime, $ticketType, $quantity, $totalAmount, $specialReqs,
        $companyName, $gstNumber, $billingAddress, $city, $state, $zipCode, $purpose,
        $razorpayOrderId, $razorpayPaymentId
    ]);

    // ── 5. ASYNC INVOICE TRIGGER ──────────────────────────────────────────────
    // We trigger the generation immediately. We use localhost port 80 if on dev
    // to bypass Vite/DevServer proxy loops.
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https://' : 'http://';
    $host = $_SERVER['HTTP_HOST'];
    if (strpos($host, 'localhost') !== false) {
        $host = 'localhost'; // Use base localhost for internal XAMPP call
    }
    
    // Dynamically find the path to generate_invoice.php relative to the current script
    $currentPath = $_SERVER['SCRIPT_NAME'];
    $targetPath = str_replace('razorpay_verify.php', 'generate_invoice.php', $currentPath);
    $triggerUrl = $protocol . $host . $targetPath;
    
    $ch = curl_init($triggerUrl);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => json_encode(['bookingReference' => $bookingRef]),
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
        CURLOPT_TIMEOUT_MS     => 100, // Non-blocking: wait only 0.1s
        CURLOPT_IPRESOLVE      => CURL_IPRESOLVE_V4,
        CURLOPT_NOSIGNAL       => 1
    ]);
    curl_exec($ch);
    curl_close($ch);

    // ── 6. RETURN SUCCESS IMMEDIATELY ─────────────────────────────────────────
    ob_end_clean();
    sendResponse(true, [
        'bookingReference'    => $bookingRef,
        'totalAmount'         => $totalAmount,
        'razorpayPaymentId'   => $razorpayPaymentId,
        'name'                => $name,
        'email'               => $email,
        'phone'               => $phone,
        'invoiceReady'        => false
    ], 'Payment verified & booking confirmed', 201);

} catch (Exception $e) {
    error_log('razorpay_verify.php error: ' . $e->getMessage());
    ob_end_clean();
    sendResponse(false, null, 'Booking save failed: ' . $e->getMessage(), 500);
}
?>

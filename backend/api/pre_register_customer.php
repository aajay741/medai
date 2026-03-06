<?php
/**
 * pre_register_customer.php
 * Creates or retrieves a Zoho Customer ID while the user is busy paying.
 * This saves 2-3 seconds of waiting time AFTER the payment is done.
 */
require_once '../config/config.php';
require_once '../config/ZohoInvoiceService.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    exit; // Silent exit for safety
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input || empty($input['email'])) {
    exit;
}

try {
    // This will check if they exist in DB first (instant)
    // If not, it will call Zoho API to search/create (slow, but happening while user pays)
    $customerId = ZohoInvoiceService::getOrCreateCustomer([
        'name'            => $input['name']           ?? 'Customer',
        'email'           => $input['email'],
        'phone'           => $input['phone']          ?? '',
        'company_name'    => $input['companyName']    ?? '',
        'gst_number'      => $input['gstNumber']      ?? '',
        'billing_address' => $input['billingAddress'] ?? '',
        'city'            => $input['city']           ?? '',
        'state'           => $input['state']          ?? '',
        'zip'             => $input['zip']            ?? ''
    ]);

    // We don't even need to return much, the ID is now cached in the DB for the next step.
    sendResponse(true, ['customer_id' => $customerId], 'Pre-registered successfully');
} catch (Exception $e) {
    // Silent fail - we don't want to block the payment UI if Zoho is down
    error_log("Pre-registration failed for " . $input['email'] . ": " . $e->getMessage());
    sendResponse(false, null, $e->getMessage());
}

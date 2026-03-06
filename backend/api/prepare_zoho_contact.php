<?php
require_once '../config/config.php';
require_once '../config/ZohoInvoiceService.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, null, 'Method not allowed', 405);
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || empty($input['email'])) {
    sendResponse(false, null, 'Email is required', 400);
}

try {
    // Just trigger the customer creation process to populate cache and Zoho early
    $customerId = ZohoInvoiceService::getOrCreateCustomer([
        'name'            => $input['name']  ?? 'Valued Customer',
        'email'           => $input['email'],
        'phone'           => $input['phone'] ?? '',
        'company_name'    => $input['company_name']    ?? '',
        'gst_number'      => $input['gst_number']      ?? '',
        'billing_address' => $input['billing_address'] ?? '',
        'city'            => $input['city']             ?? '',
        'state'           => $input['state']            ?? '',
        'zip'             => $input['zip']              ?? ''
    ]);

    sendResponse(true, ['customer_id' => $customerId], 'Customer prepared');

} catch (Exception $e) {
    error_log('prepare_zoho_contact.php failed: ' . $e->getMessage());
    // Silent fail for user, the final step will try again anyway
    sendResponse(false, null, $e->getMessage(), 500);
}

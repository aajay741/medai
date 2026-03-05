<?php
require_once '../config/config.php';
require_once '../config/ZohoInvoiceService.php';

header('Content-Type: text/plain');

echo "Verifying Zoho Integration...\n";
echo "Date: " . date('Y-m-d H:i:s') . "\n";

try {
    $testData = [
        'name' => 'Support Test User',
        'email' => 'ajay741@example.com',
        'phone' => '9999999999',
        'booking_reference' => 'RE-TEST-' . time(),
        'show_title' => 'Diagnostic Booking',
        'location' => 'CHENNAI',
        'event_date' => date('Y-m-d'),
        'event_time' => '07:00 PM',
        'ticket_type' => 'VIP',
        'quantity' => 1,
        'price_per_unit' => 1500,
        'billing_address' => '123 Test Street',
        'city' => 'Chennai',
        'state' => 'Tamil Nadu',
        'zip' => '600001'
    ];

    echo "Attempting to create invoice for: " . $testData['email'] . "\n";
    $result = ZohoInvoiceService::createInvoice($testData);

    if ($result) {
        echo "SUCCESS!\n";
        echo "Invoice ID: " . $result['invoice_id'] . "\n";
        echo "Invoice Number: " . $result['invoice_number'] . "\n";
        echo "Portal/Email URL: " . ($result['invoice_url'] ?? 'Not provided') . "\n";
    } else {
        echo "FAILED. Check PHP error logs or look for 'Zoho Invoice API Error' messages.\n";
    }

} catch (Exception $e) {
    echo "EXCEPTION: " . $e->getMessage() . "\n";
}

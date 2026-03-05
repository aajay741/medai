<?php
require_once '../config/config.php';
require_once '../config/ZohoInvoiceService.php';

header('Content-Type: text/plain');

try {
    $ref = 'BLANK-ADDR-' . time();
    $testData = [
        'name' => 'Blank Address User',
        'email' => 'blank@example.com',
        'phone' => '1234567890',
        'booking_reference' => $ref,
        'show_title' => 'Blank Test',
        'location' => 'CHENNAI',
        'event_date' => date('Y-m-d'),
        'event_time' => '10:00 AM',
        'ticket_type' => 'General Admission',
        'quantity' => 1,
        'price_per_unit' => 500,
        // No address fields passed
    ];

    $result = ZohoInvoiceService::createInvoice($testData);
    print_r($result);

} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}

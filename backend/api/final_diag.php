<?php
require_once '../config/config.php';
require_once '../config/ZohoInvoiceService.php';

header('Content-Type: text/plain');

echo "Final Diagnostic Booking...\n";

try {
    $ref = 'FINAL-DIAG-' . strtoupper(substr(md5(time()), 0, 6));
    $testData = [
        'name' => 'Ajay Test',
        'email' => 'ajay.test@example.com',
        'phone' => '1234567890',
        'booking_reference' => $ref,
        'show_title' => 'Diagnostic Performance',
        'location' => 'CHENNAI',
        'event_date' => date('Y-m-d'),
        'event_time' => '10:00 AM',
        'ticket_type' => 'General Admission',
        'quantity' => 1,
        'price_per_unit' => 799,
        'billing_address' => 'Medai Stage, Chennai',
        'city' => 'Chennai',
        'state' => 'Tamil Nadu',
        'zip' => '600001'
    ];

    $result = ZohoInvoiceService::createInvoice($testData);

    if ($result) {
        echo "SUCCESS!\n";
        echo "Invoice Number: " . $result['invoice_number'] . "\n";
        echo "Direct Link: https://invoice.zoho.in/app/" . ZOHO_ORGANIZATION_ID . "#/invoices/" . $result['invoice_id'] . "\n";
        echo "Please check this URL in your browser while logged into Zoho.\n";
    } else {
        echo "FAILED. No result returned from createInvoice.\n";
    }

} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}

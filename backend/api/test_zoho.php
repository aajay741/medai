<?php
require_once '../config/config.php';
require_once '../config/ZohoInvoiceService.php';

header('Content-Type: text/plain');

echo "Testing Zoho Integration...\n";
echo "Base URL: " . ZOHO_BASE_URL . "\n";
echo "Org ID: " . ZOHO_ORGANIZATION_ID . "\n\n";

try {
    echo "1. Getting Access Token...\n";
    $token = ZohoInvoiceService::getAccessToken();
    echo "Token received (first 10 chars): " . substr($token, 0, 10) . "...\n\n";

    echo "2. Listing Contacts (Test API call)...\n";
    $curl = curl_init();
    curl_setopt_array($curl, [
        CURLOPT_URL            => ZOHO_BASE_URL . "/contacts?organization_id=" . ZOHO_ORGANIZATION_ID,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => ["Authorization: Zoho-oauthtoken $token"]
    ]);
    $response = curl_exec($curl);
    $info = curl_getinfo($curl);
    curl_close($curl);

    echo "Status Code: " . $info['http_code'] . "\n";
    $data = json_decode($response, true);
    
    if (isset($data['code']) && $data['code'] === 0) {
        echo "Success! Found " . count($data['contacts']) . " contacts.\n";
    } else {
        echo "Error Response:\n";
        print_r($data ?: $response);
    }

    echo "\n3. Testing Invoice Creation (Dry Run / Error Check)...\n";
    $testData = [
        'name' => 'Test Customer',
        'email' => 'test@example.com',
        'phone' => '9876543210',
        'booking_reference' => 'TEST-' . time(),
        'show_title' => 'Test Performance',
        'location' => 'CHENNAI',
        'event_date' => date('Y-m-d'),
        'event_time' => '10:00 AM',
        'ticket_type' => 'General Admission',
        'quantity' => 1,
        'price_per_unit' => 100
    ];
    
    $result = ZohoInvoiceService::createInvoice($testData);
    
    if ($result) {
        echo "Invoice Created Successfully!\n";
        print_r($result);
    } else {
        echo "Invoice Creation Failed. Check error logs.\n";
    }

} catch (Exception $e) {
    echo "Caught Exception: " . $e->getMessage() . "\n";
}

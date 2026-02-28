<?php
/**
 * test_zoho.php
 * Diagnostic script to verify the Zoho Invoice connection.
 * Run this from: http://localhost/medai/backend/api/test_zoho.php
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/ZohoInvoiceService.php';

// Enable error display for this test only
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: text/plain');

echo "--- MEDAI Zoho Diagnostic Started ---\n\n";

// 1. Check Config Constants
$required = ['ZOHO_CLIENT_ID', 'ZOHO_CLIENT_SECRET', 'ZOHO_REFRESH_TOKEN', 'ZOHO_ORGANIZATION_ID'];
foreach ($required as $const) {
    if (!defined($const) || empty(constant($const))) {
        die("ERROR: Constant $const is missing or empty in config.php.\n");
    }
}
echo "✅ Configuration constants found.\n";

// 2. Fetch Access Token (Test Auth)
try {
    // We use reflection since the method is private
    $ref = new ReflectionClass('ZohoInvoiceService');
    $method = $ref->getMethod('getAccessToken');
    $method->setAccessible(true);
    $token = $method->invoke(null);
    echo "✅ Successfully fetched OAuth Access Token: " . substr($token, 0, 10) . "...\n";

    // 2.1 CHECK TAXES (ADDED DIAGNOSTIC)
    echo "\n--- Checking Available Taxes in Zoho ---\n";
    $curl = curl_init();
    curl_setopt_array($curl, [
        CURLOPT_URL => ZOHO_BASE_URL . "/settings/taxes?organization_id=" . ZOHO_ORGANIZATION_ID,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => ["Authorization: Zoho-oauthtoken $token"]
    ]);
    $taxRes = json_decode(curl_exec($curl), true);
    curl_close($curl);
    
    if (isset($taxRes['taxes'])) {
        foreach ($taxRes['taxes'] as $tax) {
            echo "Tax Name: {$tax['tax_name']} | Tax ID: {$tax['tax_id']} | Percentage: {$tax['tax_percentage']}%\n";
        }
    } else {
        echo "⚠️ No taxes found or not supported in this org. Error: " . json_encode($taxRes) . "\n";
    }
    echo "--------------------------------------\n\n";

} catch (Exception $e) {
    die("❌ FAILED to get Access Token: " . $e->getMessage() . "\n");
}

// 3. Create a Mock Invoice
echo "Generating test invoice data...\n";
$mockRef = 'TEST-' . strtoupper(substr(uniqid(), -6));
$mockData = [
    'name'           => 'Test User ' . date('His'),
    'email'          => 'test-user-' . rand(100,999) . '@zoho.com',
    'phone'          => '9199887766',
    'booking_reference' => $mockRef,
    'show_title'     => 'MEDAI Diagnostic Test',
    'location'       => 'TEST ARENA',
    'event_date'     => date('D, d M'),
    'event_time'     => '10:00 AM',
    'ticket_type'    => 'Space Rental',
    'quantity'       => 1,
    'price_per_unit' => 10,
    'billing_address'=> '123 Test Street, Fintech Hub',
    'city'           => 'Chennai',
    'state'          => 'Tamil Nadu',
    'zip'            => '600001'
];

$invoiceId = ZohoInvoiceService::createInvoice($mockData);

if ($invoiceId) {
    echo "✅ SUCCESS! Test Invoice Created.\n";
    echo "Invoice ID: " . $invoiceId . "\n";
    
    $url = ZohoInvoiceService::getInvoicePortalUrl($invoiceId);
    if ($url) {
        echo "✅ Public Invoice URL: " . $url . "\n";
    }

    echo "\n--- Diagnostic Complete --- \n";
    echo "Please check your Zoho Invoice dashboard to see the latest TEST entry.";
} else {
    echo "❌ FAILED. Zoho Invoice not created. Check error_log for details.\n";
    echo "Often this is due to an invalid tax_id or a required custom field set in your Zoho Invoice settings.";
}
?>

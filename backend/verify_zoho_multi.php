<?php
require_once 'config/config.php';
require_once 'config/ZohoInvoiceService.php';

function test_endpoint($url, $token) {
    echo "Testing URL: $url\n";
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Zoho-oauthtoken $token"]);
    $res = curl_exec($ch);
    $info = curl_getinfo($ch);
    curl_close($ch);
    echo "Status: " . $info['http_code'] . "\n";
    echo "Response: $res\n\n";
}

try {
    $token = ZohoInvoiceService::getAccessToken();
    echo "Token Found: " . substr($token, 0, 10) . "...\n";

    // Test IN
    test_endpoint("https://www.zohoapis.in/invoice/v3/organizations", $token);
    // Test COM
    test_endpoint("https://www.zohoapis.com/invoice/v3/organizations", $token);
    // Test CONTACTS for local org
    test_endpoint("https://www.zohoapis.in/invoice/v3/contacts?organization_id=" . ZOHO_ORGANIZATION_ID, $token);

} catch (Exception $e) { echo "ERROR: " . $e->getMessage(); }

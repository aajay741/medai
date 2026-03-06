<?php
require_once 'config/config.php';
require_once 'config/ZohoInvoiceService.php';

function test($url, $token) {
    echo "--- Testing $url ---\n";
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Zoho-oauthtoken $token"]);
    $res = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    echo "HTTP CODE: $code\n";
    echo "BODY: $res\n\n";
    return $res;
}

try {
    $token = ZohoInvoiceService::getAccessToken();
    echo "Token: $token\n\n";

    // 1. List Orgs on .in
    $orgs_in = test("https://www.zohoapis.in/invoice/v3/organizations", $token);
    
    // 2. List Orgs on .com
    $orgs_com = test("https://www.zohoapis.com/invoice/v3/organizations", $token);

    // 3. Test current config contact search
    test(ZOHO_BASE_URL . "/contacts?organization_id=" . ZOHO_ORGANIZATION_ID, $token);

} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage();
}

<?php
require_once 'config/config.php';
require_once 'config/ZohoInvoiceService.php';
$t = ZohoInvoiceService::getAccessToken();
$c = curl_init('https://www.zohoapis.in/invoice/v3/contacts');
curl_setopt($c, CURLOPT_RETURNTRANSFER, true);
curl_setopt($c, CURLOPT_HTTPHEADER, [
    'Authorization: Zoho-oauthtoken '.$t,
    'X-com-zoho-invoice-organizationid: ' . ZOHO_ORGANIZATION_ID
]);
$r = curl_exec($c);
$code = curl_getinfo($c, CURLINFO_HTTP_CODE);
curl_close($c);
file_put_contents('zoho_scope_test.txt', "CODE: $code\nBODY: $r");
echo "Done";

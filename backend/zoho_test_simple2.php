<?php
require_once 'config/config.php';
require_once 'config/ZohoInvoiceService.php';
$t = ZohoInvoiceService::getAccessToken();
$urls = ['https://www.zohoapis.in/invoice/v3/organizations', 'https://www.zohoapis.com/invoice/v3/organizations'];
$out = "";
foreach($urls as $u){
    $c = curl_init($u);
    curl_setopt($c, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($c, CURLOPT_HTTPHEADER, ['Authorization: Zoho-oauthtoken '.$t]);
    $r = curl_exec($c);
    $code = curl_getinfo($c, CURLINFO_HTTP_CODE);
    $out .= "URL: $u CODE: $code\n";
    curl_close($c);
}
file_put_contents('zoho_simple_out.txt', $out);
echo "Done";

<?php
require_once 'config/config.php';
require_once 'config/ZohoInvoiceService.php';
$t = ZohoInvoiceService::getAccessToken();
$c = curl_init('https://www.zohoapis.in/invoice/v3/organizations');
curl_setopt($c, CURLOPT_RETURNTRANSFER, true);
curl_setopt($c, CURLOPT_HTTPHEADER, ['Authorization: Zoho-oauthtoken '.$t]);
$r = curl_exec($c);
curl_close($c);

$data = json_decode($r, true);
$out = "";
if (isset($data['organizations'])) {
    foreach($data['organizations'] as $org) {
        $out .= "Name: " . $org['name'] . "\n";
        $out .= "ID: " . $org['organization_id'] . "\n";
        $out .= "Currency: " . $org['currency_code'] . "\n\n";
    }
} else {
    $out = "Raw: " . $r;
}

file_put_contents('zoho_org_info.txt', $out);
echo "Done";

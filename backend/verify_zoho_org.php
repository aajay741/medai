<?php
require_once 'config/config.php';
require_once 'config/ZohoInvoiceService.php';

try {
    $token = ZohoInvoiceService::getAccessToken();
    echo "Access Token acquired successfully.\n";

    $curl = curl_init();
    curl_setopt_array($curl, [
        CURLOPT_URL => "https://www.zohoapis.in/invoice/v3/organizations",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => ["Authorization: Zoho-oauthtoken $token"]
    ]);

    $response = curl_exec($curl);
    $data = json_decode($response, true);
    curl_close($curl);

    echo "Organizations Response:\n";
    echo $response . "\n";

} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}

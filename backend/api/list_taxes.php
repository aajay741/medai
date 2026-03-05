<?php
require_once '../config/config.php';
require_once '../config/ZohoInvoiceService.php';

header('Content-Type: text/plain');

try {
    $token = ZohoInvoiceService::getAccessToken();
    $curl = curl_init();
    curl_setopt_array($curl, [
        CURLOPT_URL            => ZOHO_BASE_URL . "/settings/taxes?organization_id=" . ZOHO_ORGANIZATION_ID,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => ["Authorization: Zoho-oauthtoken $token"]
    ]);
    $response = curl_exec($curl);
    curl_close($curl);

    $data = json_decode($response, true);
    if (isset($data['taxes'])) {
        echo "Taxes found in this Org:\n";
        foreach ($data['taxes'] as $tax) {
            echo "Name: {$tax['tax_name']} | Rate: {$tax['tax_percentage']}% | ID: {$tax['tax_id']}\n";
        }
    } else {
        echo "No taxes found or error:\n";
        print_r($data);
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}

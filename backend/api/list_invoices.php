<?php
require_once '../config/config.php';
require_once '../config/ZohoInvoiceService.php';

header('Content-Type: text/plain');

try {
    $token = ZohoInvoiceService::getAccessToken();
    $curl = curl_init();
    curl_setopt_array($curl, [
        CURLOPT_URL            => ZOHO_BASE_URL . "/invoices?organization_id=" . ZOHO_ORGANIZATION_ID,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => ["Authorization: Zoho-oauthtoken $token"]
    ]);
    $response = curl_exec($curl);
    curl_close($curl);

    $data = json_decode($response, true);
    if (isset($data['invoices'])) {
        echo "Total Invoices: " . count($data['invoices']) . "\n";
        foreach (array_slice($data['invoices'], 0, 5) as $inv) {
            echo "Inv: {$inv['invoice_number']} | Customer: {$inv['customer_name']} | Total: {$inv['total']} | Status: {$inv['status']} | Date: {$inv['date']}\n";
        }
    } else {
        print_r($data);
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}

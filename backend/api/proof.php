<?php
require_once '../config/config.php';
require_once '../config/ZohoInvoiceService.php';

header('Content-Type: text/plain');

try {
    $token = ZohoInvoiceService::getAccessToken();
    $curl = curl_init();
    // Simplified list call
    curl_setopt_array($curl, [
        CURLOPT_URL            => ZOHO_BASE_URL . "/invoices?organization_id=" . ZOHO_ORGANIZATION_ID,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => ["Authorization: Zoho-oauthtoken $token"]
    ]);
    $response = curl_exec($curl);
    curl_close($curl);

    $data = json_decode($response, true);
    if (isset($data['invoices']) && count($data['invoices']) > 0) {
        echo "FOUND " . count($data['invoices']) . " INVOICES IN YOUR ZOHO ACCOUNT:\n";
        foreach ($data['invoices'] as $inv) {
            echo "Date: {$inv['date']} | Status: [{$inv['status']}] | No: {$inv['invoice_number']} | Customer: {$inv['customer_name']} | Total: {$inv['total']} | Ref: {$inv['reference_number']}\n";
        }
    } else {
        echo "Actually, no invoices returned from the list API.\n";
        echo "Raw Preview: " . substr($response, 0, 500) . "\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}

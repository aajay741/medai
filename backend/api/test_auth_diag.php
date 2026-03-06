<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once 'c:/xampp/htdocs/medai/backend/config/config.php';
require_once 'c:/xampp/htdocs/medai/backend/config/ZohoInvoiceService.php';

echo "Testing Zoho Auth...\n";
try {
    $token = ZohoInvoiceService::getAccessToken();
    echo "Success! Token: " . substr($token, 0, 10) . "...\n";
} catch (Exception $e) {
    echo "Zoho Auth Failed: " . $e->getMessage() . "\n";
    echo "Full Trace:\n" . $e->getTraceAsString() . "\n";
}

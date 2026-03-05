<?php
header('Content-Type: text/plain');

echo "CURL Diagnostic:\n";
echo "CURL Version: " . curl_version()['version'] . "\n";
echo "SSL Version: " . curl_version()['ssl_version'] . "\n";
echo "Protocols: " . implode(', ', curl_version()['protocols']) . "\n";

$test_url = "https://accounts.zoho.in/oauth/v2/token";
echo "\nTesting connectivity to Zoho Auth ($test_url)...\n";

$ch = curl_init($test_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
// curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // For testing only

$exec = curl_exec($ch);
$errno = curl_errno($ch);
$error = curl_error($ch);
$info = curl_getinfo($ch);
curl_close($ch);

if ($errno) {
    echo "ERROR ($errno): $error\n";
    if ($errno == 60) {
        echo "SUGGESTION: SSL certificate problem. Try adding 'CURLOPT_SSL_VERIFYPEER => false' to ZohoInvoiceService.php for testing, or configure cacert.pem.\n";
    }
} else {
    echo "Connected successfully! HTTP Code: " . $info['http_code'] . "\n";
}

echo "\nPHP Error Log Path: " . ini_get('error_log') . "\n";

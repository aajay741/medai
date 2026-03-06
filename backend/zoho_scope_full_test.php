<?php
require_once 'config/config.php';

// Delete cached token to force a fresh one
$cacheFile = __DIR__ . '/config/zoho_token_cache.json';
if (file_exists($cacheFile)) {
    unlink($cacheFile);
    echo "Cache deleted.\n";
}

// Get a fresh token
$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL            => ZOHO_AUTH_URL,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => http_build_query([
        'refresh_token' => ZOHO_REFRESH_TOKEN,
        'client_id'     => ZOHO_CLIENT_ID,
        'client_secret' => ZOHO_CLIENT_SECRET,
        'grant_type'    => 'refresh_token'
    ])
]);

$rawResponse = curl_exec($curl);
$response = json_decode($rawResponse, true);
curl_close($curl);

echo "Full Auth Response:\n";
echo json_encode($response, JSON_PRETTY_PRINT) . "\n\n";

if (!isset($response['access_token'])) {
    echo "ERROR: No access token retrieved!\n";
    exit;
}

$token = $response['access_token'];

// Test creating a contact (minimal test)
$curl2 = curl_init();
curl_setopt_array($curl2, [
    CURLOPT_URL            => ZOHO_BASE_URL . "/contacts?organization_id=" . ZOHO_ORGANIZATION_ID,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => ["Authorization: Zoho-oauthtoken $token"],
    CURLOPT_IPRESOLVE      => CURL_IPRESOLVE_V4
]);
$contactRes = curl_exec($curl2);
$contactCode = curl_getinfo($curl2, CURLINFO_HTTP_CODE);
curl_close($curl2);

echo "Contacts List Response (HTTP $contactCode):\n";
echo $contactRes . "\n\n";

// Test invoice list
$curl3 = curl_init();
curl_setopt_array($curl3, [
    CURLOPT_URL            => ZOHO_BASE_URL . "/invoices?organization_id=" . ZOHO_ORGANIZATION_ID,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => ["Authorization: Zoho-oauthtoken $token"],
    CURLOPT_IPRESOLVE      => CURL_IPRESOLVE_V4
]);
$invRes = curl_exec($curl3);
$invCode = curl_getinfo($curl3, CURLINFO_HTTP_CODE);
curl_close($curl3);

echo "Invoice List Response (HTTP $invCode):\n";
echo $invRes . "\n";

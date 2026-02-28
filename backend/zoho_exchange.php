<?php
require_once 'config/config.php';

$code = '1000.734965dc9fd9852d87b26c1804f74674.4187a1e04c99676c0519534af9c349ce';
$redirect_uri = 'http://localhost:3000/zoho-callback';

echo "<h1>Zoho Exchange Script</h1>";

// 1. Exchange code for Refresh Token
$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL => ZOHO_AUTH_URL,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => http_build_query([
        'code' => $code,
        'client_id' => ZOHO_CLIENT_ID,
        'client_secret' => ZOHO_CLIENT_SECRET,
        'redirect_uri' => $redirect_uri,
        'grant_type' => 'authorization_code'
    ])
]);

$response = json_decode(curl_exec($curl), true);
curl_close($curl);

if (!isset($response['refresh_token'])) {
    echo "<pre>Error exchanging code: " . print_r($response, true) . "</pre>";
    exit;
}

$refresh_token = $response['refresh_token'];
$access_token = $response['access_token'];

echo "<p><strong>Refresh Token:</strong> <code>$refresh_token</code></p>";

// 2. Get Organization ID
$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL => ZOHO_BASE_URL . "/organizations",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        "Authorization: Zoho-oauthtoken $access_token"
    ]
]);

$org_response = json_decode(curl_exec($curl), true);
curl_close($curl);

if (isset($org_response['organizations'][0]['organization_id'])) {
    $org_id = $org_response['organizations'][0]['organization_id'];
    echo "<p><strong>Organization ID:</strong> <code>$org_id</code></p>";
    echo "<p>Success! Use these values in your config.php</p>";
} else {
    echo "<pre>Error getting organization: " . print_r($org_response, true) . "</pre>";
}
?>

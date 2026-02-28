<?php
require_once 'config/config.php';
require_once 'config/ZohoInvoiceService.php';

try {
    echo "<h1>Zoho Integration Test</h1>";
    
    // We'll try to get contacts as a simple test
    $curl = curl_init();
    $token_url = ZOHO_AUTH_URL;
    
    // First, let's verify we can get an access token
    echo "<p>Testing Access Token generation...</p>";
    $curl = curl_init();
    curl_setopt_array($curl, [
        CURLOPT_URL => ZOHO_AUTH_URL,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query([
            'refresh_token' => ZOHO_REFRESH_TOKEN,
            'client_id' => ZOHO_CLIENT_ID,
            'client_secret' => ZOHO_CLIENT_SECRET,
            'grant_type' => 'refresh_token'
        ])
    ]);

    $response = json_decode(curl_exec($curl), true);
    curl_close($curl);

    if (isset($response['access_token'])) {
        echo "<p style='color: green;'>✅ Access Token generated successfully!</p>";
        $token = $response['access_token'];
        
        echo "<p>Testing connection to Organization ID: " . ZOHO_ORGANIZATION_ID . "...</p>";
        
        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => ZOHO_BASE_URL . "/contacts?organization_id=" . ZOHO_ORGANIZATION_ID,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => ["Authorization: Zoho-oauthtoken $token"]
        ]);
        
        $contacts_response = json_decode(curl_exec($curl), true);
        curl_close($curl);
        
        if (isset($contacts_response['code']) && $contacts_response['code'] == 0) {
            echo "<p style='color: green;'>✅ Successfully connected to Zoho Invoice API!</p>";
            echo "<p>Found " . count($contacts_response['contacts']) . " contacts.</p>";
            echo "<br><p><strong>Integration is now LIVE!</strong></p>";
        } else {
            echo "<p style='color: red;'>❌ Failed to fetch contacts.</p>";
            echo "<pre>" . print_r($contacts_response, true) . "</pre>";
        }
    } else {
        echo "<p style='color: red;'>❌ Failed to generate Access Token.</p>";
        echo "<pre>" . print_r($response, true) . "</pre>";
    }

} catch (Exception $e) {
    echo "<p style='color: red;'>Error: " . $e->getMessage() . "</p>";
}
?>

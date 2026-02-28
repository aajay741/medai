<?php
require_once 'config/config.php';

$scope = 'ZohoInvoice.invoices.ALL,ZohoInvoice.contacts.ALL,ZohoInvoice.settings.READ';
$redirect_uri = 'http://localhost:3000/zoho-callback';
$client_id = ZOHO_CLIENT_ID;

$auth_url = "https://accounts.zoho.in/oauth/v2/auth?scope=$scope&client_id=$client_id&response_type=code&access_type=offline&redirect_uri=$redirect_uri&prompt=consent";

echo "<h1>Zoho Authentication Step 1</h1>";
echo "<p>Click the link below to authorize MedAI to access your Zoho Invoice account:</p>";
echo "<a href='$auth_url' style='padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;'>Authorize MedAI</a>";
echo "<p><br><strong>Note:</strong> After clicking Accept, you will be redirected to your React app. Look at the URL in the address bar and copy the value after <code>?code=</code></p>";
?>

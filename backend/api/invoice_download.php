<?php
/**
 * invoice_download.php
 * Proxies the Zoho invoice PDF to the browser so the customer can download it.
 * Usage: GET /backend/api/invoice_download.php?invoice_id=XXXXX
 */

require_once '../config/config.php';

// Allow CORS for the frontend origin
setCorsHeaders();

$invoiceId = $_GET['invoice_id'] ?? '';
if (!$invoiceId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'invoice_id is required']);
    exit;
}

require_once '../config/ZohoInvoiceService.php';

try {
    $token = (new ReflectionClass('ZohoInvoiceService'))
               ->getMethod('getAccessToken');
    $token->setAccessible(true);
    $accessToken = $token->invoke(null);
} catch (Exception $e) {
    // Fallback – get token via a simpler curl call
    $ch = curl_init();
    curl_setopt_array($ch, [
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
    $res = json_decode(curl_exec($ch), true);
    curl_close($ch);
    $accessToken = $res['access_token'] ?? null;
}

if (!$accessToken) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Could not authenticate with Zoho']);
    exit;
}

// Fetch PDF from Zoho
$pdfUrl = ZOHO_BASE_URL . "/invoices/{$invoiceId}?organization_id=" . ZOHO_ORGANIZATION_ID . "&accept=pdf";

$ch = curl_init($pdfUrl);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => ["Authorization: Zoho-oauthtoken $accessToken"],
    CURLOPT_FOLLOWLOCATION => true
]);
$pdfData   = curl_exec($ch);
$httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$mimeType  = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
curl_close($ch);

if ($httpCode !== 200 || empty($pdfData)) {
    http_response_code(502);
    echo json_encode(['success' => false, 'message' => 'Failed to fetch invoice PDF from Zoho']);
    exit;
}

// Stream PDF to browser
header('Content-Type: application/pdf');
header('Content-Disposition: attachment; filename="MEDAI-Invoice-' . $invoiceId . '.pdf"');
header('Content-Length: ' . strlen($pdfData));
header('Cache-Control: no-cache');
echo $pdfData;
exit;
?>

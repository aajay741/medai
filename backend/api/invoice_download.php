<?php
/**
 * invoice_download.php
 * Proxies the Zoho invoice PDF to the browser.
 * Now supports waiting for the invoice to be generated if it's currently pending.
 * Usage: GET /backend/api/invoice_download.php?invoice_id=XXXX or ?ref=MEDAI-XXXX
 */

require_once '../config/config.php';
require_once '../config/ZohoInvoiceService.php';

setCorsHeaders();

$invoiceId = $_GET['invoice_id'] ?? '';
$bookingRef = $_GET['ref'] ?? '';

if (!$invoiceId && !$bookingRef) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'invoice_id or ref is required']);
    exit;
}

$db = Database::getInstance()->getConnection();

// 1. If we only have bookingRef, we need to find the invoiceId
// We allow a short wait (5 seconds) if it's currently being generated
if (!$invoiceId && $bookingRef) {
    for ($i = 0; $i < 40; $i++) { // Wait up to 20 seconds
        $stmt = $db->prepare("SELECT zoho_invoice_id FROM bookings WHERE booking_reference = ? LIMIT 1");
        $stmt->execute([$bookingRef]);
        $invoiceId = $stmt->fetchColumn();

        if ($invoiceId) break;
        
        // If not ready, wait retry
        usleep(500000); 
    }
}

if (!$invoiceId) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Invoice not ready or not found. Please try again in a moment.']);
    exit;
}

try {
    $accessToken = ZohoInvoiceService::getAccessToken();
} catch (Exception $e) {
    error_log("Download Auth Error: " . $e->getMessage());
    $accessToken = null;
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
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_IPRESOLVE      => CURL_IPRESOLVE_V4,
    CURLOPT_CONNECTTIMEOUT => 5
]);
$pdfData   = curl_exec($ch);
$httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200 || empty($pdfData)) {
    http_response_code(502);
    echo json_encode(['success' => false, 'message' => 'Failed to fetch invoice PDF from Zoho. Status: ' . $httpCode]);
    exit;
}

// Stream PDF to browser
header('Content-Type: application/pdf');
header('Content-Disposition: attachment; filename="MEDAI-Invoice-' . $bookingRef . '-' . $invoiceId . '.pdf"');
header('Content-Length: ' . strlen($pdfData));
header('Cache-Control: no-cache');
echo $pdfData;
exit;
?>

<?php
$url = 'http://localhost/medai/backend/api/generate_invoice.php';
$data = json_encode(['bookingReference' => 'MEDAI-C9391A7D']);
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// Add these to be safe on local XAMPP
curl_setopt($ch, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
$res = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
if (curl_errno($ch)) {
    echo "CURL ERROR: " . curl_error($ch) . "\n";
}
curl_close($ch);
echo "Code: $code\n";
echo "Res: $res\n";

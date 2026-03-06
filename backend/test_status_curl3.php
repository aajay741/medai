<?php
$ch = curl_init('http://localhost/medai/backend/api/get_invoice_status.php?ref=MEDAI-FFE9A0CE');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$res = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
echo json_encode(json_decode($res), JSON_PRETTY_PRINT);

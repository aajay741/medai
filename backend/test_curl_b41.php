<?php
$ch = curl_init('http://localhost/medai/backend/api/get_invoice_status.php?ref=MEDAI-B4151FD8');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$res = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
echo "CODE: $code\nRES: $res";

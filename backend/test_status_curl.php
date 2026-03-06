<?php
$ch = curl_init('http://localhost/backend/api/get_invoice_status.php?ref=MEDAI-FFE9A0CE');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$res = curl_exec($ch);
curl_close($ch);
echo $res;

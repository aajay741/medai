<?php
require_once 'config/config.php';
$db = Database::getInstance()->getConnection();
$s = $db->query('DESCRIBE bookings');
$res = [];
while($r = $s->fetch(PDO::FETCH_ASSOC)) {
    $res[] = json_encode($r);
}
echo implode("\n", $res);

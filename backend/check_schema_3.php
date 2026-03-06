<?php
require_once 'config/config.php';
$db = Database::getInstance()->getConnection();
$s = $db->query('DESCRIBE bookings');
while($r = $s->fetch(PDO::FETCH_ASSOC)) {
    printf("%-20s | %s\n", $r['Field'], $r['Type']);
}

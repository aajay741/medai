<?php
require_once 'config/config.php';
try {
    $db = Database::getInstance()->getConnection();
    $s = $db->query('DESCRIBE bookings');
    while($r = $s->fetch(PDO::FETCH_ASSOC)) {
        echo $r['Field'] . ' ' . $r['Type'] . PHP_EOL;
    }
} catch(Exception $e) {
    echo $e->getMessage();
}

<?php
require_once 'config/config.php';
try {
    $db = Database::getInstance()->getConnection();
    $s = $db->query('DESCRIBE bookings');
    $columns = $s->fetchAll(PDO::FETCH_ASSOC);
    foreach($columns as $r) {
        echo $r['Field'] . " | " . $r['Type'] . PHP_EOL;
    }
} catch(Exception $e) {
    echo $e->getMessage();
}

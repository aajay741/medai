<?php
require_once 'config/config.php';
try {
    $db = Database::getInstance()->getConnection();
    echo "Current Database: " . DB_NAME . "\n";
    $stmt = $db->query("DESCRIBE bookings");
    while($r = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo $r['Field'] . " | " . $r['Type'] . "\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}

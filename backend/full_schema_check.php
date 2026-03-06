<?php
require_once 'config/config.php';
try {
    $db = Database::getInstance()->getConnection();
    echo "--- Tables ---\n";
    $stmt = $db->query("SHOW TABLES");
    while($r = $stmt->fetch(PDO::FETCH_NUM)) {
        echo "Table: " . $r[0] . "\n";
    }
    
    echo "\n--- Columns in bookings ---\n";
    $stmt = $db->query("DESCRIBE bookings");
    while($r = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo $r['Field'] . " | " . $r['Type'] . "\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}

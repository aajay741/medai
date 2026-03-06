<?php
require_once 'config/config.php';
try {
    $db = Database::getInstance()->getConnection();
    $stmt = $db->query("DESCRIBE bookings");
    $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "Columns: " . implode(', ', $columns) . PHP_EOL;
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}

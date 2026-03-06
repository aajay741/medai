<?php
require_once 'config/config.php';

echo "Database Host: " . DB_HOST . PHP_EOL;
echo "Database Name: " . DB_NAME . PHP_EOL;

try {
    $db = Database::getInstance()->getConnection();
    echo "Connection Successful!" . PHP_EOL;
    
    $stmt = $db->query("SELECT id, booking_reference, name, payment_status, created_at FROM bookings ORDER BY id DESC LIMIT 5");
    $bookings = $stmt->fetchAll();
    
    echo "Recent Bookings:" . PHP_EOL;
    foreach ($bookings as $b) {
        printf("[%d] %s - %s | Status: %s | Date: %s\n", $b['id'], $b['booking_reference'], $b['name'], $b['payment_status'], $b['created_at']);
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . PHP_EOL;
}

<?php
require_once 'config/config.php';
try {
    $db = Database::getInstance()->getConnection();
    $stmt = $db->query("SELECT id, booking_reference, total_amount, quantity, name, phone, billing_address, city, state, zip_code FROM bookings ORDER BY id DESC LIMIT 1");
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    foreach($row as $k => $v) {
        echo "$k: $v\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}

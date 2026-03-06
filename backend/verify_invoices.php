<?php
require_once 'config/config.php';
try {
    $db = Database::getInstance()->getConnection();
    $stmt = $db->query("SELECT id, booking_reference, zoho_invoice_id, name, created_at FROM bookings ORDER BY id DESC LIMIT 10");
    while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        printf("[%d] %s: %s | Invoice: %s | Date: %s\n", 
            $row['id'], $row['booking_reference'], $row['name'], 
            ($row['zoho_invoice_id'] ?: "EMPTY"), $row['created_at']);
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}

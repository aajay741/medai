<?php
require_once 'config/config.php';
$ref = 'MEDAI-E1DDA1B0';
try {
    $db = Database::getInstance()->getConnection();
    $stmt = $db->prepare("SELECT id, booking_reference, zoho_invoice_id, zoho_customer_id, created_at, updated_at FROM bookings WHERE booking_reference = ?");
    $stmt->execute([$ref]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode($row, JSON_PRETTY_PRINT);
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}

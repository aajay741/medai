<?php
require_once 'config/config.php';
$ref = 'MEDAI-FFE9A0CE';
try {
    $db = Database::getInstance()->getConnection();
    $stmt = $db->prepare("SELECT id, booking_reference, zoho_invoice_id, zoho_customer_id, payment_status, created_at FROM bookings WHERE booking_reference = ?");
    $stmt->execute([$ref]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($row) {
        echo json_encode($row, JSON_PRETTY_PRINT);
    } else {
        echo "Ref not found in DB";
    }
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage();
}

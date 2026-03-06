<?php
require_once 'config/config.php';
$ref = 'MEDAI-E1DDA1B0';
try {
    $db = Database::getInstance()->getConnection();
    $stmt = $db->prepare("SELECT id, zoho_invoice_id, zoho_customer_id FROM bookings WHERE booking_reference = ?");
    $stmt->execute([$ref]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($row) {
        echo "ID: " . $row['id'] . "\n";
        echo "Invoice ID: " . ($row['zoho_invoice_id'] ?: "MISSING") . "\n";
        echo "Customer ID: " . ($row['zoho_customer_id'] ?: "MISSING") . "\n";
    } else {
        echo "Booking not found";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}

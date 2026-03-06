<?php
require_once 'config/config.php';
$ref = 'MEDAI-FFE9A0CE';
try {
    $db = Database::getInstance()->getConnection();
    $stmt = $db->prepare("SELECT z.* FROM bookings z WHERE booking_reference = ?");
    $stmt->execute([$ref]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    print_r([
        'invoice' => $row['zoho_invoice_id'],
        'customer' => $row['zoho_customer_id'],
        'payment' => $row['payment_status'],
        'date' => $row['created_at']
    ]);
} catch (Exception $e) { echo $e->getMessage(); }

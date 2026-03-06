<?php
require_once 'config/config.php';
try {
    $db = Database::getInstance()->getConnection();
    // Get ALL columns for last 5 bookings to see what is going on
    $s = $db->query("SELECT id, booking_reference, name, created_at, zoho_invoice_id, payment_status FROM bookings ORDER BY id DESC LIMIT 5");
    $data = $s->fetchAll(PDO::FETCH_ASSOC);
    foreach($data as $row) {
        printf("[%d] REF: %-15s | Name: %-15s | Date: %s | Invoice: %-10s | Pay: %s\n", 
            $row['id'], 
            $row['booking_reference'], 
            $row['name'], 
            $row['created_at'], 
            ($row['zoho_invoice_id'] ?: 'MISSING'),
            $row['payment_status']
        );
    }
} catch (Exception $e) { echo "ERROR: " . $e->getMessage(); }

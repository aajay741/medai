<?php
require_once 'config/config.php';
try {
    $db = Database::getInstance()->getConnection();
    $s = $db->query('SELECT id, booking_reference, zoho_invoice_id, name, created_at FROM bookings ORDER BY id DESC LIMIT 10');
    while($r = $s->fetch()){
        printf("[%d] %s: %s | Invoice: %s | Date: %s\n", $r['id'], $r['booking_reference'], $r['name'], ($r['zoho_invoice_id'] ?: 'EMPTY'), $r['created_at']);
    }
} catch (Exception $e) { echo $e->getMessage(); }

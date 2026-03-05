<?php
require_once 'c:/xampp/htdocs/medai/backend/config/config.php';
$db = Database::getInstance()->getConnection();
$stmt = $db->query("SELECT booking_reference, special_requests, created_at FROM bookings ORDER BY created_at DESC LIMIT 10");
$results = $stmt->fetchAll();
foreach ($results as $row) {
    echo "Ref: {$row['booking_reference']} | Date: {$row['created_at']}\n";
    echo "Special/Zoho: " . ($row['special_requests'] ?: 'NONE') . "\n";
    echo "-------------------\n";
}

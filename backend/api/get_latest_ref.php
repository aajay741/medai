<?php
require_once 'c:/xampp/htdocs/medai/backend/config/config.php';
$stmt = Database::getInstance()->getConnection()->query("SELECT booking_reference FROM bookings ORDER BY id DESC LIMIT 1");
$row = $stmt->fetch();
echo $row['booking_reference'] ?? 'NOTFOUND';

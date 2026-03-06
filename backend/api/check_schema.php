<?php
require_once 'c:/xampp/htdocs/medai/backend/config/config.php';
$db = Database::getInstance()->getConnection();
$stmt = $db->query("DESCRIBE bookings");
foreach ($stmt->fetchAll() as $row) {
    echo $row['Field'] . "\n";
}

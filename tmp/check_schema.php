<?php
require 'backend/config/config.php';
$db = Database::getInstance()->getConnection();
$stmt = $db->query('DESCRIBE slot_management');
while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    print_r($row);
}

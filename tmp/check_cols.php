<?php
require 'backend/config/config.php';
$db = Database::getInstance()->getConnection();
$stmt = $db->query('SHOW COLUMNS FROM slot_management');
$columns = $stmt->fetchAll(PDO::FETCH_COLUMN);
echo implode(", ", $columns);

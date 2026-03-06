<?php
require 'backend/config/config.php';
$db = Database::getInstance()->getConnection();
$stmt = $db->query("SHOW TABLES");
$tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
echo implode(", ", $tables) . "\n";
foreach ($tables as $table) {
    echo "\nTABLE: $table\n";
    $stmt = $db->query("DESCRIBE `$table` ");
    while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        print_r($row);
    }
}

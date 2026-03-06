<?php
require_once 'config/config.php';
try {
    $db = Database::getInstance()->getConnection();
    echo "Adding show_title column..." . PHP_EOL;
    $db->exec("ALTER TABLE bookings ADD COLUMN IF NOT EXISTS show_title VARCHAR(255) NULL");
    echo "Done." . PHP_EOL;
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}

<?php
require_once __DIR__ . '/config/config.php';

try {
    $db = Database::getInstance()->getConnection();
    $stmt = $db->prepare("UPDATE venue_slots SET base_price = 15000 WHERE slot_code = 'C1' AND location = 'CHENNAI'");
    $stmt->execute();
    echo "Successfully updated C1 base_price to 15000.";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>

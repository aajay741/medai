<?php
require_once 'config/config.php';
$ref = 'MEDAI-526C5469'; // From screenshot
try {
    $db = Database::getInstance()->getConnection();
    $stmt = $db->prepare("SELECT * FROM bookings WHERE booking_reference = ?");
    $stmt->execute([$ref]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($row) {
        echo json_encode($row, JSON_PRETTY_PRINT);
    } else {
        echo "No record found for $ref";
        // Let's get the last 1 record just in case
        $stmt = $db->query("SELECT * FROM bookings ORDER BY id DESC LIMIT 1");
        echo "\nLast Record:\n" . json_encode($stmt->fetch(PDO::FETCH_ASSOC), JSON_PRETTY_PRINT);
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}

<?php
require_once 'config/config.php';

try {
    $db = Database::getInstance()->getConnection();
    
    echo "Starting migration..." . PHP_EOL;
    
    // Add columns if they don't exist
    $cols = [
        'zoho_customer_id' => 'VARCHAR(50) NULL',
        'zoho_invoice_id'  => 'VARCHAR(50) NULL'
    ];
    
    foreach ($cols as $col => $def) {
        $check = $db->query("SHOW COLUMNS FROM bookings LIKE '$col'");
        if ($check->rowCount() == 0) {
            echo "Adding column $col..." . PHP_EOL;
            $db->exec("ALTER TABLE bookings ADD COLUMN $col $def");
        } else {
            echo "Column $col already exists." . PHP_EOL;
        }
    }
    
    echo "Migration completed successfully." . PHP_EOL;
    
} catch (Exception $e) {
    echo "Migration failed: " . $e->getMessage() . PHP_EOL;
}

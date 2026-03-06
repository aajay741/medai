<?php
require_once 'config/config.php';

try {
    $db = Database::getInstance()->getConnection();
    echo "Current DB: " . DB_NAME . "\n";
    
    // Ensure zoho_customers table exists
    echo "Creating table zoho_customers if not exists...\n";
    $db->exec("CREATE TABLE IF NOT EXISTS `zoho_customers` (
      `email` varchar(255) PRIMARY KEY,
      `zoho_customer_id` varchar(50) NOT NULL,
      `name` varchar(255) DEFAULT NULL,
      `phone` varchar(20) DEFAULT NULL,
      `created_at` timestamp DEFAULT current_timestamp()
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // Add zoho_customer_id to bookings if not exists
    $stmt = $db->query("SHOW COLUMNS FROM bookings LIKE 'zoho_customer_id'");
    if (!$stmt->fetch()) {
        echo "Adding zoho_customer_id to bookings table...\n";
        $db->exec("ALTER TABLE bookings ADD COLUMN zoho_customer_id VARCHAR(50) DEFAULT NULL AFTER updated_at");
    } else {
        echo "zoho_customer_id already exists in bookings.\n";
    }

    // Add zoho_invoice_id to bookings if not exists (checked earlier, but for safety)
    $stmt = $db->query("SHOW COLUMNS FROM bookings LIKE 'zoho_invoice_id'");
    if (!$stmt->fetch()) {
        echo "Adding zoho_invoice_id to bookings table...\n";
        $db->exec("ALTER TABLE bookings ADD COLUMN zoho_invoice_id VARCHAR(50) DEFAULT NULL AFTER zoho_customer_id");
    } else {
        echo "zoho_invoice_id already exists in bookings.\n";
    }

    echo "Ensuring zip_code and others exist...\n";
    $cols = [
        'company_name' => "VARCHAR(255) DEFAULT NULL",
        'gst_number' => "VARCHAR(50) DEFAULT NULL",
        'billing_address' => "TEXT DEFAULT NULL",
        'city' => "VARCHAR(100) DEFAULT NULL",
        'state' => "VARCHAR(100) DEFAULT NULL",
        'zip_code' => "VARCHAR(20) DEFAULT NULL",
        'purpose' => "TEXT DEFAULT NULL",
    ];
    
    foreach ($cols as $col => $type) {
        $stmt = $db->query("SHOW COLUMNS FROM bookings LIKE '$col'");
        if (!$stmt->fetch()) {
             echo "Adding $col to bookings...\n";
             $db->exec("ALTER TABLE bookings ADD COLUMN $col $type");
        }
    }
    
    echo "Database fixes applied to " . DB_NAME . ".\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

<?php
require 'backend/config/config.php';
$db = Database::getInstance()->getConnection();
$sql = "
    ALTER TABLE bookings 
        ADD COLUMN IF NOT EXISTS company_name    VARCHAR(255) NULL,
        ADD COLUMN IF NOT EXISTS gst_number      VARCHAR(50)  NULL,
        ADD COLUMN IF NOT EXISTS billing_address TEXT         NULL,
        ADD COLUMN IF NOT EXISTS city            VARCHAR(100) NULL,
        ADD COLUMN IF NOT EXISTS state           VARCHAR(100) NULL,
        ADD COLUMN IF NOT EXISTS zip_code        VARCHAR(20)  NULL,
        ADD COLUMN IF NOT EXISTS purpose         VARCHAR(255) NULL,
        ADD COLUMN IF NOT EXISTS zoho_invoice_id VARCHAR(100) NULL,
        ADD COLUMN IF NOT EXISTS zoho_customer_id VARCHAR(100) NULL
";
try {
    $db->exec($sql);
    echo "Migration done\n";
} catch (PDOException $e) {
    echo "Migration error: " . $e->getMessage() . "\n";
}

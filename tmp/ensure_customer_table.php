<?php
require 'backend/config/config.php';
$db = Database::getInstance()->getConnection();
$sql = "
    CREATE TABLE IF NOT EXISTS zoho_customers (
        email VARCHAR(255) PRIMARY KEY,
        zoho_customer_id VARCHAR(100) NOT NULL,
        name VARCHAR(255),
        phone VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
";
$db->exec($sql);
echo "zoho_customers table ensured\n";

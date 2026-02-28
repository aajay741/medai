<?php
require_once __DIR__ . '/config/config.php';

try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET,
        DB_USER,
        DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    echo "Connected to database: " . DB_NAME . "\n";

    // Columns to add
    $columns = [
        'company_name' => "VARCHAR(255) DEFAULT NULL",
        'gst_number' => "VARCHAR(50) DEFAULT NULL",
        'billing_address' => "TEXT DEFAULT NULL",
        'city' => "VARCHAR(100) DEFAULT NULL",
        'state' => "VARCHAR(100) DEFAULT NULL",
        'zip_code' => "VARCHAR(20) DEFAULT NULL",
        'purpose' => "VARCHAR(255) DEFAULT NULL"
    ];

    foreach ($columns as $column => $definition) {
        $check = $pdo->query("SHOW COLUMNS FROM bookings LIKE '$column'");
        if ($check->rowCount() == 0) {
            echo "Adding column: $column... ";
            $pdo->exec("ALTER TABLE bookings ADD COLUMN $column $definition");
            echo "Done.\n";
        } else {
            echo "Column $column already exists.\n";
        }
    }

    echo "\nDatabase schema updated successfully!\n";

} catch (PDOException $e) {
    die("Database Error: " . $e->getMessage() . "\n");
}

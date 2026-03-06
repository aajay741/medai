<?php
require_once 'config/config.php';

try {
    // Try connecting without a DB first to create it if it doesn't exist
    $pdo = new PDO("mysql:host=" . DB_HOST, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Creating database if not exists: " . DB_NAME . "...\n";
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `" . DB_NAME . "`");
    echo "Database " . DB_NAME . " is ready.\n";
    
    // Now switch to the database
    $pdo->exec("USE `" . DB_NAME . "`");
    
    // Check if bookings table exists
    $tables = $pdo->query("SHOW TABLES LIKE 'bookings'")->fetchAll();
    if (empty($tables)) {
        echo "Bookings table does not exist. Creating it...\n";
        // Attempt to find the schema in the SQL file
        $sql = file_get_contents('database/u891495087_medai_db1.sql');
        $pdo->exec($sql);
        echo "Bookings table created from SQL backup.\n";
    }
    
    echo "Ensuring 'show_title' column exists...\n";
    $columns = $pdo->query("SHOW COLUMNS FROM bookings LIKE 'show_title'")->fetchAll();
    if (empty($columns)) {
        $pdo->exec("ALTER TABLE bookings ADD COLUMN show_title VARCHAR(255) AFTER location");
        echo "Column 'show_title' added successfully.\n";
    } else {
        echo "Column 'show_title' already exists.\n";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

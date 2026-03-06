<?php
/**
 * migrate_db.php
 * ONE-TIME migration to add missing columns to the live Hostinger database.
 * Run this ONCE via browser: https://medaithestage.com/backend/api/migrate_db.php
 * Then DELETE this file from the server for security!
 */

// Basic security: only allow from known IPs or with a secret key
$secret = $_GET['key'] ?? '';
if ($secret !== 'medai_migrate_2026') {
    die(json_encode(['error' => 'Unauthorized. Provide ?key=medai_migrate_2026']));
}

require_once '../config/config.php';

header('Content-Type: text/html; charset=UTF-8');

$db = Database::getInstance()->getConnection();
$results = [];

$migrations = [
    // Missing columns from the bookings table
    "show_title"        => "ALTER TABLE `bookings` ADD COLUMN `show_title` varchar(255) DEFAULT NULL AFTER `location`",
    "zoho_invoice_id"   => "ALTER TABLE `bookings` ADD COLUMN `zoho_invoice_id` varchar(100) DEFAULT NULL AFTER `purpose`",
    "zoho_customer_id"  => "ALTER TABLE `bookings` ADD COLUMN `zoho_customer_id` varchar(100) DEFAULT NULL AFTER `zoho_invoice_id`",
    
    // zoho_customers cache table (for fast lookups)
    "zoho_customers_table" => "
        CREATE TABLE IF NOT EXISTS `zoho_customers` (
            `id` int(11) NOT NULL AUTO_INCREMENT,
            `email` varchar(255) NOT NULL,
            `zoho_customer_id` varchar(100) NOT NULL,
            `name` varchar(255) DEFAULT NULL,
            `phone` varchar(50) DEFAULT NULL,
            `created_at` timestamp NULL DEFAULT current_timestamp(),
            PRIMARY KEY (`id`),
            UNIQUE KEY `email` (`email`),
            KEY `idx_email` (`email`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ",
];

echo "<h2>MEDAI Database Migration</h2><ul>";

// First check what already exists
$existingCols = [];
try {
    $stmt = $db->query("DESCRIBE bookings");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $existingCols[] = $row['Field'];
    }
} catch (Exception $e) {
    echo "<li style='color:red'>ERROR reading schema: " . htmlspecialchars($e->getMessage()) . "</li>";
}

echo "<li>Existing columns: " . implode(', ', $existingCols) . "</li><hr/>";

foreach ($migrations as $name => $sql) {
    // Skip if column already exists
    if (in_array($name, $existingCols) && strpos($name, '_table') === false) {
        echo "<li style='color:gray'>⏭️ <b>$name</b> — already exists, skipped.</li>";
        continue;
    }
    if (strpos($name, '_table') !== false) {
        // It's a CREATE TABLE — always try it (IF NOT EXISTS handles idempotency)
        try {
            $db->exec(trim($sql));
            echo "<li style='color:green'>✅ <b>$name</b> — table created (or already existed).</li>";
        } catch (Exception $e) {
            echo "<li style='color:orange'>⚠️ <b>$name</b> — " . htmlspecialchars($e->getMessage()) . "</li>";
        }
        continue;
    }
    try {
        $db->exec($sql);
        echo "<li style='color:green'>✅ <b>$name</b> — column added successfully.</li>";
    } catch (Exception $e) {
        // Code 1060 = Duplicate column name (already exists)
        if (strpos($e->getMessage(), '1060') !== false || strpos($e->getMessage(), 'Duplicate column') !== false) {
            echo "<li style='color:gray'>⏭️ <b>$name</b> — already exists, skipped.</li>";
        } else {
            echo "<li style='color:red'>❌ <b>$name</b> — ERROR: " . htmlspecialchars($e->getMessage()) . "</li>";
        }
    }
}

echo "</ul><hr/><h3 style='color:green'>Migration Complete! ✅</h3>";
echo "<p style='color:red'><strong>⚠️ IMPORTANT: Delete this file from your server now for security!</strong></p>";
echo "<p>File to delete: <code>/backend/api/migrate_db.php</code></p>";
?>

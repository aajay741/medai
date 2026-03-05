<?php
require_once '../config/config.php';

// Set headers for simple browser output
header('Content-Type: text/plain');

try {
    $db = Database::getInstance()->getConnection();

    echo "Starting migration...\n";

    // 1. Create site_settings Table
    $sql = "CREATE TABLE IF NOT EXISTS site_settings (
        setting_key VARCHAR(100) PRIMARY KEY,
        setting_value TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    
    $db->exec($sql);
    echo "Table site_settings: OK\n";

    // 2. Insert Default Settings
    $defaults = [
        'contact_email' => 'info@medai.org',
        'contact_phone' => '+91 98765 43210'
    ];

    foreach ($defaults as $key => $value) {
        $stmt = $db->prepare("INSERT IGNORE INTO site_settings (setting_key, setting_value) VALUES (?, ?)");
        $stmt->execute([$key, $value]);
    }
    echo "Default settings: OK\n";

    echo "Migration completed successfully.";

} catch (Exception $e) {
    echo "Migration failed: " . $e->getMessage();
}
?>

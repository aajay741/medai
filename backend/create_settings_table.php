<?php
require_once __DIR__ . '/config/config.php';

try {
    $db = Database::getInstance()->getConnection();

    $sql = "CREATE TABLE IF NOT EXISTS site_settings (
        setting_key VARCHAR(100) PRIMARY KEY,
        setting_value TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    
    $db->exec($sql);
    echo "Table site_settings created/verified.\n";

    // Insert defaults if not exists
    $defaults = [
        'contact_email' => 'info@medai.org',
        'contact_phone' => '+91 98765 43210'
    ];

    foreach ($defaults as $key => $value) {
        $stmt = $db->prepare("INSERT IGNORE INTO site_settings (setting_key, setting_value) VALUES (?, ?)");
        $stmt->execute([$key, $value]);
    }
    echo "Default settings inserted.\n";

} catch (Exception $e) {
    die("Database error: " . $e->getMessage());
}
?>

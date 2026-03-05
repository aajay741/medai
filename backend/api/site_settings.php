<?php
require_once '../config/config.php';

setCorsHeaders();

$db = Database::getInstance()->getConnection();
$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        // Fetch all settings
        $stmt = $db->query("SELECT setting_key, setting_value FROM site_settings");
        $settings = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
        
        // If empty, return defaults
        if (empty($settings)) {
            $settings = [
                'contact_email' => 'info@medai.org',
                'contact_phone' => '+91 98765 43210'
            ];
        }
        
        sendResponse(true, $settings, 'Settings fetched successfully');

    } elseif ($method === 'POST') {
        // Update settings
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!is_array($input)) {
            sendResponse(false, null, 'Invalid input', 400);
        }

        foreach ($input as $key => $value) {
            $stmt = $db->prepare("INSERT INTO site_settings (setting_key, setting_value) 
                                VALUES (?, ?) 
                                ON DUPLICATE KEY UPDATE setting_value = ?");
            $stmt->execute([$key, $value, $value]);
        }

        sendResponse(true, null, 'Settings updated successfully');
    }
} catch (Exception $e) {
    sendResponse(false, null, 'Error: ' . $e->getMessage(), 500);
}
?>

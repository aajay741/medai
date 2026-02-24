<?php
// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'u891495087_medai');
define('DB_USER', 'u891495087_medai');
define('DB_PASS', 'Medai123@');
define('DB_CHARSET', 'utf8mb4');

// Application Configuration
define('APP_NAME', 'MEDAI Admin Panel');
define('APP_URL', 'https://darkcyan-pig-525370.hostingersite.com/');
define('ADMIN_EMAIL', 'admin@medai.in');

// Zoho Invoice Configuration
define('ZOHO_CLIENT_ID', 'YOUR_CLIENT_ID');
define('ZOHO_CLIENT_SECRET', 'YOUR_CLIENT_SECRET');
define('ZOHO_REFRESH_TOKEN', 'YOUR_REFRESH_TOKEN');
define('ZOHO_ORGANIZATION_ID', 'YOUR_ORGANIZATION_ID');
define('ZOHO_BASE_URL', 'https://www.zohoapis.com/invoice/v3');
define('ZOHO_AUTH_URL', 'https://accounts.zoho.com/oauth/v2/token');

// Security
define('JWT_SECRET', 'your-secret-key-change-this-in-production'); // Change this!
define('SESSION_LIFETIME', 3600); // 1 hour in seconds

// CORS Settings
define('ALLOWED_ORIGINS', [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5174',
    'https://darkturquoise-magpie-724295.hostingersite.com',
    'http://darkturquoise-magpie-724295.hostingersite.com',
    'https://darkcyan-pig-525370.hostingersite.com',
    'http://darkcyan-pig-525370.hostingersite.com'
]);

// Timezone
date_default_timezone_set('Asia/Kolkata');

// Error Reporting (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database Connection Class
class Database {
    private static $instance = null;
    private $connection;
    
    private function __construct() {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];
            
            $this->connection = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            die(json_encode([
                'success' => false,
                'message' => 'Database connection failed: ' . $e->getMessage()
            ]));
        }
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->connection;
    }
}

// CORS Headers
function setCorsHeaders() {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    if (in_array($origin, ALLOWED_ORIGINS)) {
        header("Access-Control-Allow-Origin: $origin");
    }
    
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Credentials: true");
    header("Content-Type: application/json; charset=UTF-8");
    
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

// Response Helper
function sendResponse($success, $data = null, $message = '', $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    exit();
}

// Sanitize Input
function sanitizeInput($data) {
    if (is_array($data)) {
        return array_map('sanitizeInput', $data);
    }
    return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
}

// Generate Booking Reference
function generateBookingReference() {
    return 'MEDAI-' . strtoupper(substr(uniqid(), -8));
}
?>

<?php
// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'u891495087_medai_db1');
define('DB_USER', 'u891495087_medai_db1');
define('DB_PASS', 'Medai@12345');
define('DB_CHARSET', 'utf8mb4');


// Application Configuration
define('APP_NAME', 'MEDAI Admin Panel');
define('APP_URL', 'https://medaithestage.com/');
define('ADMIN_EMAIL', 'admin@medai.in'); 

// Razorpay Payment Gateway
define('RAZORPAY_KEY_ID', 'rzp_live_SLWf2Pz5BbSSBU');
define('RAZORPAY_KEY_SECRET', 'R5AlXQSs4g5l3bqlSVuoRrkW');


// MSG91 WhatsApp & SMS Notifications
// Get your authkey from: https://msg91.com/dashboard
define('MSG91_AUTH_KEY', '');           // e.g. '123456TxxxxxxBxxxxxxxx'
define('MSG91_WHATSAPP_NUMBER', '');    // e.g. '91XXXXXXXXXX' (your MSG91 WhatsApp sender number)

// Zoho GST Tax ID (official from Zoho dashboard)
// Used for 18% GST in Indian orgs
define('ZOHO_GST_TAX_ID', '3612443000000032469');

// Zoho Invoice Configuration
define('ZOHO_CLIENT_ID', '1000.XQ50HCKP8BFWL4AWU97G0F13KUZ83B');
define('ZOHO_CLIENT_SECRET', 'b55408aba8dca1316a9530a283e63ee5991a3ef89b');
define('ZOHO_REFRESH_TOKEN', '1000.32b4ee49e49809f93639c8b8e1564277.cdd88d8a06c6e605510d13f95d4914a7');
define('ZOHO_ORGANIZATION_ID', '60066256813');
define('ZOHO_BASE_URL', 'https://www.zohoapis.in/invoice/v3');
define('ZOHO_AUTH_URL', 'https://accounts.zoho.in/oauth/v2/token');

// Security
define('JWT_SECRET', 'd9f3a7c8e2b14f6a9c0d5e7b3a1f8c6d4e2a9b7c1d5f8a6e3b0c2d4f7a9e1c'); // Change this!
define('SESSION_LIFETIME', 3600); // 1 hour in seconds

// CORS Settings
define('ALLOWED_ORIGINS', [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5174',
    'https://medaithestage.com',
    'http://medaithestage.com',
    'https://darkturquoise-magpie-724295.hostingersite.com',
    'http://darkturquoise-magpie-724295.hostingersite.com',
    'https://darkcyan-pig-525370.hostingersite.com',
    'http://darkcyan-pig-525370.hostingersite.com'
]);

// Timezone
date_default_timezone_set('Asia/Kolkata');

// Error Reporting (PRODUCTION: errors off)
error_reporting(0);
ini_set('display_errors', 0);

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
            // If the DB doesn't exist, try connecting to host and creating it
            try {
                $tempPdo = new PDO("mysql:host=" . DB_HOST, DB_USER, DB_PASS);
                $tempPdo->exec("CREATE DATABASE IF NOT EXISTS `" . DB_NAME . "`");
                // Retry connection
                $this->connection = new PDO($dsn, DB_USER, DB_PASS, $options);
            } catch (Exception $inner) {
                die(json_encode([
                    'success' => false,
                    'message' => 'Database connection failed: ' . $inner->getMessage()
                ]));
            }
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

// Email (SMTP) Configuration
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'medaipvtltd@gmail.com');
define('SMTP_PASS', ''); // TODO: USER NEEDS TO ADD GMAIL APP PASSWORD HERE
define('SMTP_FROM', 'medaipvtltd@gmail.com');
define('SMTP_FROM_NAME', 'MEDAI Hub');
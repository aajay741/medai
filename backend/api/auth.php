<?php
require_once '../config/config.php';

setCorsHeaders();

$db = Database::getInstance()->getConnection();
$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'POST') {
        // Login
        $input = json_decode(file_get_contents('php://input'), true);
        
        $username = sanitizeInput($input['username'] ?? '');
        $password = $input['password'] ?? '';
        
        if (empty($username) || empty($password)) {
            sendResponse(false, null, 'Username and password are required', 400);
        }
        
        $stmt = $db->prepare("SELECT * FROM admin_users WHERE username = ? AND is_active = 1");
        $stmt->execute([$username]);
        $user = $stmt->fetch();
        
        if (!$user || !password_verify($password, $user['password_hash'])) {
            sendResponse(false, null, 'Invalid credentials', 401);
        }
        
        // Update last login
        $updateStmt = $db->prepare("UPDATE admin_users SET last_login = NOW() WHERE id = ?");
        $updateStmt->execute([$user['id']]);
        
        // Log activity
        $logStmt = $db->prepare("
            INSERT INTO activity_logs (admin_id, action, description, ip_address)
            VALUES (?, 'login', 'User logged in', ?)
        ");
        $logStmt->execute([$user['id'], $_SERVER['REMOTE_ADDR']]);
        
        // Create session token (simple implementation)
        $token = bin2hex(random_bytes(32));
        
        // Store session in database or use PHP sessions
        session_start();
        $_SESSION['admin_id'] = $user['id'];
        $_SESSION['admin_username'] = $user['username'];
        $_SESSION['admin_role'] = $user['role'];
        $_SESSION['token'] = $token;
        
        sendResponse(true, [
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
                'fullName' => $user['full_name'],
                'role' => $user['role']
            ],
            'token' => $token
        ], 'Login successful');
        
    } elseif ($method === 'GET') {
        // Verify session
        session_start();
        
        if (!isset($_SESSION['admin_id'])) {
            sendResponse(false, null, 'Not authenticated', 401);
        }
        
        $stmt = $db->prepare("SELECT * FROM admin_users WHERE id = ?");
        $stmt->execute([$_SESSION['admin_id']]);
        $user = $stmt->fetch();
        
        if (!$user) {
            sendResponse(false, null, 'User not found', 404);
        }
        
        sendResponse(true, [
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
                'fullName' => $user['full_name'],
                'role' => $user['role']
            ]
        ]);
        
    } elseif ($method === 'DELETE') {
        // Logout
        session_start();
        session_destroy();
        
        sendResponse(true, null, 'Logged out successfully');
    }
    
} catch (Exception $e) {
    sendResponse(false, null, 'Error: ' . $e->getMessage(), 500);
}
?>

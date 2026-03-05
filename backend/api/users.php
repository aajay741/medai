<?php
require_once '../config/config.php';

setCorsHeaders();

$db = Database::getInstance()->getConnection();
$method = $_SERVER['REQUEST_METHOD'];

// Check authentication and admin role
session_start();
if (!isset($_SESSION['admin_id']) || $_SESSION['admin_role'] !== 'admin') {
    sendResponse(false, null, 'Unauthorized. Admin access required.', 403);
}

try {
    if ($method === 'GET') {
        $stmt = $db->query("SELECT id, username, email, full_name, role, is_active, last_login, created_at FROM admin_users ORDER BY id DESC");
        $users = $stmt->fetchAll();
        sendResponse(true, $users);

    } elseif ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $username = sanitizeInput($input['username'] ?? '');
        $password = $input['password'] ?? '';
        $email = sanitizeInput($input['email'] ?? '');
        $full_name = sanitizeInput($input['fullName'] ?? '');
        $role = sanitizeInput($input['role'] ?? 'viewer');

        if (empty($username) || empty($password) || empty($email) || empty($full_name)) {
            sendResponse(false, null, 'Missing required fields', 400);
        }

        // Check if username or email exists
        $checkStmt = $db->prepare("SELECT id FROM admin_users WHERE username = ? OR email = ?");
        $checkStmt->execute([$username, $email]);
        if ($checkStmt->fetch()) {
            sendResponse(false, null, 'Username or email already exists', 409);
        }

        $password_hash = password_hash($password, PASSWORD_DEFAULT);

        $stmt = $db->prepare("
            INSERT INTO admin_users (username, password_hash, email, full_name, role)
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute([$username, $password_hash, $email, $full_name, $role]);

        sendResponse(true, ['id' => $db->lastInsertId()], 'User created successfully');

    } elseif ($method === 'PUT') {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? null;

        if (!$id) {
            sendResponse(false, null, 'User ID required', 400);
        }

        $username = sanitizeInput($input['username'] ?? '');
        $email = sanitizeInput($input['email'] ?? '');
        $full_name = sanitizeInput($input['fullName'] ?? $input['full_name'] ?? '');
        $role = sanitizeInput($input['role'] ?? '');
        $is_active = $input['is_active'] ?? null;
        $password = $input['password'] ?? null;

        $updates = [];
        $params = [];

        if ($username) { $updates[] = "username = ?"; $params[] = $username; }
        if ($email) { $updates[] = "email = ?"; $params[] = $email; }
        if ($full_name) { $updates[] = "full_name = ?"; $params[] = $full_name; }
        if ($role) { $updates[] = "role = ?"; $params[] = $role; }
        if ($is_active !== null) { $updates[] = "is_active = ?"; $params[] = $is_active ? 1 : 0; }
        if ($password) { 
            $updates[] = "password_hash = ?"; 
            $params[] = password_hash($password, PASSWORD_DEFAULT); 
        }

        if (empty($updates)) {
            sendResponse(false, null, 'No fields to update', 400);
        }

        $params[] = $id;
        $sql = "UPDATE admin_users SET " . implode(", ", $updates) . " WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);

        sendResponse(true, null, 'User updated successfully');

    } elseif ($method === 'DELETE') {
        $id = $_GET['id'] ?? null;
        if (!$id) sendResponse(false, null, 'User ID required', 400);

        // Prevent self-deletion
        if ($id == $_SESSION['admin_id']) {
            sendResponse(false, null, 'Cannot delete yourself', 400);
        }

        $stmt = $db->prepare("DELETE FROM admin_users WHERE id = ?");
        $stmt->execute([$id]);

        sendResponse(true, null, 'User deleted successfully');
    }

} catch (Exception $e) {
    sendResponse(false, null, 'Error: ' . $e->getMessage(), 500);
}
?>

<?php
require_once '../config/config.php';

setCorsHeaders();

$db = Database::getInstance()->getConnection();
$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $category = $_GET['category'] ?? null;
        $query = "SELECT * FROM gallery WHERE is_active = 1";
        $params = [];
        
        if ($category) {
            $query .= " AND category = ?";
            $params[] = $category;
        }
        
        $query .= " ORDER BY created_at DESC";
        
        $stmt = $db->prepare($query);
        $stmt->execute($params);
        $images = $stmt->fetchAll();
        
        sendResponse(true, $images);
        
    } elseif ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (empty($input['image_url'])) {
            sendResponse(false, null, 'Image URL is required', 400);
        }
        
        $title = sanitizeInput($input['title'] ?? '');
        $description = sanitizeInput($input['description'] ?? '');
        $imageUrl = sanitizeInput($input['image_url']);
        $category = sanitizeInput($input['category'] ?? 'General');
        
        $stmt = $db->prepare("INSERT INTO gallery (title, description, image_url, category) VALUES (?, ?, ?, ?)");
        $stmt->execute([$title, $description, $imageUrl, $category]);
        
        sendResponse(true, ['id' => $db->lastInsertId()], 'Gallery item added successfully', 201);
        
    } elseif ($method === 'DELETE') {
        $id = $_GET['id'] ?? null;
        if (!$id) {
            sendResponse(false, null, 'ID is required', 400);
        }
        
        // Soft delete
        $stmt = $db->prepare("UPDATE gallery SET is_active = 0 WHERE id = ?");
        $stmt->execute([$id]);
        
        sendResponse(true, null, 'Gallery item deleted successfully');
    }
} catch (Exception $e) {
    sendResponse(false, null, 'Error: ' . $e->getMessage(), 500);
}
?>

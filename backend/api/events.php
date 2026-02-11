<?php
require_once '../config/config.php';

setCorsHeaders();

$db = Database::getInstance()->getConnection();
$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        // Get all events or single event
        $id = $_GET['id'] ?? null;
        
        if ($id) {
            // Get single event
            $stmt = $db->prepare("SELECT * FROM events WHERE id = ?");
            $stmt->execute([$id]);
            $event = $stmt->fetch();
            
            if (!$event) {
                sendResponse(false, null, 'Event not found', 404);
            }
            
            // Decode JSON ticket_types
            $event['ticket_types'] = json_decode($event['ticket_types'], true);
            
            sendResponse(true, $event);
        } else {
            // Get all events with filters
            $where = ['is_active = 1']; // Only active events by default
            $params = [];
            
            if (!empty($_GET['location'])) {
                $where[] = "location = ?";
                $params[] = $_GET['location'];
            }
            
            if (!empty($_GET['status'])) {
                $where[] = "status = ?";
                $params[] = $_GET['status'];
            }
            
            if (!empty($_GET['featured'])) {
                $where[] = "featured = 1";
            }
            
            if (!empty($_GET['upcoming'])) {
                $where[] = "event_date >= CURDATE()";
                $where[] = "status = 'upcoming'";
            }
            
            // Admin can see all events
            if (!empty($_GET['admin'])) {
                $where = []; // Remove active filter for admin
            }
            
            $whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';
            
            $stmt = $db->prepare("
                SELECT * FROM events 
                $whereClause 
                ORDER BY event_date ASC, event_time ASC
            ");
            $stmt->execute($params);
            $events = $stmt->fetchAll();
            
            // Decode JSON for each event
            foreach ($events as &$event) {
                $event['ticket_types'] = json_decode($event['ticket_types'], true);
            }
            
            sendResponse(true, $events);
        }
        
    } elseif ($method === 'POST') {
        // Create new event
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        $required = ['title', 'location', 'event_date', 'event_time', 'ticket_types'];
        foreach ($required as $field) {
            if (empty($input[$field])) {
                sendResponse(false, null, "Field '$field' is required", 400);
            }
        }
        
        // Sanitize inputs
        $title = sanitizeInput($input['title']);
        $description = sanitizeInput($input['description'] ?? '');
        $location = sanitizeInput($input['location']);
        $venueName = sanitizeInput($input['venue_name'] ?? '');
        $venueAddress = sanitizeInput($input['venue_address'] ?? '');
        $eventDate = sanitizeInput($input['event_date']);
        $eventTime = sanitizeInput($input['event_time']);
        $endTime = sanitizeInput($input['end_time'] ?? '');
        $duration = sanitizeInput($input['duration'] ?? '');
        $category = sanitizeInput($input['category'] ?? 'Performance');
        $imageUrl = sanitizeInput($input['image_url'] ?? '');
        $ticketTypes = json_encode($input['ticket_types']);
        $totalSeats = (int)($input['total_seats'] ?? 100);
        $status = sanitizeInput($input['status'] ?? 'upcoming');
        $featured = !empty($input['featured']) ? 1 : 0;
        
        $stmt = $db->prepare("
            INSERT INTO events 
            (title, description, location, venue_name, venue_address, event_date, event_time, 
             end_time, duration, category, image_url, ticket_types, total_seats, available_seats, status, featured)
            VALUES 
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $title, $description, $location, $venueName, $venueAddress, $eventDate, $eventTime,
            $endTime, $duration, $category, $imageUrl, $ticketTypes, $totalSeats, $totalSeats, $status, $featured
        ]);
        
        $eventId = $db->lastInsertId();
        
        sendResponse(true, ['id' => $eventId], 'Event created successfully', 201);
        
    } elseif ($method === 'PUT') {
        // Update event
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? null;
        
        if (!$id) {
            sendResponse(false, null, 'Event ID is required', 400);
        }
        
        // Build update query dynamically
        $updates = [];
        $params = [];
        
        $allowedFields = [
            'title', 'description', 'location', 'venue_name', 'venue_address', 
            'event_date', 'event_time', 'end_time', 'duration', 'category', 
            'image_url', 'total_seats', 'available_seats', 'status', 'featured', 'is_active'
        ];
        
        foreach ($allowedFields as $field) {
            if (isset($input[$field])) {
                $updates[] = "$field = ?";
                $params[] = $field === 'featured' || $field === 'is_active' 
                    ? (!empty($input[$field]) ? 1 : 0)
                    : sanitizeInput($input[$field]);
            }
        }
        
        // Handle ticket_types separately (JSON)
        if (isset($input['ticket_types'])) {
            $updates[] = "ticket_types = ?";
            $params[] = json_encode($input['ticket_types']);
        }
        
        if (empty($updates)) {
            sendResponse(false, null, 'No fields to update', 400);
        }
        
        $params[] = $id;
        $updateClause = implode(', ', $updates);
        
        $stmt = $db->prepare("UPDATE events SET $updateClause WHERE id = ?");
        $stmt->execute($params);
        
        sendResponse(true, null, 'Event updated successfully');
        
    } elseif ($method === 'DELETE') {
        // Soft delete event (set is_active = 0)
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            sendResponse(false, null, 'Event ID is required', 400);
        }
        
        // Soft delete instead of hard delete
        $stmt = $db->prepare("UPDATE events SET is_active = 0 WHERE id = ?");
        $stmt->execute([$id]);
        
        sendResponse(true, null, 'Event deleted successfully');
    }
    
} catch (Exception $e) {
    sendResponse(false, null, 'Error: ' . $e->getMessage(), 500);
}
?>

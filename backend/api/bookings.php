<?php
require_once '../config/config.php';

setCorsHeaders();

$db = Database::getInstance()->getConnection();

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'POST') {
        // Create new booking
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        $required = ['name', 'email', 'phone', 'location', 'eventDate', 'eventTime', 'ticketType', 'quantity'];
        foreach ($required as $field) {
            if (empty($input[$field])) {
                sendResponse(false, null, "Field '$field' is required", 400);
            }
        }
        
        // Sanitize inputs
        $name = sanitizeInput($input['name']);
        $email = filter_var($input['email'], FILTER_SANITIZE_EMAIL);
        $phone = sanitizeInput($input['phone']);
        $location = sanitizeInput($input['location']);
        $eventDate = sanitizeInput($input['eventDate']);
        $eventTime = sanitizeInput($input['eventTime']);
        $ticketType = sanitizeInput($input['ticketType']);
        $quantity = (int)$input['quantity'];
        $specialRequests = sanitizeInput($input['specialRequests'] ?? '');
        $companyName = sanitizeInput($input['companyName'] ?? '');
        $gstNumber = sanitizeInput($input['gstNumber'] ?? '');
        $billingAddress = sanitizeInput($input['billingAddress'] ?? '');
        $city = sanitizeInput($input['city'] ?? '');
        $state = sanitizeInput($input['state'] ?? '');
        $zipCode = sanitizeInput($input['zip'] ?? '');
        $purpose = sanitizeInput($input['purpose'] ?? '');

        if ($purpose) {
            $specialRequests = "Purpose: $purpose. " . $specialRequests;
        }
        
        // Calculate total amount based on user pricing table
        $unitRate = 0;
        if ($ticketType === 'Space Rental') {
            $loc = strtoupper($location);
            if ($loc === 'CHENNAI') $unitRate = 15000;
            elseif ($loc === 'BANGALORE' || $loc === 'BENGALURU') $unitRate = 45000;
            elseif ($loc === 'COIMBATORE') $unitRate = 30000;
            else $unitRate = 15000;
        } else {
            $prices = [
                'General Admission' => 799,
                'VIP' => 1500,
                'Premium' => 2500
            ];
            $unitRate = $prices[$ticketType] ?? 799;
        }
        
        // Final Total = (Base Rate * Quantity) + 18% GST
        $baseTotal = $unitRate * $quantity;
        $totalAmount = round($baseTotal * 1.18);
        
        // Generate booking reference
        $bookingRef = generateBookingReference();
        
        // Insert booking
        $stmt = $db->prepare("
            INSERT INTO bookings 
            (booking_reference, name, email, phone, location, event_date, event_time, 
             ticket_type, quantity, total_amount, special_requests, 
             company_name, gst_number, billing_address, city, state, zip_code, purpose,
             booking_status, payment_status)
            VALUES 
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', 'completed')
        ");
        
        $stmt->execute([
            $bookingRef, $name, $email, $phone, $location, $eventDate, 
            $eventTime, $ticketType, $quantity, $totalAmount, $specialRequests,
            $companyName, $gstNumber, $billingAddress, $city, $state, $zipCode, $purpose
        ]);

        // Integrate Zoho Invoice
        require_once '../config/ZohoInvoiceService.php';
        $zohoInvoiceId = ZohoInvoiceService::createInvoice([
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'booking_reference' => $bookingRef,
            'show_title' => $input['showTitle'] ?? 'MEDAI Performance',
            'location' => $location,
            'event_date' => $eventDate,
            'event_time' => $eventTime,
            'ticket_type' => $ticketType,
            'quantity' => $quantity,
            'price_per_unit' => $unitRate,
            'company_name' => $companyName,
            'gst_number' => $gstNumber,
            'billing_address' => $billingAddress,
            'city' => $city,
            'state' => $state,
            'zip' => $zipCode
        ]);

        // Update booking with Zoho Invoice ID if needed
        if ($zohoInvoiceId) {
            $stmt = $db->prepare("UPDATE bookings SET special_requests = CONCAT(special_requests, '\nZoho Invoice ID: ', ?) WHERE booking_reference = ?");
            $stmt->execute([$zohoInvoiceId, $bookingRef]);
        }
        
        sendResponse(true, [
            'bookingReference' => $bookingRef,
            'totalAmount' => $totalAmount,
            'zohoInvoiceId' => $zohoInvoiceId
        ], 'Booking created successfully', 201);
        
    } elseif ($method === 'GET') {
        // Get all bookings or filter
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
        $offset = ($page - 1) * $limit;
        
        $where = [];
        $params = [];
        
        // Filters
        if (!empty($_GET['location'])) {
            $where[] = "location = ?";
            $params[] = $_GET['location'];
        }
        
        if (!empty($_GET['status'])) {
            $where[] = "booking_status = ?";
            $params[] = $_GET['status'];
        }
        
        if (!empty($_GET['search'])) {
            $where[] = "(name LIKE ? OR email LIKE ? OR booking_reference LIKE ?)";
            $search = '%' . $_GET['search'] . '%';
            $params[] = $search;
            $params[] = $search;
            $params[] = $search;
        }
        
        $whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';
        
        // Get total count
        $countStmt = $db->prepare("SELECT COUNT(*) as total FROM bookings $whereClause");
        $countStmt->execute($params);
        $total = $countStmt->fetch()['total'];
        
        // Get bookings
        $stmt = $db->prepare("
            SELECT * FROM bookings 
            $whereClause 
            ORDER BY created_at DESC 
            LIMIT ? OFFSET ?
        ");
        $params[] = $limit;
        $params[] = $offset;
        $stmt->execute($params);
        $bookings = $stmt->fetchAll();
        
        sendResponse(true, [
            'bookings' => $bookings,
            'pagination' => [
                'total' => $total,
                'page' => $page,
                'limit' => $limit,
                'totalPages' => ceil($total / $limit)
            ]
        ]);
        
    } elseif ($method === 'PUT') {
        // Update booking status
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? null;
        $status = $input['status'] ?? null;
        
        if (!$id || !$status) {
            sendResponse(false, null, 'ID and status are required', 400);
        }
        
        $stmt = $db->prepare("UPDATE bookings SET booking_status = ? WHERE id = ?");
        $stmt->execute([$status, $id]);
        
        sendResponse(true, null, 'Booking updated successfully');
        
    } elseif ($method === 'DELETE') {
        // Delete booking
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            sendResponse(false, null, 'ID is required', 400);
        }
        
        $stmt = $db->prepare("DELETE FROM bookings WHERE id = ?");
        $stmt->execute([$id]);
        
        sendResponse(true, null, 'Booking deleted successfully');
    }
    
} catch (Exception $e) {
    sendResponse(false, null, 'Error: ' . $e->getMessage(), 500);
}
?>

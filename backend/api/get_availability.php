<?php
require_once '../config/config.php';

setCorsHeaders();

$db = Database::getInstance()->getConnection();

try {
    $location = $_GET['location'] ?? '';
    $month = $_GET['month'] ?? date('n');
    $year = $_GET['year'] ?? date('Y');

    if (!$location) {
        sendResponse(false, null, 'Location is required', 400);
    }

    // 1. Get total slots for this location from DB
    $limitStmt = $db->prepare("SELECT COUNT(*) FROM venue_slots WHERE UPPER(location) = ? AND is_active = 1");
    $limitStmt->execute([strtoupper($location)]);
    $limit = (int)$limitStmt->fetchColumn() ?: 4;

    // 2. Get confirmed bookings for the month
    $stmt = $db->prepare("
        SELECT event_date, SUM(quantity) as booked_slots 
        FROM bookings 
        WHERE UPPER(location) = ? 
        AND MONTH(event_date) = ? 
        AND YEAR(event_date) = ?
        AND booking_status = 'confirmed'
        GROUP BY event_date
    ");
    $stmt->execute([strtoupper($location), $month, $year]);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 3. Get manual blocks for the month
    $blockStmt = $db->prepare("
        SELECT sm.specific_date, COUNT(*) as blocked_slots
        FROM slot_management sm
        JOIN venue_slots vs ON sm.slot_id = vs.id
        WHERE UPPER(vs.location) = ?
        AND sm.is_blocked = 1
        AND MONTH(sm.specific_date) = ?
        AND YEAR(sm.specific_date) = ?
        GROUP BY sm.specific_date
    ");
    $blockStmt->execute([strtoupper($location), $month, $year]);
    $blocks = $blockStmt->fetchAll(PDO::FETCH_KEY_PAIR);

    // 4. Combine results
    $availability = [];
    
    // Process bookings
    foreach ($results as $row) {
        $date = $row['event_date'];
        $booked = (int)$row['booked_slots'];
        $blocked = (int)($blocks[$date] ?? 0);
        $totalUsed = $booked + $blocked;

        $status = 'available';
        if ($totalUsed >= $limit) {
            $status = 'full';
        } elseif ($totalUsed > 0) {
            $status = 'partial';
        }
        $availability[$date] = [
            'booked' => $booked,
            'blocked' => $blocked,
            'limit' => $limit,
            'status' => $status
        ];
    }

    // Process dates with blocks but NO bookings
    foreach ($blocks as $date => $blockedCount) {
        if (!isset($availability[$date])) {
            $status = ($blockedCount >= $limit) ? 'full' : 'partial';
            $availability[$date] = [
                'booked' => 0,
                'blocked' => (int)$blockedCount,
                'limit' => $limit,
                'status' => $status
            ];
        }
    }

    sendResponse(true, $availability);

} catch (Exception $e) {
    sendResponse(false, null, 'Error: ' . $e->getMessage(), 500);
}
?>

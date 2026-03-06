<?php
require_once '../config/config.php';

setCorsHeaders();

$db = Database::getInstance()->getConnection();

try {
    $location = $_GET['location'] ?? '';
    $date = $_GET['date'] ?? '';

    if (!$location) {
        sendResponse(false, null, 'Location is required', 400);
    }

    // 1. Get base slots
    $stmt = $db->prepare("SELECT id, slot_code, slot_range, duration, base_price FROM venue_slots WHERE UPPER(location) = ? AND is_active = 1");
    $stmt->execute([strtoupper($location)]);
    $slots = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 2. If date is provided, filter out blocked ones or override price
    if ($date) {
        // Get blocks/overrides
        $ovStmt = $db->prepare("SELECT slot_id, override_price, is_blocked, block_reason FROM slot_management WHERE specific_date = ?");
        $ovStmt->execute([$date]);
        $overrides = $ovStmt->fetchAll(PDO::FETCH_ASSOC);
        
        $ovMap = [];
        foreach ($overrides as $ov) $ovMap[$ov['slot_id']] = $ov;

        // Get confirmed bookings to check if already occupied
        $bookStmt = $db->prepare("SELECT event_time FROM bookings WHERE location = ? AND event_date = ? AND booking_status = 'confirmed'");
        $bookStmt->execute([$location, $date]);
        $bookedTimes = $bookStmt->fetchAll(PDO::FETCH_COLUMN);

        foreach ($slots as $idx => &$slot) {
            $ov = $ovMap[$slot['id']] ?? null;
            
            // Check if blocked by admin
            if ($ov && $ov['is_blocked']) {
                $slot['is_available'] = false;
                $slot['reason'] = $ov['block_reason'] ?: 'Admin Blocked';
            } 
            // Check if already booked
            elseif (in_array($slot['slot_range'], $bookedTimes)) {
                $slot['is_available'] = false;
                $slot['reason'] = 'Already Booked';
            }
            else {
                $slot['is_available'] = true;
                if ($ov && $ov['override_price']) $slot['base_price'] = $ov['override_price'];
            }
        }
    }

    sendResponse(true, $slots);

} catch (Exception $e) {
    sendResponse(false, null, 'Error: ' . $e->getMessage(), 500);
}
?>

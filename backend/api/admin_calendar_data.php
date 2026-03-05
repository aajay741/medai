<?php
require_once '../config/config.php';

setCorsHeaders();

$db = Database::getInstance()->getConnection();

// Check authentication
session_start();
if (!isset($_SESSION['admin_id'])) {
    sendResponse(false, null, 'Unauthorized', 401);
}

try {
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        $month = $_GET['month'] ?? date('n');
        $year = $_GET['year'] ?? date('Y');
        $location = $_GET['location'] ?? '';

        // 1. Fetch all bookings for the month
        $sql = "SELECT id, booking_reference, name, location, event_date, event_time, booking_status 
                FROM bookings 
                WHERE MONTH(event_date) = ? AND YEAR(event_date) = ?";
        $params = [$month, $year];

        if ($location) {
            $sql .= " AND location = ?";
            $params[] = $location;
        }

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $bookings = $stmt->fetchAll();

        // 2. Fetch all blocks from slot_management
        $sqlBlocks = "SELECT sm.*, vs.location, vs.slot_code, vs.slot_range 
                      FROM slot_management sm
                      JOIN venue_slots vs ON sm.slot_id = vs.id
                      WHERE MONTH(sm.specific_date) = ? AND YEAR(sm.specific_date) = ?";
        $stmtBlocks = $db->prepare($sqlBlocks);
        $stmtBlocks->execute([$month, $year]);
        $blocks = $stmtBlocks->fetchAll();

        // 3. Fetch all default slots
        $stmtSlots = $db->query("SELECT * FROM venue_slots WHERE is_active = 1");
        $allSlots = $stmtSlots->fetchAll();

        sendResponse(true, [
            'bookings' => $bookings,
            'blocks' => $blocks,
            'definitions' => $allSlots
        ]);

    } elseif ($method === 'POST') {
        // Toggle Block or set price
        $input = json_decode(file_get_contents('php://input'), true);
        $slotId = $input['slot_id'];
        $date = $input['date'];
        $isBlocked = $input['is_blocked'] ?? null;
        $price = $input['price'] ?? null;
        $reason = $input['reason'] ?? '';

        // Check if exists
        $stmtExpr = $db->prepare("SELECT id FROM slot_management WHERE slot_id = ? AND specific_date = ?");
        $stmtExpr->execute([$slotId, $date]);
        $exists = $stmtExpr->fetch();

        if ($exists) {
            $updates = [];
            $params = [];
            if ($isBlocked !== null) { $updates[] = "is_blocked = ?"; $params[] = $isBlocked ? 1 : 0; }
            if ($price !== null) { $updates[] = "override_price = ?"; $params[] = $price; }
            $updates[] = "block_reason = ?"; $params[] = $reason;
            $params[] = $exists['id'];

            $sql = "UPDATE slot_management SET " . implode(', ', $updates) . " WHERE id = ?";
            $stmt = $db->prepare($sql);
            $stmt->execute($params);
        } else {
            $sql = "INSERT INTO slot_management (slot_id, specific_date, is_blocked, override_price, block_reason) 
                    VALUES (?, ?, ?, ?, ?)";
            $stmt = $db->prepare($sql);
            $stmt->execute([$slotId, $date, $isBlocked ? 1 : 0, $price, $reason]);
        }

        sendResponse(true, null, 'Updated successfully');

    } elseif ($method === 'PUT') {
        // Bulk Action: Block Date Range or Adjust Price
        $input = json_decode(file_get_contents('php://input'), true);
        $location = $input['location'] ?? '';
        $startDate = $input['start_date'];
        $endDate = $input['end_date'];
        $action = $input['action']; // 'block', 'unblock', 'adjust_price'
        $price_value = $input['price_value'] ?? null;
        $reason = $input['reason'] ?? 'Bulk Admin Action';

        if (empty($startDate) || empty($endDate)) {
            sendResponse(false, null, 'Start and End dates required', 400);
        }

        // Get slots for this location
        $slotQuery = "SELECT id FROM venue_slots WHERE is_active = 1";
        $slotParams = [];
        if ($location) {
            $slotQuery .= " AND UPPER(location) = ?";
            $slotParams[] = strtoupper($location);
        }
        $slots = $db->prepare($slotQuery);
        $slots->execute($slotParams);
        $slotIds = $slots->fetchAll(PDO::FETCH_COLUMN);

        if (empty($slotIds)) {
            sendResponse(false, null, 'No slots found for this location', 404);
        }

        // Generate date list
        $period = new DatePeriod(
            new DateTime($startDate),
            new DateInterval('P1D'),
            (new DateTime($endDate))->modify('+1 day')
        );

        $db->beginTransaction();
        foreach ($period as $dt) {
            $formattedDate = $dt->format("Y-m-d");
            foreach ($slotIds as $sid) {
                if ($action === 'adjust_price') {
                    $sql = "INSERT INTO slot_management (slot_id, specific_date, override_price) 
                            VALUES (?, ?, ?) 
                            ON DUPLICATE KEY UPDATE override_price = ?";
                    $stmt = $db->prepare($sql);
                    $stmt->execute([$sid, $formattedDate, $price_value, $price_value]);
                } else {
                    $isBlocked = ($action === 'block' ? 1 : 0);
                    $sql = "INSERT INTO slot_management (slot_id, specific_date, is_blocked, block_reason) 
                            VALUES (?, ?, ?, ?) 
                            ON DUPLICATE KEY UPDATE is_blocked = ?, block_reason = ?";
                    $stmt = $db->prepare($sql);
                    $stmt->execute([$sid, $formattedDate, $isBlocked, $reason, $isBlocked, $reason]);
                }
            }
        }
        $db->commit();

        sendResponse(true, null, 'Bulk update applied');
    }

} catch (Exception $e) {
    if (isset($db) && $db->inTransaction()) $db->rollBack();
    sendResponse(false, null, 'Error: ' . $e->getMessage(), 500);
}
?>

<?php
require_once '../config/config.php';

setCorsHeaders();

$db = Database::getInstance()->getConnection();

try {
    // Get statistics
    $stmt = $db->query("SELECT * FROM booking_statistics");
    $stats = $stmt->fetch();
    
    // Get bookings by location
    $locationStmt = $db->query("
        SELECT location, COUNT(*) as count, SUM(total_amount) as revenue
        FROM bookings
        GROUP BY location
        ORDER BY count DESC
    ");
    $byLocation = $locationStmt->fetchAll();
    
    // Get recent bookings
    $recentStmt = $db->query("
        SELECT * FROM bookings
        ORDER BY created_at DESC
        LIMIT 10
    ");
    $recentBookings = $recentStmt->fetchAll();
    
    // Get revenue by month
    $revenueStmt = $db->query("
        SELECT 
            DATE_FORMAT(created_at, '%Y-%m') as month,
            COUNT(*) as bookings,
            SUM(total_amount) as revenue
        FROM bookings
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY month
        ORDER BY month ASC
    ");
    $revenueByMonth = $revenueStmt->fetchAll();
    
    sendResponse(true, [
        'statistics' => $stats,
        'byLocation' => $byLocation,
        'recentBookings' => $recentBookings,
        'revenueByMonth' => $revenueByMonth
    ]);
    
} catch (Exception $e) {
    sendResponse(false, null, 'Error: ' . $e->getMessage(), 500);
}
?>

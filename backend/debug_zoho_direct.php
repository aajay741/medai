<?php
require_once 'config/config.php';
require_once 'config/ZohoInvoiceService.php';
$ref = 'MEDAI-E1DDA1B0';
try {
    $db = Database::getInstance()->getConnection();
    $stmt = $db->prepare("SELECT * FROM bookings WHERE booking_reference = ?");
    $stmt->execute([$ref]);
    $booking = $stmt->fetch();
    if (!$booking) die("Ref not found");

    $qty = (float)$booking['quantity'];
    $total = (float)$booking['total_amount'];
    $unitRate = ($qty > 0) ? round(($total / 1.18) / $qty, 4) : 0;

    echo "Attempting invoice for $ref\n";
    $zohoData = ZohoInvoiceService::createInvoice([
        'name'              => $booking['name'],
        'email'             => $booking['email'],
        'phone'             => $booking['phone'],
        'booking_reference' => $ref,
        'show_title'        => $booking['show_title'] ?: 'MEDAI Performance',
        'location'          => $booking['location'],
        'event_date'        => $booking['event_date'],
        'event_time'        => $booking['event_time'],
        'ticket_type'       => $booking['ticket_type'],
        'quantity'          => (int)$booking['quantity'],
        'price_per_unit'    => $unitRate,
        'company_name'      => $booking['company_name']    ?? '',
        'gst_number'        => $booking['gst_number']      ?? '',
        'billing_address'   => $booking['billing_address'] ?? '',
        'city'              => $booking['city']             ?? '',
        'state'             => $booking['state']            ?? '',
        'zip'               => $booking['zip_code']         ?? ''
    ]);
    print_r($zohoData);
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}

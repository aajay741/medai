<?php
$hosts = ['127.0.0.1', 'localhost'];
$port = '3306';
$dbname = 'u891495087_medai_db1';
$user = 'u891495087_medai_db1';
$pass = 'Medai@12345';

foreach ($hosts as $host) {
    try {
        echo "Trying $host:$port... ";
        $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";
        $pdo = new PDO($dsn, $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
        echo "Connected!" . PHP_EOL;
        $stmt = $pdo->query("DESCRIBE bookings");
        $cols = $stmt->fetchAll(PDO::FETCH_COLUMN);
        echo "Columns: " . implode(', ', $cols) . PHP_EOL;
        break;
    } catch (PDOException $e) {
        echo "Failed: " . $e->getMessage() . PHP_EOL;
    }
}

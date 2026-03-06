<?php
require_once 'config/config.php';
$db = Database::getInstance()->getConnection();
$s = $db->query('DESCRIBE bookings');
$res = [];
while($r = $s->fetch(PDO::FETCH_ASSOC)) {
    $res[] = sprintf("%-20s | %s", $r['Field'], $r['Type']);
}
file_put_contents('schema_result.txt', implode("\n", $res));
echo "Schema written to schema_result.txt" . PHP_EOL;

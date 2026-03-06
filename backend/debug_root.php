<?php
try {
    $pdo = new PDO('mysql:host=localhost;port=3306', 'root', '');
    echo "Connected as root\n";
    foreach($pdo->query('SHOW DATABASES') as $r) {
        echo "DB: " . $r[0] . "\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

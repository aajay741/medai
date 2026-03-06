<?php
require_once 'c:/xampp/htdocs\medai\backend\config\config.php';
$db = Database::getInstance()->getConnection();
try {
    $stmt = $db->query("SHOW TABLES LIKE 'zoho_customers'");
    if ($stmt->rowCount() > 0) {
        $stmt_desc = $db->query("DESCRIBE zoho_customers");
        echo "Table zoho_customers exists:\n";
        foreach ($stmt_desc->fetchAll() as $row) {
            echo $row['Field'] . " ";
        }
    } else {
        echo "Table zoho_customers DOES NOT exist!";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}

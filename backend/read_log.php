<?php
$logFile = 'C:\xampp\php\logs\php_error_log';
if (file_exists($logFile)) {
    // Read last 4KB
    $data = file_get_contents($logFile, false, null, max(0, filesize($logFile) - 4000));
    echo $data;
} else {
    echo "Log file not found at $logFile";
    // Try other common paths
    $alt = 'C:\xampp\apache\logs\error.log';
    if (file_exists($alt)) {
        echo "\nFound Apache log:\n";
        echo file_get_contents($alt, false, null, max(0, filesize($alt) - 4000));
    }
}

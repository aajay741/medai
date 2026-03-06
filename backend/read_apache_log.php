<?php
$alt = 'C:\xampp\apache\logs\error.log';
if (file_exists($alt)) {
    echo file_get_contents($alt, false, null, max(0, filesize($alt) - 8000));
}

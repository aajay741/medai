<?php
require_once '../config/config.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST') {
    sendResponse(false, null, 'Method not allowed', 405);
}

if (!isset($_FILES['file'])) {
    sendResponse(false, null, 'No file uploaded', 400);
}

$file = $_FILES['file'];
$targetDir = "../../uploads/";
$originalName = basename($file["name"]);
$fileType = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

// Generate unique name
$newName = uniqid() . '.' . $fileType;
$targetFile = $targetDir . $newName;

// Check if image file is a actual image or fake image
$check = getimagesize($file["tmp_name"]);
if($check === false) {
    sendResponse(false, null, "File is not an image.", 400);
}

// Check file size (limit to 5MB)
if ($file["size"] > 5000000) {
    sendResponse(false, null, "File is too large (max 5MB).", 400);
}

// Allow certain file formats
if($fileType != "jpg" && $fileType != "png" && $fileType != "jpeg" && $fileType != "gif" && $fileType != "webp" ) {
    sendResponse(false, null, "Only JPG, JPEG, PNG, GIF & WEBP files are allowed.", 400);
}

if (move_uploaded_file($file["tmp_name"], $targetFile)) {
    $fileUrl = APP_URL . "/uploads/" . $newName;
    sendResponse(true, ['url' => $fileUrl, 'name' => $newName], 'File uploaded successfully');
} else {
    sendResponse(false, null, "Failed to upload file.", 500);
}
?>

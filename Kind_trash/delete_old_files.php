<?php

if (!isset($_GET['key']) || $_GET['key'] !== $secret_key) {
    die("Unauthorized access.");
}

$folderPath = "output"; // เปลี่ยนเป็นพาธจริงของ Joomla

if (is_dir($folderPath)) {
    $files = glob($folderPath . "/*"); // ดึงรายการไฟล์ทั้งหมด

    foreach ($files as $file) {
        if (is_file($file)) {
            unlink($file); // ลบไฟล์
            echo "Deleted: " . basename($file) . "\n";
        }
    }
    echo "All old files deleted successfully.\n";
} else {
    echo "Folder not found.\n";
}
?>

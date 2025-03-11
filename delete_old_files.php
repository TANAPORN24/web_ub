<?php
// กำหนดโฟลเดอร์ที่ต้องการลบไฟล์
$folderPath = "https://ubonmet.tmd.go.th/upload_EX/output.php"; // เปลี่ยนเป็นพาธจริงของ Joomla

// ตรวจสอบว่าโฟลเดอร์มีอยู่หรือไม่
if (is_dir($folderPath)) {
    $files = glob($folderPath . "/*"); // ดึงรายการไฟล์ทั้งหมดในโฟลเดอร์

    foreach ($files as $file) {
        if (is_file($file)) {
            unlink($file); // ลบไฟล์แต่ละไฟล์
            echo "Deleted: " . basename($file) . "\n";
        }
    }
    echo "All old files deleted successfully.\n";
} else {
    echo "Folder not found.\n";
}
?>

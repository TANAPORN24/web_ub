<?php
$target_dir = "output/"; // โฟลเดอร์ปลายทางที่รับไฟล์
$target_file = $target_dir . basename($_FILES["file"]["name"]);
$uploadOk = 1;

// ตรวจสอบว่าไฟล์ถูกอัปโหลดสำเร็จหรือไม่
if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
    echo "ไฟล์ " . basename($_FILES["file"]["name"]) . " อัปโหลดสำเร็จ!";
} else {
    echo "เกิดข้อผิดพลาดในการอัปโหลดไฟล์.";
}
?>
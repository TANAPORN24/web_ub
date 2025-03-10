<?php
header('Content-Type: application/json');

// ดึงรายการไฟล์ภาพจากโฟลเดอร์ output/
$files = glob("output/20250310095418_*.png");

// แปลงเป็น JSON ส่งกลับไปยัง JavaScript
echo json_encode($files);
?>
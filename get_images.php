<?php
header('Content-Type: application/json');

// ดึงรายการไฟล์ภาพจากโฟลเดอร์ output/
$files = glob("output/*.png");

// แปลงเป็น JSON ส่งกลับไปยัง JavaScript
echo json_encode($files);
?>

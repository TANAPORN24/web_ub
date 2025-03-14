<?php
header('Content-Type: application/json');

// ตรวจสอบว่าได้รับคำขอจาก Python หรือไม่
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $folder = "output/"; // 
    $files = glob($folder . "*.png");

    if ($files !== false) {
        foreach ($files as $file) {
            if (is_file($file)) {
                unlink($file); // 🔥 ลบไฟล์
            }
        }
        echo json_encode(["status" => "success", "message" => "ลบไฟล์ทั้งหมดสำเร็จ!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "ไม่พบไฟล์ในโฟลเดอร์ output!"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "กรุณาใช้คำขอแบบ POST เท่านั้น!"]);
}
?>

import requests

# URL ของ PHP บน Joomla
joomla_url = "https://ubonmet.tmd.go.th/upload_EX/delete_images.php"

# ส่งคำขอ POST เพื่อสั่งให้ PHP ลบไฟล์
response = requests.post(joomla_url)

# แสดงผลลัพธ์ที่ได้จากเซิร์ฟเวอร์
print("คำสั่งลบถูกส่งไปยัง Joomla สำเร็จ!")
print("ตอบกลับจากเซิร์ฟเวอร์ (raw text):", response.text)

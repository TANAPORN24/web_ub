import requests
import os

# ตั้งค่า URL ของ upload.php บน Joomla (เปลี่ยนให้ตรงกับเซิร์ฟเวอร์จริง)
url = 'http://yourjoomla.com/upload.php'

# ระบุไฟล์ที่ต้องการอัปโหลด (ต้องเป็นพาธที่ถูกต้องของแต่ละไฟล์)
files_to_upload = [
    r'C:/Users/Ubonmet/Documents/GitHub/web_ub/index.html',
    r'C:/Users/Ubonmet/Documents/GitHub/web_ub/script.js',
    r'C:/Users/Ubonmet/Documents/GitHub/web_ub/styles.css',
    r'C:/Users/Ubonmet/Documents/GitHub/web_ub/script4.py',
    r'C:/Users/Ubonmet/Documents/GitHub/web_ub/loop.py'
]

# เตรียมไฟล์สำหรับอัปโหลด
files = {}
for file_path in files_to_upload:
    if os.path.exists(file_path):  # ตรวจสอบว่าไฟล์มีอยู่จริง
        files[os.path.basename(file_path)] = open(file_path, 'rb')
    else:
        print(f"❌ ไม่พบไฟล์: {file_path}")

# อัปโหลดไฟล์ไปยัง Joomla
try:
    response = requests.post(url, files=files)
    print("Response Status Code:", response.status_code)
    print("Response Content:", response.text)
except Exception as e:
    print(f"เกิดข้อผิดพลาด: {e}")
finally:
    # ปิดไฟล์ทั้งหมด
    for file in files.values():
        file.close()

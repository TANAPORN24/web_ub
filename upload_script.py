import requests
import os

# ตั้งค่า URL ของ upload.php บน Joomla
url = 'https://ubonmet.tmd.go.th/upload_EX/upload.php'

# ระบุไฟล์ที่ต้องการอัปโหลด (เปลี่ยนไฟล์ตามลำดับที่ต้องการ)
files_to_upload = [
    r'C:\Users\Ubonmet\Documents\GitHub\web_ub\output/1.png',
    r'C:\Users\Ubonmet\Documents\GitHub\web_ub\output/2.png',
    r'C:\Users\Ubonmet\Documents\GitHub\web_ub\output/3.png',
    r'C:\Users\Ubonmet\Documents\GitHub\web_ub\output/4.png',
    r'C:\Users\Ubonmet\Documents\GitHub\web_ub\output/5.png',
    r'C:\Users\Ubonmet\Documents\GitHub\web_ub\output/6.png',
    r'C:\Users\Ubonmet\Documents\GitHub\web_ub\output/7.png',
    r'C:\Users\Ubonmet\Documents\GitHub\web_ub\output/8.png',
    r'C:\Users\Ubonmet\Documents\GitHub\web_ub\output/9.png',
    r'C:\Users\Ubonmet\Documents\GitHub\web_ub\output/10.png',
    r'C:\Users\Ubonmet\Documents\GitHub\web_ub\output/11.png',
    r'C:\Users\Ubonmet\Documents\GitHub\web_ub\output/12.png',
    r'C:\Users\Ubonmet\Documents\GitHub\web_ub\index.html',
    r'C:\Users\Ubonmet\Documents\GitHub\web_ub\styles.css',
    r'C:\Users\Ubonmet\Documents\GitHub\web_ub\script.js'

]

# อัปโหลดแต่ละไฟล์ตามลำดับ
for file_path in files_to_upload:
    if os.path.exists(file_path):  # ตรวจสอบว่าไฟล์มีอยู่จริง
        try:
            with open(file_path, 'rb') as file:
                files = {'file': file}
                response = requests.post(url, files=files)
                print(f"อัปโหลด {os.path.basename(file_path)} สำเร็จ!")
                print("Response Status Code:", response.status_code)
                print("Response Content:", response.text)
        except Exception as e:
            print(f"เกิดข้อผิดพลาดในการอัปโหลด {os.path.basename(file_path)}: {e}")
    else:
        print(f"ไม่พบไฟล์: {file_path}")


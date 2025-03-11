import requests
import os
import datetime

# 🔹 ตั้งค่า URL ของ Joomla PHP Script
DELETE_URL = "https://ubonmet.tmd.go.th/administrator/scripts/delete_old_files.php"
UPLOAD_URL = "https://ubonmet.tmd.go.th/upload_EX/upload.php"


# ระบุไฟล์ที่ต้องการอัปโหลด
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
]

# 🔹 ขั้นตอนที่ 1: เรียกใช้ PHP Script เพื่อลบไฟล์เก่า
def delete_old_files():
    try:
        response = requests.get(f"{DELETE_URL}?key={SECRET_KEY}")
        print("Response from Joomla delete script:")
        print(response.text)  # แสดงผลลัพธ์จาก PHP
    except Exception as e:
        print(f"Error calling delete script: {e}")

# 🔹 ขั้นตอนที่ 2: อัปโหลดไฟล์ใหม่พร้อมเพิ่ม timestamp
def upload_new_files():
    timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")  # ดึง timestamp ปัจจุบัน

    for file_path in files_to_upload:
        if os.path.exists(file_path):  # ตรวจสอบว่าไฟล์มีอยู่จริง
            try:
                with open(file_path, 'rb') as file:
                    filename = os.path.basename(file_path)
                    new_filename = f"{timestamp}_{filename}"  # เปลี่ยนชื่อไฟล์ให้มี timestamp

                    files = {'file': (new_filename, file)}
                    response = requests.post(UPLOAD_URL, files=files)

                    print(f"อัปโหลด {new_filename} สำเร็จ!")
                    print("Response Status Code:", response.status_code)
                    print("Response Content:", response.text)
            except Exception as e:
                print(f"เกิดข้อผิดพลาดในการอัปโหลด {filename}: {e}")
        else:
            print(f"ไม่พบไฟล์: {file_path}")

# 🔹 รันกระบวนการ
if __name__ == "__main__":
    delete_old_files()  # 🔥 ลบไฟล์เก่าก่อน
    upload_new_files()  # 🚀 อัปโหลดไฟล์ใหม่

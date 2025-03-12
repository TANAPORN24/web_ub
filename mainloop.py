import time
import subprocess

# กำหนดชื่อไฟล์ Python ที่ต้องการรัน
script1 = "script4.py"  # ไฟล์แรกที่ต้องรัน
script2 = "delete_from_joomla.py"  # ไฟล์ที่ใช้ลบไฟล์ใน Joomla 
script3 = "upload_script.py"  # ไฟล์ที่อัปโหลดหลังจากลบไฟล์

while True:
     # ✅ รัน script4.py
    try:
        print(f"Running {script1}...")
        subprocess.run(["python", script1], check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌Error occurred while running {script1}: {e}")

    # ✅ รอ 1 นาที ก่อนรัน delete_from_joomla.py และ upload_script.py
    print("Waiting 1 minutes before running next script...")
    time.sleep(60)

    # ✅ รัน delete_from_joomla.py (🔥 ลบไฟล์บน Joomla)
    try:
        print(f"Running {script2} (Deleting files on Joomla)...")
        subprocess.run(["python", script2], check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Error occurred while running {script2}: {e}")

    # ✅ รัน upload_script.py
    try:
        print(f"Running {script3}...")
        subprocess.run(["python", script3], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error occurred while running {script3}: {e}")

    # ✅ รอเวลาที่เหลืออีก 4 นาที (รวมทั้งหมดเป็น 5 นาที)
    print("Waiting 4 minutes before next cycle...")
    time.sleep(240) 

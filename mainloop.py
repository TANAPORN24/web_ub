import time
import subprocess

# กำหนดชื่อไฟล์ Python ที่ต้องการรัน
script1 = "script4.py"  # ไฟล์แรกที่ต้องรัน
script2 = "upload_script.py"  # ไฟล์ที่สองที่ต้องรันหลังจาก 2 นาที

while True:
    try:
        # ✅ รัน script4.py
        print(f"Running {script1}...")
        subprocess.run(["python", script1], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error occurred while running {script1}: {e}")

    # ✅ รอ 1 นาที ก่อนรัน upload_script.py
    print("Waiting 1 minutes before running next script...")
    time.sleep(60)

    try:
        # ✅ รัน upload_script.py
        print(f"Running {script2}...")
        subprocess.run(["python", script2], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error occurred while running {script2}: {e}")

    # ✅ รอเวลาที่เหลืออีก 4 นาที (รวมทั้งหมดเป็น 5 นาที)
    print("Waiting 4 minutes before next cycle...")
    time.sleep(240)

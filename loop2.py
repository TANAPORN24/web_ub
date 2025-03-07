import time
import subprocess

# กำหนดชื่อไฟล์ Python ที่ต้องการรัน
script_to_run = "upload_script.py"  # แก้เป็นชื่อไฟล์ที่ต้องการ

while True:
    try:
        print(f"Running {script_to_run}...")
        subprocess.run(["python", script_to_run], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error occurred: {e}")
    
    print("Waiting for 5 minutes...")
    time.sleep(360)  # รอ 6 นาที (360 วินาที) ก่อนรันใหม่
# import time
# import subprocess

# # กำหนดชื่อไฟล์ Python ที่ต้องการรัน
# script_to_run = "script4.py"  # แก้เป็นชื่อไฟล์ที่ต้องการ

# while True:
#     try:
#         print(f"Running {script_to_run}...")
#         subprocess.run(["python", script_to_run], check=True)
#     except subprocess.CalledProcessError as e:
#         print(f"Error occurred: {e}")
    
#     print("Waiting for 5 minutes...")
#     time.sleep(300)  # รอ 5 นาที (300 วินาที) ก่อนรันใหม่

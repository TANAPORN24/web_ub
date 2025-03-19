import requests
from bs4 import BeautifulSoup
import os
import re
from PIL import Image, ImageChops
import numpy as np

# === STEP 1: กำหนดโฟลเดอร์และสร้างถ้ายังไม่มี ===
drive_folder = "Radar_Output"
input_folder = "input"
output_folder = "output"
os.makedirs(drive_folder, exist_ok=True)
os.makedirs(input_folder, exist_ok=True)
os.makedirs(output_folder, exist_ok=True)

# === STEP 2: ดึงภาพ GIF จากเว็บไซต์ ===
url = "https://weather.tmd.go.th/skn240_HQ_edit2.php"  
##### เปลี่ยน URL ถ้าเรดาร์ใช้ได้แล้ว หมายเหตุ: ต้องเป็น TMD Radar High Quality เท่านั้น #########

response = requests.get(url)
response.raise_for_status()
soup = BeautifulSoup(response.text, "html.parser")

gif_url = None
for img in soup.find_all("img"):
    if ".gif" in img["src"]:
        gif_url = img["src"]
        break  

if gif_url:
    if not gif_url.startswith("http"):
        gif_url = "https://weather.tmd.go.th/" + gif_url

    print(f"พบไฟล์ GIF: {gif_url}")

    gif_filename = "skn240_HQ_latest.gif"
    gif_path = os.path.join(input_folder, gif_filename)

    # ดาวน์โหลดไฟล์ GIF
    gif_response = requests.get(gif_url, stream=True)
    
    if gif_response.status_code == 200:
        with open(gif_path, "wb") as file:
            for chunk in gif_response.iter_content(chunk_size=1024):
                file.write(chunk)
        print(f"ไฟล์ GIF ถูกบันทึกที่: {gif_path}")
    else:
        print(f"ไม่สามารถดาวน์โหลดไฟล์ GIF ได้ (Status Code: {gif_response.status_code})")
        exit()

    # === STEP 2.5: ตรวจสอบว่าภาพใหม่เหมือนภาพก่อนหน้าหรือไม่ ===
    previous_gif_path = os.path.join(input_folder, "previous_skn240_HQ.gif")

    if os.path.exists(previous_gif_path):
        old_image = Image.open(previous_gif_path).convert("RGB")
        new_image = Image.open(gif_path).convert("RGB")
        
        diff = ImageChops.difference(old_image, new_image)
        if diff.getbbox() is None:  # ถ้าภาพเหมือนกันหมด
            print("ภาพเรดาร์ยังเหมือนเดิม หยุดการทำงาน")
            exit()
        else:
            print("🔄 พบความแตกต่างในภาพเรดาร์ กำลังดำเนินการต่อ...")

    # บันทึกไฟล์ใหม่เป็น previous เพื่อใช้เปรียบเทียบครั้งถัดไป
    os.replace(gif_path, previous_gif_path)
    gif_path = previous_gif_path  # ใช้ไฟล์ที่บันทึกแทน

    # === STEP 3: ลบพื้นหลังและตัดภาพ (ห้ามเปลี่ยนแปลง) ===
    image = Image.open(gif_path).convert("RGBA")
    image_data = np.array(image)

    def is_rain_data(pixel):
        r, g, b, a = pixel
        return not (40 < r < 180 and 60 < g < 200 and 40 < b < 180)

    mask = np.apply_along_axis(is_rain_data, -1, image_data)
    image_data[~mask] = [0, 0, 0, 0]

    blue_lower = np.array([0, 0, 100, 0])
    blue_upper = np.array([100, 255, 255, 255])
    white_lower = np.array([200, 200, 200, 0])
    white_upper = np.array([255, 255, 255, 255])

    blue_mask = ((image_data[:, :, 0] >= blue_lower[0]) & (image_data[:, :, 0] <= blue_upper[0]) &
                 (image_data[:, :, 1] >= blue_lower[1]) & (image_data[:, :, 1] <= blue_upper[1]) &
                 (image_data[:, :, 2] >= blue_lower[2]) & (image_data[:, :, 2] <= blue_upper[2]))

    white_mask = ((image_data[:, :, 0] >= white_lower[0]) & (image_data[:, :, 0] <= white_upper[0]) &
                  (image_data[:, :, 1] >= white_lower[1]) & (image_data[:, :, 1] <= white_upper[1]) &
                  (image_data[:, :, 2] >= white_lower[2]) & (image_data[:, :, 2] <= white_upper[2]))

    final_mask = blue_mask | white_mask
    image_data[final_mask] = [0, 0, 0, 0]

    processed_image = Image.fromarray(image_data)

    crop_width, crop_height = 1745, 1585
    orig_width, orig_height = processed_image.size
    left, upper = orig_width - crop_width, 0
    right, lower = orig_width, crop_height
    cropped_image = processed_image.crop((left, upper, right, lower))

    width, height = cropped_image.size
    center_x, center_y = width // 2, height // 2
    radius = 792

    mask = Image.new("L", (width, height), 0)
    mask_data = np.array(mask)
    y, x = np.ogrid[:height, :width]
    mask_area = (x - center_x) ** 2 + (y - center_y) ** 2 <= radius ** 2
    mask_data[mask_area] = 255
    circular_mask = Image.fromarray(mask_data, mode="L")

    circular_rain_image = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    circular_rain_image.paste(cropped_image, (0, 0), circular_mask)

    # === STEP 4: จัดการชื่อไฟล์และขยับลำดับ ===
    existing_files = sorted(
        [f for f in os.listdir(output_folder) if f.endswith(".png")],
        key=lambda x: int(os.path.splitext(x)[0])
    )

    has_full_9 = "9.png" in existing_files

    if has_full_9:
        os.remove(os.path.join(output_folder, "1.png"))
        for i in range(2, 10):
            old_path = os.path.join(output_folder, f"{i}.png")
            new_path = os.path.join(output_folder, f"{i-1}.png")
            if os.path.exists(old_path):
                os.rename(old_path, new_path)
        next_number = 9
    else:
        existing_numbers = []
        for file in existing_files:
            try:
                num = int(os.path.splitext(file)[0])
                if 1 <= num <= 9:
                    existing_numbers.append(num)
            except ValueError:
                pass

        next_number = max(existing_numbers) + 1 if existing_numbers else 1

    output_filename = f"{next_number}.png"
    output_path = os.path.join(output_folder, output_filename)

    circular_rain_image.save(output_path)

    print(f"บันทึกภาพเรดาร์ที่ประมวลผลแล้วที่: {output_path}")

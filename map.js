// สร้างแผนที่และกำหนดตำแหน่งเริ่มต้น
var map = L.map('map').setView([15.0, 100.0], 6); // ตั้งค่าให้ดูประเทศไทย

// เพิ่มแผนที่พื้นหลังจาก OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// โหลดไฟล์ GeoJSON
fetch('data.geojson')
    .then(response => response.json())
    .then(data => {
        // แสดงข้อมูล GeoJSON บนแผนที่
        L.geoJSON(data).addTo(map);
    })
    .catch(error => console.error('Error loading GeoJSON:', error));

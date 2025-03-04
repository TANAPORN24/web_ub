// กำหนดแผนที่และศูนย์กลาง
var map = L.map('map').setView([17.156253703430906, 104.13320232083736], 8);

// เพิ่ม Base Map
var baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// ✅ **เพิ่มภาพเรดาร์ฝนก่อน GeoJSON เพื่อไม่ให้ถูกซ่อน**
var radarImages = [
    'skn240_HQ_latest (1).png',
    'skn240_HQ_latest (2).png',
    'skn240_HQ_latest (3).png',
    'skn240_HQ_latest (4).png'
];
var currentIndex = 0;
var isLooping = true;

// ✅ **ปรับตำแหน่ง Bounding Box ให้ถูกต้อง**
var radarBounds = [
    [17.156253703430906 + 3, 104.13320232083736 - 3],
    [17.156253703430906 - 3, 104.13320232083736 + 3]
];

// ✅ **เพิ่มภาพเรดาร์เป็นเลเยอร์แรก**
var radarLayer = L.imageOverlay(radarImages[currentIndex], radarBounds).addTo(map);

// ✅ **ใช้ setUrl() เพื่อเปลี่ยนภาพแทนการสร้างเลเยอร์ใหม่**
var radarInterval = setInterval(() => {
    if (isLooping) {
        currentIndex = (currentIndex + 1) % radarImages.length;
        console.log("Switching Radar Image:", radarImages[currentIndex]);
        radarLayer.setUrl(radarImages[currentIndex]);
    }
}, 1000);

// ✅ **ปุ่มเปิด/ปิด Loop ของเรดาร์**
document.getElementById("toggleRadar").addEventListener("click", function() {
    isLooping = !isLooping;
    this.innerText = isLooping ? "หยุด Loop ภาพเรดาร์" : "เริ่ม Loop ภาพเรดาร์";
    console.log("Radar Looping:", isLooping);
});

// ✅ **โหลดไฟล์ GeoJSON จากโฟลเดอร์ Geojson/** (หลังจากเพิ่มเรดาร์)
var provinceLayer, districtLayer;

// โหลดข้อมูลจังหวัด
fetch('Geojson/province.geojson')
    .then(response => response.json())
    .then(data => {
        console.log("Province GeoJSON Loaded:", data);
        provinceLayer = L.geoJSON(data, {
            style: { 
                color: "#ff7800", weight: 2, fillOpacity: 0.2
            },
            onEachFeature: function (feature, layer) {
                layer.bindTooltip(feature.properties.ADM1_TH);
                layer.on('mouseover', function () {
                    layer.setStyle({ color: "#ff0000", weight: 4 });
                });
                layer.on('mouseout', function () {
                    layer.setStyle({ color: "#ff7800", weight: 2 });
                });
            }
        }).addTo(map);
    })
    .catch(error => console.error("Error loading province GeoJSON:", error));

// โหลดข้อมูลอำเภอ
fetch('Geojson/output_filtered.geojson')
    .then(response => response.json())
    .then(data => {
        console.log("District GeoJSON Loaded:", data);
        districtLayer = L.geoJSON(data, {
            style: { 
                color: "#0078ff", weight: 1, fillOpacity: 0.1
            },
            onEachFeature: function (feature, layer) {
                layer.bindTooltip(feature.properties.ADM2_TH);
                layer.on('mouseover', function () {
                    layer.setStyle({ color: "#0000ff", weight: 3 });
                });
                layer.on('mouseout', function () {
                    layer.setStyle({ color: "#0078ff", weight: 1 });
                });
            }
        }).addTo(map);
    })
    .catch(error => console.error("Error loading district GeoJSON:", error));

// ✅ ตรวจสอบว่ากล่องควบคุมถูกโหลดหรือไม่
console.log("Loading controls...");

document.addEventListener("DOMContentLoaded", function() {
    const controls = document.querySelector(".controls");
    if (!controls) {
        console.error("❌ Controls div is missing!");
    } else {
        console.log("✅ Controls div found!");
        controls.style.display = "block";
        controls.style.zIndex = "9999";
    }

    setInterval(() => {
        if (controls.style.display === "none") {
            console.warn("⚠️ Leaflet อาจซ่อน controls, กำลังแก้ไข...");
            controls.style.display = "block";
        }
    }, 500);
});

// ฟังก์ชันเปิด/ปิดเลเยอร์
document.getElementById("toggleProvince").addEventListener("change", function() {
    if (provinceLayer) {
        if (this.checked) {
            map.addLayer(provinceLayer);
        } else {
            map.removeLayer(provinceLayer);
        }
    }
});

document.getElementById("toggleDistrict").addEventListener("change", function() {
    if (districtLayer) {
        if (this.checked) {
            map.addLayer(districtLayer);
        } else {
            map.removeLayer(districtLayer);
        }
    }
});

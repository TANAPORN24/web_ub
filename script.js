/* ✅ ปักแมพเริ่มต้นที่ตำแหน่งที่กำหนด */ 
var map = L.map('map', {
    zoomControl: false
}).setView([15.42341669724746, 103.56871060013817], 8);

// ✅ เพิ่ม Base Map
var openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
});
var googleHybrid = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
    attribution: '&copy; Google Maps'
});

// ✅ ตั้งค่าเริ่มต้น OpenStreetMap
openStreetMap.addTo(map);

/* ✅ ฟังก์ชัน Toggle ปุ่ม */
function toggleButtonState(button, isActive) {
    button.classList.toggle("active", isActive);
}

/* ✅ เปิด/ปิด Base Layers */
document.getElementById("toggleOpenStreetMap").addEventListener("click", function () {
    if (map.hasLayer(openStreetMap)) {
        map.removeLayer(openStreetMap);
        toggleButtonState(this, false);
    } else {
        map.addLayer(openStreetMap);
        toggleButtonState(this, true);
    }
});

document.getElementById("toggleGoogleHybrid").addEventListener("click", function () {
    if (map.hasLayer(googleHybrid)) {
        map.removeLayer(googleHybrid);
        toggleButtonState(this, false);
    } else {
        map.addLayer(googleHybrid);
        toggleButtonState(this, true);
    }
});

// ✅ กำหนดตัวแปรหลัก
var isLooping = false;
var radarImages = [];
var currentIndex = 0;
var radarLayer = null;

// ✅ กำหนดตัวแปรหลัก
var isLooping = false;
var radarImages = [];
var currentIndex = 0;
var radarLayer = null;

// ✅ ฟังก์ชันโหลดภาพเรดาร์
function loadRadarImages() {
    fetch("get_images.php?t=" + new Date().getTime()) 
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                radarImages = data;
                console.log("✅ โหลดภาพเรดาร์สำเร็จ:", radarImages);
                currentIndex = 0;
                updateRadarLayer();
            } else {
                console.error("⚠️ ไม่มีภาพเรดาร์ใน output/");
            }
        })
        .catch(error => console.error("❌ เกิดข้อผิดพลาดในการโหลดภาพเรดาร์:", error));
}

// ✅ กำหนดขอบเขตของภาพเรดาร์
var radarCenter = [17.156253703430906, 104.13320232083736]; 
var radarRadiusKm = 250;
var kmToLat = 1 / 111.32;
var kmToLon = 1 / (111.32 * Math.cos(radarCenter[0] * Math.PI / 180));
var radarBounds = [
    [radarCenter[0] + (radarRadiusKm * kmToLat), radarCenter[1] - (radarRadiusKm * kmToLon)],
    [radarCenter[0] - (radarRadiusKm * kmToLat), radarCenter[1] + (radarRadiusKm * kmToLon)]
];

// ✅ ฟังก์ชันอัปเดตภาพเรดาร์
function updateRadarLayer() {
    if (radarImages.length > 0) {
        if (!radarLayer) {
            radarLayer = L.imageOverlay(radarImages[currentIndex], radarBounds).addTo(map);
        } else {
            radarLayer.setUrl(radarImages[currentIndex]);
        }
    } else {
        console.error("⚠️ ไม่มีไฟล์ภาพเรดาร์ให้โหลด!");
    }
}

// ✅ เริ่มโหลดภาพเรดาร์
loadRadarImages();

// ✅ อัปเดตภาพเรดาร์แบบ Loop
setInterval(() => {
    if (isLooping && radarImages.length > 0) {
        currentIndex = (currentIndex + 1) % radarImages.length;
        updateRadarLayer();
    }
}, 1000);

// ✅ ปุ่ม Toggle Radar
document.getElementById("toggleRadar").addEventListener("click", function() {
    isLooping = !isLooping;
    this.innerHTML = isLooping 
        ? '<span class="material-icons">pause</span> หยุด Loop ภาพเรดาร์' 
        : '<span class="material-icons">loop</span> เริ่ม Loop ภาพเรดาร์';
});


/* ✅ โหลดไฟล์ GeoJSON */
var provinceLayer, districtLayer;

// ✅ โหลดข้อมูลจังหวัด
fetch('Geojson/province.geojson')
    .then(response => response.json())
    .then(data => {
        provinceLayer = L.geoJSON(data, {
            style: { className: "province" },
            onEachFeature: function (feature, layer) {
                layer.bindTooltip(`<b>จังหวัด</b> ${feature.properties.ADM1_TH}`);
            }
        }).addTo(map);
    });

// ✅ โหลดข้อมูลอำเภอ
fetch('Geojson/output_filtered.geojson')
    .then(response => response.json())
    .then(data => {
        districtLayer = L.geoJSON(data, {
            style: { className: "district" },
            onEachFeature: function (feature, layer) {
                layer.bindTooltip(`<b>อำเภอ</b> ${feature.properties.ADM2_TH}<br><b>จังหวัด</b> ${feature.properties.ADM1_TH}`);
            }
        });
    });

/* ✅ ปุ่ม Toggle Province */
document.getElementById("toggleProvince").addEventListener("click", function () {
    if (provinceLayer) {
        if (map.hasLayer(provinceLayer)) {
            map.removeLayer(provinceLayer);
            toggleButtonState(this, false);
        } else {
            map.addLayer(provinceLayer);
            toggleButtonState(this, true);
        }
    }
});

/* ✅ ปุ่ม Toggle District */
document.getElementById("toggleDistrict").addEventListener("click", function () {
    if (districtLayer) {
        if (map.hasLayer(districtLayer)) {
            map.removeLayer(districtLayer);
            toggleButtonState(this, false);
        } else {
            map.addLayer(districtLayer);
            toggleButtonState(this, true);
        }
    }
});

// ✅ ปุ่ม Zoom In
document.getElementById("zoomIn").addEventListener("click", function() {
    map.zoomIn();
});

// ✅ ปุ่ม Zoom Out
document.getElementById("zoomOut").addEventListener("click", function() {
    map.zoomOut();
});


/* ✅ ฟังก์ชันค้นหาตำแหน่งผู้ใช้ */
function locateUser() {
    if (!navigator.geolocation) {
        alert("เบราว์เซอร์ของคุณไม่รองรับการระบุตำแหน่ง");
        return;
    }
    navigator.geolocation.getCurrentPosition(
        function (position) {
            var userLat = position.coords.latitude;
            var userLon = position.coords.longitude;
            map.setView([userLat, userLon], 11);
            L.marker([userLat, userLon]).addTo(map).bindPopup("คุณอยู่ที่นี่").openPopup();
        },
        function () {
            alert("ไม่สามารถเข้าถึงตำแหน่งของคุณได้");
        }
    );
}

document.getElementById("locateUser").addEventListener("click", locateUser);

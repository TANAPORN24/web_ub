/* ✅ ปักแมพเริ่มต้นที่ตำแหน่งที่กำหนด */ 
var map = L.map('map', {
    zoomControl: false  // ✅ ปิดปุ่ม Zoom In/Out ของ Leaflet
}).setView([15.42341669724746, 103.56871060013817], 8);

// เพิ่ม Base Map
var openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
});

var googleHybrid = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
    attribution: '&copy; Google Maps'
});

// เพิ่ม OpenStreetMap เป็นค่าเริ่มต้น
openStreetMap.addTo(map);

// ฟังก์ชันเปิด/ปิด Base Layers
document.getElementById("toggleOpenStreetMap").addEventListener("change", function() {
    this.checked ? map.addLayer(openStreetMap) : map.removeLayer(openStreetMap);
});

document.getElementById("toggleGoogleHybrid").addEventListener("change", function() {
    this.checked ? map.addLayer(googleHybrid) : map.removeLayer(googleHybrid);
});

// ✅ ดึงรายชื่อไฟล์ภาพเรดาร์จากโฟลเดอร์ output/
var radarImages = Array.from({ length: 12 }, (_, i) => `output/${i + 1}.png`);
var currentIndex = 0;
var isLooping = false;

// ✅ พิกัดกึ่งกลางของเรดาร์และขอบเขต
var radarCenter = [17.156253703430906, 104.13320232083736]; 
var radarRadiusKm = 250;
var kmToLat = 1 / 111.32;
var kmToLon = 1 / (111.32 * Math.cos(radarCenter[0] * Math.PI / 180));
var radarBounds = [
    [radarCenter[0] + (radarRadiusKm * kmToLat), radarCenter[1] - (radarRadiusKm * kmToLon)],
    [radarCenter[0] - (radarRadiusKm * kmToLat), radarCenter[1] + (radarRadiusKm * kmToLon)]
];

// ✅ เพิ่มภาพเรดาร์
var radarLayer = L.imageOverlay(radarImages[currentIndex], radarBounds).addTo(map);
setInterval(() => {
    if (isLooping) {
        currentIndex = (currentIndex + 1) % radarImages.length;
        radarLayer.setUrl(radarImages[currentIndex]);
    }
}, 1000);

// ✅ ปุ่ม Toggle Radar พร้อมเปลี่ยนไอคอน
document.getElementById("toggleRadar").addEventListener("click", function() {
    isLooping = !isLooping;
    this.innerHTML = isLooping 
        ? '<span class="material-icons">pause</span> หยุด Loop ภาพเรดาร์' 
        : '<span class="material-icons">loop</span> เริ่ม Loop ภาพเรดาร์';
});


// ✅ ปุ่ม Zoom In
document.getElementById("zoomIn").addEventListener("click", function() {
    map.zoomIn();
});

// ✅ ปุ่ม Zoom Out
document.getElementById("zoomOut").addEventListener("click", function() {
    map.zoomOut();
});


// ✅ โหลดไฟล์ GeoJSON
var provinceLayer, districtLayer;

// ✅ ฟังก์ชัน Highlight Polygon ตอนวางเมาส์
function highlightFeature(e) {
    var layer = e.target;
    
    if (!layer || !layer.setStyle) return; // ตรวจสอบว่ามีค่า layer ก่อนใช้

    layer.setStyle({
        weight: 3,
        color: "#ff0000",  // เปลี่ยนเป็นสีแดงตอนวางเมาส์
        fillOpacity: 0.3
    });
}

// ✅ ฟังก์ชันคืนค่าเมื่อเมาส์ออกจาก Polygon
function resetHighlight(e) {
    var layer = e.target;

    if (!layer || !layer.setStyle) return; // ตรวจสอบว่ามีค่า layer ก่อนใช้

    layer.setStyle({
        weight: 1, 
        color: layer.feature?.properties?.layerType === "province" ? "#ff7800" : "#0078ff", 
        fillOpacity: 0.1
    });
}


// โหลดข้อมูลจังหวัด
fetch('Geojson/province.geojson')
    .then(response => response.json())
    .then(data => {
        provinceLayer = L.geoJSON(data, {
            style: { className: "province" },
            onEachFeature: function (feature, layer) {
                layer.bindTooltip(`<b>จังหวัด</b> ${feature.properties.ADM1_TH}`);
                layer.on({ mouseover: highlightFeature, mouseout: resetHighlight });
            }
        }).addTo(map);
    });

// ✅ โหลดข้อมูลอำเภอ (แต่ยังไม่เพิ่มลงแผนที่)
fetch('Geojson/output_filtered.geojson')
    .then(response => response.json())
    .then(data => {
        districtLayer = L.geoJSON(data, {
            style: { className: "district" },
            onEachFeature: function (feature, layer) {
                layer.bindTooltip(`<b>อำเภอ</b> ${feature.properties.ADM2_TH}<br><b>จังหวัด</b> ${feature.properties.ADM1_TH}`);
                layer.on({ mouseover: highlightFeature, mouseout: resetHighlight });
            }
        });
    });

// ✅ ปิดเลเยอร์อำเภอไว้ก่อนและเปิดเมื่อกด checkbox
document.getElementById("toggleDistrict").addEventListener("change", function() {
    if (this.checked) {
        map.addLayer(districtLayer);
    } else {
        map.removeLayer(districtLayer);
    }
});


// ✅ ตรวจสอบว่ากล่องควบคุมถูกโหลดหรือไม่
document.addEventListener("DOMContentLoaded", function() {
    const controls = document.querySelector(".controls");
    if (!controls) {
        console.error("❌ Controls div is missing!");
    } else {
        controls.classList.remove("hidden");
    }
});

// ✅ ฟังก์ชันเปิด/ปิดเลเยอร์
document.getElementById("toggleProvince").addEventListener("change", function() {
    this.checked ? map.addLayer(provinceLayer) : map.removeLayer(provinceLayer);
});

document.getElementById("toggleDistrict").addEventListener("change", function() {
    this.checked ? map.addLayer(districtLayer) : map.removeLayer(districtLayer);
});

// ✅ ฟังก์ชันค้นหาตำแหน่งผู้ใช้
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

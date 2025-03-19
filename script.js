/*  ปักแมพเริ่มต้นที่ตำแหน่งที่กำหนด */ 
var map = L.map('map', {
    zoomControl: false
}).setView([15.42341669724746, 103.56871060013817], 7); //********กรณีที่เรดาร์อุบลใช้ได้แล้วให้ใส่ค่านี้แทน [15.245197761623547, 104.87098075473182]*************//

// ตรวจสอบขนาดหน้าจอเมื่อโหลดหน้าเว็บ
window.addEventListener("load", function () {
    if (window.innerWidth <= 768) { 
        map.setZoom(6); 
    }
});

//  เพิ่ม Base Map
var openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
});
var googleHybrid = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
    attribution: '&copy; Google Maps'
});

// ฟังก์ชันเปลี่ยนสถานะของปุ่มและเลเยอร์
function toggleBaseLayer(activeButton, inactiveButton, activeLayer, inactiveLayer) {
    if (map.hasLayer(activeLayer)) {
        // ถ้าเลเยอร์เปิดอยู่ -> ให้ปิด
        map.removeLayer(activeLayer);
        toggleButtonState(activeButton, false);
    } else {
        // ถ้าเลเยอร์ปิดอยู่ -> เปิดเลเยอร์ใหม่ และปิดอีกเลเยอร์
        map.removeLayer(inactiveLayer);
        map.addLayer(activeLayer);
        toggleButtonState(activeButton, true);
        toggleButtonState(inactiveButton, false);
    }
}

// เพิ่ม Event Listener สำหรับปุ่ม OpenStreetMap
document.getElementById("toggleOpenStreetMap").addEventListener("click", function () {
    toggleBaseLayer(this, document.getElementById("toggleGoogleHybrid"), openStreetMap, googleHybrid);
});

// เพิ่ม Event Listener สำหรับปุ่ม Google Hybrid
document.getElementById("toggleGoogleHybrid").addEventListener("click", function () {
    toggleBaseLayer(this, document.getElementById("toggleOpenStreetMap"), googleHybrid, openStreetMap);
});

// ตั้งค่าเริ่มต้น: เปิด Google Hybrid
map.addLayer(googleHybrid);
toggleButtonState(document.getElementById("toggleGoogleHybrid"), true);
toggleButtonState(document.getElementById("toggleOpenStreetMap"), false);

function toggleButtonState(button, isActive) {
    if (isActive) {
        button.classList.add("active");
    } else {
        button.classList.remove("active");
    }
}

//  กำหนดตัวแปรหลัก
var isLooping = false;
var radarImages = [];
var currentIndex = 0;
var radarLayer = null;

//  ฟังก์ชันโหลดภาพเรดาร์
function loadRadarImages() {
    fetch("get_images.php?t=" + new Date().getTime()) 
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                radarImages = data;
                console.log(" โหลดภาพเรดาร์สำเร็จ:", radarImages);
                currentIndex = 0;
                updateRadarLayer();
            } else {
                console.error(" ไม่มีภาพเรดาร์ใน output/");
            }
        })
        .catch(error => console.error(" เกิดข้อผิดพลาดในการโหลดภาพเรดาร์:", error));
}

//  กำหนดขอบเขตของภาพเรดาร์
var radarCenter = [17.156253703430906, 104.13320232083736];//*****กรณีเรดาร์อุบลใช้ได้แล้วให้ใส่พิกัดนี้แทน [15.245197761623547, 104.87098075473182]*****//
var radarRadiusKm = 250; //**รัศมีทำการ**//
var kmToLat = 1 / 111.32;
var kmToLon = 1 / (111.32 * Math.cos(radarCenter[0] * Math.PI / 180));
var radarBounds = [
    [radarCenter[0] + (radarRadiusKm * kmToLat), radarCenter[1] - (radarRadiusKm * kmToLon)],
    [radarCenter[0] - (radarRadiusKm * kmToLat), radarCenter[1] + (radarRadiusKm * kmToLon)]
];

//  ฟังก์ชันอัปเดตภาพเรดาร์
function updateRadarLayer() {
    if (radarImages.length > 0) {
        if (!radarLayer) {
            radarLayer = L.imageOverlay(radarImages[currentIndex], radarBounds).addTo(map);
        } else {
            radarLayer.setUrl(radarImages[currentIndex]);
        }
    } else {
        console.error(" ไม่มีไฟล์ภาพเรดาร์ให้โหลด!");
    }
}

//  เริ่มโหลดภาพเรดาร์
loadRadarImages();

//  อัปเดตภาพเรดาร์แบบ Loop
setInterval(() => {
    if (isLooping && radarImages.length > 0) {
        currentIndex = (currentIndex + 1) % radarImages.length;
        updateRadarLayer();
    }
}, 1000);

//  ปุ่ม Toggle Radar
document.getElementById("toggleRadar").addEventListener("click", function() {
    isLooping = !isLooping;
    this.innerHTML = isLooping 
        ? '<span class="material-icons">pause</span> หยุด Loop ภาพเรดาร์' 
        : '<span class="material-icons">loop</span> เริ่ม Loop ภาพเรดาร์';
});

/*  โหลดไฟล์ GeoJSON */
var provinceLayer, districtLayer;

// โหลดข้อมูลจังหวัด
fetch('Geojson/province.geojson')
    .then(response => response.json())
    .then(data => {
        provinceLayer = L.geoJSON(data, {
            style: { className: "province" },
            onEachFeature: function (feature, layer) {
                layer.bindTooltip(`<b>จังหวัด</b> ${feature.properties.ADM1_TH}`);
            }
        }).addTo(map); // เพิ่มเลเยอร์จังหวัดตั้งแต่เริ่มต้น
        toggleButtonState(document.getElementById("toggleProvince"), true);
    });

//  โหลดข้อมูลอำเภอ
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

/*  ปุ่ม Hemberger ในแมพ */
document.getElementById("menu-toggle").addEventListener("click", function () {
    let controls = document.getElementById("controls");
    controls.classList.toggle("active");

    // เปลี่ยนไอคอนของปุ่มเมนู
    this.innerHTML = controls.classList.contains("active") 
        ? '<span class="material-icons">close</span>' 
        : '<span class="material-icons">menu</span>';
});

/*  ปุ่ม Toggle Province */
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

/*  ปุ่ม Toggle District */
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

//  ปุ่ม Zoom In
document.getElementById("zoomIn").addEventListener("click", function() {
    map.zoomIn();
});

//  ปุ่ม Zoom Out
document.getElementById("zoomOut").addEventListener("click", function() {
    map.zoomOut();
});

/*  ฟังก์ชันค้นหาตำแหน่งผู้ใช้ */
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

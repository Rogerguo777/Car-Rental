// 注意：如果後端主機/port 不同，修改 API_BASE
const API_BASE = "http://localhost:8080";

let selectedVehicle = null;
let selectedCarId = null;
let basePrice = 0;
let perKmPrice = 0;
let maxPassengers = 0;

// 固定里程表（保留原本映射，必要時可擴充）
const fixedDistanceTable = {
  "松山國際機場-高鐵-台北站": 6,
  "松山國際機場-高鐵-台中站": 150,
  "松山國際機場-高鐵-台南站": 290,
  "松山國際機場-高鐵-左營站": 360,
  "松山國際機場-桃園國際機場": 45,
  "松山國際機場-清泉崗國際機場": 150,
  "松山國際機場-小港國際機場": 360,
  "松山國際機場-台北市": 5,
  "松山國際機場-台中市": 150,
  "松山國際機場-高雄市": 350,

  "桃園國際機場-高鐵-台北站": 45,
  "桃園國際機場-高鐵-台中站": 120,
  "桃園國際機場-高鐵-台南站": 260,
  "桃園國際機場-高鐵-左營站": 310,
  "桃園國際機場-台北市": 45,
  "桃園國際機場-台中市": 120,
  "桃園國際機場-高雄市": 310,
  "桃園國際機場-清泉崗國際機場": 120,
  "桃園國際機場-小港國際機場": 310,

  "清泉崗國際機場-小港國際機場": 230,
  "清泉崗國際機場-高鐵-台北站": 150,
  "清泉崗國際機場-高鐵-台中站": 20,
  "清泉崗國際機場-高鐵-台南站": 170,
  "清泉崗國際機場-高鐵-左營站": 230,
  "清泉崗國際機場-台北市": 150,
  "清泉崗國際機場-台中市": 20,
  "清泉崗國際機場-高雄市": 230,

  "小港國際機場-高鐵-台北站": 360,
  "小港國際機場-高鐵-台中站": 230,
  "小港國際機場-高鐵-台南站": 50,
  "小港國際機場-高鐵-左營站": 10,
  "小港國際機場-台北市": 350,
  "小港國際機場-台中市": 230,
  "小港國際機場-高雄市": 10,

  "高鐵-台北站-台北市": 5,
  "高鐵-台北站-台中市": 150,
  "高鐵-台北站-高雄市": 350,
  "高鐵-台北站-高鐵-台中站": 150,
  "高鐵-台北站-高鐵-台南站": 290,
  "高鐵-台北站-高鐵-左營站": 350,

  "高鐵-台中站-高鐵-台南站": 140,
  "高鐵-台中站-高鐵-左營站": 190,
  "高鐵-台中站-台中市": 10,
  "高鐵-台中站-高雄市": 190,
  "高鐵-台南站-高鐵-左營站": 50,

  "高鐵-台南站-高雄市": 50,
  "高鐵-左營站-高雄市": 10,

  "台北市-台中市": 150,
  "台北市-高雄市": 350,
  "台中市-高雄市": 190,
};

// helper: 取得固定距離（含反向）
function getFixedDistance(from, to) {
  const key = `${from}-${to}`;
  const reverseKey = `${to}-${from}`;
  return fixedDistanceTable[key] ?? fixedDistanceTable[reverseKey] ?? null;
}

// 載入後端車輛清單（轉換 imageUrl）
async function loadCarsFromBackend() {
  const resp = await fetch(`${API_BASE}/api/adscar`);
  if (!resp.ok) {
    console.error("載入車輛失敗", resp.status, await resp.text());
    return [];
  }
  const cars = await resp.json();
  return cars.map(car => ({
    id: car.adscarId,
    name: car.name,
    maxPassengers: car.maxPassengers,
    maxLuggage: car.maxLuggage,
    baseFare: car.baseFare,
    perKmFare: car.perKmFare,
    // 建議後端提供 /api/adscar/{id}/image endpoint
    imageUrl: `${API_BASE}/api/adscar/${car.adscarId}/image`
  }));
}

// renderCarCards 改為 async 並從後端載入
async function renderCarCards() {
  const container = document.getElementById("step2");
  container.innerHTML = ""; // 清空舊內容
  const carList = await loadCarsFromBackend();

  if (!carList.length) {
    container.innerHTML = "<p>目前無車輛資料可顯示</p>";
    return;
  }

  carList.forEach(car => {
    const card = document.createElement("div");
    card.className = "col-md-3 mb-3";
    card.innerHTML = `
      <div class="card h-100 text-center" style="height:100%;" onclick="selectVehicle('${car.id}', '${escapeHtml(car.name)}', ${car.baseFare}, ${car.perKmFare}, ${car.maxPassengers})">
        <img src="${car.imageUrl}" class="card-img-top" alt="${escapeHtml(car.name)}" style="height:160px; object-fit:cover;">
        <div class="card-body d-flex flex-column justify-content-between">
          <div>
            <h5 class="card-title">${escapeHtml(car.name)}</h5>
            <p class="card-text">${car.maxPassengers}人 ${car.maxLuggage ?? '-'}件行李</p>
          </div>
          <div>
            <button class="btn btn-outline-danger">我要選擇</button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// 安全 escape HTML（避免注入）
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// 顯示車輛（觸發 render）
function showVehicles() {
  // 基本欄位驗證（姓名、電話、email、出發地、目的地、日期、時間）
  const pickupPlace = document.getElementById('pickupPlace').value;
  const pickupDate = document.getElementById('pickupDate').value;
  const pickupTime = document.getElementById('pickupTime').value;
  const dropoffPlace = document.getElementById('dropoffPlace').value;

  let missingFields = [];
  if (!pickupPlace) missingFields.push("出發地點");
  if (!pickupDate) missingFields.push("日期");
  if (!pickupTime) missingFields.push("時間");
  if (!dropoffPlace) missingFields.push("目的地點");

  const name = document.getElementById('userName').value.trim();
  const phone = document.getElementById('userPhone').value.trim();
  const email = document.getElementById('userEmail').value.trim();
  const phoneValid = /^\d{10}$/.test(phone);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!name || !phone || !email) {
    alert("請填寫所有聯絡資訊欄位");
    return;
  }
  if (!phoneValid) {
    alert("電話號碼格式錯誤，請輸入10碼數字");
    return;
  }
  if (!emailValid) {
    alert("Email 格式錯誤，請確認輸入正確的郵件地址");
    return;
  }
  if (missingFields.length > 0) {
    alert("請完成以下欄位再繼續：\n" + missingFields.join("、"));
    return;
  }

  // 設定日期最小值為今天
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("pickupDate").setAttribute("min", today);

  // 顯示 Step2 並載入卡片
  document.getElementById('step2').style.display = 'flex';
  renderCarCards();

  // 隱藏按鈕
  document.getElementById('showVehiclesBtn').style.display = 'none';
}

// 選擇車輛
function selectVehicle(id, name, base, perKm, maxPax) {
  selectedCarId = Number(id);
  selectedVehicle = name;
  basePrice = Number(base);
  perKmPrice = Number(perKm);
  maxPassengers = Number(maxPax);

  document.getElementById('vehicleName').value = name;

  // 設定乘客限制
  const paxInput = document.getElementById('passengerCount');
  paxInput.setAttribute('max', maxPassengers);
  paxInput.value = Math.min(maxPassengers, paxInput.value || maxPassengers);

  paxInput.addEventListener('input', () => {
    if (parseInt(paxInput.value) > maxPassengers) {
      alert(`此車型最多可乘坐 ${maxPassengers} 人`);
      paxInput.value = maxPassengers;
    }
  });

  // 計算距離與價格
  updateDistanceAndPrice();
  calculatePrice();

  // 切換步驟顯示
  document.getElementById('step2').style.display = 'none';
  document.getElementById('step3').style.display = 'block';
}

// 回到車輛選擇
function goBackToStep2() {
  document.getElementById('step3').style.display = 'none';
  document.getElementById('step2').style.display = 'flex';
}

// 根據選擇的出發、目的地取得距離並更新價格欄位
function updateDistanceAndPrice() {
  const from = document.getElementById("pickupPlace").value;
  const to = document.getElementById("dropoffPlace").value;
  const distance = getFixedDistance(from, to);
  if (distance !== null) {
    document.getElementById("distance").value = distance;
    calculatePrice();
  } else {
    document.getElementById("distance").value = "";
    document.getElementById("price").value = "";
    // 不用每次 alert，改成 console（避免太多跳窗）
    console.warn("此組合尚未定義距離");
  }
}

// 計算價格（顯示為整數金額）
function calculatePrice() {
  const distanceVal = parseFloat(document.getElementById('distance').value || 0);
  const signageFee = document.getElementById('signage').value === 'yes' ? 200 : 0;
  const total = (Number(basePrice) || 0) + (Number(perKmPrice) || 0) * (distanceVal || 0) + signageFee;
  const rounded = Math.round(total);
  document.getElementById('price').value = `NT$ ${rounded} 元`;
}

// 行李選單是否需要額外顯示數量（此版保留，但未使用）
function toggleLuggageCount() {
  const luggageValue = document.getElementById("luggage").value;
  const countSection = document.getElementById("luggageCount");
  if (countSection) countSection.style.display = (luggageValue === "yes") ? "block" : "none";
}

function isLuggageNeeded() {
  return document.getElementById("luggage").value === "yes";
}

// 送出訂單 (POST 到後端)
async function submitOrder() {
  if (!selectedCarId) {
    alert("請先選擇車型");
    return;
  }

  // 基本欄位
  const name = document.getElementById('userName').value.trim();
  const phone = document.getElementById('userPhone').value.trim();
  const email = document.getElementById('userEmail').value.trim();
  const pickupPlace = document.getElementById('pickupPlace').value;
  const dropoffPlace = document.getElementById('dropoffPlace').value;
  const pickupDate = document.getElementById('pickupDate').value; // yyyy-mm-dd
  const pickupTime = document.getElementById('pickupTime').value; // hh:mm
  const distance = parseFloat(document.getElementById('distance').value || 0);
  const passengerCount = parseInt(document.getElementById('passengerCount').value || 1);
  const luggageCount = (document.getElementById('luggage').value === 'yes') ? 1 : 0;
  const signage = document.getElementById('signage').value === 'yes';
  const priceText = document.getElementById('price').value || '';
  const totalPrice = parseInt((priceText.match(/\d+/) || [0])[0], 10);

  // 再次基本驗證
  if (!name || !phone || !email || !pickupPlace || !dropoffPlace || !pickupDate || !pickupTime) {
    alert("請完整填寫所有必要欄位");
    return;
  }

  // 組成要送的物件（對應到 DriverOrder entity）
  const order = {
    name: name,
    phone: phone,
    email: email,
    pickupPlace: pickupPlace,
    dropoffPlace: dropoffPlace,
    pickupDate: pickupDate, // Spring Boot LocalDate 會解析 yyyy-MM-dd
    pickupTime: pickupTime + ":00", // 傳 hh:mm:ss，Spring LocalTime 可解析
    distanceKm: distance,
    passengerCount: passengerCount,
    luggageCount: luggageCount,
    signage: signage,
    totalPrice: totalPrice,
    adscar: { adscarId: selectedCarId } // 關聯車輛
  };

  try {
    const resp = await fetch(`${API_BASE}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order)
    });

    if (resp.ok) {
      const created = await resp.json();
      alert(`訂單建立成功！訂單ID: ${created.orderNo ?? '已建立'}`);
      // 可做表單清除或導向訂單頁
      //window.location.reload();
      // document.querySelector("form").reset();
      // 將 orderNo 寫入 LocalStorage，再跳轉成功頁面
      localStorage.setItem("lastOrderNo", created.orderNo);
      // 跳轉連結根據api整合、調整
      window.location.href = `order-success.html?orderNo=${created.orderNo}`;
      //window.location.href = "order-success.html";
      // 顯示隱藏的成功跳轉按鈕
      //document.getElementById("successBtn").style.display = "inline-block";


    } else {
      const text = await resp.text();
      console.error("建立訂單失敗", resp.status, text);
      alert("建立訂單失敗，請稍後再試或聯絡客服");
    }
  } catch (err) {
    console.error("建立訂單例外", err);
    alert("建立訂單發生錯誤，請檢查伺服器或網路");
  }
}

// 頁面事件：當出發/目的地改變時更新距離
document.addEventListener("DOMContentLoaded", () => {
  const pickupPlace = document.getElementById("pickupPlace");
  const dropoffPlace = document.getElementById("dropoffPlace");
  const signage = document.getElementById("signage");
  pickupPlace?.addEventListener("change", updateDistanceAndPrice);
  dropoffPlace?.addEventListener("change", updateDistanceAndPrice);
  signage?.addEventListener("change", updateDistanceAndPrice);

  // 初始化：把日期 min 設為今天
  const today = new Date().toISOString().split("T")[0];
  const dateInput = document.getElementById("pickupDate");
  if (dateInput) dateInput.setAttribute("min", today);
});

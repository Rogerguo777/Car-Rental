const API_BASE = "http://localhost:8080";

// 取得 URL ?orderNo=ads001...
const urlParams = new URLSearchParams(window.location.search);
const orderNo = urlParams.get("orderNo") || localStorage.getItem("lastOrderNo");

document.getElementById("orderNoDisplay").innerText =
    orderNo ? `訂單編號：${orderNo}` : "訂單編號：未取得";

async function loadOrderDetail() {
    if (!orderNo) {
        document.getElementById("orderDetail").innerHTML =
            "<p class='info-row'>無法取得訂單編號</p>";
        return;
    }

    document.getElementById("loadingText").style.display = "block";

    try {
        const resp = await fetch(`${API_BASE}/api/dorder/query?orderNo=${orderNo}`);

        if (!resp.ok) {
            document.getElementById("orderDetail").innerHTML =
                "<p class='info-row'>查詢失敗，請稍後再試！</p>";
            return;
        }

        const data = await resp.json();

        document.getElementById("orderDetail").innerHTML = `
            <p class="info-row"><strong>車型：</strong> ${data.adscar?.name ?? "—"}</p>
            <p class="info-row"><strong>姓名：</strong> ${data.name}</p>
            <p class="info-row"><strong>電話：</strong> ${data.phone}</p>
            <p class="info-row"><strong>Email：</strong> ${data.email}</p>

            <p class="info-row"><strong>上車地點：</strong> ${data.pickupPlace}</p>
            <p class="info-row"><strong>目的地：</strong> ${data.dropoffPlace}</p>

            <p class="info-row"><strong>日期時間：</strong> 
                ${data.pickupDate} ${data.pickupTime}
            </p>

            <p class="info-row"><strong>乘客人數：</strong> ${data.passengerCount} 人</p>
            <p class="info-row"><strong>行李：</strong> ${data.luggageCount} 件</p>
            <p class="info-row"><strong>舉牌：</strong> ${data.signage ? "需要" : "不需要"}</p>

            <p class="info-row"><strong>總金額：</strong> NT$ ${data.totalPrice} 元</p>
        `;
    } catch (err) {
        document.getElementById("orderDetail").innerHTML =
            "<p class='info-row'>查詢時發生錯誤！</p>";
    } finally {
        document.getElementById("loadingText").style.display = "none";
    }
}

loadOrderDetail();
# Car-Rental
## 🚗attach-driver-service

📌 專案介紹
「附駕出行服務系統」是一個 前後端分離 的用車預約平台，提供：
- 車型選擇（含後端資料庫車型表）
- 距離費用自動計算
- 訂單建立 API（含 orderNo 自動生成）
- 訂單查詢（orderNo / phone）
- 前端動態頁面（訂單頁、成功頁）
## ✨ Features
### 🔹 Frontend
- 📄 **附駕下單頁面**：`attach-driver.html`
- 📏 **距離自動計算**（固定表）
- 🚘 **車型清單即時載入**（含圖片）
- ✅ **訂單送出後自動跳轉** → `order-success.html`
- 💾 **LocalStorage 暫存 orderNo**
- 🎉 **訂單成功頁面顯示完整資訊**

### 🔹 Backend
- ⚙️ **Spring Boot + JPA + MySQL**
- 📝 **訂單建立 API**
- 📞 **依電話查詢 API**
- 🔑 **依 orderNo 查詢 API**
- 🚗 **車型資料 API (`/api/adscar`)**
- 🖼️ **車輛圖片 API**
- 🔄 **OrderNo 自動生成**（ads001, ads002…）
- 🛡️ **完整例外處理**（Bad Request / Not Found）

---

## 📂 Project Structure
```
📦 src
┣ 📂 controller
┃ ┗ 📜 DriverOrderController.java
┃ ┗ 📜 ADSCarController.java
┣ 📂 service
┃ ┣ 📜 DriverOrderService.java
┃ ┣ 📜 ADSCarService.java
┃ ┗ 📂 impl
┃   ┣ 📜 DriverOrderServiceImpl.java
┃   ┗ 📜 ADSCarServiceImpl.java
┣ 📂 repository
┃ ┣ 📜 DriverOrderRepository.java
┃ ┗ 📜 ADSCarRepository.java
┣ 📂 entity
┃ ┣ 📜 DriverOrder.java
┃ ┗ 📜 ADSCar.java
┣ 📂 util
┃ ┗ 📜 (工具類)
┣ 📂 static
┃ ┣ 📜 attach-driver.html
┃ ┣ 📜 order-success.html
┃ ┣ 📜 order-research.html
┃ ┣ 📂 css
┃ ┣ 📂 js
┃ ┗ 📂 assets / images
┗ 📜 DriverAssistantApplication.java
```
程式碼

---

## 🧩 Order Flow (Frontend)

```
    User->>Frontend: 填寫資訊 / 選擇車型
    Frontend->>Frontend: 計算金額 (依距離表)
    Frontend->>Backend: POST /api/orders
    Backend->>Backend: 產生 orderNo (ads001…)
    Backend-->>Frontend: 回傳 orderNo
    Frontend->>Frontend: 寫入 localStorage
    Frontend->>User: 跳轉至 order-success.html?orderNo=ads001
    Frontend->>Backend: GET /api/orders/{orderNo}
    Backend-->>Frontend: 回傳完整訂單資訊
    Frontend->>User: 顯示成功頁面
```
### 🚀 Tech Stack
-Frontend: HTML, JavaScript

-Backend: Spring Boot, JPA

-Database: MySQL

## 🧾 License
MIT License © 2025 Roger Guo


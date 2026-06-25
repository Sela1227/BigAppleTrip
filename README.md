<div align="center">
  <img src="favicon/app-icon.svg" width="120" alt="BigAppleTrip"/>
  <h1>BigAppleTrip（紐約家庭之旅）</h1>
  <p>2026 年 7 月 · 紐約 8 天親子旅遊的隨身網站</p>
  <p><strong>V1.11.9</strong></p>
</div>

---

## 這是什麼

一個部署在 GitHub Pages、給全家手機用的純靜態網站，包含兩個 app：

- **旅遊行程（itinerary.html）** — 8 天完整行程、景點、地圖導航、訂位資訊
- **小小探險家（kids.html）** — 給小孩的旅遊 App：蓋章護照、知識問答、Mii 風格捏臉頭像、尋寶任務、英文字卡發音
- **首頁（index.html）** — 連到上面兩個 app 的選單

部署在 HTTPS 後，相機蓋章、英文發音、語音、存檔（localStorage）都能正常使用。

---

## 檔案結構

```
BigAppleTrip/
├── index.html          首頁選單
├── itinerary.html      旅遊行程
├── kids.html           小小探險家 App（shell）
├── css/kids.css        kids 樣式
├── js/kids.data.js     kids 資料（景點/圖示/尋寶/徽章），需先載入
├── js/kids.js          kids 邏輯（頭像/分頁/蓋章/問答）
├── sw.js               Service Worker（離線快取 + Android 安裝）
├── favicon/            App 圖示套組（深藍＋金星＋天際線）+ site.webmanifest
├── assets/sela.svg     SELA 品牌標識
├── CLAUDE.md           給下一個 Claude 的工作上下文
├── README.md           本檔
└── .gitignore
```

---

## 部署（GitHub Pages）

1. 用 Git Pusher 把 zip 匯入並推上 `sela1227` 的 repo
2. Settings → Pages → Source：`main` 分支、`/ (root)`
3. 等 1–2 分鐘，網址出現在 Settings → Pages
4. 手機開網址 → 瀏覽器選單「加到主畫面」即變成 App

> 純靜態、無 build step，原始碼即上線檔（branch-serve）。

---

## 技術

純 HTML + 原生 JS + CSS，三個自包含單檔 + `sw.js`，零後端、零相依套件。
PWA 用 data-URI manifest + 真實 `sw.js`（network-first），HTTPS 上可安裝。

---

## 版本歷程

- **V1.11.9** — 自然史博物館 AMNH 標記為已訂（7/6 週一）：預訂清單打勾、Day 2 活動列加「已訂」標籤。
- **V1.11.8** — Day 8 觀景台由 Edge 換成更適合小孩的 Summit One Vanderbilt，並重排當天動線（Summit → 7 號線 → High Line → Chelsea）；Edge 移為候補選項。
- **V1.11.7** — Day 3 登船時間校正為 8:30；修正全頁星期標示（7/7 其實是週二）；更正 9/11 博物館的週二說明；預訂清單新增 9/11 博物館、自然史博物館、大都會三項建議先買的票。
- **V1.11.6** — Day 3 自由女神更新為官方基座票（7/7 9:00 場），時間改為 07:45 出發、09:00 上島（含基座）、11:00 Ellis Island，並補上票券與取票資訊。
- **V1.11.5** — 校正 Day 3 自由女神行程時間，配合實際訂的 8:00 渡輪場次（出發提前到 07:00、第一班船 08:30）。
- **V1.11.4** — 行程頁新增「候補景點（可替換）」卡，列出 Woodbury Common 等家庭向備選與可替換的天數，方便彈性取捨。
- **V1.11.3** — 行程頁整合最新 OMNY 交通卡資訊：更新已停售的 MetroCard 說明，新增「地鐵這樣搭 · 2 大 2 小」濃縮指南卡。
- **V1.11.2** — 頭像優化：重畫更自然的捲髮、調淡腮紅讓角色不那麼娃娃臉、快速造型改成較有型不幼的組合。
- **V1.11.1** — 景點挑戰題目大幅擴充並更貼近各景點（每個景點 9 題題庫，每次隨機抽 3 題）；英文字卡再新增 16 張紐約旅遊主題單字。
- **V1.11.0** — 修復互動地圖點 pin／行政區沒反應的問題；新增英文單字題庫與更多英文字卡；景點挑戰改成「隨機 5 題、計分、像問答」（3 題景點知識＋2 題英文單字），過關記入成就。
- **V1.10.0** — 捏臉頭像新增 6 款髮型（長直髮、丸子頭、雙丸子、低雙馬尾、捲髮、短髮）與 4 款配件（王冠、耳機、花朵髮夾、毛帽），編輯器自動帶入新選項，另加 2 組預設造型。
- **V1.9.1** — 修復 V1.9.0 初始化中斷（huntPhotos TDZ）造成多畫面空白的 bug。

- **V1.9.0** — 知識庫手風琴、景點標題列縮小、景點知識/挑戰加量並去 emoji、明信片語音輸入、尋寶分 8 天可拍照完成。

- **V1.8.0** — 護照成就分享：一鍵把頭像＋進度＋徽章＋已收集地標組成成就卡，分享給家人（手機 share／桌機下載）。

- **V1.7.0** — itinerary 加 iOS Apple Maps 深連結與 8 天日次快速跳轉；全頁 UI 圖示統一（分頁標題/按鈕 emoji 換 SVG 或移除）。

- **V1.6.0** — 底部導覽列與首頁卡片的 emoji 換成一致 SVG（導覽＝線性圖示、內容＝貼紙磚），全 app 圖示零 emoji。

- **V1.5.0** — 知識卡加 9 個同款 SVG 插圖；全 app 圖示（景點／尋寶／徽章／知識）風格徹底統一。

- **V1.4.0** — 導覽列一致性：行程與探險兩頁加上同款深藍頂部導覽列（回首頁＋直接切換另一 app），三頁導覽統一、可互通。

- **V1.3.0** — 全頁 UI 一致性：行程頁由深灰系統字統一成淺色 navy＋金＋Nunito，與 kids 一致；navy 色號與 theme-color 三頁收斂。

- **V1.2.0** — 尋寶與徽章 emoji 換成同款 SVG（尋寶方形貼紙、徽章金色獎章）；kids 拆成 HTML/CSS/data/logic 四層，邏輯與資料分離、好維護。
- **V1.1.0** — 美感升級：18 個景點圖示由 emoji 換成自製 SVG 地標貼紙（深藍＋金、照真實造型、跨裝置一致），護照／收集冊／相簿全面更新。
- **V1.0.0** — 首次對齊 SELA Starter Kit V1.18.0：英文化為 BigAppleTrip、補齊規範檔、整理 favicon、確立 GitHub Pages PWA。對齊前已迭代完成三個 app、Mii 風格捏臉系統（包頭框臉髮型、深色大眼）、相機蓋章護照、英文字卡發音、尋寶與成就系統。

---

<div align="center">
  <br/>
  <img src="assets/sela.svg" width="64" alt="SELA"/>
  <p><sub>Made by <strong>SELA</strong>, with <strong>Claude</strong></sub></p>
</div>

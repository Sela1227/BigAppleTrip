<div align="center">
  <img src="favicon/app-icon.svg" width="120" alt="BigAppleTrip"/>
  <h1>BigAppleTrip（紐約家庭之旅）</h1>
  <p>2026 年 7 月 · 紐約 8 天親子旅遊的隨身網站</p>
  <p><strong>V1.0.0</strong></p>
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
├── kids.html           小小探險家 App
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

- **V1.0.0** — 首次對齊 SELA Starter Kit V1.18.0：英文化為 BigAppleTrip、補齊規範檔、整理 favicon、確立 GitHub Pages PWA。對齊前已迭代完成三個 app、Mii 風格捏臉系統（包頭框臉髮型、深色大眼）、相機蓋章護照、英文字卡發音、尋寶與成就系統。

---

<div align="center">
  <br/>
  <img src="assets/sela.svg" width="64" alt="SELA"/>
  <p><sub>Made by <strong>SELA</strong>, with <strong>Claude</strong></sub></p>
</div>

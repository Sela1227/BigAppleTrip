# SELA-handoff.md ｜ BigAppleTrip

## 〇、專案速覽

- **專案名稱：** BigAppleTrip（紐約家庭之旅）
- **專案類型：** 純靜態網頁（GitHub Pages，多頁 + PWA）
- **技術棧：** 純 HTML + 原生 JS + CSS，三個自包含單檔 + `sw.js`，零後端、零 build
- **規模：** 4 個檔（index 60KB / itinerary 104KB / kids 216KB / sw.js）+ favicon 套組
- **使用 Kit 版本：** V1.21.0（首次對齊為 V1.18.0 @ V1.0.0；本次 re-align 到 V1.21.0）
- **完成版本：** V1.13.0
- **完成日期：** 2026-06-29

### 自我檢查清單
```
☑ 「完成版本」V1.13.0、三位格式
☑ 跟 CLAUDE.md / README.md 一致
☑ 完成日期 YYYY-MM-DD
```

---

## 一、用 Kit 的整體感受

### 預期外的順利
- 「對齊既有專案 SOP」的四級分類法（必做／建議／順便／不做）很好用，把「該英文化、該補檔」跟「不該動配色、不該拆檔」清楚分開，不會手滑去改既有設計。
- 衝突仲裁開頭區塊讓「為什麼保留中文 UI / 單檔 / navy 配色」一次講清楚，下個 Claude 不會又想「修正」。

### 預期外的卡住
- 純靜態 PWA 的「可安裝性」Kit 沒有專條：坑 #39 講子路徑相對路徑、#13 講 SW 攔 POST，但「**blob manifest／SW 在 GitHub Pages 裝不了、要改 data-URI manifest + 真實 sw.js**」這條沒被涵蓋，是這次實際踩到的。
- 「同頁多個 inline SVG 共用 gradient id 會衝突」也沒被涵蓋 — 任何用重複 inline SVG（頭像／圖示／圖表）的靜態頁都會中。
- **（V1.13.0 re-align 發現）既有專案 re-align 到新 Kit 版本時，要 diff 新增鐵律。** 本次從 Kit V1.18.0 → V1.21.0，新浮現的缺口是 **SPEC §10.6「UI 版本號鐵律」（Kit V1.20.0 新增）**——三頁原本都沒有可見版號，這次補上 `v1.13.0`。建議：claude-init 的對齊 SOP 可加一步「**列出自上次對齊以來 Kit 新增的鐵律、逐條檢查既有專案**」，避免 re-align 漏掉新規。

### 整體評價
- ✓ 對齊 SOP + 配色／命名鐵律對「Kit 出來前的舊專案」非常實用
- ✗ 靜態 PWA 的可安裝性、inline SVG 重複實例兩個通用坑可補

---

## 一.5、新 stack 首遇報告

### A. 完全新 framework / 語言 / 工具
- ☑ **無**（純靜態 HTML / JS / CSS，Kit 的 reference-static-pages 已覆蓋）

### B. 既有 stack 的新 API / 新 module
- 列出：`getUserMedia`（相機蓋章）、`SpeechSynthesis`（英文字卡發音）、inline SVG 程序化生成（捏臉頭像）。皆 GitHub Pages HTTPS 上才完整、`file://` 受限（已記專案坑 #6）。

---

## 二、發現的「跨專案通用坑」（建議進 Kit）

> grep 過 Kit：以下兩條 Kit 現無、且其他靜態／PWA 專案會踩。

### 1. 同頁多個 inline SVG 共用 gradient id 會衝突
- **證據（本專案坑 #3）：** 一頁渲染多個頭像時，第二個之後顏色錯亂、全部套到第一個的漸層。
- **症狀 → 原因 → 做法：** 症狀=重複實例顏色錯亂；原因=相同 `gradient id` 在同份 DOM 只認第一個；做法=每個實例用遞增 `uid` 產唯一 id（`fill="url(#hr${uid})"`）。
- **通用性：** 任何用重複 inline SVG + 漸層的靜態頁（頭像／圖示／圖表 series）都會中，跨技術棧。
- **建議落點：** `cross-project-pitfalls`「Web 部署陷阱／前端」章，新坑。

### 2. GitHub Pages PWA：blob manifest／SW 裝不了，要 data-URI manifest + 真實 sw.js
- **證據（本專案坑 #4）：** 用 `URL.createObjectURL(blob)` 當 manifest / 註冊 SW，Android Chrome 不出現安裝。
- **症狀 → 原因 → 做法：** 症狀=PWA 不可安裝；原因=`blob:` 來源不被當可安裝 manifest／SW；做法=manifest 改 `data:application/manifest+json` URI、SW 必須是真實同源檔（`./sw.js`）、限 HTTPS。
- **跟 #39 的差別：** #39 是「路徑絕對 vs 相對」、本條是「可安裝性的來源機制」，互補不重複。
- **建議落點：** 補強既有 PWA 段（`tech-stack-lessons` PWA 章）或新坑。

---

## 三、設計模式建議（會改變未來決策的）

- **程序化 inline SVG「組件化頭像」模式**：`buildAvatar(cfg)` 用 9 個純函式各回傳一段 SVG 路徑、組裝成完整頭像，部位／配色全參數化（含唯一 id 機制）。任何「使用者可自訂的向量化身／圖示」需求可重用此模式。N=1，先記著，等第二個同型需求再考慮是否升 reference。

---

## 三.5、程式碼優化發現

- 無「舊寫法 → 更優寫法」可回溯升級的條目（本次是對齊與補檔，非重構）。
- 優化體檢結果：對照 `optimizations.md` OPT-1～OPT-4 —— 本專案純靜態前端、無後端／排程／種子資料，OPT-1～3（cron→Timer／master JSON seed／outbox）不適用；OPT-4（生成後自我驗證）是 Claude 工作流非 app 程式碼。**無可升級項。**

---

## 四、Kit 瘦身 / 補強建議

- **補強 #42（主題色 N 處真相清單）：** 目前列 CSS `:root` / JS 填色 / HTML theme-color / manifest theme_color 四處；可補一句「**data-URI manifest 內的 `theme_color` 也算一處**」（自包含 PWA 會多這處）。
- #39 已完整覆蓋本專案子路徑相對路徑需求，無需補。

---

## 五、不要回流的東西（本專案特定）

- ✗ 行程內容（8 天景點、訂位、地圖深連結）、kids 功能（18 景點 SPOTS / 12 尋寶 HUNT / 英文字卡 / 護照成就）
- ✗ Mii 風格捏臉的美術細節（臉型／髮型路徑、深色大眼、包頭框臉）
- ✗ navy `#1B3A6B` + gold `#F4B942` 配色（兒童／活潑類依向性自訂、已驗證）
- ✗ 單檔自包含結構（已驗證可運作；拆檔是本專案下版候選、不是通用建議）
- ✗ 中文 UI 稱呼（紐約家庭之旅 / 小小探險家）

---

## 六、行動清單（給 Kit Claude）

| # | 項目 | 類型 | 建議 |
|---|------|------|------|
| 1 | inline SVG 重複實例 gradient id 衝突 | 新通用坑 | 進 cross-project-pitfalls 前端章 |
| 2 | GitHub Pages PWA blob→data-URI manifest + 真實 sw.js | 新坑 / 補強 PWA | 進 tech-stack-lessons PWA 章 |
| 3 | #42 主題色清單補「data-URI manifest theme_color」 | 補強既有坑 | 一句話補充 |
| 4 | 程序化 SVG 組件化頭像模式 | 設計模式（N=1）| 先記、等第二案 |

> 以上為提案，分類請 SELA 對焦後再決定進不進 Kit。

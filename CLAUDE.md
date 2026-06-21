# CLAUDE.md — BigAppleTrip（紐約家庭之旅）

> **⚠ 給同時拿到 SELA-Starter-Kit 的 Claude：**
> 這是**已對齊 Kit V1.18.0 的成熟專案**，不是新專案（首次對齊於 V1.0.0）。
>
> 衝突仲裁規則：
> 1. **以本專案 CLAUDE.md 為主、Kit 為輔**
> 2. 本專案刻意不對齊 Kit 的部分：
>    - **配色 = navy `#1B3A6B` + gold `#F4B942`**（V1.3.0 統一：index 原 `#15315C`、itinerary 原灰藍都收斂到 `#1B3A6B`；kids/itinerary 為淺色米白底、index 為深藍封面）
>    - **index.html / itinerary.html 維持單檔自包含**；**kids 已於 V1.2.0 拆成 HTML/CSS/JS/data 四層**（單檔達 236KB 後拆分，邏輯與資料分離、好維護）
>    - **UI 內部稱呼保留中文**（紐約家庭之旅 / 小小探險家）；英文程式名 = `BigAppleTrip`（資料夾 + zip 用）
>    - **App logo = 自製 NYC 圖示**（深藍＋金星＋天際線）為主視覺；**SELA logo 為品牌歸屬印記**放 README footer
> 3. **不要為對齊 Kit 而動既有設計** — 已驗證的就是事實標準
> 4. 版號照 Kit（部署版無後綴、備份版 -source）
> 5. **下次完成版本記得評估 SELA-handoff.md**（鐵律 #0，完整見 Kit master CLAUDE.md）

---

## 〇、當前狀態

- **版本：** V1.8.0
- **狀態：** 上線中（GitHub Pages、HTTPS）
- **一句話定位：** 我家 2026 紐約 8 天親子旅遊的隨身網站 — 一個查行程、一個給小孩的探險 App，部署 GitHub Pages 給全家手機用
- **技術棧：** 純 HTML + 原生 JS + CSS，零後端、零 build。index/itinerary 仍單檔；**kids 已拆層**：`kids.html` + `css/kids.css` + `js/kids.data.js`（資料）+ `js/kids.js`（邏輯）+ `sw.js`
- **入口點：** `index.html`（首頁選單）→ `itinerary.html` / `kids.html`（kids 載入順序：`kids.data.js` 必須在 `kids.js` 前）

---

## 一、技術棧決策（為什麼這樣選）

| 選擇 | 替代品 | 選這個的理由 |
|------|--------|------------|
| 純靜態單檔 HTML | React / Vite PWA | 全家手機看、零後端、GitHub Pages branch-serve 直接託管、不需 build（Git Pusher 推 main 即上線）|
| localStorage（包 fallback）| 後端 DB / 雲端同步 | 個人／家族用、各自手機存自己的護照進度、不需跨裝置同步 |
| data-URI manifest + 真實 `./sw.js` | blob manifest / 真實 manifest 檔 | 自包含可攜 + HTTPS 上可安裝（見坑 #4）|
| kids 拆 HTML/CSS/JS/data 四層 | 維持單檔 | V1.2.0：單檔達 236KB、改一處難找；拆後 `kids.js` 純邏輯、`kids.data.js` 純資料（景點/圖示），好維護。index/itinerary 較小仍單檔 |

> branch-serve 部署 = **不可有 build step**（原始碼即上線檔）。維持純靜態正是為了這條路徑。

---

## 二、業務對映表（kids.html 的核心系統）

> 改頭像系統 = 動 `buildAvatar` + `AV_CATS` + 對應 `avXxx()`；改主色 = 動 4 處（見坑 #5）。

| 業務概念 | 程式實作 | 改這個動哪 |
|---------|---------|-----------|
| 每個小孩獨立護照 | `currentKid` + `kk(key)` 命名空間 + `switchKid()` | 所有 storage key 都過 `kk()` 前綴 |
| 捏臉頭像 9 部位 | `buildAvatar(cfg)` 組 9 個 `avXxx()` | `avFace` / `avHairBack` / `avHair` / `avBrow` / `avEyes` / `avNose` / `avMouth` / `avAcc` + `AV_CATS` |
| 6 分頁 + detail/celebrate | `.screen` / `showScreen()` | CSS `.screen.active` + 底部 nav |
| 18 收集景點 / 12 尋寶 | `SPOTS[]` / `HUNT[]` | 對應陣列 |
| 護照成就分享卡 | `buildCardSVG`（組 navy/金卡：頭像+進度+徽章+已收集地標）→ `svgToPng`（SVG→canvas→PNG）→ `shareCard`（navigator.share files / 下載 fallback），按鈕在成就畫面 |
| 全 app SVG 圖示 | `SPOT_ART`/`HUNT_ART`/`BADGE_ART`/`KNOW_ART`（皆 kids.data.js）+ `spotArt`/`huntArt`/`badgeArt`/`knowArt` | 同款 navy／金貼紙、各唯一漸層 id（坑 #3）|
| 存檔讀寫 | `storeGet` / `storeSet`（fallback in-memory `mem{}`）| 所有持久化都過這兩個（坑 #6）|

> itinerary.html 為單純內容頁（各 day 區塊），無上述抽象層。
>
> **兩套圖示語言（別混用）：** ①「貼紙磚」(navy 圓角方塊＋金邊＋米白插圖) 用於**可收集/內容**（景點 SPOT_ART／尋寶 HUNT_ART／徽章 BADGE_ART／知識 KNOW_ART）；②「線性圖示」(`currentColor` stroke) 用於 **UI 導覽**（topbar home／底部分頁）。新增圖示先判斷屬哪類。

---

## 三、關鍵檔案路徑

| 想改什麼 | 動哪 |
|---------|------|
| 首頁選單 / 兩個 app 連結 | `index.html` |
| 行程內容 | `itinerary.html`（各 day 區塊）|
| kids 樣式 | `css/kids.css` |
| kids 邏輯（頭像生成 / 分頁 / 蓋章 / 問答）| `js/kids.js`（`buildAvatar` / `showScreen` / 各 `avXxx`）|
| kids 資料（景點/地標圖示/尋寶/徽章）| `js/kids.data.js`（`SPOTS` / `SPOT_ART` / `HUNT_ART` / `BADGE_ART` / `TRIVIA` / `BOROUGHS` / `BADGES`）|
| kids 結構 / 載入 | `kids.html`（shell，先載 `kids.data.js` 再 `kids.js`）|
| 尋寶 / 知識卡資料 | `js/kids.js`（`HUNT` / `KNOWLEDGE`，較小、留在邏輯層）|
| 主題色 | CSS `:root --navy` + HTML `<meta theme-color>` + JS manifest `theme_color`（多處，坑 #5）|
| kids 底部 6 分頁圖示 | kids.html `.nav-icon`（線性 SVG `currentColor`）+ css `.nav-btn.active .nav-icon`（灰→navy）|
| 首頁兩張卡圖示 | index.html `.emoji`（金／米白 SVG）|
| 頁面導覽列（回首頁／切換 app）| 三頁頂部 `.topbar`（kids 在 kids.html+css；itinerary 在 itinerary.html；index 為中樞無需）|
| itinerary 地圖連結 | 預設 Google Maps；iOS 自動改 Apple Maps（itinerary.html 尾端 JS 偵測 `iPad|iPhone` 改寫 `.map-link`）|
| itinerary 日次跳轉 | `.daynav` chips（錨點 `#day-N`，IntersectionObserver 高亮 active）|
| 離線快取策略 | `sw.js`（network-first）|
| App 圖示 | `favicon/`（套組）+ 各 HTML data-URI apple-touch-icon |

---

## 四、踩過的坑（編號累積，永不重排）

1. **`.screen` flex-shrink 害長頁面子元素壓縮重疊**
   - 症狀：護照／頭像等高內容頁，子元素互相重疊、被截斷
   - 原因：`.screen` 用 `display:flex;flex-direction:column`，子元素被 flex 壓縮
   - 做法：`.screen{flex:1;overflow-y:auto;display:none}` `.screen.active{display:block}`；只有 `#detail` / `#celebrate` 才 `display:flex;flex-direction:column`

2. **手機上 inline SVG 高度塌陷**
   - 症狀：頭像／地圖 SVG 在手機顯示高度 0 或變形
   - 原因：SVG 沒有明確 `viewBox` + CSS 高度，手機算不出內在高度
   - 做法：每個 SVG 設 `viewBox` + 容器給明確高度

3. **多個 inline SVG 漸層 id 衝突**
   - 症狀：同頁第二個之後的頭像顏色錯亂、共用到第一個頭像的漸層
   - 原因：相同 `gradient id` 在同份 DOM 衝突，瀏覽器只認第一個
   - 做法：`buildAvatar` 每次用遞增 `uid` 產唯一 id（`sk${uid}` / `hr${uid}` / `sh${uid}`）
   - 延伸（V1.1.0）：18 個地標貼紙 SVG 同頁渲染（收集冊）也中——每個 SVG 的 `bg` 漸層 id 唯一化成 `bg_<spotid>`

4. **GitHub Pages 用 blob manifest／SW 裝不了 App**
   - 症狀：Android Chrome 不出現安裝、PWA 不成立
   - 原因：`blob:` 的 service worker / manifest 不被瀏覽器當可安裝來源
   - 做法：manifest 改 `data:application/manifest+json` URI + 註冊真實 `./sw.js`（限 HTTPS）；圖示用 data-URI apple-touch-icon

5. **主題色多處要一致（呼應 Kit 坑 #42）**
   - 症狀：改了主色但某處沒跟著變
   - 原因：主色散在 4 處：CSS `:root --navy` / HTML `<meta theme-color>` / JS manifest `theme_color` / favicon manifest
   - 做法：navy 統一 `#1B3A6B`，三頁的 CSS / `<meta theme-color>` / manifest `theme_color` 一起對齊（V1.3.0 已收斂）

6. **`file://` 雙擊下 localStorage／相機／語音失效**
   - 症狀：本地直接開檔，存檔不留、相機掃章／英文發音壞
   - 原因：`file://` 不是安全來源，這些 API 受限
   - 做法：部署 GitHub Pages HTTPS 才完整；localStorage 一律過 `storeGet` / `storeSet`，失敗 fallback in-memory `mem{}`，本地也不報錯

8. **拆檔後 classic script 的載入順序與全域作用域**
   - 症狀：拆 JS 後 `kids.js` 找不到 `SPOTS` / `SPOT_ART`，或 inline `onclick` 點了沒反應
   - 原因：①`kids.data.js` 沒在 `kids.js` 之前載入；②inline `onclick` 只看得到 `window` 上的函式（`function foo(){}` 宣告會上 window，`const fn=()=>{}` 不會）
   - 做法：HTML 內 `kids.data.js` 先、`kids.js` 後；所有被 onclick 呼叫的都用 `function` 宣告（同份全域作用域，跨 classic script 共用 `const`/`let`）

7. **子路徑部署資源 404（呼應 Kit 坑 #39）**
   - 症狀：部署到 `帳號.github.io/repo/` 子路徑時資源抓不到
   - 原因：用了絕對路徑 `/favicon/...`
   - 做法：全部相對路徑（`favicon/...`、`./sw.js`、`./itinerary.html`）

---

10. **深色換淺色重映時，inline style 寫死的色會被漏掉、白字變看不見**
   - 症狀：itinerary 由深轉淺後，「抵達日」標題列白字消失（淺底白字）
   - 原因：那列背景是元素上的 inline `style="background:..."` 覆寫（非 `:root` 變數）；全域 hex 替換把它的深色換成淺色，但列上的白字（`color:#fff`）沒被換
   - 做法：重映後**務必渲染檢查**（`wkhtmltoimage`），揪出 inline style 覆寫的特殊色塊；白字區塊的背景要維持深色，或一併改深字
   - 補充（V1.4.0）：`kids.html` 需 JS 才能渲染，`wkhtmltoimage` 會得到空白；要驗其靜態元件（如導覽列），把該元件的 HTML＋對應 CSS 抽成獨立 test.html 再渲染

11. **跨頁設計 token 不一致（獨立開發的頁面會各走各的）**
   - 症狀：itinerary 用灰藍＋系統字，index/kids 用 navy＋金＋Nunito，三頁長相不一
   - 原因：三頁分別在不同時間做、沒有共用 token 來源
   - 做法：統一 token —— navy `#1B3A6B` / gold `#F4B942` / 字型 Nunito / theme-color `#1B3A6B`；itinerary 因全用 CSS 變數，重映 `:root` 即整頁換色


12. **圖示放在同色背景上會看不見（用 currentColor）**
   - 症狀：金色進度徽章上放金色星星 SVG → 整個消失
   - 原因：icon 色 = 背景色
   - 做法：放在彩色按鈕/徽章上的 icon 用 `fill="currentColor"`／`stroke="currentColor"`，繼承該元素的文字色（深藍徽章文字 → 星星自動深藍）

13. **用 textContent 切換的 emoji 改 SVG 要改成 innerHTML**
   - 症狀：錄音鍵狀態用 `ico.textContent='🔴'` 切換；換 SVG 後 textContent 會把標籤當純文字顯示
   - 做法：改 `ico.innerHTML='<svg…>'`


14. **DOM→圖片分享：用 SVG→canvas→PNG，不需 html2canvas**
   - 作法：把要分享的內容組成自包含 SVG（可內嵌既有頭像/貼紙 SVG，記得唯一漸層 id），`new Blob([svg],{type:'image/svg+xml'})` → `URL.createObjectURL` → `img.onload` 畫到 canvas → `canvas.toBlob` → `navigator.share({files})`（手機）或 `<a download>`（桌機）
   - 注意：SVG 要有明確 `width/height/viewBox`；用 Blob URL 而非 data-URI 避免中文編碼問題；HTTPS 才有 share/canvas（file:// 受限，呼應坑 #6）
   - 內嵌既有 SVG 資產：剝掉外層 `<svg>`、用 `<g transform="translate scale">` 包 inner（各資產 viewBox 0-100，scale=size/100）


## 五、煙霧測試（每次升版必跑，可貼上）

```bash
# 1. kids 兩個 JS 檔可編譯、且合併無宣告衝突（改頭像／資料後必跑）
node -e "const fs=require('fs');const d=fs.readFileSync('js/kids.data.js','utf8'),l=fs.readFileSync('js/kids.js','utf8');require('vm').compileFunction(d);require('vm').compileFunction(l);require('vm').compileFunction(d+l);console.log('kids JS OK')"
# 1b. kids.html 載入順序：data 在 logic 前
grep -n 'js/kids' kids.html   # kids.data.js 應在 kids.js 之前

# 2. 沒有絕對路徑 / file:// 假設（坑 #7）
grep -n 'href=\"/\|src=\"/\|file://' index.html itinerary.html kids.html || echo "OK 無絕對路徑"

# 3. 主題色四處一致（坑 #5）— navy 應一致出現
grep -c '1B3A6B' kids.html   # CSS :root / theme-color / manifest 都應命中

# 4. 三檔都有 sw.js 註冊 + 相對連結
grep -l "register('./sw.js'" index.html itinerary.html kids.html
```

預期：第 1 條印 `kids JS OK`、第 2 條無絕對路徑、其餘有命中。**全綠才打包。**

---

## 六、版本歷程（最近 6-10 版）

| 版本 | 重點 |
|------|------|
| V1.8.0 | 護照成就分享：成就畫面加「分享成就卡給家人」，用現有 SVG 資產（捏臉頭像+徽章+地標貼紙）組一張 navy/金護照成就卡（1080×1350），SVG→canvas→PNG，手機 `navigator.share` 直接分享、桌機下載。零外部套件。 |
| V1.7.0 | ① itinerary：iOS 自動改用 Apple Maps 深連結（Android/桌機維持 Google）+ 8 天日次快速跳轉列（sticky chips、滑動高亮）。② 全頁 UI chrome emoji 統一：分頁標題/tab/按鈕的 emoji 移除、淡色浮水印移除、焦點圖示換 SVG（護照書、慶祝獎盃、進度金星、倒數飛機、相機/發音/編輯/錄音鍵）。內容文字裡的裝飾 emoji（景點故事、farewell ✈、慶祝 🎉）屬內容保留。|
| V1.6.0 | 最後的 emoji 圖示也換 SVG：kids 底部 6 分頁（護照/地圖/玩樂/知識/問答/成就，線性圖示 `currentColor` 灰→navy）+ 首頁兩張卡（旅遊行程/小小探險家，金米白填色）。**全 app 零 emoji 圖示**。釐清兩套圖示語言：內容＝貼紙磚、UI 導覽＝線性圖示。 |
| V1.5.0 | 知識卡（9 張）加同款 SVG 插圖（城市天際線／帆船／披薩／地鐵／面具／帝國大廈／樹／地球／棒球），KNOW_ART 放 kids.data.js。**全 app 圖示風格徹底統一**：景點 18＋尋寶 12＋徽章 6＋知識 9 都是同款 navy／金 SVG。 |
| V1.4.0 | **導覽列一致性**：兩個內容頁加上同款深藍頂部導覽列（回首頁鍵＋跳另一 app 的切換鍵）；解決「進了行程/探險就出不來、只能瀏覽器返回」。kids 原有 `.topbar` 補回首頁＋切換；itinerary 新增 sticky `.topbar`。三頁導覽統一、可互通。 |
| V1.3.0 | **全頁 UI 一致性**：itinerary 由深灰＋系統字＋藍棕，統一成淺色 navy＋金＋Nunito（重映 `:root`），與 kids 一致；index 的 navy 由 `#15315C` 收斂到 `#1B3A6B`；三頁 theme-color 統一 `#1B3A6B`。itinerary 功能（地圖／資訊面板／訂位）原已齊備，本版專注視覺統一。 |
| V1.2.0 | 尋寶 12 + 徽章 6 的 emoji 也換成同款 SVG（尋寶＝方形貼紙、徽章＝金色圓獎章）；**kids 拆檔**：`kids.html`/`css/kids.css`/`js/kids.data.js`/`js/kids.js` 四層，邏輯與資料分離。|
| V1.1.0 | 景點圖示 emoji → 自製 SVG 地標貼紙（18 個、深藍＋金、各唯一漸層 id）；護照格／收集冊／detail 浮水印／相簿全換。跨裝置一致、風格統一。kids.html 增至 ~236KB。 |
| V1.0.0 | **首次對齊 SELA Kit V1.18.0 里程碑**：英文化為 `BigAppleTrip`、補 CLAUDE/README/.gitignore/SELA-handoff、整理 favicon 套組、確立 GitHub Pages PWA（data-URI manifest + `sw.js`）。對齊前已在對話中迭代完成：三個自包含 app（行程 + kids 探險 + 首頁選單）、Mii 風格捏臉系統（9 部位、包頭框臉髮型、深色大眼）、相機蓋章護照、英文字卡發音、尋寶與成就。 |

> 對齊前的迭代是在單一對話內連續完成、未編正式版號；V1.0.0 為對齊 Kit 的重新校準起點（見 Kit SPEC §11.4.5），歷史不回頭重訂。

---

## 七、下版候選工作（按優先序）

1. **kids 加英文／中文切換**，當作旅途英文學習
2. itinerary 加「今日該去哪」依日期自動高亮當天
3. 成就卡可選不同版型/背景
3. 頭像新增更多髮型 / 配件（依小孩回饋）
4. 護照成就分享（截圖 / 匯出一張卡）
5. kids 加英文 / 中文切換，當作旅途英文學習
6. （視需要）itinerary 若繼續長大再考慮同樣拆層

---

## 八、升版必讀（如有）

（V1.0.0 無 — 純靜態、無資料結構遷移問題）

---

## 九、一句話總結

V1.8.0 護照成就分享：成就畫面可一鍵把捏臉頭像＋進度＋徽章＋已收集地標組成一張 navy/金成就卡，手機直接分享、桌機下載（SVG→canvas→PNG，零套件）。下版第一優先是 kids 英文/中文切換。

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

- **版本：** V1.14.1
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
| 捏臉頭像 9 部位 | `buildAvatar(cfg)` 組 9 個 `avXxx()` | `avFace` / `avHairBack` / `avHair` / `avBrow` / `avEyes` / `avNose` / `avMouth` / `avAcc` + `AV_CATS`（V1.10.0：髮型 22／配件 10，新增由 `AV_CATS` 的 `count` 控制顯示）|
| 6 分頁 + detail/celebrate | `.screen` / `showScreen()` | CSS `.screen.active` + 底部 nav |
| 18 收集景點 / 12 尋寶 | `SPOTS[]` / `HUNT[]` | 對應陣列 |
| 知識庫手風琴 | `toggleKnow` 先關其他 `.know-card.open` 再開本項 |
| 景點挑戰（隨機計分）| `buildSpotQuiz(id)` 抽 3 題 `SPOTS.quiz+SPOTQ_EXTRA[id]+SPOTQ_EXTRA2[id]`（每景點 9 題池）+ 2 題 `ENGQ`，`_shuffleOpts` 打亂選項並重映 ans；`renderSpotQuiz`/`answerSpotQuiz`/`nextSpotQuestion`/`showSpotQuizResult`/`retrySpotQuiz` 一次一題計分；過關(≥4/5)→`quizDone.push(id)`（徽章門檻 q>=18 不變）。資料 `ENGQ`/`SPOTQ_EXTRA` 在 kids.data.js |
| 分天尋寶＋拍照 | HUNT 加 `day`（20 個分 8 天）；`huntCapture`→`handleHuntPhoto`（複用 #photo-input，存 `huntPhotos` kk'nyc-huntphoto'）標記完成 |
| 明信片語音 | `toggleVoice(k,mode)`；mode=postcard 時寫入 #post-msg |
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


15. **`let`/`const` 的 TDZ：在宣告行執行前存取會 runtime 報錯（compile 抓不到！）**
   - 症狀：V1.9.0 把 `let huntPhotos={}` 放在尋寶邏輯區（檔案後段），但 `loadKidState()` 在開頭就執行並存取它 → `Cannot access 'huntPhotos' before initialization` → init 中斷 → 護照/地圖/尋寶全空白
   - 關鍵：`compileFunction`（語法檢查）**驗不出** TDZ／執行期錯誤；只有實際執行才會現形
   - 做法：① 所有會被 `loadKidState()`／init 早期存取的狀態變數，一律宣告在檔案**頂層狀態區**（和 stamped/quizDone 同一行）② 交付前**務必跑 DOM harness**（見下方煙霧測試）實際執行 init + 每個 render + 互動函式，不能只靠 compile


16. **`setPointerCapture` 會讓子元素收不到合成 `click`（觸控尤其明顯）**
   - 症狀：互動地圖（`#usmap`）點 pin／行政區沒反應；pan/zoom 正常但「點擊」失效
   - 原因：手勢用 `svg.setPointerCapture(e.pointerId)` 做 pan，pointer 事件被捕獲到 `<svg>`，瀏覽器把之後合成的 `click` 改派到捕獲元素（svg）而非 pin/borough → `.pin-tap`/`.boro-shape` 的 click 監聽永遠不觸發
   - 做法：**不要靠子元素的 click**。在手勢的 `pointerup` 自己做點擊判定（單指、位移<10px、時間<600ms 視為 tap）→ `document.elementFromPoint(x,y)` + `.closest('.pin-tap'/'.boro-shape'/'.us-state')` 直接呼叫對應動作；移除原本收不到的 click 監聽，避免桌機 double-fire。另把 `#usmap` 設 `touch-action:none`（全域 `*{touch-action:manipulation}` 會被它繼承，導致瀏覽器搶走單指手勢）


## 五、煙霧測試

> **鐵律：compile 過 ≠ 能跑。** 每次改 kids.js 後，除了 `compileFunction` 語法檢查，**一定要用 DOM-proxy harness（專案內 `_smoketest.js`）實際 eval 整個 app**，確認 init 不拋例外，且 renderHome/Map/Hunt/Cards/Postcard/Knowledge/Achieve + openDetail/navTo/switchKid 全部能跑。`node _smoketest.js` 應全部顯示 ✓。這次 V1.9.0→V1.9.1 的空白 bug 就是只跑 compile、沒跑 runtime 漏掉的。（每次升版必跑，可貼上）

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
| V1.14.1 | **修正：行程頁固定淺色、不跟隨系統深色模式**（itinerary.html）。回報：系統開深色模式時行程頁仍是黑底——因 itinerary 內有 `@media (prefers-color-scheme: dark)` 會覆蓋成深色（V1.14.0 只改了淺色模式樣子）。做法：移除該 dark 覆蓋區塊（換成防回歸註解）＋ head 加 `<meta name="color-scheme" content="light">`，行程頁恆為淺色。index/kids 本就無此區塊、不受影響。三頁 UI 版號同步 v1.14.1。煙霧 38/38。c+1。|
| V1.14.0 | **行程頁改淺色系 + Apple 視覺重整**（itinerary.html）：SELA 主動要求行程頁改淺色。①深色元件轉淺：置頂 bar 改白色霧面（`--bar-bg` rgba(255,255,255,.80)）、day-head 由深藍漸層改淺灰底＋navy 日期數字、topbar/daynav 文字底色全轉淺（用語意變數 --text/--card-3，深色模式自動適應）。②accent 紀律：active daychip 由橘 `--accent` 改系統藍 `--act`，橘色僅留給「探險」跨頁閘門鈕。③時間軸連接脊：row-i 撐滿高度＋`::before` 垂直線＋圖示白底圓形節點；列改白底（移除整片色帶，色彩交給圖示與 section header，更 deference）；section header 改較淡 tint。三頁 UI 版號同步 v1.14.0。煙霧 38/38。動 5 檔 → b+1。未做：概覽/地鐵卡漸進揭露（留待下次，需動 markup/JS）。|
| V1.13.0 | **首次對齊 SELA Starter Kit V1.21.0**（里程碑）：依坑 #40「鐵律／建議／順便／不做」四級選擇性對齊。🔴 三頁 UI 補上可見版本號 `v1.13.0`（index hero／itinerary・kids topbar-sub，與 zip 版號同步，SPEC §10.6）。新增本檔「Kit 衝突仲裁區塊」明記：配色保留既有 navy（不改 Kit 北歐霧藍/SELA 橘，依 colors.md 既有專案配色鐵律）、品牌用自家 app-icon＋README footer SELA 歸屬（雙軌）。更新 SELA-handoff.md（首次對齊里程碑）。已符合免動：.gitignore 對齊範本、0 console.log、data-* 分離、branch-serve 無 build、zip 命名、三位版號。動 6 檔 → b+1。|
| V1.12.10 | **D5 改 Intrepid 航艦日**（取消水樂園、不去康尼島）（itinerary.html）：使用者決定不去 DreamWorks 水樂園、也不要康尼島。D5 整天改寫為 **Intrepid 海空暨太空博物館**（Pier 86，航母甲板/戰機 F-14·SR-71/太空梭 Enterprise/潛艇 Growler/Exploreum 兒童廳，11:00 約 3hr；查證週四 10:00-17:00、成人$32/童(5-12)$23、4D 模擬器另$11）→ Hell's Kitchen 9 大道泰式午餐（Pure Thai，新菜系）→ Hudson Yards The Shops+Vessel 下午室內躲熱 → 保留 Mercado Little Spain 西班牙晚餐（時間 18:30→18:00、交通註修正）。**連帶清理**：①概覽卡移除 American Dream 交通句；②訂票清單 DreamWorks 票→Intrepid 票；③候補卡移除已否決的 Coney Island 整列；④購物清單因不再去紐澤西（免稅消失）→ 頂部 note 改「紐約加 8.875% 稅」、買鞋地點改紐約店家（DSW/Foot Locker/Nordstrom Rack/Macy's）、**Hopara 2 ✅→➖**（加稅僅小贏~240）、**Stinson ➖→❌**（加稅台灣較便宜）、Clifton ❌ 不變。煙霧 38/38。只動 itinerary.html。|
| V1.12.9 | **機場接送（肯驛 SmartTicket）**（itinerary.html）：①抵達日(7/4) 去程航班最前插入**送機** 15:00 台中西屯→桃園（訂單 **F15321514**、✓已訂 rt-done），info-panel 含訂單/時間/司機資訊/客戶＋**⚠航廈提醒**：票卡誤寫「第1航廈」，但長榮 BR32 在桃園實際 **T2**（已查證 EVA 桃園全部航班、赴美線皆 T2），請告知司機停 T2。②最後一天(D8) 回程 BR31 01:25 起飛列後插入**接機** 05:20 桃園 T2→台中西屯（✓已訂、回國接機、抵達前 6hr 提供司機）。客戶 林*儒 0932***248。兩列皆 rt-done。只動 itinerary.html。|
| V1.12.8 | **購物清單獨立成頁＋AI 建議分類**（itinerary.html）：①daynav 新增「購物」chip（data-day=shop）；購物清單從「清單」頁（list）拆出，獨立為 **shop 頁**（已比價卡改名「已比價·鞋＋家電」=HOKA×3＋Dyson）。②新增「AI 建議·值得買分類」卡：6 類 pill tags（美國價格優勢 Coach/Tory Burch/Kate Spade/Ralph Lauren/Levi's/NB/Brooks、紐約限定 TJ環保袋/洋基帽/Levain/Fishs Eddy、Costco超市、保健品、電子、文創）＋**順路買動線提示**（洋基帽→D1球場、The Met→D2、TJ→72nd分店、精品→Woodbury、零食保健→Costco East Harlem）。③新增「必買 Top 10」可勾選卡。新增 `.shop-cat/.shop-tags` CSS。view 分布：shop=3、list=2。show() 通用邏輯免改。只動 itinerary.html。|
| V1.12.7 | **購物清單加 Dyson Supersonic r 吹風機**（itinerary.html）：卡片改名「購物清單」（不限鞋）。台 NT$14,900 vs 美 $550起（dyson.com Amber silk $549.99、Best Buy $649.99，≈NT$17,500+）→ **❌ 台灣便宜約 2,600+**；且吹風機屬電器**免稅不適用**（紐澤西仍課 6.625%、紐約 8.875%）、美規 **120/127V**（台 110V）、**美國保固不跨台**，三輸建議台灣買。資料：ETtoday(台價)、dyson.com／Best Buy(美價)。只動 itinerary.html。|
| V1.12.6 | **購物清單**（itinerary.html）：清單頁新增「購物清單 · HOKA 鞋」卡（class view data-view="list"，可勾選 cl-item）。三雙鞋台灣 vs 美國官網價＋換算對比（匯率 1USD≈31.8NTD，2026/6/26）＋划算結論：**Hopara 2** 台NT$5,080／美$140（≈4,450）✅美國省~600；**Stinson EVO GTX** 台6,280／美~$190（≈6,040）➖持平；**Clifton 9 GTX** 台5,080／美$165（≈5,250）❌台灣略便宜。關鍵提示：在 **American Dream（Day5）買免營業稅**（紐澤西鞋類免稅、紐約 8.875%）。新增 `.cl-note` 樣式（淺藍 info box）。清單頁現 3 卡（訂票／購物／候補）。資料來源 hoka.com 官網價。只動 itinerary.html。|
| V1.12.5 | **每日即時天氣**（itinerary.html）：每天卡片 day-head 下方加一條天氣列 `.wxbar`（9 天各一，data-date=該日）。底部新增 `<script>` client 端 fetch **Open-Meteo**（免金鑰、CORS OK、座標 40.758/-73.9855、攝氏、timezone America/New_York、start/end 2026-07-04~12），取 weather_code/最高最低溫/降雨機率，WMO 碼→emoji＋中文（晴/多雲/雷雨…），渲染為「⛅ 局部多雲 30°/23° ☔10%」。隨日期逼近自動更新（forecast 16 天內才有值，超出顯示「尚未涵蓋此日」）；fetch 失敗／離線降級顯示「七月紐約約 29–31°、悶熱、午後易雷陣雨」。SW v2 跨源不攔截，離線走降級。node mock 驗證解析正確、煙霧 38/38。只動 itinerary.html。|
| V1.12.4 | **D5 交通改叫車**（itinerary.html）：使用者選 Uber／Lyft。①**修正過時巴士**：原寫「NJ Transit Bus 351」其實 351 是 Coach USA 只在 MetLife 球賽日跑的車；直達快線現為 **#355**（Port Authority 305 號門），且 **7/9 週四 #355 平日僅 10:00、12:30 兩班、回程僅 19:00／21:30**。②去/回程巴士全改 **Uber／Lyft 門到門**（約 30 分、單程估 $40–60）；去程 info-panel 說明為何叫車＋上車點＋#355 省錢備案。③配合昨晚 SUMMIT 晚場，早上改睡飽：09:30 備行李 → 10:00 叫車 → 10:45 抵達接 Mall 11:00 開門。④回程可直接叫到 Hudson Yards 吃晚餐（Mercado Little Spain）；概覽卡 351→叫車／#355、Mercado 交通註同步。只動 itinerary.html。|
| V1.12.3 | **SUMMIT 已訂日落場 → D4 重排為日落壓軸**（itinerary.html）：使用者訂到 **7/8 19:00 日落場、Entry Only**（不含 Ascent）。D4 由「15:00 SUMMIT」改為日落壓軸版：12:30 午餐後 → 14:00 回飯店午後休息（備戰晚場，附 FAO Schwarz 選項）→ 17:00 提早晚餐 Carmine's → 18:30 中央車站穹頂（SUMMIT 入口、往西進 transit hall）→ 19:00 SUMMIT（日落約 20:28，白天→夕陽→夜景一次收）→ 夜景步行回飯店。SUMMIT 標 `rt-done`「✓ 已訂 · 7/8 19:00 · Entry Only」，info-panel 加票券/入口/太陽眼鏡提醒；day-sub 改「中城 → SUMMIT 日落場」。訂票清單 SUMMIT 打勾。已訂項現為 4（自由女神、獅子王、AMNH、洋基）＋ SUMMIT。只動 itinerary.html。|
| V1.12.2 | **行程頁大改版＋「每天斷開」分頁**（itinerary.html 為主、kids.data.js 一處）：①**分頁機制**：行程頁由連續滾動改為點 daynav 只顯示該天（`.view{display:none}/.view.on{display:block}` + 點擊 `show(v)` 切換，取代原 IntersectionObserver 捲動高亮）；新增「清單」頁（訂票清單＋候補景點獨立成頁）；抵達頁含行程概覽＋地鐵卡（data-view="4"）。day-card 9 個各帶 `view`+`data-view`，共 13 個 view。②**內容大改**：D1 洋基重排（時差日、11:00 出發、Monument Park 11:45、13:35 vs 雙城、`rt-done`✓已訂票 420B 11排14-17 Order#1071159453）；D2 大都會改「精華」（丹鐸神廟＋盔甲廳＋頂樓~1.5hr，孩子累可跳；**修正 7/6 週日→週一**）；D3 加 Oculus＋華爾街銅牛（免費彈性段「有體力再走」）；D4 移除 Top of the Rock、改 SUMMIT One Vanderbilt（接中央車站，15:00）；D6 加 RiseNY（飛行劇院上午 10:00）；D7 重塑（村→SoHo＋冰淇淋博物館→中國城 Nom Wah 飲茶午餐→走布魯克林大橋→DUMBO；晚餐墨西哥撞菜系 Gran Electrica→換 Time Out Market）；D8 移除 Summit、改西區輕鬆收尾。③訂票清單：洋基✓、移除 ToR、Summit 改 D4、加 RiseNY/冰淇淋博物館待訂、Met 註精華。④兒童 `edge`(Summit) day:8→4、date 7/12→7/8 同步。煙霧 38/38。|
| V1.12.1 | **修兩個收尾問題**：①**Service Worker 重寫**（`sw.js` v1→v2）：原本 network-first 無逾時，慢網／剛部署 CDN 冷時 fetch 會掛數分鐘才回退快取，導致 `kids.css` 載入慢、靠 flexbox 定位的 `.bottom-nav` 底部導航列「晚好幾分鐘才出現」。改為 **install 預快取 app shell + stale-while-revalidate**（先回快取瞬間渲染、背景更新；跨源請求不攔截），並 skipWaiting+clients.claim。順手移除三頁已無用的 Google Fonts(Nunito) render-blocking 連結（已改系統字）。部署後關閉重開 PWA 一次讓新 SW 生效。②**兒童景點收集連動行程**：行程 Day8 Edge→Summit，但兒童 `SPOTS`/`SPOTQ`/`SPOTQ_EXTRA`/`MAPDATA` pin/`PIN_NAME`/一張字卡仍是 Edge，已全部同步成 Summit（保留內部 id key `edge` 以免動到所有 key，只改顯示內容：name 改「Summit 觀景台」、icon 🔭→🪞、story/facts/quiz 改鏡子房/銀色氣球/Levitation 玻璃地板/中央車站旁、pin 座標東移近 Grand Central）。煙霧 38/38。|
| V1.12.0 | **UI 全面 Apple 化改版**（三頁＋kids.css，純樣式層、不動結構/內容）：①字體改系統字（itinerary/index 用 SF Pro、kids 用 SF Rounded）。②色盤改 Apple 系統色：冷灰底 #F2F2F7＋純白卡＋髮絲分隔線 rgba(60,60,67,.x)＋系統分類色（藍/橙/綠/靛/紅/紫），文字灰階改 #1C1C1E/#636366/#8E8E93。③導覽列毛玻璃（backdrop-filter saturate+blur，stickytop 承載、topbar/daynav 透明）。④卡片去邊框改柔和陰影＋16px 大圓角；膠囊標籤/按鈕（border-radius 980px）；勾選框 20px/6px。⑤新增**深色模式**（@media prefers-color-scheme:dark 覆寫 token）與 prefers-reduced-motion、互動 :active 態。token 化讓全頁連動。zip 檔名空格點格式。|
| V1.11.9 | **AMNH 標記已訂**（itinerary.html）：使用者上傳 AMNH 確認信（Monday July 06 2026）。預訂清單「自然史博物館 AMNH」改 cl-box done＋sub「✓ 已訂 7/6（週一）· tickets.amnh.org」；Day 2 AMNH 活動列加 rtag「✓ 已訂 7/6」。已訂項現為 3（自由女神、獅子王、AMNH）。只動 itinerary.html。|
| V1.11.8 | **Day 8 觀景台 Edge → Summit One Vanderbilt**（itinerary.html，依使用者需求、Summit 對 8 歲較好玩）：因 Summit 在中城 Grand Central、Edge 在西區 Hudson Yards，重排動線為 09:00 Summit →（7 號線直達 34 St-Hudson Yards）→ 11:00 High Line → Little Island → Chelsea Market；day-sub 改「中城 Summit ＋ 西區」、section 改「Summit ＋ West Side 連線」；詳細資訊放鏡面/氣球房/室內恆溫/7 號線轉乘/怕高可跳 Levitation。預訂清單 Edge→Summit（summitov.com）。候補卡反向：Summit 移出、Edge 改列為候補。只動 itinerary.html。|
| V1.11.7 | **Day 3 登船時間校正＋查核日期＋補預訂票**（itinerary.html）：①官方基座票 Boarding Time **8:30**（非先到先上）——出發改 07:00、登船 08:30，詳細資訊註明 8:30 為準。②**修正系統性星期錯誤**：7/5 起每天都標慢一天，已對正（7/7 實為**週二** TUE，非 MON）。③9/11 那條原註「週二公休、7/7 週一」錯誤——改為「7/7 是週二，9/11 博物館 2026 多數週二有開、訂票時確認 7/7 有時段；戶外紀念池免費」。④預訂清單新增 **9/11 博物館 / 自然史 AMNH / 大都會 Met** 三個 timed 票（皆建議線上先訂）。⑤頁尾年份 2025→2026。只動 itinerary.html。|
| V1.11.6 | **Day 3 自由女神更新為官方基座票**（itinerary.html）：使用者改買官方 Statue City Cruises Pedestal Reserve、7/7 9:00 場、確認碼 #79051393（大人2+兒童2）。出發 07:00→**07:45**、上島 08:30→**09:00（含基座）**、Ellis 10:15→**11:00**；詳細資訊改為官方票券/確認碼/中文導覽/取票（護照+信用卡）/基座二次安檢提醒；預訂清單該條打勾。只動 itinerary.html。|
| V1.11.5 | **Day 3 自由女神時間校正**（itinerary.html）：配合實際訂的 GetYourGuide 7/7 上午 8:00 場（8:00 為進安檢時間、第一班船約 8:30）。飯店出發 08:00→**07:00**、渡輪 09:00→**08:30**、Ellis Island 11:00→**10:15**；詳細資訊改為票券說明＋早起/帶水帽零食/控制 3 小時提醒；預訂清單票券備註改為「7/7 8:00 場 · GetYourGuide（先預訂後付款）」。只動 itinerary.html。|
| V1.11.4 | **行程頁加「候補景點（可替換）」卡**（itinerary.html，預訂清單後、footer 前）：方便取捨替換，含 Woodbury Common Premium Outlets（名牌 outlet，註明 1651 Broadway 上車/先上網買票/可換 Day 4 白天）＋ Summit One Vanderbilt／Intrepid 無畏號／Coney Island／FAO Schwarz+LEGO／中央公園動物園，每項標注區域・所需時間・可換哪天。沿用既有 info-card 樣式與 i-bag/i-sky/i-plane/i-swim/i-shop/i-park 圖示。只動 itinerary.html。|
| V1.11.3 | **整合 OMNY 交通卡資訊到主線**（itinerary.html）：此內容原先在另一對話誤做在舊分支 V1.9.3，本版併入最新主線。①概覽卡交通行更新：移除已停售的「7-Day Unlimited MetroCard」→「市區交通 · 地鐵／公車用 OMNY 嗶卡，每趟 $3」。②在「抵達」區塊前新增「地鐵這樣搭 · 2 大 2 小」info-card（4 行：OMNY 嗶卡用法/小孩 112cm 票/每人各用一支付方式嗶滿 12 趟該週免費/2 小時轉乘+AirTrain 另計等小提醒）。只動 itinerary.html，沿用既有卡片樣式與 #i-train/#i-info/#i-star/#i-check 圖示。|
| V1.11.2 | **頭像優化**（依 SELA 回饋）：①重畫捲髮 `avHair` 索引 20（原本一坨凹凸怪塊→圓潤捲球帽：基底髮帽+沿輪廓 9 顆捲球）。②**降低娃娃感**：`buildAvatar` 固定腮紅由 `#F5A0B0 opacity .42 rx6` 調淡為 `#F0A8B2 opacity .2 rx5`。③`AV_PRESETS` 10 組快速造型全換成較有型、不幼的組合（太陽眼鏡/耳機/毛帽/龐克頭/俐落短髮/酷眼神/大沉穩眼），移除星星眼+大笑嘴+皇冠+花朵等過於孩子氣的組合。cairosvg 視覺驗證、煙霧 38/38。|
| V1.11.1 | **內容擴充**：①景點挑戰題目「高度相關擴展」——每景點再 +4 題緊扣該景點故事（新 `SPOTQ_EXTRA2`），題池 5→**9 題/景點**（原 quiz 2 + EXTRA 3 + EXTRA2 4），抽 3 更隨機更相關；`buildSpotQuiz` 的 own 池納入 EXTRA2。②英文字卡 +16 張紐約旅遊主題（Skyscraper/Museum/Bridge/Ferry/Statue/Broadway/Souvenir/Bagel/Pretzel/Hot dog/Skyline…），FLASHCARDS→40。煙霧 38/38。|
| V1.11.0 | **三項**：①**修 bug**：互動地圖點 pin/行政區沒反應——`setPointerCapture` 讓合成 `click` 改派到 `<svg>`，子元素收不到（坑 #16）；改在手勢 `pointerup` 自做點擊判定（位移<10px+時間<600ms→`elementFromPoint`+`closest` 觸發 openDetail/showBoro/zoomPreset），`#usmap` 設 `touch-action:none`。②**英文單字題庫** `ENGQ`（28 題）+ 字卡 16→25。③**景點挑戰改隨機計分**：每次抽 5 題（3 該景點知識 + 2 英文單字，選項順序也打亂）一次一題、計分、像問答，過關(≥4/5)記入 `quizDone`；資料新增 `SPOTQ_EXTRA`（每景點 +3 題，依事實撰寫）。煙霧測試 36/36 + 地圖點擊事件模擬 5/5。|
| V1.10.0 | **頭像新增髮型／配件**：髮型 16→22（長直髮〔含後層垂落〕、丸子頭、雙丸子、低雙馬尾、捲髮、短髮）；配件 6→10（金王冠、紅耳罩耳機、花朵髮夾、藍毛帽）。新增由 `AV_CATS` 的 `count` 自動帶入編輯器選項；front 層加進 `avHair`、長直髮/低雙馬尾的後層加進 `avHairBack`、配件加進 `avAcc`。另加 2 組預設造型（丸子頭+王冠、短髮+耳機）。全用既有色票、未引入新漸層 id（坑 #3）。煙霧測試 27/27 全綠、cairosvg montage 視覺確認。|
| V1.9.1 | **修 bug**：V1.9.0 的 `huntPhotos` 用 `let` 宣告在尋寶區，被開頭 `loadKidState` 早期存取 → TDZ 例外 → init 中斷、多畫面空白。宣告移到頂層狀態區即修復。新增 `_smoketest.js`（DOM harness）為必跑煙霧測試（坑 #15）。|
| V1.9.0 | 5 項：①知識庫手風琴（開一關其他）②景點標題列縮小（det-hdr/title/tagline 緊縮）③景點知識 3→5、挑戰 1→2 題（quiz 改陣列、多題渲染、per-題作答記錄）並清掉本區 emoji（story 開頭圖示去除、facts 改統一金點、quiz 結果 ✅❌🌟 改純文字）④明信片支援語音輸入 ⑤尋寶改 20 個分 8 天、拍照完成任務（新增 8 個尋寶 SVG）。|
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

1. **kids 加英文／中文切換**，當作旅途英文學習（第一優先；ENGQ 題庫已備）
2. itinerary 加「今日該去哪」依日期自動高亮當天
3. 知識卡內文 emoji 也可改 SVG/移除（目前知識庫內文仍有裝飾 emoji）
4. 成就分享卡不同版型／背景（延伸 V1.8.0）
5. 景點挑戰：可考慮加「最佳成績」記錄、或英文題加發音
6. （視需要）itinerary 若繼續長大再考慮同樣拆層

> 已完成並移出候選：頭像髮型／配件（V1.10.0）、互動地圖點擊修復＋英文題庫＋景點挑戰計分（V1.11.0）、護照成就分享卡（V1.8.0）。

---

## 八、升版必讀（如有）

（V1.0.0 無 — 純靜態、無資料結構遷移問題）

---

## Kit 對齊與衝突仲裁區塊（首次對齊 SELA Starter Kit V1.21.0）

> 本專案為 Kit 出現前就成熟的既有專案，依 `cross-project-pitfalls.md` 坑 #40「鐵律／建議／順便／不做」四級選擇性對齊。此區塊記錄**刻意保留、不對齊回 Kit 預設**的項目與理由，避免下次又想改回去。

**對齊版本：** V1.13.0（2026-06，首次對齊 Kit V1.21.0）

**✗ 不做（刻意保留，有理由）**
- **配色：index／kids 保留既有 navy/gold**，不改為 Kit 預設北歐霧藍 `#5A7A8B` 或 SELA 橘。依 `colors.md`「既有專案配色鐵律」不主動改色。
- **（V1.14.0）行程頁 itinerary 改為淺色 iOS 系，屬 SELA 主動要求** —— 即 colors.md 鐵律「除非 SELA 主動說要改」例外觸發，非 Claude 主動改色。主題：白色霧面置頂 bar、淺灰 day-head、白底時間軸列、單一系統藍 accent（橘僅留給「探險」閘門）。
- **品牌用自家 app-icon/favicon**（BigAppleTrip 自有識別、業務 app），不換成 SELA logo 主視覺。SELA 品牌歸屬已置於 README footer（雙軌系統，符合 `logo/CLAUDE.md` §7.2）。

**🔴 已對齊（鐵律）**
- UI 可見版本號：三頁 app 名稱旁 `v1.13.0`，與 zip 版號同步（本版補上，SPEC §10.6）
- zip 命名 `BigAppleTrip V<a>.<b>.<c>.zip`（空格＋三位版號）
- `.gitignore` 以 Kit `gitignore-template` 為基礎 + 專案特定段
- `CLAUDE.md` / `README.md` / `SELA-handoff.md` 齊備

**✓ 本來就符合（免動）**
- 0 個 `console.log`（release 無 debug）
- data-* 屬性分離資料與顯示（`data-view` / `data-day` / `data-date`）
- branch-serve 純靜態、無 build step（原始碼即上線檔，符合範本 §7 V1.15.0 注意事項）
- 三位版本號規則、版本歷程完整、踩坑章節保留

## 九、一句話總結

V1.12.0 把全 app UI 以 Apple 設計語彙重做（系統字體、Apple 色盤、毛玻璃導覽、柔和陰影大圓角、膠囊元件、深色模式），純樣式層、不動內容。承接 V1.11.9 AMNH 已訂等。


## 景點同步規則（行程↔兒童收集，務必遵守）

當 `itinerary.html` 更換/新增/移除任一景點時，**兒童「景點收集」必須同步檢查更新**，否則兩邊會脫鉤（如 V1.12.1 修的 Edge→Summit）。需同步的位置：
1. `js/kids.data.js` → `SPOTS` 該景點物件：`name`/`icon`/`color`/`short`/`story`/`facts`/`quiz`。
2. `js/kids.data.js` → `SPOTQ` 與 `SPOTQ_EXTRA?` 中該景點的問答池（key 同景點 id）。
3. `js/kids.data.js` → `SPOT_ART` 該景點徽章 SVG（若造型需貼合新景點才改；泛用造型可留）。
4. `js/kids.js` → `MAPDATA.pins` 該景點座標（換地點要移到正確位置）。
5. `js/kids.js` → `PIN_NAME` 該景點顯示名。
6. `js/kids.js` 內任何字卡/敘述硬編到該景點名稱處（grep 景點舊名確認）。
**降風險作法**：保留內部 id key（如 `edge`）不變，只改人可見內容，避免同步動到 SPOT_ART/SPOTQ/MAPDATA/PIN_NAME 的所有 key。改完跑 `node _smoketest.js`（應 38/38）。

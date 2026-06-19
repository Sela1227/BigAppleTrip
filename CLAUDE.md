# CLAUDE.md — BigAppleTrip（紐約家庭之旅）

> **⚠ 給同時拿到 SELA-Starter-Kit 的 Claude：**
> 這是**已對齊 Kit V1.18.0 的成熟專案**，不是新專案（首次對齊於 V1.0.0）。
>
> 衝突仲裁規則：
> 1. **以本專案 CLAUDE.md 為主、Kit 為輔**
> 2. 本專案刻意不對齊 Kit 的部分：
>    - **配色保留現有 navy `#1B3A6B` / `#15315C` + gold `#F4B942`**（兒童／活潑類「依向性自訂」、已迭代驗證，不為對齊改色）
>    - **kids.html / itinerary.html 維持單檔自包含**（已驗證可運作；拆檔列為下版候選、非對齊強制）
>    - **UI 內部稱呼保留中文**（紐約家庭之旅 / 小小探險家）；英文程式名 = `BigAppleTrip`（資料夾 + zip 用）
>    - **App logo = 自製 NYC 圖示**（深藍＋金星＋天際線）為主視覺；**SELA logo 為品牌歸屬印記**放 README footer
> 3. **不要為對齊 Kit 而動既有設計** — 已驗證的就是事實標準
> 4. 版號照 Kit（部署版無後綴、備份版 -source）
> 5. **下次完成版本記得評估 SELA-handoff.md**（鐵律 #0，完整見 Kit master CLAUDE.md）

---

## 〇、當前狀態

- **版本：** V1.0.0
- **狀態：** 上線中（GitHub Pages、HTTPS）
- **一句話定位：** 我家 2026 紐約 8 天親子旅遊的隨身網站 — 一個查行程、一個給小孩的探險 App，部署 GitHub Pages 給全家手機用
- **技術棧：** 純 HTML + 原生 JS + CSS（三個自包含單檔 + sw.js），零後端、零 build
- **入口點：** `index.html`（首頁選單）→ `itinerary.html` / `kids.html`

---

## 一、技術棧決策（為什麼這樣選）

| 選擇 | 替代品 | 選這個的理由 |
|------|--------|------------|
| 純靜態單檔 HTML | React / Vite PWA | 全家手機看、零後端、GitHub Pages branch-serve 直接託管、不需 build（Git Pusher 推 main 即上線）|
| localStorage（包 fallback）| 後端 DB / 雲端同步 | 個人／家族用、各自手機存自己的護照進度、不需跨裝置同步 |
| data-URI manifest + 真實 `./sw.js` | blob manifest / 真實 manifest 檔 | 自包含可攜 + HTTPS 上可安裝（見坑 #4）|

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
| 存檔讀寫 | `storeGet` / `storeSet`（fallback in-memory `mem{}`）| 所有持久化都過這兩個（坑 #6）|

> itinerary.html 為單純內容頁（各 day 區塊），無上述抽象層。

---

## 三、關鍵檔案路徑

| 想改什麼 | 動哪 |
|---------|------|
| 首頁選單 / 兩個 app 連結 | `index.html` |
| 行程內容 | `itinerary.html`（各 day 區塊）|
| kids 功能 / 頭像 / 分頁 | `kids.html`（`buildAvatar` / `SPOTS` / `HUNT` / `showScreen`）|
| 主題色 | 三檔的 CSS `:root --navy` + HTML `<meta theme-color>` + JS manifest `theme_color`（4 處，坑 #5）|
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

4. **GitHub Pages 用 blob manifest／SW 裝不了 App**
   - 症狀：Android Chrome 不出現安裝、PWA 不成立
   - 原因：`blob:` 的 service worker / manifest 不被瀏覽器當可安裝來源
   - 做法：manifest 改 `data:application/manifest+json` URI + 註冊真實 `./sw.js`（限 HTTPS）；圖示用 data-URI apple-touch-icon

5. **主題色多處要一致（呼應 Kit 坑 #42）**
   - 症狀：改了主色但某處沒跟著變
   - 原因：主色散在 4 處：CSS `:root --navy` / HTML `<meta theme-color>` / JS manifest `theme_color` / favicon manifest
   - 做法：navy `#1B3A6B`（kids）/ `#15315C`（首頁）四處一起改

6. **`file://` 雙擊下 localStorage／相機／語音失效**
   - 症狀：本地直接開檔，存檔不留、相機掃章／英文發音壞
   - 原因：`file://` 不是安全來源，這些 API 受限
   - 做法：部署 GitHub Pages HTTPS 才完整；localStorage 一律過 `storeGet` / `storeSet`，失敗 fallback in-memory `mem{}`，本地也不報錯

7. **子路徑部署資源 404（呼應 Kit 坑 #39）**
   - 症狀：部署到 `帳號.github.io/repo/` 子路徑時資源抓不到
   - 原因：用了絕對路徑 `/favicon/...`
   - 做法：全部相對路徑（`favicon/...`、`./sw.js`、`./itinerary.html`）

---

## 五、煙霧測試（每次升版必跑，可貼上）

```bash
# 1. kids.html 的 JS 可編譯（改頭像／功能後必跑）
node -e "const h=require('fs').readFileSync('kids.html','utf8');require('vm').compileFunction(h.match(/<script>([\s\S]*)<\/script>/)[1]);console.log('kids JS OK')"

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
| V1.0.0 | **首次對齊 SELA Kit V1.18.0 里程碑**：英文化為 `BigAppleTrip`、補 CLAUDE/README/.gitignore/SELA-handoff、整理 favicon 套組、確立 GitHub Pages PWA（data-URI manifest + `sw.js`）。對齊前已在對話中迭代完成：三個自包含 app（行程 + kids 探險 + 首頁選單）、Mii 風格捏臉系統（9 部位、包頭框臉髮型、深色大眼）、相機蓋章護照、英文字卡發音、尋寶與成就。 |

> 對齊前的迭代是在單一對話內連續完成、未編正式版號；V1.0.0 為對齊 Kit 的重新校準起點（見 Kit SPEC §11.4.5），歷史不回頭重訂。

---

## 七、下版候選工作（按優先序）

1. **評估要不要把 `kids.html`（單檔 216KB）拆成 `data/` `css/` `js/`** — 第 1 名理由：單檔過大是目前唯一明顯技術債，改一處要在巨檔裡找（對應靜態網頁示範的反面教材「健保藥物 22,800 行單檔」）。**取捨：** 拆檔會失去「一個檔可攜」優點、且現狀已驗證可運作；先評估值不值得，不是非拆不可。
2. 行程頁補強：景點離線地圖 / 導航深連結 / 訂位資訊一鍵開
3. 頭像新增更多髮型 / 配件（依小孩回饋）
4. 護照成就分享（截圖 / 匯出一張卡）
5. kids 加英文 / 中文切換，當作旅途英文學習
6. 行程倒數與「今日該去哪」首頁小卡

---

## 八、升版必讀（如有）

（V1.0.0 無 — 純靜態、無資料結構遷移問題）

---

## 九、一句話總結

V1.0.0 首次對齊 SELA Kit：專案英文化為 `BigAppleTrip`、補齊 Kit 規範檔（CLAUDE / README / .gitignore / SELA-handoff）、整理 favicon，GitHub Pages 可安裝 PWA 就緒；配色、單檔結構、UI 中文稱呼依「不為對齊改既有設計」保留。下版第一優先是評估要不要把 216KB 的 `kids.html` 拆檔（單檔過大是唯一明顯技術債）。

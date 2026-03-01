# 麥當勞台灣點餐引擎（可維護版本）

這個版本已從單一大檔改為資料驅動架構，重點是：

- 每月更新資料不需要改演算法
- 價格計算與畫面分離
- 可依預算、熱量、點餐目標快速推薦

## 目前架構

```text
mcdonalds-tw-deals/
├── data/
│   ├── manifest.json
│   ├── menu/2026-03.json
│   ├── nutrition/2026-03.json
│   └── promos/2026-03.json
├── src/
│   ├── engine/
│   │   ├── priceEngine.js
│   │   └── recommendEngine.js
│   ├── services/
│   │   └── dataService.js
│   ├── ui/
│   │   └── render.js
│   └── main.js
├── scripts/
│   └── validate-data.js
├── index.html
├── styles.css
└── package.json
```

## 核心設計

### 1) 資料分層

- `data/menu/*.json`: 品項、價格、時段、狀態（verified/estimated/unverified）
- `data/nutrition/*.json`: 熱量資料
- `data/promos/*.json`: 促銷規則（不是純文案）
- `data/manifest.json`: 指向目前啟用版本

### 2) 引擎分層

- `priceEngine.js`: 只負責計算 5 種策略
  - 方案A：全部單點
  - 方案B：儘量用套餐
  - 方案C：甜心卡
  - 方案D：1+1=50 + 其餘套餐
  - 方案E：綜合最佳（取策略最低）
- `recommendEngine.js`: 根據目標（預算/熱量/平衡）輸出 Top 3 建議

### 3) UI 分層

- `render.js` 只負責 HTML 字串渲染
- `main.js` 只做狀態與事件

## 如何啟動

```bash
npm run start
# http://localhost:8080
```

## 資料驗證

```bash
npm run validate:data
```

驗證內容包含：

- `item.id` 重複檢查
- `verified/estimated` 品項是否有可計算價格
- nutrition 對應完整性
- 促銷規則日期與型別

## 每月更新流程

1. 複製上月資料檔成新版本（例如 `2026-04.json`）。
2. 更新價格、供應狀態、促銷日期。
3. 修改 `data/manifest.json` 指向新版本。
4. 執行 `npm run validate:data`。
5. 開啟網站抽查：
   - 單點/套餐/甜心卡/1+1 是否可算
   - 預算與熱量篩選是否仍有結果

## 資料狀態約定

- `verified`: 可直接用於計算
- `estimated`: 可計算但需在 UI 明確標示
- `unverified`: 不進入計算，只顯示待補

## 備註

- 本資料為整理用途，實際價格與活動以台灣麥當勞官方公告與 App 為準。

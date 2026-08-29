# HIS 案號系統資料庫設計

目前資料庫只收畫面上已呈現的欄位，分成兩張表：

- `research_projects`：計畫主檔，一筆計畫一筆資料。
- `project_budget_items`：下方經費表明細，一筆計畫可有多列費用。

另外提供三個中文欄位名稱的 View，方便在 Neon 或未來校內資料庫直接查看：

- `計畫主檔`：對應 `research_projects`，欄位顯示為中文。
- `經費明細`：對應 `project_budget_items`，並帶出計劃編號。
- `計畫經費明細`：主檔與經費明細合併檢視。

建立資料表時先執行 `database/schema.sql`，再執行 `database/views.sql`。

## 測試環境

測試階段可用 Neon 或 Supabase 的免費 PostgreSQL。把連線字串放在本機 `.env.local` 與 Vercel Environment Variables：

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DB?sslmode=require
```

`.env.local` 不要提交到 GitHub；GitHub 只提交 `.env.example`。

## 未來搬到學校伺服器

學校伺服器安裝 PostgreSQL 後，匯入 `database/schema.sql` 即可建立同樣資料表。程式端只需要把 `DATABASE_URL` 改成校內 PostgreSQL 連線字串。

## 欄位範圍

主檔欄位對應目前首頁畫面：

- 計劃編號、第二段案號
- 機構別、院區
- 主持人證號、主持人姓名
- 部門代號、部門名稱
- 國科會編號、主持人郵件
- 總計畫編號、須繳藥管費
- 計劃合作別、計劃名稱
- 研究類別、開始日期、結束日期、展延日期
- 統一編號、計劃年期
- IACUC 編號、IRB 編號
- 基本設定費、人員職類
- 撤銷註記、撤銷生效日
- 院外計畫類別、傑出人員別
- 儲存條件費
- 國科會/國衛院延伸件計畫
- 科研計畫編號、試驗起始費
- 結案註記、管制相對補助

經費明細欄位對應下方表格：

- 費用代碼
- 費用別
- 預算總額
- 院內補助金額
- 院外補助金額
- 院內核銷金額
- 院外核銷金額
- 預算餘額

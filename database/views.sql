CREATE OR REPLACE VIEW "計畫主檔" AS
SELECT
  project_no AS "計劃編號",
  project_no_suffix AS "計劃編號後段",
  institution_code AS "機構別代碼",
  institution_name AS "機構別",
  campus_code AS "院區",
  principal_name AS "主持人姓名",
  principal_id AS "主持人證號",
  department_code AS "部門代號",
  department_name AS "部門名稱",
  national_science_council_no AS "國科會編號",
  principal_email AS "主持人郵件",
  parent_project_no AS "總計畫編號",
  management_fee_required AS "須繳藥管費",
  cooperation_type AS "計劃合作別",
  project_name AS "計劃名稱",
  research_category AS "研究類別",
  start_date AS "開始日期",
  end_date AS "結束日期",
  extension_date AS "展延日期",
  tax_id AS "統一編號",
  project_term AS "計劃年期",
  iacuc_no AS "IACUC編號",
  base_setup_fee AS "基本設定費",
  staff_type AS "人員職類",
  revoke_flag AS "撤銷註記",
  revoke_effective_date AS "撤銷生效日",
  external_project_type AS "院外計畫類別",
  outstanding_staff_type AS "傑出人員別",
  irb_no AS "IRB編號",
  storage_condition_fee AS "儲存條件費",
  extended_nstc_or_nhri_project AS "國科會國衛院延伸件計畫",
  scientific_research_project_no AS "科研計畫編號",
  trial_start_fee AS "試驗起始費",
  close_flag AS "結案註記",
  controlled_relative_subsidy AS "管制相對補助",
  created_at AS "建立時間",
  updated_at AS "更新時間"
FROM research_projects;

CREATE OR REPLACE VIEW "經費明細" AS
SELECT
  p.project_no AS "計劃編號",
  b.sort_order AS "排序",
  b.expense_code AS "費用代碼",
  b.expense_name AS "費用別",
  b.budget_total AS "預算總額",
  b.internal_subsidy_amount AS "院內補助金額",
  b.external_subsidy_amount AS "院外補助金額",
  b.internal_writeoff_amount AS "院內核銷金額",
  b.external_writeoff_amount AS "院外核銷金額",
  b.budget_balance AS "預算餘額",
  b.created_at AS "建立時間",
  b.updated_at AS "更新時間"
FROM project_budget_items b
JOIN research_projects p ON p.id = b.project_id;

CREATE OR REPLACE VIEW "計畫經費明細" AS
SELECT
  p.project_no AS "計劃編號",
  p.project_name AS "計劃名稱",
  p.institution_code AS "機構別代碼",
  p.institution_name AS "機構別",
  p.campus_code AS "院區",
  p.principal_name AS "主持人姓名",
  p.principal_id AS "主持人證號",
  p.research_category AS "研究類別",
  p.start_date AS "開始日期",
  p.end_date AS "結束日期",
  b.sort_order AS "排序",
  b.expense_code AS "費用代碼",
  b.expense_name AS "費用別",
  b.budget_total AS "預算總額",
  b.internal_subsidy_amount AS "院內補助金額",
  b.external_subsidy_amount AS "院外補助金額",
  b.internal_writeoff_amount AS "院內核銷金額",
  b.external_writeoff_amount AS "院外核銷金額",
  b.budget_balance AS "預算餘額"
FROM research_projects p
LEFT JOIN project_budget_items b ON b.project_id = p.id;

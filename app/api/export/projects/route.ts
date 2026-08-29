import { csvResponse, db, toCsv } from '../csv';

export async function GET() {
  const sql = db();
  const rows = await sql`
    SELECT
      project_no AS "計劃編號",
      project_no_suffix AS "計劃編號後段",
      institution_code AS "機構別代碼",
      institution_name AS "機構別",
      campus_code AS "院區",
      principal_id AS "主持人證號",
      principal_name AS "主持人姓名",
      department_code AS "部門代號",
      department_name AS "部門名稱",
      national_science_council_no AS "國科會編號",
      principal_email AS "主持人郵件",
      parent_project_no AS "總計畫編號",
      management_fee_required AS "須繳藥管費",
      cooperation_type AS "計畫合作別",
      project_name AS "計畫名稱",
      research_category AS "研究類別",
      start_date AS "開始日期",
      end_date AS "結束日期",
      extension_date AS "展延日期",
      tax_id AS "統一編號",
      project_term AS "計畫年期",
      iacuc_no AS "IACUC編號",
      base_setup_fee AS "基本設定費",
      staff_type AS "人員職類",
      revoke_flag AS "撤銷註記",
      revoke_effective_date AS "撤銷生效日",
      external_project_type AS "院外計畫類別",
      outstanding_staff_type AS "傑出人員別",
      irb_no AS "IRB編號",
      storage_condition_fee AS "儲存條件費",
      extended_nstc_or_nhri_project AS "國科會/國衛院延伸件計畫",
      scientific_research_project_no AS "科研計畫編號",
      trial_start_fee AS "試驗起始費",
      close_flag AS "結案註記",
      created_at AS "建立時間",
      updated_at AS "更新時間"
    FROM research_projects
    ORDER BY project_no ASC
  `;

  return csvResponse(toCsv(rows), '計畫主檔.csv');
}

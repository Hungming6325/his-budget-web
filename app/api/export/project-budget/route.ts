import { csvResponse, db, toCsv } from '../csv';

export async function GET() {
  const sql = db();
  const rows = await sql`
    SELECT
      p.project_no AS "計劃編號",
      p.project_no_suffix AS "計劃編號後段",
      p.project_name AS "計畫名稱",
      p.institution_code AS "機構別代碼",
      p.institution_name AS "機構別",
      p.campus_code AS "院區",
      p.principal_id AS "主持人證號",
      p.principal_name AS "主持人姓名",
      p.department_code AS "部門代號",
      p.department_name AS "部門名稱",
      p.research_category AS "研究類別",
      p.start_date AS "開始日期",
      p.end_date AS "結束日期",
      p.project_term AS "計畫年期",
      b.sort_order AS "費用列序",
      b.expense_code AS "費用別代碼",
      b.expense_name AS "費用別",
      b.budget_total AS "預算總額",
      b.internal_subsidy_amount AS "院內補助金額",
      b.external_subsidy_amount AS "院外補助金額",
      b.internal_writeoff_amount AS "院內核銷金額",
      b.external_writeoff_amount AS "院外核銷金額",
      b.budget_balance AS "預算餘額",
      p.close_flag AS "結案註記",
      p.updated_at AS "計畫更新時間"
    FROM research_projects p
    LEFT JOIN project_budget_items b ON b.project_id = p.id
    ORDER BY p.project_no ASC, b.sort_order ASC
  `;

  return csvResponse(toCsv(rows), '計畫經費明細.csv');
}

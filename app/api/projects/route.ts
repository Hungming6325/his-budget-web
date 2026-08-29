import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

type ProjectFormPayload = {
  projectNo?: string;
  externalNo?: string;
  institutionCode?: string;
  institutionName?: string;
  campus?: string;
  principalId?: string;
  principalName?: string;
  departmentCode?: string;
  departmentName?: string;
  nsCNo?: string;
  email?: string;
  parentProjectNo?: string;
  managementFeeRequired?: boolean;
  cooperationType?: string;
  projectName?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  extensionDate?: string;
  taxId?: string;
  iacucNo?: string;
  baseSetupFee?: string;
  staffType?: string;
  revokeFlag?: string;
  revokeDate?: string;
  externalProjectType?: string;
  outstandingStaffType?: string;
  projectTerm?: string;
  irbNo?: string;
  storageConditionFee?: string;
  extendedProject?: boolean;
  scienceProjectNo?: string;
  trialStartFee?: string;
  closed?: boolean;
  lockedNotice?: string;
};

type BudgetRowPayload = {
  code?: string;
  name?: string;
  budget?: number;
  internalSubsidy?: number;
  externalSubsidy?: number;
  internalSpent?: number;
  externalSpent?: number;
};

function db() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured');
  }
  return neon(process.env.DATABASE_URL);
}

function text(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function amount(value: unknown) {
  return Number.isFinite(Number(value)) ? Number(value) : 0;
}

export async function GET(request: Request) {
  const projectNo = new URL(request.url).searchParams.get('projectNo')?.trim();
  if (!projectNo) {
    return NextResponse.json({ error: '請輸入計劃編號。' }, { status: 400 });
  }

  const sql = db();
  const projects = await sql`
    SELECT *
    FROM research_projects
    WHERE project_no = ${projectNo}
    LIMIT 1
  `;

  if (!projects[0]) {
    return NextResponse.json({ project: null });
  }

  const project = projects[0];
  const rows = await sql`
    SELECT *
    FROM project_budget_items
    WHERE project_id = ${project.id}
    ORDER BY sort_order ASC
  `;

  return NextResponse.json({
    project: {
      form: {
        projectNo: project.project_no,
        externalNo: project.project_no_suffix,
        institutionCode: project.institution_code,
        institutionName: project.institution_name,
        campus: project.campus_code,
        principalName: project.principal_name,
        principalId: project.principal_id,
        departmentCode: project.department_code,
        departmentName: project.department_name,
        nsCNo: project.national_science_council_no,
        email: project.principal_email,
        parentProjectNo: project.parent_project_no,
        managementFeeRequired: project.management_fee_required,
        cooperationType: project.cooperation_type,
        projectName: project.project_name,
        category: project.research_category,
        startDate: project.start_date,
        endDate: project.end_date,
        extensionDate: project.extension_date,
        taxId: project.tax_id,
        iacucNo: project.iacuc_no,
        baseSetupFee: project.base_setup_fee,
        staffType: project.staff_type,
        revokeFlag: project.revoke_flag,
        revokeDate: project.revoke_effective_date,
        externalProjectType: project.external_project_type,
        outstandingStaffType: project.outstanding_staff_type,
        projectTerm: project.project_term,
        irbNo: project.irb_no,
        storageConditionFee: project.storage_condition_fee,
        extendedProject: project.extended_nstc_or_nhri_project,
        scienceProjectNo: project.scientific_research_project_no,
        trialStartFee: project.trial_start_fee,
        closed: project.close_flag === 'Y',
        lockedNotice: '已從資料庫載入。',
      },
      rows: rows.map((row) => ({
        code: row.expense_code,
        name: row.expense_name,
        budget: Number(row.budget_total),
        internalSubsidy: Number(row.internal_subsidy_amount),
        externalSubsidy: Number(row.external_subsidy_amount),
        internalSpent: Number(row.internal_writeoff_amount),
        externalSpent: Number(row.external_writeoff_amount),
      })),
    },
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    form?: ProjectFormPayload;
    rows?: BudgetRowPayload[];
  };
  const form = (body.form ?? {}) as ProjectFormPayload;
  const rows = Array.isArray(body.rows) ? (body.rows as BudgetRowPayload[]) : [];
  const projectNo = text(form.projectNo).trim();

  if (!projectNo) {
    return NextResponse.json({ error: '計劃編號不可空白。' }, { status: 400 });
  }

  const sql = db();
  const savedProjects = await sql`
    INSERT INTO research_projects (
      project_no,
      project_no_suffix,
      institution_code,
      institution_name,
      campus_code,
      principal_name,
      principal_id,
      department_code,
      department_name,
      national_science_council_no,
      principal_email,
      parent_project_no,
      management_fee_required,
      cooperation_type,
      project_name,
      research_category,
      start_date,
      end_date,
      extension_date,
      tax_id,
      tax_id_suffix,
      project_term,
      iacuc_no,
      base_setup_fee,
      staff_type,
      revoke_flag,
      revoke_effective_date,
      external_project_type,
      outstanding_staff_type,
      irb_no,
      storage_condition_fee,
      extended_nstc_or_nhri_project,
      scientific_research_project_no,
      trial_start_fee,
      close_flag,
      controlled_relative_subsidy
    ) VALUES (
      ${projectNo},
      ${text(form.externalNo)},
      ${text(form.institutionCode)},
      ${text(form.institutionName)},
      ${text(form.campus)},
      ${text(form.principalName)},
      ${text(form.principalId)},
      ${text(form.departmentCode)},
      ${text(form.departmentName)},
      ${text(form.nsCNo)},
      ${text(form.email)},
      ${text(form.parentProjectNo)},
      ${Boolean(form.managementFeeRequired)},
      ${text(form.cooperationType)},
      ${text(form.projectName)},
      ${text(form.category)},
      ${text(form.startDate)},
      ${text(form.endDate)},
      ${text(form.extensionDate)},
      ${text(form.taxId)},
      '',
      ${text(form.projectTerm)},
      ${text(form.iacucNo)},
      ${text(form.baseSetupFee)},
      ${text(form.staffType)},
      ${text(form.revokeFlag)},
      ${text(form.revokeDate)},
      ${text(form.externalProjectType)},
      ${text(form.outstandingStaffType)},
      ${text(form.irbNo)},
      ${text(form.storageConditionFee)},
      ${Boolean(form.extendedProject)},
      ${text(form.scienceProjectNo)},
      ${text(form.trialStartFee)},
      ${form.closed ? 'Y' : ''},
      ''
    )
    ON CONFLICT (project_no) DO UPDATE SET
      project_no_suffix = EXCLUDED.project_no_suffix,
      institution_code = EXCLUDED.institution_code,
      institution_name = EXCLUDED.institution_name,
      campus_code = EXCLUDED.campus_code,
      principal_name = EXCLUDED.principal_name,
      principal_id = EXCLUDED.principal_id,
      department_code = EXCLUDED.department_code,
      department_name = EXCLUDED.department_name,
      national_science_council_no = EXCLUDED.national_science_council_no,
      principal_email = EXCLUDED.principal_email,
      parent_project_no = EXCLUDED.parent_project_no,
      management_fee_required = EXCLUDED.management_fee_required,
      cooperation_type = EXCLUDED.cooperation_type,
      project_name = EXCLUDED.project_name,
      research_category = EXCLUDED.research_category,
      start_date = EXCLUDED.start_date,
      end_date = EXCLUDED.end_date,
      extension_date = EXCLUDED.extension_date,
      tax_id = EXCLUDED.tax_id,
      project_term = EXCLUDED.project_term,
      iacuc_no = EXCLUDED.iacuc_no,
      base_setup_fee = EXCLUDED.base_setup_fee,
      staff_type = EXCLUDED.staff_type,
      revoke_flag = EXCLUDED.revoke_flag,
      revoke_effective_date = EXCLUDED.revoke_effective_date,
      external_project_type = EXCLUDED.external_project_type,
      outstanding_staff_type = EXCLUDED.outstanding_staff_type,
      irb_no = EXCLUDED.irb_no,
      storage_condition_fee = EXCLUDED.storage_condition_fee,
      extended_nstc_or_nhri_project = EXCLUDED.extended_nstc_or_nhri_project,
      scientific_research_project_no = EXCLUDED.scientific_research_project_no,
      trial_start_fee = EXCLUDED.trial_start_fee,
      close_flag = EXCLUDED.close_flag
    RETURNING id
  `;

  const projectId = savedProjects[0].id;
  await sql`DELETE FROM project_budget_items WHERE project_id = ${projectId}`;

  for (const [index, row] of rows.entries()) {
    const budget = amount(row.budget);
    const internalSpent = amount(row.internalSpent);
    const externalSpent = amount(row.externalSpent);
    const hasContent =
      text(row.code) ||
      text(row.name) ||
      budget ||
      amount(row.internalSubsidy) ||
      amount(row.externalSubsidy) ||
      internalSpent ||
      externalSpent;

    if (!hasContent) {
      continue;
    }

    await sql`
      INSERT INTO project_budget_items (
        project_id,
        sort_order,
        expense_code,
        expense_name,
        budget_total,
        internal_subsidy_amount,
        external_subsidy_amount,
        internal_writeoff_amount,
        external_writeoff_amount,
        budget_balance
      ) VALUES (
        ${projectId},
        ${index},
        ${text(row.code)},
        ${text(row.name)},
        ${budget},
        ${amount(row.internalSubsidy)},
        ${amount(row.externalSubsidy)},
        ${internalSpent},
        ${externalSpent},
        ${budget - internalSpent - externalSpent}
      )
    `;
  }

  return NextResponse.json({ ok: true, projectNo });
}

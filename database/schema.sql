CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE research_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_no TEXT NOT NULL UNIQUE,
  project_no_suffix TEXT NOT NULL DEFAULT '',
  institution_code TEXT NOT NULL DEFAULT '',
  institution_name TEXT NOT NULL DEFAULT '',
  campus_code TEXT NOT NULL DEFAULT '',
  principal_name TEXT NOT NULL DEFAULT '',
  principal_id TEXT NOT NULL DEFAULT '',
  department_code TEXT NOT NULL DEFAULT '',
  department_name TEXT NOT NULL DEFAULT '',
  national_science_council_no TEXT NOT NULL DEFAULT '',
  principal_email TEXT NOT NULL DEFAULT '',
  parent_project_no TEXT NOT NULL DEFAULT '',
  management_fee_required BOOLEAN NOT NULL DEFAULT false,
  cooperation_type TEXT NOT NULL DEFAULT '',
  project_name TEXT NOT NULL DEFAULT '',
  research_category TEXT NOT NULL DEFAULT '',
  start_date TEXT NOT NULL DEFAULT '',
  end_date TEXT NOT NULL DEFAULT '',
  extension_date TEXT NOT NULL DEFAULT '',
  tax_id TEXT NOT NULL DEFAULT '',
  tax_id_suffix TEXT NOT NULL DEFAULT '',
  project_term TEXT NOT NULL DEFAULT '',
  iacuc_no TEXT NOT NULL DEFAULT '',
  base_setup_fee TEXT NOT NULL DEFAULT '',
  staff_type TEXT NOT NULL DEFAULT '',
  revoke_flag TEXT NOT NULL DEFAULT '',
  revoke_effective_date TEXT NOT NULL DEFAULT '',
  external_project_type TEXT NOT NULL DEFAULT '',
  outstanding_staff_type TEXT NOT NULL DEFAULT '',
  irb_no TEXT NOT NULL DEFAULT '',
  storage_condition_fee TEXT NOT NULL DEFAULT '',
  extended_nstc_or_nhri_project BOOLEAN NOT NULL DEFAULT false,
  scientific_research_project_no TEXT NOT NULL DEFAULT '',
  trial_start_fee TEXT NOT NULL DEFAULT '',
  close_flag TEXT NOT NULL DEFAULT '',
  controlled_relative_subsidy TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE project_budget_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES research_projects(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  expense_code TEXT NOT NULL DEFAULT '',
  expense_name TEXT NOT NULL DEFAULT '',
  budget_total NUMERIC(14, 0) NOT NULL DEFAULT 0,
  internal_subsidy_amount NUMERIC(14, 0) NOT NULL DEFAULT 0,
  external_subsidy_amount NUMERIC(14, 0) NOT NULL DEFAULT 0,
  internal_writeoff_amount NUMERIC(14, 0) NOT NULL DEFAULT 0,
  external_writeoff_amount NUMERIC(14, 0) NOT NULL DEFAULT 0,
  budget_balance NUMERIC(14, 0) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (project_id, sort_order)
);

CREATE INDEX project_budget_items_project_id_idx
  ON project_budget_items(project_id);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER research_projects_set_updated_at
BEFORE UPDATE ON research_projects
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER project_budget_items_set_updated_at
BEFORE UPDATE ON project_budget_items
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

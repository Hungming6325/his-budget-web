'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Download,
  FilePlus2,
  LockKeyhole,
  RotateCcw,
  Save,
  Search,
  Trash2,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type BudgetRow = {
  code: string;
  name: string;
  budget: number;
  internalSubsidy: number;
  externalSubsidy: number;
  internalSpent: number;
  externalSpent: number;
};

type ProjectForm = {
  projectNo: string;
  externalNo: string;
  institutionCode: string;
  institutionName: string;
  campus: string;
  principalId: string;
  principalName: string;
  departmentCode: string;
  departmentName: string;
  nsCNo: string;
  email: string;
  parentProjectNo: string;
  managementFeeRequired: boolean;
  cooperationType: string;
  projectName: string;
  category: string;
  startDate: string;
  endDate: string;
  extensionDate: string;
  taxId: string;
  iacucNo: string;
  baseSetupFee: string;
  staffType: string;
  revokeFlag: string;
  revokeDate: string;
  externalProjectType: string;
  outstandingStaffType: string;
  projectTerm: string;
  irbNo: string;
  storageConditionFee: string;
  extendedProject: boolean;
  scienceProjectNo: string;
  trialStartFee: string;
  closed: boolean;
  lockedNotice: string;
};

type ProjectLookupResponse = {
  error?: string;
  project?: {
    form: ProjectForm;
    rows: BudgetRow[];
  } | null;
};

type ProjectSaveResponse = {
  error?: string;
  projectNo?: string;
};

type ProjectDeleteResponse = {
  error?: string;
  projectNo?: string;
};

type CodeForm = {
  fundingSource: string;
  nature: string;
  institution: string;
  campus: string;
  startYear: string;
  term: string;
  serial: string;
};

const blankRows: BudgetRow[] = [
  {
    code: '',
    name: '',
    budget: 0,
    internalSubsidy: 0,
    externalSubsidy: 0,
    internalSpent: 0,
    externalSpent: 0,
  },
  {
    code: '',
    name: '',
    budget: 0,
    internalSubsidy: 0,
    externalSubsidy: 0,
    internalSpent: 0,
    externalSpent: 0,
  },
  {
    code: '',
    name: '',
    budget: 0,
    internalSubsidy: 0,
    externalSubsidy: 0,
    internalSpent: 0,
    externalSpent: 0,
  },
];

const initialForm: ProjectForm = {
  projectNo: '',
  externalNo: '',
  institutionCode: '',
  institutionName: '',
  campus: '',
  principalId: '',
  principalName: '',
  departmentCode: '',
  departmentName: '',
  nsCNo: '',
  email: '',
  parentProjectNo: '',
  managementFeeRequired: false,
  cooperationType: '',
  projectName: '',
  category: '',
  startDate: '',
  endDate: '',
  extensionDate: '',
  taxId: '',
  iacucNo: '',
  baseSetupFee: '',
  staffType: '',
  revokeFlag: '',
  revokeDate: '',
  externalProjectType: '',
  outstandingStaffType: '',
  projectTerm: '',
  irbNo: '',
  storageConditionFee: '',
  extendedProject: false,
  scienceProjectNo: '',
  trialStartFee: '',
  closed: false,
  lockedNotice: '',
};

const sampleProject: ProjectForm = {
  ...initialForm,
  projectNo: 'NMRPF3R0341',
  externalNo: '115-2314-B-255-013',
  institutionCode: 'F',
  institutionName: '長庚科技大學',
  campus: '3',
  principalId: 'H222637467',
  principalName: '李家瑩',
  departmentCode: 'A1000',
  departmentName: '護理系',
  projectName: '性別平等教育融入教育劇場的行動研究',
  category: '個別型',
  startDate: '2026-08-01',
  endDate: '2027-07-31',
  projectTerm: '第1年',
  lockedNotice: '國科會/國衛院案件帶入後，主持人姓名與起訖日期需依規則管制。',
};

const sampleRows: BudgetRow[] = [
  { ...blankRows[0], code: 'P', name: '主持人費', budget: 0 },
  { ...blankRows[1], code: 'B', name: '業務費', budget: 220000, internalSubsidy: 22000, externalSubsidy: 198000 },
  { ...blankRows[2], code: 'K', name: '管理費', budget: 0 },
];

const fundingSources = [
  { value: 'H', label: 'H：國衛院' },
  { value: 'M', label: 'M：國科會' },
  { value: 'O', label: 'O：傑出研究人員獎勵' },
  { value: 'P', label: 'P：衛福部暨所屬機構' },
  { value: 'S', label: 'S：其他廠商' },
  { value: 'U', label: 'U：長庚大學' },
  { value: 'V', label: 'V：經濟部' },
  { value: 'X', label: 'X：人體試驗廠商' },
  { value: 'Z', label: 'Z：長庚科技大學' },
];

const natures = [
  { value: 'M', label: 'M：醫學類' },
  { value: 'O', label: 'O：目標導向' },
  { value: 'P', label: 'P：自行發起臨床試驗' },
  { value: 'R', label: 'R：科研究中心' },
  { value: 'S', label: 'S：擴充加值類' },
  { value: 'T', label: 'T：科技類' },
  { value: 'V', label: 'V：專案計畫' },
  { value: 'Y', label: 'Y：研究技術加值' },
  { value: 'Z', label: 'Z：其他類' },
];

const institutions = [
  { value: 'D', label: 'D：長庚大學', name: '長庚大學', defaultCampus: '' },
  { value: 'F', label: 'F：長庚科技大學', name: '長庚科技大學', defaultCampus: '3' },
  { value: 'G', label: 'G：長庚紀念醫院', name: '長庚紀念醫院', defaultCampus: '' },
  { value: 'V', label: 'V：土城醫院', name: '土城醫院', defaultCampus: 'V' },
  { value: 'W', label: 'W：大同醫院', name: '大同醫院', defaultCampus: 'W' },
];

const institutionByCode = Object.fromEntries(
  institutions.map((item) => [item.value, item]),
);

const feeNameByCode: Record<string, string> = {
  P: '主持人費',
  B: '業務費',
  K: '管理費',
};

const campuses = [
  { value: '1', label: '1：台北（醫學院）' },
  { value: '3', label: '3：林口（醫學院）' },
  { value: '4', label: '4：基隆' },
  { value: '5', label: '5：桃園（護專中心）' },
  { value: '6', label: '6：嘉義' },
  { value: '8', label: '8：高雄' },
  { value: 'B', label: 'B：台北診所' },
  { value: 'H', label: 'H：養生文化村' },
  { value: 'K', label: 'K：養生文化村' },
  { value: 'M', label: 'M：嘉義' },
  { value: 'N', label: 'N：護理之家' },
  { value: 'T', label: 'T：鳳山' },
  { value: 'V', label: 'V：土城' },
  { value: 'W', label: 'W：大同' },
];

const startYears = ['114', '115', '116', '117', '118', '119', '120'];
const projectTerms = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
const toolbarButtonClass = 'h-10 w-[72px] shrink-0 gap-1 px-1 text-sm bg-[#fff8c9] text-slate-950 hover:bg-[#f4eaa8] [&_svg]:size-4';
const exportMasterButtonClass = 'h-10 w-[86px] shrink-0 gap-1 px-1 text-sm bg-[#d9f99d] text-slate-950 hover:bg-[#bef264] [&_svg]:size-4';
const exportDetailButtonClass = 'h-10 w-[86px] shrink-0 gap-1 px-1 text-sm bg-[#bae6fd] text-slate-950 hover:bg-[#7dd3fc] [&_svg]:size-4';

const researchCategories = [
  '一般研究計劃',
  '個別型',
  '整合型',
  '院內型',
  '子計劃',
];

const blankCodeForm: CodeForm = {
  fundingSource: '',
  nature: '',
  institution: '',
  campus: '',
  startYear: '',
  term: '',
  serial: '',
};

const principalDirectory: Record<
  string,
  Pick<
    ProjectForm,
    'principalName' | 'departmentCode' | 'departmentName' | 'institutionCode' | 'institutionName' | 'campus'
  >
> = {
  H222637467: {
    principalName: '李家瑩',
    departmentCode: 'A1000',
    departmentName: '護理系',
    institutionCode: 'F',
    institutionName: '長庚科技大學',
    campus: '3',
  },
  A123456789: {
    principalName: '王怡君',
    departmentCode: 'C2000',
    departmentName: '人文社會學科',
    institutionCode: 'F',
    institutionName: '長庚科技大學',
    campus: '3',
  },
};

function money(value: number) {
  return new Intl.NumberFormat('zh-TW').format(value);
}

function moneyOrBlank(value: number) {
  return value === 0 ? '' : money(value);
}

export default function Home() {
  const [form, setForm] = useState<ProjectForm>(initialForm);
  const [rows, setRows] = useState<BudgetRow[]>(blankRows);
  const [query, setQuery] = useState('');
  const [codeOpen, setCodeOpen] = useState(false);
  const [codeForm, setCodeForm] = useState<CodeForm>(blankCodeForm);

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, row) => ({
          budget: acc.budget + row.budget,
          internalSubsidy: acc.internalSubsidy + row.internalSubsidy,
          externalSubsidy: acc.externalSubsidy + row.externalSubsidy,
          internalSpent: acc.internalSpent + row.internalSpent,
          externalSpent: acc.externalSpent + row.externalSpent,
        }),
        {
          budget: 0,
          internalSubsidy: 0,
          externalSubsidy: 0,
          internalSpent: 0,
          externalSpent: 0,
        },
      ),
    [rows],
  );

  const balance = totals.budget - totals.internalSpent - totals.externalSpent;

  function patchForm(patch: Partial<ProjectForm>) {
    setForm((current) => ({ ...current, ...patch }));
  }

  function clearForm() {
    setForm(initialForm);
    setRows(blankRows);
    setQuery('');
  }

  async function searchProject() {
    const projectNo = (query.trim() || form.projectNo.trim()).toUpperCase();
    if (projectNo === 'NMRPF3R0341') {
      setForm(sampleProject);
      setRows(sampleRows);
      setQuery(projectNo);
      return;
    }

    if (!projectNo) {
      patchForm({ lockedNotice: '請先輸入計劃編號再查詢。' });
      return;
    }

    try {
      const response = await fetch(`/api/projects?projectNo=${encodeURIComponent(projectNo)}`);
      const data = (await response.json()) as ProjectLookupResponse;

      if (!response.ok) {
        patchForm({ lockedNotice: data.error ?? '查詢失敗，請稍後再試。' });
        return;
      }

      if (data.project) {
        setForm(data.project.form);
        setRows(data.project.rows.length ? data.project.rows : blankRows);
        setQuery(data.project.form.projectNo);
        return;
      }
    } catch {
      patchForm({ lockedNotice: '資料庫查詢失敗，請確認 DATABASE_URL 或網路連線。' });
      return;
    }

    patchForm({
      projectNo,
      lockedNotice: '查無資料，可用新增流程建立此案號。',
    });
    setQuery(projectNo);
    setRows(blankRows);
  }

  function applyPrincipal(id: string) {
    const key = id.trim().toUpperCase();
    const found = principalDirectory[key];
    patchForm({
      principalId: key,
      ...(found ?? {
        principalName: '',
        departmentCode: '',
        departmentName: '',
        lockedNotice: key ? '主持人資料尚未建檔，請確認人事主檔。' : '',
      }),
    });
  }

  function applyInstitutionCode(value: string) {
    const code = value.trim().toUpperCase();
    const institution = institutionByCode[code];
    patchForm({
      institutionCode: code,
      institutionName: institution?.name ?? '',
      campus: institution?.defaultCampus ?? '',
    });
  }

  function generateProjectNo() {
    if (
      !codeForm.fundingSource ||
      !codeForm.nature ||
      !codeForm.institution ||
      !codeForm.campus ||
      !codeForm.serial
    ) {
      return;
    }
    const serial = codeForm.serial.padStart(4, '0').slice(-4);
    const projectNo = `${codeForm.fundingSource}${codeForm.nature}RP${codeForm.institution}${codeForm.campus}R${serial}`;
    const institution = institutions.find((item) => item.value === codeForm.institution);
    patchForm({
      projectNo,
      institutionCode: codeForm.institution,
      institutionName: institution?.name ?? '',
      campus: codeForm.campus,
      projectTerm: `第${codeForm.term}年`,
      category: form.category || '個別型',
      lockedNotice: '案號已產生，請續填主持人、日期、計畫名稱與費用明細。',
    });
    setQuery(projectNo);
    setCodeOpen(false);
  }

  function openNewProjectDialog() {
    setCodeForm(blankCodeForm);
    setCodeOpen(true);
  }

  async function deleteProject() {
    const projectNo = (form.projectNo.trim() || query.trim()).toUpperCase();
    if (!projectNo) {
      patchForm({ lockedNotice: '請先輸入或查詢計劃編號再刪除。' });
      return;
    }

    if (!window.confirm(`確定刪除計劃案號 ${projectNo}？`)) {
      return;
    }

    try {
      const response = await fetch(`/api/projects?projectNo=${encodeURIComponent(projectNo)}`, {
        method: 'DELETE',
      });
      const data = (await response.json()) as ProjectDeleteResponse;

      if (!response.ok) {
        patchForm({ lockedNotice: data.error ?? '刪除失敗，請稍後再試。' });
        return;
      }

      setForm({ ...initialForm, lockedNotice: `計劃案號 ${data.projectNo ?? projectNo} 已從資料庫刪除。` });
      setRows(blankRows);
      setQuery('');
    } catch {
      patchForm({ lockedNotice: '刪除失敗，請確認 DATABASE_URL 或網路連線。' });
    }
  }

  async function moveRecord(direction: 'prev' | 'next') {
    const projectNo = (form.projectNo.trim() || query.trim()).toUpperCase();
    try {
      const params = new URLSearchParams({ move: direction });
      if (projectNo) {
        params.set('projectNo', projectNo);
      }
      const response = await fetch(`/api/projects?${params.toString()}`);
      const data = (await response.json()) as ProjectLookupResponse;

      if (!response.ok) {
        patchForm({ lockedNotice: data.error ?? '資料切換失敗，請稍後再試。' });
        return;
      }

      if (!data.project) {
        patchForm({ lockedNotice: direction === 'prev' ? '已經是第一筆資料。' : '已經是最後一筆資料。' });
        return;
      }

      setForm(data.project.form);
      setRows(data.project.rows.length ? data.project.rows : blankRows);
      setQuery(data.project.form.projectNo);
    } catch {
      patchForm({ lockedNotice: '資料切換失敗，請確認 DATABASE_URL 或網路連線。' });
    }
  }

  async function saveProject() {
    if (!form.projectNo.trim()) {
      patchForm({ lockedNotice: '請先新增或輸入計劃編號再存檔。' });
      return;
    }

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form, rows }),
      });
      const data = (await response.json()) as ProjectSaveResponse;

      if (!response.ok) {
        patchForm({ lockedNotice: data.error ?? '存檔失敗，請稍後再試。' });
        return;
      }

      patchForm({ lockedNotice: `計劃案號 ${data.projectNo ?? form.projectNo} 已存入資料庫。` });
    } catch {
      patchForm({ lockedNotice: '存檔失敗，請確認 DATABASE_URL 或網路連線。' });
    }
  }

  function updateRow(index: number, key: keyof BudgetRow, value: string) {
    setRows((current) =>
      current.map((row, rowIndex) => {
        if (rowIndex !== index) {
          return row;
        }
        if (key === 'code') {
          const code = value.trim().toUpperCase();
          return {
            ...row,
            code,
            name: feeNameByCode[code] ?? (code ? row.name : ''),
          };
        }
        return {
          ...row,
          [key]: key === 'name' ? value : Number(value) || 0,
        };
      }),
    );
  }

  function downloadCsv(path: string) {
    window.location.href = path;
  }

  return (
    <main className="min-h-screen bg-[#2bb9b0] text-slate-950">
      <header className="border-b border-emerald-900 bg-black text-white">
        <div className="flex items-center justify-between gap-4 px-3 py-2">
          <div className="flex h-14 w-48 shrink-0 items-center overflow-hidden bg-black md:w-64">
            <Image
              src="/cgust-logo.png"
              alt="長庚科技大學"
              width={512}
              height={112}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
            <div className="flex shrink-0 flex-nowrap gap-1.5 text-slate-950">
              <Button className={toolbarButtonClass} variant="outline" onClick={openNewProjectDialog}>
                <FilePlus2 />
                新增
              </Button>
              <Button className={toolbarButtonClass} variant="outline" onClick={clearForm}>
                <RotateCcw />
                清除
              </Button>
              <Button className={toolbarButtonClass} variant="outline" onClick={deleteProject}>
                <Trash2 />
                刪除
              </Button>
              <Button className={toolbarButtonClass} variant="outline" onClick={saveProject}>
                <Save />
                存檔
              </Button>
              <Button className={toolbarButtonClass} variant="outline" onClick={searchProject}>
                <Search />
                查詢
              </Button>
              <Button className={toolbarButtonClass} variant="outline" onClick={() => moveRecord('prev')}>
                <ChevronUp />
                上筆
              </Button>
              <Button className={toolbarButtonClass} variant="outline" onClick={() => moveRecord('next')}>
                <ChevronDown />
                下筆
              </Button>
              <Button className={toolbarButtonClass} variant="outline" onClick={() => patchForm({ closed: true })}>
                <LockKeyhole />
                結案
              </Button>
              <Button
                className={exportMasterButtonClass}
                variant="outline"
                onClick={() => downloadCsv('/api/export/projects')}
              >
                <Download />
                主檔CSV
              </Button>
              <Button
                className={exportDetailButtonClass}
                variant="outline"
                onClick={() => downloadCsv('/api/export/project-budget')}
              >
                <Download />
                明細CSV
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="overflow-x-auto px-1 py-1">
        <section className="mx-auto min-w-[1080px] max-w-[1080px] bg-[#2bb9b0] pb-1">
          <div className="relative mb-1 h-7">
            <div className="mx-auto w-[400px] border border-yellow-200 bg-[#087c73] px-4 py-0 text-center text-xl font-semibold leading-7 text-yellow-200">
              研究計劃經費預算建檔
            </div>
            <div className="absolute bottom-0 right-0 px-2 text-sm font-semibold leading-7 text-yellow-100">
              版本 1141106
            </div>
          </div>

          <div className="mb-1 border-2 border-pink-200 bg-[#f5a9c9] px-2 pb-2 pt-1 shadow-[inset_0_0_0_1px_#e485a7]">
            <div className="-mt-6 mb-1 w-fit bg-[#12a986] px-1 text-base font-semibold leading-6 text-yellow-100">
              查詢輸入
            </div>
            <div className="grid grid-cols-[88px_175px_1fr] items-center gap-3">
              <span className="text-left text-base font-semibold text-rose-900">計劃編號</span>
              <Input value={query} onChange={(event) => setQuery(event.target.value)} />
              <Input value={form.lockedNotice} readOnly />
            </div>
          </div>

          <div className="grid grid-cols-[735px_330px] gap-x-[15px] gap-y-0">
            <div className="space-y-0">
              <div className="grid grid-cols-[440px_280px] gap-x-[15px] gap-y-0">
                <div className="space-y-0">
                  <LegacyField label="計劃編號">
                    <div className="grid grid-cols-[190px_14px_1fr] gap-1">
                      <Input value={form.projectNo} onChange={(event) => patchForm({ projectNo: event.target.value })} />
                      <span className="text-center">-</span>
                      <Input value={form.externalNo} onChange={(event) => patchForm({ externalNo: event.target.value })} />
                    </div>
                  </LegacyField>
                  <LegacyField label="機 構 別">
                    <div className="grid grid-cols-[38px_150px_52px_38px] gap-0.5">
                      <Input value={form.institutionCode} onChange={(event) => applyInstitutionCode(event.target.value)} />
                      <Input value={form.institutionName} onChange={(event) => patchForm({ institutionName: event.target.value })} />
                      <span className="flex items-center justify-end bg-[#07857f] px-2 text-white">院區</span>
                      <Input value={form.campus} onChange={(event) => patchForm({ campus: event.target.value })} />
                    </div>
                  </LegacyField>
                  <LegacyField label="主持人證號">
                    <div className="grid grid-cols-[1fr_1fr] gap-1">
                      <Input value={form.principalName} onChange={(event) => patchForm({ principalName: event.target.value })} />
                      <Input value={form.principalId} onChange={(event) => applyPrincipal(event.target.value)} />
                    </div>
                  </LegacyField>
                  <LegacyField label="部門代號">
                    <div className="grid grid-cols-[86px_1fr] gap-1">
                      <Input value={form.departmentCode} onChange={(event) => patchForm({ departmentCode: event.target.value })} />
                      <Input value={form.departmentName} onChange={(event) => patchForm({ departmentName: event.target.value })} />
                    </div>
                  </LegacyField>
                  <LegacyField label="國科會編號">
                    <Input value={form.nsCNo} onChange={(event) => patchForm({ nsCNo: event.target.value })} />
                  </LegacyField>
                  <LegacyField label="主持人郵件">
                    <Input value={form.email} onChange={(event) => patchForm({ email: event.target.value })} />
                  </LegacyField>
                  <LegacyField label="總計畫編號">
                    <div className="grid grid-cols-[135px_132px_24px] gap-0.5">
                      <Input value={form.parentProjectNo} onChange={(event) => patchForm({ parentProjectNo: event.target.value })} />
                      <span className="flex items-center justify-end bg-[#2bb9b0] px-2 font-semibold text-fuchsia-800">須繳藥管費</span>
                      <input
                        className="m-auto size-5"
                        type="checkbox"
                        checked={form.managementFeeRequired}
                        onChange={(event) => patchForm({ managementFeeRequired: event.target.checked })}
                      />
                    </div>
                  </LegacyField>
                  <LegacyField label="計劃合作別">
                    <NativeSelect
                      className="w-full"
                      value={form.cooperationType}
                      onChange={(event) => patchForm({ cooperationType: event.target.value })}
                    >
                      <NativeSelectOption value=""></NativeSelectOption>
                      <NativeSelectOption value="院內合作">院內合作</NativeSelectOption>
                      <NativeSelectOption value="跨院合作">跨院合作</NativeSelectOption>
                      <NativeSelectOption value="校外合作">校外合作</NativeSelectOption>
                    </NativeSelect>
                  </LegacyField>
                </div>

                <div className="space-y-0">
                  <LegacyField label="研究類別">
                    <NativeSelect
                      className="w-full"
                      value={form.category}
                      onChange={(event) => patchForm({ category: event.target.value })}
                    >
                      <NativeSelectOption value=""></NativeSelectOption>
                      {researchCategories.map((category) => (
                        <NativeSelectOption key={category} value={category}>
                          {category}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                  </LegacyField>
                  <LegacyField label="開始日期">
                    <Input value={form.startDate} onChange={(event) => patchForm({ startDate: event.target.value })} />
                  </LegacyField>
                  <LegacyField label="結束日期">
                    <Input value={form.endDate} onChange={(event) => patchForm({ endDate: event.target.value })} />
                  </LegacyField>
                  <LegacyField label="展延日期">
                    <Input value={form.extensionDate} onChange={(event) => patchForm({ extensionDate: event.target.value })} />
                  </LegacyField>
                  <LegacyField label="統一編號">
                    <div className="grid grid-cols-[1fr_1fr] gap-0.5">
                      <Input value={form.taxId} onChange={(event) => patchForm({ taxId: event.target.value })} />
                      <Input value={form.externalNo} onChange={(event) => patchForm({ externalNo: event.target.value })} />
                    </div>
                  </LegacyField>
                  <LegacyField label="IACUC編號">
                    <Input value={form.iacucNo} onChange={(event) => patchForm({ iacucNo: event.target.value })} />
                  </LegacyField>
                  <LegacyField label="基本設定費">
                    <NativeSelect
                      className="w-full"
                      value={form.baseSetupFee}
                      onChange={(event) => patchForm({ baseSetupFee: event.target.value })}
                    >
                      <NativeSelectOption value=""></NativeSelectOption>
                      <NativeSelectOption value="免收">免收</NativeSelectOption>
                      <NativeSelectOption value="應收">應收</NativeSelectOption>
                    </NativeSelect>
                  </LegacyField>
                  <LegacyField label="人員職類">
                    <NativeSelect
                      className="w-full"
                      value={form.staffType}
                      onChange={(event) => patchForm({ staffType: event.target.value })}
                    >
                      <NativeSelectOption value=""></NativeSelectOption>
                      <NativeSelectOption value="專任">專任</NativeSelectOption>
                      <NativeSelectOption value="兼任">兼任</NativeSelectOption>
                    </NativeSelect>
                  </LegacyField>
                </div>
              </div>

              <LegacyField label="計劃名稱">
                <Input className="h-[62px]" value={form.projectName} onChange={(event) => patchForm({ projectName: event.target.value })} />
              </LegacyField>
              <LegacyField label="結案註記">
                <div className="grid grid-cols-[38px_154px_1fr] gap-0.5">
                  <Input value={form.closed ? 'Y' : ''} onChange={(event) => patchForm({ closed: event.target.value.toUpperCase() === 'Y' })} />
                  <span className="flex items-center justify-end bg-[#2bb9b0] px-2 font-semibold text-fuchsia-800">管制相對補助</span>
                  <NativeSelect className="w-full">
                    <NativeSelectOption value=""></NativeSelectOption>
                    <NativeSelectOption value="Y">Y</NativeSelectOption>
                    <NativeSelectOption value="N">N</NativeSelectOption>
                  </NativeSelect>
                </div>
              </LegacyField>
            </div>

            <div className="space-y-0">
              <LegacyField label="撤銷註記">
                <NativeSelect
                  className="w-full"
                  value={form.revokeFlag}
                  onChange={(event) => patchForm({ revokeFlag: event.target.value })}
                >
                  <NativeSelectOption value=""></NativeSelectOption>
                  <NativeSelectOption value="Y">Y</NativeSelectOption>
                  <NativeSelectOption value="N">N</NativeSelectOption>
                </NativeSelect>
              </LegacyField>
              <LegacyField label="撤銷生效日">
                <Input value={form.revokeDate} onChange={(event) => patchForm({ revokeDate: event.target.value })} />
              </LegacyField>
              <LegacyField label="院外計畫類別">
                <NativeSelect
                  className="w-full"
                  value={form.externalProjectType}
                  onChange={(event) => patchForm({ externalProjectType: event.target.value })}
                >
                  <NativeSelectOption value=""></NativeSelectOption>
                  <NativeSelectOption value="政府補助">政府補助</NativeSelectOption>
                  <NativeSelectOption value="產學合作">產學合作</NativeSelectOption>
                  <NativeSelectOption value="其他委託">其他委託</NativeSelectOption>
                </NativeSelect>
              </LegacyField>
              <LegacyField label="傑出人員別">
                <NativeSelect
                  className="w-full"
                  value={form.outstandingStaffType}
                  onChange={(event) => patchForm({ outstandingStaffType: event.target.value })}
                >
                  <NativeSelectOption value=""></NativeSelectOption>
                  <NativeSelectOption value="傑出">傑出</NativeSelectOption>
                  <NativeSelectOption value="一般">一般</NativeSelectOption>
                </NativeSelect>
              </LegacyField>
              <LegacyField label="計劃年期">
                <NativeSelect
                  className="w-full"
                  value={form.projectTerm}
                  onChange={(event) => patchForm({ projectTerm: event.target.value })}
                >
                  <NativeSelectOption value=""></NativeSelectOption>
                  {projectTerms.map((term) => (
                    <NativeSelectOption key={term} value={`第${term}年`}>
                      第{term}年
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </LegacyField>
              <LegacyField label="IRB編號">
                <Input value={form.irbNo} onChange={(event) => patchForm({ irbNo: event.target.value })} />
              </LegacyField>
              <LegacyField label="儲存條件費">
                <NativeSelect
                  className="w-full"
                  value={form.storageConditionFee}
                  onChange={(event) => patchForm({ storageConditionFee: event.target.value })}
                >
                  <NativeSelectOption value=""></NativeSelectOption>
                  <NativeSelectOption value="免收">免收</NativeSelectOption>
                  <NativeSelectOption value="應收">應收</NativeSelectOption>
                </NativeSelect>
              </LegacyField>
              <label className="grid min-h-[31px] grid-cols-[238px_24px_1fr] items-center gap-0.5">
                <span className="flex h-[31px] items-center justify-end bg-[#2bb9b0] px-2 text-right font-semibold text-fuchsia-800">
                  國科會/國衛院延伸件計畫
                </span>
                <input
                  className="m-auto size-5"
                  type="checkbox"
                  checked={form.extendedProject}
                  onChange={(event) => patchForm({ extendedProject: event.target.checked })}
                />
                <span />
              </label>
              <LegacyField label="科研計畫編號">
                <Input value={form.scienceProjectNo} onChange={(event) => patchForm({ scienceProjectNo: event.target.value })} />
              </LegacyField>
              <LegacyField label="試驗起始費">
                <NativeSelect
                  className="w-full"
                  value={form.trialStartFee}
                  onChange={(event) => patchForm({ trialStartFee: event.target.value })}
                >
                  <NativeSelectOption value=""></NativeSelectOption>
                  <NativeSelectOption value="免收">免收</NativeSelectOption>
                  <NativeSelectOption value="應收">應收</NativeSelectOption>
                </NativeSelect>
              </LegacyField>
            </div>
          </div>

          <section className="mt-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[33px]"></TableHead>
                  <TableHead className="w-[190px]">費 用 別</TableHead>
                  <TableHead className="w-[128px]">預算總額</TableHead>
                  <TableHead className="w-[137px]">院內補助金額</TableHead>
                  <TableHead className="w-[137px]">院外補助金額</TableHead>
                  <TableHead className="w-[137px]">院內核銷金額</TableHead>
                  <TableHead className="w-[137px]">院外核銷金額</TableHead>
                  <TableHead className="w-[127px]">預算餘額</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, index) => {
                  const rowBalance = row.budget - row.internalSpent - row.externalSpent;
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <Input
                          className="h-[31px] min-w-0 text-center font-mono font-semibold"
                          value={row.code}
                          onChange={(event) => updateRow(index, 'code', event.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          className="h-[31px] min-w-0"
                          value={row.name}
                          onChange={(event) => updateRow(index, 'name', event.target.value)}
                        />
                      </TableCell>
                      {(['budget', 'internalSubsidy', 'externalSubsidy', 'internalSpent', 'externalSpent'] as const).map(
                        (key) => (
                          <TableCell key={key}>
                            <Input
                              className="h-[31px] min-w-0 text-right"
                              inputMode="numeric"
                              value={row[key] || ''}
                              onChange={(event) => updateRow(index, key, event.target.value)}
                            />
                          </TableCell>
                        ),
                      )}
                      <TableCell className="text-right font-semibold">{moneyOrBlank(rowBalance)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell className="text-center text-lg">合　　計</TableCell>
                  <TableCell className="text-right">{moneyOrBlank(totals.budget)}</TableCell>
                  <TableCell className="text-right">{moneyOrBlank(totals.internalSubsidy)}</TableCell>
                  <TableCell className="text-right">{moneyOrBlank(totals.externalSubsidy)}</TableCell>
                  <TableCell className="text-right">{moneyOrBlank(totals.internalSpent)}</TableCell>
                  <TableCell className="text-right">{moneyOrBlank(totals.externalSpent)}</TableCell>
                  <TableCell className="text-right">{moneyOrBlank(balance)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </section>
        </section>
      </div>

      <Dialog open={codeOpen} onOpenChange={setCodeOpen}>
        <DialogContent
          className="max-w-none border-2 border-emerald-900 bg-[#c8c5df] p-5 shadow-2xl"
          style={{ width: 'min(820px, calc(100vw - 2rem))', maxWidth: 'calc(100vw - 2rem)' }}
        >
          <DialogHeader className="items-center">
            <DialogTitle className="text-xl font-bold text-yellow-300">研究計劃案號編碼</DialogTitle>
          </DialogHeader>
          <div className="grid gap-x-7 gap-y-3 md:grid-cols-2">
            <Field label="經費來源">
              <NativeSelect
                className="w-full"
                value={codeForm.fundingSource}
                onChange={(event) => setCodeForm((current) => ({ ...current, fundingSource: event.target.value }))}
              >
                <NativeSelectOption value="">請選擇</NativeSelectOption>
                {fundingSources.map((item) => (
                  <NativeSelectOption key={item.value} value={item.value}>
                    {item.label}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
            <Field label="計畫性質">
              <NativeSelect
                className="w-full"
                value={codeForm.nature}
                onChange={(event) => setCodeForm((current) => ({ ...current, nature: event.target.value }))}
              >
                <NativeSelectOption value="">請選擇</NativeSelectOption>
                {natures.map((item) => (
                  <NativeSelectOption key={item.value} value={item.value}>
                    {item.label}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
            <Field label="研究計劃">
              <Input value="RP" disabled />
            </Field>
            <Field label="執行機構">
              <NativeSelect
                className="w-full"
                value={codeForm.institution}
                onChange={(event) => setCodeForm((current) => ({ ...current, institution: event.target.value }))}
              >
                <NativeSelectOption value="">請選擇</NativeSelectOption>
                {institutions.map((item) => (
                  <NativeSelectOption key={item.value} value={item.value}>
                    {item.label}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
            <Field label="執行院區">
              <NativeSelect
                className="w-full"
                value={codeForm.campus}
                onChange={(event) => setCodeForm((current) => ({ ...current, campus: event.target.value }))}
              >
                <NativeSelectOption value="">請選擇</NativeSelectOption>
                {campuses.map((item) => (
                  <NativeSelectOption key={item.value} value={item.value}>
                    {item.label}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
            <Field label="起始年度">
              <NativeSelect
                className="w-full"
                value={codeForm.startYear}
                onChange={(event) => setCodeForm((current) => ({ ...current, startYear: event.target.value }))}
              >
                <NativeSelectOption value="">請選擇</NativeSelectOption>
                {startYears.map((year) => (
                  <NativeSelectOption key={year} value={year}>
                    {year}年度
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
            <Field label="計畫年期">
              <NativeSelect
                className="w-full"
                value={codeForm.term}
                onChange={(event) => setCodeForm((current) => ({ ...current, term: event.target.value }))}
              >
                <NativeSelectOption value="">請選擇</NativeSelectOption>
                {projectTerms.map((term) => (
                  <NativeSelectOption key={term} value={term}>
                    第{term}年
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
            <Field label="流水號">
              <Input
                value={codeForm.serial}
                onChange={(event) => setCodeForm((current) => ({ ...current, serial: event.target.value }))}
              />
            </Field>
          </div>
          <div className="rounded border border-slate-500 bg-[#f7f0b8] p-3 text-sm">
            預覽案號：
            <span className="ml-2 font-mono font-semibold">
              {codeForm.fundingSource && codeForm.nature && codeForm.institution && codeForm.campus && codeForm.serial
                ? `${codeForm.fundingSource}${codeForm.nature}RP${codeForm.institution}${codeForm.campus}R${codeForm.serial.padStart(4, '0').slice(-4)}`
                : ''}
            </span>
          </div>
          <DialogFooter className="border-t-slate-400 bg-[#c8c5df]">
            <Button variant="outline" onClick={() => setCodeOpen(false)}>
              <X />
              離開
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                setCodeForm(blankCodeForm)
              }
            >
              <RotateCcw />
              清除
            </Button>
            <Button onClick={generateProjectNo}>
              <Check />
              確定
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`grid min-h-8 grid-cols-[104px_minmax(170px,1fr)] items-center gap-2 ${className ?? ''}`}>
      <span className="flex h-8 items-center justify-end bg-[#07857f] px-2 text-right text-xs font-medium text-white">
        {label}
      </span>
      {children}
    </label>
  );
}

function LegacyField({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`grid min-h-[34px] grid-cols-[108px_minmax(0,1fr)] items-center gap-1 ${className ?? ''}`}>
      <span className="flex h-[34px] items-center justify-end bg-[#2bb9b0] px-1 text-right text-base font-semibold text-slate-950">
        {label}
      </span>
      {children}
    </label>
  );
}

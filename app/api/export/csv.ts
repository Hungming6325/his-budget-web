import { neon } from '@neondatabase/serverless';

export function db() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured');
  }
  return neon(process.env.DATABASE_URL);
}

export function csvValue(value: unknown) {
  if (value === null || value === undefined) {
    return '';
  }
  const text = String(value);
  if (/[",\r\n]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

export function toCsv(rows: Record<string, unknown>[]) {
  const headers = rows[0] ? Object.keys(rows[0]) : [];
  const lines = [
    headers.map(csvValue).join(','),
    ...rows.map((row) => headers.map((header) => csvValue(row[header])).join(',')),
  ];
  return `\uFEFF${lines.join('\r\n')}`;
}

export function csvResponse(csv: string, filename: string) {
  const encodedFilename = encodeURIComponent(filename);
  return new Response(csv, {
    headers: {
      'Content-Disposition': `attachment; filename*=UTF-8''${encodedFilename}`,
      'Content-Type': 'text/csv; charset=utf-8',
    },
  });
}

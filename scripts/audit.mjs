import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { uniqueById, groupByCause } from '../src/lib/kb/causes.ts';

const load = async (file) => JSON.parse(await readFile(new URL(file, import.meta.url), 'utf8'));
const raw = await load('../src/lib/data/reports-4471.json');
const notes = await load('../src/lib/data/desk-notes.json');
const tenants = new Map();
for (const file of await readdir(new URL('../src/lib/data/tenants/', import.meta.url))) {
  const tenant = await load(`../src/lib/data/tenants/${file}`);
  tenants.set(tenant.handle, tenant);
}
const unique = uniqueById(raw).filter((r) => r.mergedInto === 4471);
const groups = groupByCause(unique, (r) => tenants.get(r.tenant));
const seen = new Set();
const duplicateIds = raw.flatMap((r) => { if (seen.has(r.id)) return [r.id]; seen.add(r.id); return []; });
const audit = {
  source: 'KB_EXPORT',
  sourceArchive: 'kb-export-267efc5e.zip',
  snapshotDate: '2026-10-04',
  rawRows: raw.length,
  distinctReports: unique.length,
  duplicateIds,
  groups: groups.map((g) => ({ ...g, reports: g.reports.map((r) => r.id) })),
  anomalousIds: notes.oneDayMove,
  anomalyInterpretation: 'Included in parser by supplied classifier; bodies do not establish a distinct shared cause.',
  timestamps: 'Preserve original +01:00/+02:00 offsets; no named desk time zone is declared.'
};
await mkdir(new URL('../evidence/', import.meta.url), { recursive: true });
await writeFile(new URL('../evidence/audit.json', import.meta.url), JSON.stringify(audit, null, 2) + '\n');
console.log(JSON.stringify({ rows: raw.length, distinct: unique.length, groups: groups.map((g) => ({cause: g.cause, count: g.reports.length, tags: g.taggedAs})), anomalies: notes.oneDayMove }));

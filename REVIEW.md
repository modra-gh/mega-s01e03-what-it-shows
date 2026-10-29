# S01E03 — prepared delivery

Public repository: https://github.com/modra-gh/mega-s01e03-what-it-shows

This directory contains the supplied support KB, the signed review, a proposed replacement triage decision, the two published issue bodies, reproducible count evidence, and the actual built desk pages. The review links to published issues 1 and 2. The course accepted both tickets on the first submission. Closing them records completion of this investigation/reporting deliverable, not shipment of production fixes.

## Reproduce

Use Node.js 24 or newer (the installed Svelte plugin declares support for Node 20.19, 22.12, or 24+). Dependencies are pinned in package-lock.json.

```
npm ci --ignore-scripts
node scripts/audit.mjs
npm run build
npm run preview -- --port 4173
```

Open `/kb/incidents/4471-review` in the preview. Its actual generated HTML is `build/kb/incidents/4471-review.html`, with supporting assets under `build/_app`. The source page is `src/routes/kb/incidents/4471-review/+page.svx`. The rendered stamp is derived by the original RenderStamp component from signature `modra-gh`.

## Validation

- Count audit: 427 rows, 412 distinct IDs, parser 379, hint 33. Fifteen overlap rows removed by ID.
- Full SvelteKit build and static prerender passed.
- Browser confirmed rendered counts, receipt/merge chronology, anomaly section, proposed policy links, and derived signature stamp.
- Browser changed report A from form to app: verdict changed from different causes to same cause, confirming client interactivity.
- Decision 0001 remains byte-for-byte unchanged from the supplied ZIP.
- No production application test or shipped fix is claimed. Five anomalous report bodies remain an explicit uncertainty within the supplied parser allocation.

## Planned issue titles

1. Shared date parser swaps day and month for day-first tenants — 379 reports
2. Booking-v3 date hint conflicts with tenant input order — 33 reports

The bodies are under issue-drafts/. The KB's operational guidance is marked proposed pending desk acceptance; the old accepted decision is preserved.

## Later desk outcome

The course page's engineering update reports parser FIXED and hint WON'T FIX because booking-v3 was retired. Parser closes as completed, hint as not planned. This supersedes the initial rationale that both could close merely because the triage deliverable was complete; the course rejected that closure. Historical export counts remain unchanged.

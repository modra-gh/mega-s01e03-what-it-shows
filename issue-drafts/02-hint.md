## Problem

Booking-v3 displays MM/DD/YYYY under the date field for day-first tenants, while the form reads the entered date in tenant order. A person following the hint can therefore book the wrong date. This is separate from the shared parser bug hidden in ticket #4471.

## Reports covered

**33 distinct reports** from the form channel on booking-v3: Alder Physio 12, Copper Studio 11, Pale Harbour 10. Received dates: 2026-04-17 through 2026-09-22. Full IDs: `evidence/audit.json`; regenerate with `node scripts/audit.mjs`.

The real allocation uses tenant locale, booking form, and channel. Of these 33 reports, intake guessed parser for 15 and hint for 18. Counting all hint tags would incorrectly give 41. The parser ticket covers the other 379 distinct reports, so the two allocations total 412 without overlap.

## Reproduction

1. Open Copper Studio's booking-v3 form, whose tenant locale is day-first.
2. Follow the printed MM/DD/YYYY hint and enter 01/06 intending January 6.
3. The form reads the tenant's day-first order and books June 1.

Expected: the hint, validation, and reader use the same date contract. Actual reported behavior: the hint teaches an order different from the reader. This reproduction is derived from the exported model, not a production app test.

## Evidence

- `src/lib/kb/causes.ts`: booking-v2 prints DD/MM/YYYY; booking-v3 prints MM/DD/YYYY. `causeOf` selects hint for day-first tenants on the form channel with the month-first hint.
- `src/lib/data/tenants/`: look up tenant configuration instead of trusting reporter browser locale.
- R-41230, Copper Studio form: "My client came on 1 June instead of 6 January. We sorted it out."
- R-41241, Alder Physio form: browser locale en-US does not change its tenant contract or hint allocation.

## Proposed correction and acceptance

Localize the form hint and align it with validation and parsing. Test day-first booking-v3 tenants with different browser locales, alongside booking-v2 and app/email paths. Keep this issue separate from the shared parser correction. No fix is claimed as shipped.

KB review source: `src/routes/kb/incidents/4471-review/+page.svx`. Rendered desk page: `build/kb/incidents/4471-review.html`.

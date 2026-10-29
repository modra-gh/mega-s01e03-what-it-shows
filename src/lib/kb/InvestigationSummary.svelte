<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { groupByCause, uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  const unique = uniqueById(reports as Report[]).filter((r) => r.mergedInto === 4471);
  const groups = groupByCause(unique, tenantOf);
  const firstReceived = [...unique].sort((a, b) => a.receivedAt.localeCompare(b.receivedAt))[0];
  const merged = [...unique].filter((r) => r.mergedAt).sort((a, b) => a.mergedAt!.localeCompare(b.mergedAt!));
  const firstMerge = merged[0]?.mergedAt;
  const firstMergeDay = firstMerge?.slice(0, 10);
  const firstDayMerges = merged.filter((r) => r.mergedAt?.startsWith(firstMergeDay!)).length;
  const anomalous = unique.filter((r) => notes.oneDayMove.includes(r.id));
</script>

<p>{reports.length} exported rows become <strong>{unique.length} distinct reports</strong> after removing {reports.length - unique.length} repeated IDs. Count report IDs once; intake tags are guesses, not cause labels.</p>

<table>
  <thead><tr><th>Problem</th><th>Reports</th><th>Ticket</th><th>Reproduction and next step</th></tr></thead>
  <tbody>
    {#each groups as g (g.cause)}
      <tr>
        <td><code>{g.cause}</code></td><td>{g.reports.length}</td>
        <td><a href="https://github.com/modra-gh/mega-s01e03-what-it-shows/issues/{g.cause === 'parser' ? 1 : 2}">{g.cause === 'parser' ? 'Shared date parser' : 'Booking-v3 date hint'}</a></td>
        <td>{g.cause === 'parser' ? 'A day-first tenant enters 07/04; shared parser interprets July 4 instead of April 7. Align parsing with the tenant input contract.' : 'A day-first tenant using booking-v3 sees MM/DD/YYYY, enters 01/06 for January 6, and the tenant-order form reads June 1. Localize the hint and input contract together.'}</td>
      </tr>
    {/each}
  </tbody>
</table>

<h2>Received is not merged</h2>
<p>The first report was received at <code>{firstReceived.receivedAt}</code>. The first merge was at <code>{firstMerge}</code>; {firstDayMerges} reports were merged on {firstMergeDay}. A merge spike shows desk processing, not an arrival spike. Preserve the timestamp offsets; the export does not declare a named desk time zone.</p>

<h2>Symptoms still needing investigation</h2>
<p>{anomalous.length} reports in the parser count were read as one-day moves. They remain included there under the supplied classifier, rather than becoming an additional disjoint count. Their bodies do not establish a shared root cause. Check event creation, invite generation, calendar import, and display timestamps before attributing them to date order or time zones.</p>
<ul>{#each anomalous as r (r.id)}<li><code>{r.id}</code>: {r.body}</li>{/each}</ul>

<h2>Scope of this evidence</h2>
<p>This is the supplied October 4 export. Components calculate from its JSON when the page is built or rendered; they do not fetch the current support queue. The tickets describe reported behavior, not deployed fixes. Refresh the export and re-run the calculation when new desk evidence arrives.</p>

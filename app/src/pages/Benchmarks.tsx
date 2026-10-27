import { BenchmarkBar, BenchmarkChip, Card, SegmentedControl, percentileOf } from '@ds';
import { BENCH, BENCH_SOURCES, COHORTS, type BenchId, type Cohort } from '../data';
import { useStore } from '../store';

/** Percentile for one of the creator's metrics against the selected peer group. */
export function useBench(id: BenchId) {
  const { cohort } = useStore();
  const m = BENCH[id];
  return percentileOf(m.value, m.peers[cohort]);
}

export function BenchChip({ id }: { id: BenchId }) {
  return <BenchmarkChip percentile={useBench(id)} />;
}

function Row({ id }: { id: BenchId }) {
  const { cohort } = useStore();
  const m = BENCH[id];
  const pct = useBench(id);
  return (
    <div className="bench">
      <div className="bench__head">
        <div><b>{m.label}</b><div className="faint small">{m.how}</div></div>
        <div className="bench__val"><b className="num">{m.fmt(m.value)}</b><BenchmarkChip percentile={pct} /></div>
      </div>
      <BenchmarkBar label={m.label} value={m.value} points={m.peers[cohort]} format={m.fmt} reference={m.reference} />
      <div className="note note--ai small"><b>EdgeAI:</b> {m.tip[cohort] ?? m.tip.default}</div>
    </div>
  );
}

/** Compares a creator's numbers with similar creators on Later, with published industry figures as an outside reference. */
export function HowYouCompare({ ids, title = 'How you compare' }: { ids: BenchId[]; title?: string }) {
  const { cohort, setCohort } = useStore();
  return (
    <Card title={title} subtitle={`Compared with ${COHORTS[cohort].n} ${COHORTS[cohort].label.toLowerCase()} on Later`}
>
      <div className="bench__cohort"><span className="faint small">Compare with</span><div className="scrollx"><SegmentedControl size="sm" label="Compare with" value={cohort} onChange={(c: Cohort) => setCohort(c)} options={(Object.keys(COHORTS) as Cohort[]).map(c => ({ value: c, label: COHORTS[c].short }))} /></div></div>
      <div className="stack" style={{ gap: 22 }}>{ids.map(id => <Row key={id} id={id} />)}</div>
      <details className="bench__about">
        <summary>About these comparisons</summary>
        <p>Peer groups are creators on Later with a similar niche and audience size. The bands are below typical (bottom quarter), typical (middle half), better than most, and top 10%. In this prototype the peer data is illustrative.</p>
        <p>Published benchmarks describe brand accounts and online stores rather than creators, so they appear only as a dashed reference line:</p>
        <ul>{BENCH_SOURCES.map(s => <li key={s.url}>{s.label}. <a href={s.url} target="_blank" rel="noreferrer">{s.src}</a></li>)}</ul>
      </details>
    </Card>
  );
}

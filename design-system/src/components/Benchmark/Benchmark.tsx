import { Pill, type PillTone } from '../Pill/Pill';
import './Benchmark.css';

/** Where a peer group sits, from the 10th to the 90th percentile. Higher is better. */
export interface Percentiles { p10: number; p25: number; p50: number; p75: number; p90: number }
export type BenchBand = 'below' | 'typical' | 'good' | 'top';

export const BAND_LABEL: Record<BenchBand, string> = { below: 'Below typical', typical: 'Typical', good: 'Better than most', top: 'Top 10%' };
const BAND_TONE: Record<BenchBand, PillTone> = { below: 'warning', typical: 'neutral', good: 'success', top: 'success' };

/** Estimate a percentile by interpolating between the known points. */
export function percentileOf(value: number, p: Percentiles): number {
  const pts: [number, number][] = [[p.p10, 10], [p.p25, 25], [p.p50, 50], [p.p75, 75], [p.p90, 90]];
  if (value <= pts[0][0]) return Math.max(1, Math.round(10 * (value / pts[0][0] || 0)));
  if (value >= pts[4][0]) return Math.min(99, Math.round(90 + 9 * Math.min(1, (value - p.p90) / (p.p90 - p.p75 || 1))));
  for (let i = 1; i < pts.length; i++) {
    const [v0, q0] = pts[i - 1], [v1, q1] = pts[i];
    if (value <= v1) return Math.round(q0 + ((value - v0) / (v1 - v0 || 1)) * (q1 - q0));
  }
  return 50;
}
export const bandOf = (pct: number): BenchBand => (pct >= 90 ? 'top' : pct >= 75 ? 'good' : pct >= 25 ? 'typical' : 'below');
const ordinal = (n: number) => `${n}${['th', 'st', 'nd', 'rd'][(n % 100 > 10 && n % 100 < 14) || n % 10 > 3 ? 0 : n % 10]}`;

export interface BenchmarkChipProps { percentile: number }
/** A compact verdict for a metric card or table cell. */
export function BenchmarkChip({ percentile }: BenchmarkChipProps) {
  const band = bandOf(percentile);
  return <Pill tone={BAND_TONE[band]} title={`${ordinal(percentile)} percentile among peers`}>{BAND_LABEL[band]}<span className="lo-sr-only">, {ordinal(percentile)} percentile among peers</span></Pill>;
}

export interface BenchmarkBarProps {
  /** Names the metric for screen readers, e.g. "Link conversion". */
  label: string;
  value: number;
  points: Percentiles;
  format?: (n: number) => string;
  /** Optional outside reference drawn as a dashed tick, e.g. an industry average. */
  reference?: { value: number; label: string };
}

/** Shows a value against a peer group's spread: below typical, typical (middle half), better than most, top 10%. */
export function BenchmarkBar({ label, value, points: p, format = n => String(n), reference }: BenchmarkBarProps) {
  const spread = p.p90 - p.p10 || 1;
  const lo = Math.max(0, Math.min(p.p10, value, reference?.value ?? Infinity) - spread * 0.2);
  const hi = Math.max(p.p90, value, reference?.value ?? -Infinity) + spread * 0.2;
  const x = (v: number) => `${((v - lo) / (hi - lo)) * 100}%`;
  const pct = percentileOf(value, p);
  return (
    <div className="lo-bench" role="img" aria-label={`${label}: you ${format(value)}, ${ordinal(pct)} percentile. Peer median ${format(p.p50)}; typical range ${format(p.p25)} to ${format(p.p75)}; top 10% from ${format(p.p90)}.${reference ? ` ${reference.label}: ${format(reference.value)}.` : ''}`}>
      <div className="lo-bench__track" aria-hidden="true">
        <i className="lo-bench__seg lo-bench__seg--below" style={{ left: 0, width: x(p.p25) }} />
        <i className="lo-bench__seg lo-bench__seg--typical" style={{ left: x(p.p25), width: `calc(${x(p.p75)} - ${x(p.p25)})` }} />
        <i className="lo-bench__seg lo-bench__seg--good" style={{ left: x(p.p75), width: `calc(${x(p.p90)} - ${x(p.p75)})` }} />
        <i className="lo-bench__seg lo-bench__seg--top" style={{ left: x(p.p90), right: 0 }} />
        <i className="lo-bench__median" style={{ left: x(p.p50) }} />
        {reference && <i className="lo-bench__ref" style={{ left: x(reference.value) }} />}
        <i className="lo-bench__you" style={{ left: x(value) }} />
      </div>
      <div className="lo-bench__labels" aria-hidden="true">
        <b style={{ left: `clamp(34px, ${x(value)}, calc(100% - 34px))` }}>You {format(value)}</b>
      </div>
      <div className="lo-bench__legend" aria-hidden="true">
        <span><i className="lo-bench__key lo-bench__key--median" />Median {format(p.p50)}</span>
        <span>Typical {format(p.p25)}–{format(p.p75)}</span>
        <span>Top 10% {format(p.p90)}+</span>
        {reference && <span><i className="lo-bench__key lo-bench__key--ref" />{reference.label} {format(reference.value)}</span>}
      </div>
    </div>
  );
}

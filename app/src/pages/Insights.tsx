import { useEffect, useRef, useState } from 'react';
import { Button, Card, CreatorRow, Icon, MetricCard, Pill, SegmentedControl, TabPanel, Tabs } from '@ds';
import { AUDIENCE, HALO, findCreator, money } from '../data';
import { useStore } from '../store';

/* Halo replay: daily sales on Fernway's own Link in bio, split into what was expected anyway,
   what creator links tracked, and the halo the links can't see. */
const N = 26;
const POSTS: [number, string, number, number][] = [[14, 'AB', 18000, 3.2], [15, 'LT', 22000, 4.5], [17, 'SS', 9620, 0.6], [19, 'MF', 34840, 2.4], [20, 'JO', 2410, 2.5], [21, 'AB', 9820, 1.4], [22, 'LT', 17260, 3.4]];
const SHARE = [0.45, 0.25, 0.14, 0.08, 0.05, 0.03];
const series = (() => {
  const base: number[] = [], tracked: number[] = [], halo: number[] = [];
  for (let d = 1; d <= N; d++) {
    const b = 1.2 + 0.25 * Math.sin(d * 0.9) + (d % 7 === 3 || d % 7 === 4 ? 0.3 : 0);
    let t = 0, h = 0;
    POSTS.forEach(([day, , link, lift]) => { const k = d - day; if (k >= 0) { if (k < 6) t += (link * SHARE[k]) / 1000; h += lift * Math.exp(-k / 2); } });
    base.push(b); tracked.push(t); halo.push(h);
  }
  return { base, tracked, halo, sumT: tracked.reduce((a, b) => a + b, 0), sumH: halo.reduce((a, b) => a + b, 0) };
})();
const EVENTS: [number, string][] = [[1, 'Before the campaign, sales through Fernway’s Link in bio hover around $1,200 a day.'], [8, 'Fall Trail ’26 begins. Creators are briefed and product ships.'], [14, 'Ari Bennett’s Reel goes live. Sales through his link spike right away.'], [15, 'Lena Tor’s TikTok lands. Two days later, Fernway’s own page is still selling.'], [17, 'Sun Shin’s video adds steady sales through her link.'], [19, 'Mo Farah-Lind’s Reel drives the biggest day of link sales.'], [20, 'Jules’s teaser gets few link clicks, but sales on Fernway’s own page jump.'], [22, 'Lena’s Reel sets off the largest halo of the campaign.']];

function HaloChart({ t, k }: { t: number; k: number }) {
  const W = 640, H = 280, L = 44, R = 14, T = 40, B = 28, max = 24;
  const x = (d: number) => L + ((d - 1) * (W - L - R)) / (N - 1), y = (v: number) => T + (H - T - B) * (1 - v / max);
  const end = 1 + t * (N - 1), fl = Math.floor(end), fr = end - fl;
  const at = (a: number[], d: number) => { const i = Math.floor(d) - 1, f = d - Math.floor(d); return i >= a.length - 1 ? a[a.length - 1] : a[i] + (a[i + 1] - a[i]) * f; };
  const days: number[] = []; for (let d = 1; d <= fl; d++) days.push(d); if (fr > 0.001) days.push(end);
  const L1 = days.map(d => at(series.base, d)), L2 = days.map((d, i) => L1[i] + at(series.tracked, d)), L3 = days.map((d, i) => L2[i] + k * at(series.halo, d));
  const area = (lo: number[] | null, hi: number[]) => `${days.map((d, i) => `${x(d).toFixed(1)},${y(hi[i]).toFixed(1)}`).join(' ')} ${days.map((d, i) => `${x(d).toFixed(1)},${y(lo ? lo[i] : 0).toFixed(1)}`).reverse().join(' ')}`;
  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Daily sales: expected baseline, sales tracked through creator links, and the halo bought on Fernway's own page, with creator posts marked">
      {[0, 12, 24].map(v => <g key={v}><line className="grid" x1={L} x2={W - R} y1={y(v)} y2={y(v)} /><text x={L - 8} y={y(v) + 4} textAnchor="end">${v}K</text></g>)}
      {[1, 8, 15, 22, 26].map(d => <text key={d} x={x(d)} y={H - 8} textAnchor={d === 1 ? 'start' : d === 26 ? 'end' : 'middle'}>Oct {d}</text>)}
      <line x1={x(8)} x2={x(8)} y1={T - 6} y2={y(0)} stroke="var(--lo-color-border-strong)" strokeDasharray="3 4" />
      <text x={x(8) + 6} y={y(max) + 12}>Campaign starts</text>
      {days.length > 1 && <>
        <polygon points={area(null, L1)} fill="var(--lo-color-chart-5)" opacity=".9" />
        <polygon points={area(L1, L2)} fill="var(--lo-color-creators)" opacity=".85" />
        {k > 0.005 && <polygon points={area(L2, L3)} fill="var(--lo-color-action)" opacity={0.85 * Math.min(1, k * 1.4)} />}
        <path d={days.map((d, i) => `${i ? 'L' : 'M'}${x(d).toFixed(1)} ${y(L3[i]).toFixed(1)}`).join(' ')} fill="none" stroke="var(--lo-color-text)" strokeWidth="1.5" opacity=".55" />
      </>}
      {POSTS.map(([day, initials], i) => {
        if (day > end) return null;
        const px = x(day), py = y(at(series.base, day) + at(series.tracked, day) + k * at(series.halo, day)), age = end - day, ly = T - 12 - (i % 2) * 13;
        return (
          <g key={i}>
            {age < 2.6 && [0, 1, 2].map(r => { const a = age - r * 0.45; if (a < 0 || a > 1.6) return null; return <circle key={r} cx={px} cy={py} r={6 + a * 34} fill="none" stroke="var(--lo-color-creators)" strokeWidth="2" opacity={Math.max(0, 0.75 * (1 - a / 1.6))} />; })}
            <line x1={px} x2={px} y1={ly + 3} y2={py - 6} stroke="var(--lo-color-creators)" opacity=".35" />
            <circle cx={px} cy={py} r="5" fill="var(--lo-color-creators)" stroke="var(--lo-color-surface)" strokeWidth="2" />
            <text x={px} y={ly} textAnchor="middle" style={{ fontSize: 10.5, fill: 'var(--lo-color-creators)', fontWeight: 700 }}>{initials}</text>
          </g>
        );
      })}
      {t < 0.999 && <line x1={x(end)} x2={x(end)} y1={T - 6} y2={y(0)} stroke="var(--lo-color-text)" strokeWidth="1.5" />}
    </svg>
  );
}

function HaloReplay() {
  const [t, setT] = useState(1);
  const [k, setK] = useState(0);
  const [mode, setMode] = useState<'links' | 'full'>('links');
  const [playing, setPlaying] = useState(false);
  const raf = useRef(0);
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const animate = (from: number, to: number, ms: number, set: (v: number) => void, ease: boolean, onDone?: () => void) => {
    cancelAnimationFrame(raf.current);
    const t0 = performance.now();
    const step = (n: number) => { const p = Math.min(1, (n - t0) / ms), e = ease ? 1 - Math.pow(1 - p, 3) : p; set(from + (to - from) * e); if (p < 1) raf.current = requestAnimationFrame(step); else onDone?.(); };
    raf.current = requestAnimationFrame(step);
  };
  const switchMode = (m: 'links' | 'full') => {
    setMode(m);
    const to = m === 'full' ? 1 : 0;
    if (playing || reduce) { setK(to); return; }
    animate(k, to, m === 'full' ? 1500 : 700, setK, true);
  };
  const play = (fromStart = false) => {
    if (playing && !fromStart) { cancelAnimationFrame(raf.current); setPlaying(false); return; }
    setK(mode === 'full' ? 1 : 0);
    if (reduce) { setT(1); return; }
    const start = fromStart || t > 0.99 ? 0 : t;
    setPlaying(true);
    animate(start, 1, 10000 * (1 - start), setT, false, () => setPlaying(false));
  };

  const end = 1 + t * (N - 1), fl = Math.floor(end), fr = end - fl;
  const cum = (a: number[]) => a.reduce((s, v, i) => s + (i + 1 <= fl ? v : i + 1 === fl + 1 ? v * fr : 0), 0);
  const tracked = Math.round((cum(series.tracked) / series.sumT) * 113950), share = cum(series.halo) / series.sumH, done = t > 0.999, hidden = k < 0.05;
  const caption = done ? (hidden ? 'This is what link tracking reports: $113,950 in creator sales. It can’t see shoppers who watched a creator, then bought on Fernway’s own page.' : null) : EVENTS.filter(e => e[0] <= end).pop()![1];

  return (
    <Card title="What creators really drove" subtitle="Fall Trail ’26 · daily sales influenced by creator posts"
      actions={<SegmentedControl label="Halo view" value={mode} onChange={switchMode} options={[{ value: 'links', label: 'What links see' }, { value: 'full', label: 'Full picture' }]} />}>
      <div className="halo">
        <div style={{ minWidth: 0 }}>
          <HaloChart t={t} k={k} />
          <div className="legend" style={{ marginTop: 6 }}>
            <span><i style={{ background: 'var(--lo-color-chart-5)' }} />Expected anyway</span>
            <span><i style={{ background: 'var(--lo-color-creators)' }} />Tracked through creator links</span>
            <span><i style={{ background: 'var(--lo-color-action)' }} />Halo: bought on Fernway’s own page</span>
          </div>
          <div className="row" style={{ marginTop: 12, flexWrap: 'nowrap', gap: 8 }}>
            <button className="playbtn playbtn--pri" aria-label={playing ? 'Pause' : 'Play'} onClick={() => play()}><Icon name={playing ? 'pause' : 'play'} size={18} /></button>
            <button className="playbtn" aria-label="Replay from the start" title="Replay from the start" onClick={() => play(true)}><Icon name="refresh" size={17} /></button>
            <span className="num" style={{ fontWeight: 600, minWidth: 50, marginLeft: 4 }}>Oct {Math.min(26, Math.round(end))}</span>
            <input className="range" type="range" min={0} max={1000} value={Math.round(t * 1000)} aria-label="Scrub through the campaign" onChange={e => { cancelAnimationFrame(raf.current); setPlaying(false); setT(+e.target.value / 1000); }} />
          </div>
          <p className="halo__cap" aria-live="polite">{caption ?? <>For every $1 tracked through creator links, creators drove another <b>$0.33–0.46</b> through Fernway’s own Link in bio.</>}</p>
        </div>
        <div className="halo__side">
          <div><span className="lbl"><i className="sw" style={{ background: 'var(--lo-color-creators)' }} />Tracked through creator links</span><div className="halo__num">{money(tracked)}</div></div>
          <div className={`halo__box ${hidden ? 'halo__box--dim' : ''}`}>
            <span className="lbl"><i className="sw" style={{ background: 'var(--lo-color-action)' }} />Halo through Fernway’s page</span>
            <div className="halo__num">{hidden ? <span className="faint" style={{ fontSize: 15, fontWeight: 600 }}>Not visible to link tracking</span> : done ? '$38–52K' : `$${Math.round(share * 45 * k)}K`}</div>
          </div>
          <div className="row" style={{ gap: 20 }}>
            <div><span className="lbl">ROAS</span><div className="halo__num halo__num--sm">{hidden ? '6.3×' : done && k > 0.95 ? '7.6–8.1×' : `${(6.3 + 1.55 * share * k).toFixed(1)}×`}</div></div>
            <div><span className="lbl">New followers</span><div className="halo__num halo__num--sm">{hidden ? '—' : `+${Math.round(share * 5950 * k).toLocaleString()}`}</div></div>
          </div>
          {hidden && !playing && <Button variant="primary" icon="spark" className="pulse" onClick={() => switchMode('full')}>Reveal what links can’t see</Button>}
        </div>
      </div>
    </Card>
  );
}

function HaloTab() {
  const { open, say } = useStore();
  return <>
    <HaloReplay />
    <Card title="What stands out" actions={<><Button size="sm" variant="primary" onClick={() => say('Halo added to rate suggestions for Jules, Lena, Ari and Mo')}>Use halo in renewal rates</Button><Button size="sm" icon="copy" onClick={() => say('Shareable report link created')}>Share with finance</Button></>}>
      <div className="three">
        <div className="note note--ai"><b>Jules’s teaser sold more through your page than his link.</b> About $5–8K through Fernway’s Link in bio, versus $2,410 through his own. Pricing his next deal on tracked sales alone would undervalue him.</div>
        <div className="note note--ai"><b>Lena Tor’s halo adds about 45%</b> to her tracked sales, and she brought the most new followers (+2,310).</div>
        <div className="note note--ai"><b>Paid amplification shows little halo.</b> Days with boosted posts and no new creator content stayed inside the expected range.</div>
      </div>
    </Card>
    <Card title="Halo by creator" subtitle="Ranges are 80% intervals" flush>
      <div className="scrollx">
        <table className="tbl">
          <thead><tr><th>Creator</th><th className="r">Posts</th><th className="r">Tracked sales</th><th className="r">Estimated halo</th><th className="r">Halo vs. tracked</th><th className="r">New followers</th><th className="r">Brand mentions</th><th>Confidence</th></tr></thead>
          <tbody>
            {HALO.map(h => (
              <tr key={h.id}>
                <td><button className="linkbtn" onClick={() => open({ kind: 'profile', id: h.id })}>{findCreator(h.id)?.name}</button></td>
                <td className="r">{h.posts}</td><td className="r">{money(h.tracked)}</td><td className="r"><b>${h.lo / 1000}–{h.hi / 1000}K</b></td>
                <td className="r">{h.lo > h.tracked ? `${(h.lo / h.tracked).toFixed(1)}–${(h.hi / h.tracked).toFixed(1)}×` : `${Math.round((h.lo / h.tracked) * 100)}–${Math.round((h.hi / h.tracked) * 100)}%`}</td>
                <td className="r">+{h.followers.toLocaleString()}</td><td className="r">{h.mentions}</td>
                <td><Pill tone={h.conf === 'High' ? 'success' : 'warning'}>{h.conf}</Pill></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <details style={{ padding: '14px 20px 20px' }}><summary style={{ cursor: 'pointer', fontWeight: 600 }}>How this is calculated</summary><p className="muted small" style={{ marginTop: 8, maxWidth: '72ch' }}>We forecast what Fernway’s Link in bio sales, follower growth and mentions would have been from the 6 weeks before the campaign, adjusting for day of week and paid spend. Lift above that forecast in the 4 days after each creator post is credited to that creator, split by overlap when posts land close together. Sales already counted through a creator’s own link are excluded, so nothing is counted twice.</p></details>
    </Card>
  </>;
}

function AudienceTab() {
  const { open, invited, invite } = useStore();
  const [filter, setFilter] = useState<'all' | 'ugc' | 'inbox' | 'sells'>('all');
  const list = AUDIENCE.filter(a => filter === 'all' || (filter === 'ugc' && a.ugc) || (filter === 'inbox' && a.inbox) || (filter === 'sells' && a.sold));
  return <>
    <div className="metrics">
      <MetricCard kind="people" label="People with creator potential" value="214" note="Across your audience" />
      <MetricCard kind="people" label="Strong matches" value="38" note="Fit score 75 or higher" />
      <MetricCard kind="money" label="Already sell your products" value="37" note="Through Later Creator links" />
      <MetricCard kind="people" label="Top matches below" value="6" note="Ranked by fit score" />
    </div>
    <div className="g2">
      <Card title="Where they come from">
        <div className="three">
          {[['Posted about you', '142', 'UGC in Create'], ['Messaged you', '61', 'Comments and DMs in Engage'], ['Sell your products', '37', 'Links in Later Creator']].map(([t, n, d]) => (
            <div key={t} className="note" style={{ background: 'var(--lo-color-grow-subtle)' }}><span style={{ color: 'var(--lo-color-grow)', fontWeight: 600 }}>{t}</span><div className="cu num" style={{ fontSize: 18, fontWeight: 700 }}>{n}</div><span className="muted">{d}</span></div>
          ))}
        </div>
        <p className="muted small" style={{ marginTop: 12 }}>No single Later product can see all three. Together they find people who already love the brand and have shown they can sell it.</p>
      </Card>
      <Card title="Why start here">
        <div className="note note--ai">In Spring Trail ’26, the 4 creators recruited from Fernway’s own audience converted <b>2.1×</b> better and cost <b>41% less per order</b> than creators found through search.</div>
        <p className="faint small" style={{ marginTop: 10 }}>Only people who post publicly, message you, or have joined Later Creator appear here. Shopper data stays aggregated.</p>
      </Card>
    </div>
    <Card title="Top matches" actions={<SegmentedControl label="Filter matches" value={filter} onChange={setFilter} options={[{ value: 'all', label: 'All' }, { value: 'ugc', label: 'Posted about you' }, { value: 'inbox', label: 'Messaged you' }, { value: 'sells', label: 'Sell your products' }]} />}>
      {list.map(a => (
        <CreatorRow key={a.id} name={a.name} handle={a.handle} followers={a.followers} fit={a.fit} source="audience"
          reason={`${a.reason}${a.sold ? ` · ${money(a.sold)} sold in 90 days` : ''} · ${a.rate}`}
          onOpen={() => open({ kind: 'profile', id: a.id })}
          trailing={invited.has(a.id) ? <Pill>Invited</Pill> : <Button size="sm" onClick={() => invite(a.id, a.name, a.rate)}>Invite</Button>} />
      ))}
    </Card>
  </>;
}

export function Insights({ tab }: { tab: 'halo' | 'audience' }) {
  const { go } = useStore();
  return (
    <div className="stack">
      <div className="head"><div><h1>Insights</h1><p className="muted">Answers that need your social, creator and sales data together. Each one shows how it was worked out.</p></div></div>
      <Tabs idBase="insights" label="Insights" value={tab} onChange={t => go({ page: 'insights', tab: t })} tabs={[{ value: 'halo', label: 'Creator halo' }, { value: 'audience', label: 'From your audience' }]} />
      <TabPanel idBase="insights" value={tab}>
      {tab === 'halo' ? <HaloTab /> : <AudienceTab />}
      </TabPanel>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Button, Card, CreatorRow, Icon, MetricCard, Pill, Tabs } from '@ds';
import { BOOSTS, BRANDS, CAMPAIGNS, CAMP_STATUS, OPPORTUNITIES, PROMOS, PIPELINE, RECOMMENDED, RESULTS, STAGES, findCreator, money, type CampTab } from '../data';
import { useStore } from '../store';

function Crumbs({ name }: { name: string }) {
  const { go } = useStore();
  return <div className="crumb"><button onClick={() => go({ page: 'tool', tool: 'campaigns' })}>Campaigns</button><Icon name="chevronRight" size={14} /><span>{name}</span></div>;
}

export function CampaignList() {
  const { go, role } = useStore();
  if (role === 'creator') return <Opportunities />;
  return (
    <div className="stack">
      <div className="head">
        <div><h1>Creator campaigns</h1><p className="muted">Every creator program in one place, whether your team runs it or Later’s does. Sales come from the same links creators manage in Earn.</p></div>
        <Button variant="primary" icon="spark" onClick={() => go({ page: 'campaign', id: 'wl' })}>Plan with EdgeAI</Button>
      </div>
      <div className="metrics">
        <MetricCard kind="money" label="Committed budget" value="$108,000" note="2 active campaigns" />
        <MetricCard kind="money" label="Attributed sales, 2026" value="$427,200" note="Across 4 campaigns" />
        <MetricCard kind="rate" label="Blended ROAS" value="4.3×" note="Target 4.0×" />
        <MetricCard kind="people" label="Creators worked with" value="27" note="14 rebooked" />
      </div>
      <Card flush>
        <div className="scrollx">
          <table className="tbl">
            <thead><tr><th>Campaign</th><th>Status</th><th>Run by</th><th>Dates</th><th>Budget used</th><th className="r">Sales</th><th className="r">ROAS</th></tr></thead>
            <tbody>
              {CAMPAIGNS.map(c => (
                <tr key={c.id}>
                  <td><button className="linkbtn" onClick={() => go({ page: 'campaign', id: c.id })}>{c.name}</button><div className="faint small">{c.goal}</div></td>
                  <td><Pill tone={CAMP_STATUS[c.status][1]}>{CAMP_STATUS[c.status][0]}</Pill></td>
                  <td className="muted small">{c.mode}</td>
                  <td className="small" style={{ whiteSpace: 'nowrap' }}>{c.dates}</td>
                  <td style={{ minWidth: 150 }}><div className="meter"><i style={{ width: `${Math.round((c.spent / c.budget) * 100)}%` }} /></div><div className="faint" style={{ fontSize: 11.5, marginTop: 4 }}>{money(c.spent)} of {money(c.budget)}</div></td>
                  <td className="r">{c.sales ? money(c.sales) : '—'}</td>
                  <td className="r">{c.roas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Pacing() {
  const W = 640, H = 230, L = 46, R = 14, T = 14, B = 30, max = 60, labels = ['Oct 8', 'Oct 14', 'Oct 20', 'Oct 26', 'Nov 1', 'Nov 7'];
  const x = (i: number) => L + (i * (W - L - R)) / (labels.length - 1), y = (v: number) => T + (H - T - B) * (1 - v / max);
  const line = (v: number[]) => v.map((n, i) => `${i ? 'L' : 'M'}${x(i)} ${y(n)}`).join(' ');
  const actual = [0, 7.9, 17.6, 29.4], plan = [0, 9.6, 19.2, 28.8, 38.4, 48];
  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Cumulative spend versus plan: $29,400 spent against $28,800 planned by Oct 26">
      {[0, 30, 60].map(t => <g key={t}><line className="grid" x1={L} x2={W - R} y1={y(t)} y2={y(t)} /><text x={L - 8} y={y(t) + 4} textAnchor="end">${t}K</text></g>)}
      {labels.map((l, i) => <text key={l} x={x(i)} y={H - 8} textAnchor={i === 0 ? 'start' : i === labels.length - 1 ? 'end' : 'middle'}>{l}</text>)}
      <path d={`${line(actual)} L${x(3)} ${y(0)} L${x(0)} ${y(0)}Z`} fill="var(--lo-color-action)" opacity=".12" />
      <path d={line(plan)} fill="none" stroke="var(--lo-color-text-tertiary)" strokeWidth="1.5" strokeDasharray="5 5" />
      <path d={line(actual)} fill="none" stroke="var(--lo-color-action)" strokeWidth="2.25" />
      <circle cx={x(3)} cy={y(29.4)} r="4" fill="var(--lo-color-action)" />
    </svg>
  );
}

const SUGGESTIONS = [
  { id: 'r1', t: 'Move $4,000 from paid amplification to 2 micro-creators', i: '+9% projected sales at the same spend', m: 'Micro-creators in this campaign return $9.20 per dollar; paid returns $4.23.', done: 'Budget moved. 2 micro-creator slots added.' },
  { id: 'r2', t: 'Boost @mofl’s Reel with partnership ads', i: '+$6–8K sales, about 5.9× ROAS', m: 'Highest purchase rate in the campaign (9.3% of clicks).', done: 'Partnership ad drafted for @mofl’s Reel' },
  { id: 'r3', t: 'Extend Lena Tor’s usage rights by 60 days', i: 'Your best-performing ad creative', m: '2.1% click-through as a paid ad vs. a 0.9% average.', done: 'Usage extension sent to Lena Tor for approval' },
];

function FallTrail({ tab }: { tab: CampTab }) {
  const { go, open, invited, invite, say } = useStore();
  const [applied, setApplied] = useState<string[]>([]);
  const setTab = (t: CampTab) => go({ page: 'campaign', id: 'ft', tab: t });
  const rows = Object.entries(RESULTS).sort((a, b) => b[1][4] - a[1][4]);
  return (
    <div className="stack">
      <Crumbs name="Fall Trail ’26" />
      <div className="head">
        <div><h1>Fall Trail ’26</h1><p className="muted"><Pill tone="success">Live</Pill>&nbsp; Drive sales · Oct 8 – Nov 7 · Self-run</p></div>
        <div className="row"><Button icon="copy" onClick={() => say('Shareable campaign report link created')}>Share report</Button><Button variant="primary" icon="plus" onClick={() => setTab('creators')}>Add creators</Button></div>
      </div>
      <Tabs label="Campaign sections" value={tab} onChange={setTab} tabs={[{ value: 'overview', label: 'Overview' }, { value: 'creators', label: 'Creators', count: 1 }, { value: 'results', label: 'Results' }]} />
      {tab === 'overview' && <>
        <div className="metrics">
          <MetricCard kind="money" label="Budget" value="$48,000" note="Flight day 18 of 30" />
          <MetricCard kind="money" label="Spent" value="$29,400" note="61% · pacing 1 pt ahead" />
          <MetricCard kind="people" label="Creators" value="9 of 12" note="3 in contracting" />
          <MetricCard kind="money" label="Attributed sales" value="$186,200" delta="+$21K" note="this week" />
          <MetricCard kind="rate" label="ROAS" value="6.3×" note="Target 4.5×" />
        </div>
        <div className="g2">
          <Card title="Spend pacing" actions={<div className="legend"><span><i style={{ background: 'var(--lo-color-action)' }} />Actual</span><span><i style={{ background: 'var(--lo-color-text-tertiary)' }} />Plan</span></div>}><Pacing /></Card>
          <Card title="EdgeAI suggestions" actions={<Pill tone="action">{SUGGESTIONS.length - applied.length} open</Pill>}>
            {SUGGESTIONS.map(s => (
              <div key={s.id} className="li" style={{ alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--lo-color-action)', marginTop: 2 }}><Icon name="spark" size={16} /></span>
                <div className="grow"><b>{s.t}</b><div className="up small">{s.i}</div><div className="faint small">{s.m}</div></div>
                {applied.includes(s.id) ? <Pill tone="success">Applied</Pill> : <Button size="sm" onClick={() => { setApplied(a => [...a, s.id]); say(s.done); }}>Apply</Button>}
              </div>
            ))}
          </Card>
        </div>
      </>}
      {tab === 'creators' && <>
        <Card title="Creator pipeline" subtitle="Select a name for the full profile">
          {STAGES.slice().reverse().map((stage, ri) => {
            const i = STAGES.length - 1 - ri;
            const list = PIPELINE.filter(c => c.stage === i).concat(i === 1 ? RECOMMENDED.filter(c => invited.has(c.id)) : []);
            if (!list.length) return null;
            return (
              <div key={stage} style={{ marginBottom: 8 }}>
                <div className="lbl" style={{ marginTop: 8 }}>{stage} · {list.length}</div>
                {list.map(c => <CreatorRow key={c.id} name={c.name} handle={c.handle} followers={c.followers} tier={c.tier} fit={c.fit} reason={c.note ?? 'Invited today'} onOpen={() => open({ kind: 'profile', id: c.id })} trailing={c.id === 'jo' ? <Button size="sm" variant="primary" onClick={() => open({ kind: 'post', id: 'p3' })}>Review draft</Button> : undefined} />)}
              </div>
            );
          })}
        </Card>
        <Card title="Recommended creators" subtitle="EdgeAI ranks fit from your past campaigns, audience match and purchase data. Rates come from the incentive advisor.">
          {RECOMMENDED.map(c => (
            <CreatorRow key={c.id} name={c.name} handle={c.handle} followers={c.followers} tier={c.tier} fit={c.fit} reason={`${c.reason} · ${c.rate}`}
              onOpen={() => open({ kind: 'profile', id: c.id })}
              trailing={<>{c.risk && <Pill tone="warning" icon="alert">Review</Pill>}{invited.has(c.id) ? <Pill>Invited</Pill> : <Button size="sm" onClick={() => invite(c.id, c.name, c.rate)}>Invite</Button>}</>} />
          ))}
        </Card>
      </>}
      {tab === 'results' && (
        <Card title="Creator performance" flush>
          <div className="scrollx">
            <table className="tbl">
              <thead><tr><th>Creator</th><th className="r">Reach</th><th className="r">Engagement</th><th className="r">Clicks</th><th className="r">Orders</th><th className="r">Sales</th><th className="r">Cost</th><th className="r">Cost per order</th><th className="r">ROAS</th></tr></thead>
              <tbody>
                {rows.map(([id, r]) => (
                  <tr key={id}>
                    <td><button className="linkbtn" onClick={() => open({ kind: 'profile', id })}>{findCreator(id)?.name}</button></td>
                    <td className="r">{r[0]}K</td><td className="r">{r[1]}%</td><td className="r">{r[2].toLocaleString()}</td><td className="r">{r[3]}</td>
                    <td className="r">{money(r[4])}</td><td className="r">{money(r[5])}</td><td className="r">{money(Math.round((r[5] / r[3]) * 100) / 100)}</td><td className="r">{(r[4] / r[5]).toFixed(1)}×</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

export function CampaignDetail({ id, tab = 'overview' }: { id: string; tab?: CampTab }) {
  const { go, agent } = useStore();
  const c = CAMPAIGNS.find(x => x.id === id);
  if (!c) return null;
  if (id === 'ft') return <FallTrail tab={tab} />;
  const head = <><Crumbs name={c.name} /><div className="head"><div><h1>{c.name}</h1><p className="muted"><Pill tone={CAMP_STATUS[c.status][1]}>{agent.state.sent && id === 'wl' ? 'Planning' : CAMP_STATUS[c.status][0]}</Pill>&nbsp; {c.goal} · {c.dates} · {c.mode}</p></div></div></>;
  if (id === 'wl') {
    return (
      <div className="stack">
        {head}
        <div className="g2">
          <Card title="Draft brief" actions={agent.state.started ? <Button variant="primary" icon="arrow" onClick={() => go({ page: 'agent' })}>Open the agent run</Button> : <Button variant="primary" icon="spark" onClick={() => { agent.start(); go({ page: 'agent' }); }}>Let EdgeAI plan it</Button>}>
            {[['Goal', c.goal], ['Budget', money(c.budget)], ['Products', 'Alder jacket'], ['Audience', 'Hikers 25–34, winter campers'], ['Dates', c.dates]].map(([l, v]) => <div key={l} className="li"><span className="faint" style={{ width: 90 }}>{l}</span><b className="grow">{v}</b></div>)}
          </Card>
          <Card title="What EdgeAI will do">
            <ol className="lines">
              <li>Gather context from your last two campaigns, halo results and your audience</li>
              <li>Draft the brief, then wait for your review</li>
              <li>Build a shortlist and price offers in the fair range</li>
              <li>Wait for your approval before committing any budget</li>
              <li>Check availability and stop on conflicts</li>
              <li>Show you every invite before anything is sent</li>
            </ol>
          </Card>
        </div>
      </div>
    );
  }
  return (
    <div className="stack">
      {head}
      {c.status === 'complete'
        ? <div className="metrics"><MetricCard kind="volume" label="Impressions" value="41M" /><MetricCard kind="money" label="Earned media value" value="$1.1M" /><MetricCard kind="money" label="Attributed sales" value="$241,000" /><MetricCard kind="rate" label="ROAS" value="3.4×" /></div>
        : <Card title="Program timeline" subtitle="Run by Later’s team">
            {[['Strategy approved', 'Oct 21', 'success'], ['Creator sourcing', 'Nov 3 – Nov 7', 'action'], ['Your creator approvals', 'Nov 10', 'warning'], ['Content production', 'Nov 10 – Nov 18', 'neutral'], ['Live and optimizing', 'Nov 20 – Dec 15', 'neutral']].map(([s, d, t]) => (
              <div key={s} className="li"><span className="grow"><b>{s}</b></span>{t === 'warning' && <Pill tone="warning">Needs you</Pill>}<span className="faint small">{d}</span></div>
            ))}
          </Card>}
    </div>
  );
}

function Opportunities() {
  const { say, route, makeLink } = useStore();
  const fromRoute = (route.page === 'tool' && route.tab) as OppTab | undefined;
  const [tab, setTab] = useState<OppTab>(fromRoute || 'deals');
  useEffect(() => { if (fromRoute) setTab(fromRoute); }, [route]); // eslint-disable-line react-hooks/exhaustive-deps
  const [status, setStatus] = useState<Record<string, string>>(Object.fromEntries(OPPORTUNITIES.map(o => [o.id, o.status])));
  const [openBoost, setOpenBoost] = useState<string | null>('b1');
  const act = (id: string, s: string, msg: string) => { setStatus(x => ({ ...x, [id]: s })); say(msg); };
  const brand = (name: string) => BRANDS.find(b => b.name === name)!;
  const usd = (n: number) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (
    <div className="stack">
      <div className="head"><div><h1>Opportunities</h1><p className="muted">Paid brand deals, commission boosts and promotions in one place. Accepted deals land in Plan for posting; everything pays out through Earn.</p></div></div>
      <Tabs label="Opportunities" value={tab} onChange={setTab} tabs={[{ value: 'deals', label: 'Brand deals', count: Object.values(status).filter(s => s === 'invite').length }, { value: 'boosts', label: `Boosts · ${BOOSTS.length} live` }, { value: 'promos', label: 'Promotions' }]} />
      {tab === 'deals' && OPPORTUNITIES.map(o => {
        const s = status[o.id];
        return (
          <Card key={o.id} title={o.name} subtitle={`${o.brand} · ${o.pay} · ${o.due}`} actions={<>
            <Pill tone="action">{o.match}% match</Pill>
            {s === 'active' && <Pill tone="success">Active</Pill>}
            {s === 'invite' && <><Button size="sm" onClick={() => act(o.id, 'declined', 'Invite declined')}>Decline</Button><Button size="sm" variant="primary" onClick={() => act(o.id, 'accepted', `${o.brand} accepted. The brief is in Plan.`)}>Accept</Button></>}
            {s === 'open' && <Button size="sm" onClick={() => act(o.id, 'applied', `Applied to ${o.brand}`)}>Apply</Button>}
            {s === 'applied' && <Pill>Applied</Pill>}{s === 'accepted' && <Pill tone="success">Accepted</Pill>}{s === 'declined' && <Pill>Declined</Pill>}
          </>} />
        );
      })}
      {tab === 'boosts' && <>
        <p className="faint small" style={{ margin: 0 }}>Boosts add to a brand’s base commission for a limited time on qualifying products. Make a link to any listed product to take part.</p>
        <div className="boosts">
          {BOOSTS.map(b => {
            const isOpen = openBoost === b.id;
            return (
              <Card key={b.id} title={b.name} subtitle={`${b.brand} · ${b.dates}`} selected={isOpen} actions={b.isNew ? <Pill tone="success">New</Pill> : undefined}>
                <div className="rates">
                  <div><span className="lbl">Base</span><b className="num">{b.base}%</b></div>
                  <div className="rates__boost"><span className="lbl">Boost</span><b className="num">+{b.boost}%</b></div>
                  <div><span className="lbl">Total</span><b className="num">up to {+(b.base + b.boost).toFixed(1)}%</b></div>
                </div>
                {isOpen ? <div className="stack" style={{ gap: 8, marginTop: 14 }}>
                  <span className="lbl">Your earnings from this boost</span>
                  <div className="rates rates--sm"><div><span className="lbl">Base</span><b className="num">{usd(b.earned[0])}</b></div><div className="rates__boost"><span className="lbl">Boost</span><b className="num">+{usd(b.earned[1])}</b></div><div><span className="lbl">Total</span><b className="num">{usd(b.earned[0] + b.earned[1])}</b></div></div>
                  <span className="lbl" style={{ marginTop: 6 }}>Qualifying products</span>
                  {b.items.map(it => <div key={it} className="li"><span className="grow">{it}</span><Button size="sm" icon="bolt" onClick={() => makeLink(brand(b.brand), it, b.base + b.boost)}>Quick link</Button></div>)}
                  <span className="faint small">Subject to returns and reversals.</span>
                </div> : <Button size="sm" variant="ghost" icon="chevronDown" onClick={() => setOpenBoost(b.id)}>Details and products</Button>}
              </Card>
            );
          })}
        </div>
      </>}
      {tab === 'promos' && <Card title="Featured promotions" subtitle="Brand sales worth posting about. A Quick link copies a link to the sale straight away." flush>
        {PROMOS.map(p => (
          <div key={p.brand} className="li li--pad">
            <span className="brand__logo" aria-hidden="true">{p.brand[0]}</span>
            <div className="grow"><b>{p.brand}</b><div className="small">{p.text}</div></div>
            <Pill tone={['Oct 29', 'Oct 31'].includes(p.ends) ? 'warning' : 'neutral'}>Ends {p.ends}</Pill>
            <Button size="sm" icon="bolt" onClick={() => makeLink(brand(p.brand), `${p.brand} sale`)}>Quick link</Button>
          </div>
        ))}
      </Card>}
    </div>
  );
}

type OppTab = 'deals' | 'boosts' | 'promos';

import { Button, Card, Icon, Pill } from '@ds';
import { QUEUE, ROLES, TILES, TOOLS, toolLabel } from '../data';
import { useStore } from '../store';
import { toolRoute } from '../shell/Shell';
import { BonusTracker } from './Earn';

function Spark({ values }: { values: number[] }) {
  const W = 200, H = 44, mx = Math.max(...values), mn = Math.min(...values);
  const x = (i: number) => (i * W) / (values.length - 1), y = (n: number) => 4 + (H - 8) * (1 - (n - mn) / (mx - mn || 1));
  const d = values.map((n, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(n).toFixed(1)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 44, display: 'block' }} aria-hidden="true">
      <path d={`${d} L${W} ${H} L0 ${H}Z`} fill="var(--lo-color-action)" opacity=".12" />
      <path d={d} fill="none" stroke="var(--lo-color-action)" strokeWidth="2" strokeLinejoin="round" />
      <circle cx={x(values.length - 1)} cy={y(values[values.length - 1])} r="3.5" fill="var(--lo-color-action)" />
    </svg>
  );
}

function Summary() {
  const { role, go } = useStore();
  if (role === 'brand') {
    return (
      <Card title="Fall Trail ’26" actions={<Pill tone="success">On track</Pill>}>
        <div className="stack" style={{ gap: 14 }}>
          <div>
            <div className="row" style={{ justifyContent: 'space-between', fontSize: 13 }}><span>Budget spent</span><span className="num">$29,400 of $48,000</span></div>
            <div className="meter" style={{ marginTop: 6 }}><i style={{ width: '61%' }} /></div>
            <div className="row faint small" style={{ justifyContent: 'space-between', marginTop: 4 }}><span>Flight day 18 of 30</span><span>60% elapsed</span></div>
          </div>
          <div className="three">
            {[['Sales', '$186K'], ['ROAS', '6.3×'], ['Live', '9']].map(([l, v]) => <div key={l}><span className="lbl">{l}</span><div className="cu num" style={{ fontSize: 18 }}>{v}</div></div>)}
          </div>
          <div className="note note--ai"><b>EdgeAI:</b> Shifting $4K from paid amplification to two more micro-creators like @mofl would raise projected sales about 9% at the same spend.</div>
          <Button icon="arrow" onClick={() => go({ page: 'campaign', id: 'ft' })}>Open campaign</Button>
        </div>
      </Card>
    );
  }
  if (role === 'creator') {
    return (
      <Card title="October earnings" actions={<Pill tone="success">+38% vs Sept</Pill>}>
        <div className="cu num" style={{ fontSize: 34, lineHeight: 1, fontWeight: 600 }}>$4,812.40</div>
        <div style={{ margin: '12px 0' }}><Spark values={[2.1, 2.6, 2.2, 3.0, 3.4, 3.1, 3.8, 4.0, 3.7, 4.4, 4.8]} /></div>
        {[['Next payout · Nov 1', '$3,576.40'], ['Pending (in return window)', '$1,236.00'], ['Commission + Fernway fee', '$3,012 + $1,800']].map(([l, v]) => <div key={l} className="li"><span className="grow">{l}</span><b className="num">{v}</b></div>)}
        <div style={{ marginTop: 14 }}><BonusTracker compact /></div>
      </Card>
    );
  }
  return (
    <Card title="Today and tomorrow" actions={<Button size="sm" variant="ghost" onClick={() => go({ page: 'tool', tool: 'plan' })}>Calendar</Button>}>
      {[['Mon 9 AM', 'Trail-ready layers: the fall drop', 'Published', 'success'], ['Mon 6:30 PM', 'Reel: 3 ways to pack the Ridge 28', 'Needs approval', 'action'], ['Tue 12 PM', 'Jules × Fernway: summit morning', 'Needs approval', 'action'], ['Thu 7 PM', 'Tent pitch speedrun', 'Failed', 'danger']].map(([t, n, s, tone]) => (
        <div key={n} className="li"><span className="faint small" style={{ width: 78 }}>{t}</span><span className="grow">{n}</span><Pill tone={tone as 'success'}>{s}</Pill></div>
      ))}
      <div className="note" style={{ marginTop: 12, background: 'var(--lo-color-publish-subtle)' }}><b>Best time today:</b> 6:30 PM on Instagram. Your Reel is already in that slot.</div>
    </Card>
  );
}

export function Home() {
  const { role, go, open, pinned } = useStore();
  const r = ROLES[role];
  const q = QUEUE[role];
  return (
    <div className="stack">
      <div className="head"><div><span className="faint small">Monday, October 26</span><h1 style={{ marginTop: 6 }}>Good afternoon, {r.name.split(' ')[0]}</h1><p className="muted">{r.greeting}</p></div></div>
      <div className="g2">
        <Card title="Needs you now" actions={<Pill tone="action">{q.length} items</Pill>}>
          <div className="queue">
            {q.map((item, i) => (
              <button key={item.title} className="qi" style={{ ['--i' as string]: i }} onClick={() => { go(item.to); if (item.profile) window.setTimeout(() => open({ kind: 'profile', id: item.profile! }), 0); if (item.post) window.setTimeout(() => open({ kind: 'post', id: item.post! }), 0); }}>
                <span className={`qi__ico bg-${item.tone ?? item.group}`}><Icon name={item.icon} /></span>
                <span><span className="qi__t">{item.title}</span><br /><span className="qi__m">{item.meta}</span></span>
                <Icon name="arrow" size={16} />
              </button>
            ))}
          </div>
        </Card>
        <Summary />
      </div>
      <section className="stack" style={{ gap: 10 }}>
        <div className="row" style={{ justifyContent: 'space-between' }}><h2 style={{ margin: 0, fontSize: 16 }}>Your tools</h2><Button size="sm" variant="ghost" icon="sliders" onClick={() => open({ kind: 'tools' })}>Customize</Button></div>
        <div className="tiles">
          {pinned.map(id => {
            const t = TILES[role][id];
            return (
              <button key={id} className="tile" onClick={() => go(toolRoute(id))}>
                <span className="tile__t"><span className={`g-${TOOLS[id].group}`}><Icon name={TOOLS[id].icon} size={20} /></span>{toolLabel(id, role)}</span>
                {t && <><span className="tile__v">{t[0]}</span><span className="tile__c">{t[1]}</span></>}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

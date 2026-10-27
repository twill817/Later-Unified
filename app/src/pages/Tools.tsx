import { useState } from 'react';
import { Button, Card, Icon, MetricCard, Pill, SegmentedControl, Switch } from '@ds';
import { BEST, IDEAS, MEDIA, money } from '../data';
import { useStore, viewOf } from '../store';

const Head = ({ title, desc, actions }: { title: string; desc: string; actions?: React.ReactNode }) => (
  <div className="head"><div><h1>{title}</h1><p className="muted">{desc}</p></div>{actions && <div className="row">{actions}</div>}</div>
);

/* ---------- Analyze ---------- */
function StackedBars({ series, labels }: { series: { name: string; values: number[]; color: string }[]; labels: string[] }) {
  const W = 640, H = 240, L = 46, R = 10, T = 12, B = 30;
  const totals = labels.map((_, i) => series.reduce((a, s) => a + s.values[i], 0));
  const max = Math.ceil((Math.max(...totals) * 1.08) / 20) * 20, slot = (W - L - R) / labels.length, bw = slot * 0.72, y = (v: number) => T + (H - T - B) * (1 - v / max);
  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Weekly reach by platform, in thousands. Latest week: ${totals[totals.length - 1]}K.`}>
      {[0, max / 2, max].map(t => <g key={t}><line className="grid" x1={L} x2={W - R} y1={y(t)} y2={y(t)} /><text x={L - 8} y={y(t) + 4} textAnchor="end">{t}K</text></g>)}
      {labels.map((l, i) => {
        const x = L + i * slot + (slot - bw) / 2;
        let acc = 0;
        return <g key={l}>{series.map(s => { const v = s.values[i], r = <rect key={s.name} x={x} y={y(acc + v)} width={bw} height={y(acc) - y(acc + v)} fill={s.color}><title>{`${s.name}: ${v}K`}</title></rect>; acc += v; return r; })}<text x={x + bw / 2} y={H - 9} textAnchor="middle">{l}</text></g>;
      })}
    </svg>
  );
}

export function Analyze() {
  const { role, open } = useStore();
  const [mode, setMode] = useState<'organic' | 'paid' | 'creators'>('paid');
  const creator = role === 'creator';
  const labels = ['Sep 7', '14', '21', '28', 'Oct 5', '12', '19', '26'];
  const series = creator
    ? [{ name: 'TikTok', values: [10, 12, 11, 13, 15, 14, 17, 19], color: 'var(--lo-color-chart-4)' }, { name: 'Instagram', values: [9, 10, 10, 12, 13, 12, 15, 16], color: 'var(--lo-color-chart-1)' }, { name: 'YouTube', values: [2, 2, 2, 3, 3, 3, 4, 4], color: 'var(--lo-color-chart-3)' }, { name: 'Pinterest', values: [1, 1, 1, 1, 2, 2, 2, 2], color: 'var(--lo-color-chart-2)' }]
    : [{ name: 'TikTok', values: [12, 14, 13, 16, 18, 19, 18, 21], color: 'var(--lo-color-chart-4)' }, { name: 'Facebook', values: [7, 8, 7, 8, 9, 9, 9, 10], color: 'var(--lo-color-chart-3)' }, { name: 'Threads', values: [5, 5, 6, 6, 6, 6, 6, 6], color: 'var(--lo-color-chart-2)' }, { name: 'Instagram', values: [18, 21, 19, 23, 25, 27, 24, 29], color: 'var(--lo-color-chart-1)' }];
  if (!creator && mode === 'paid') series.push({ name: 'Paid (Meta Ads)', values: [18, 20, 26, 24, 30, 34, 31, 38], color: 'var(--lo-color-chart-5)' });
  if (!creator && mode === 'creators') series.push({ name: 'Creator collabs', values: [9, 11, 14, 18, 22, 27, 29, 34], color: 'var(--lo-color-action)' });
  const channels: [string, number][] = creator ? [['TikTok', 58], ['Instagram', 31], ['YouTube', 8], ['Pinterest', 3]] : [['Instagram', 44], ['TikTok', 29], ['Facebook', 12], ['YouTube', 7], ['Pinterest', 5], ['LinkedIn', 3]];
  const top: [string, string, string, string, string?][] = creator
    ? [['Sunrise on Mt. Si', 'IG', '14.2K', '2.1K saves'], ['Fall layers haul', 'TT', '88K', '1.4K clicks'], ['Solo overnight checklist', 'IG', '11.9K', '3.0K saves']]
    : [['Jules × Fernway: summit morning', 'IG', '96K', '4.1K saves', 'jo'], ['Trail-ready layers: the fall drop', 'IG', '54K', '1.2K saves'], ['@lenatrails reel', 'TT', '211K', '3.3K saves', 'lt'], ['Behind the stitch', 'YT', '18K', '610 saves']];
  return (
    <div className="stack">
      <Head title="Performance" desc={creator ? 'Every profile and every link in one report. Sales come from your Earn links.' : 'Organic, paid and creator content measured side by side, with sales attributed through Link in bio and creator links.'}
        actions={!creator && <SegmentedControl label="Reach view" value={mode} onChange={setMode} options={[{ value: 'organic', label: 'Organic' }, { value: 'paid', label: 'Organic + paid' }, { value: 'creators', label: 'Organic + creators' }]} />} />
      <div className="metrics">
        {creator ? <>
          <MetricCard kind="people" label="Followers" value="184.2K" delta="+3.1K" note="vs prior 30 days" />
          <MetricCard kind="rate" label="Engagement rate" value="6.8%" delta="+0.6 pts" />
          <MetricCard kind="volume" label="Saves" value="21.4K" delta="+18%" />
          <MetricCard kind="clicks" label="Link clicks" value="9,143" delta="+22%" />
        </> : <>
          <MetricCard kind="volume" label="Reach" value="412K" delta="+11%" note="vs prior 30 days" />
          <MetricCard kind="rate" label="Engagement rate" value="4.2%" delta="+0.3 pts" />
          <MetricCard kind="clicks" label="Link clicks" value="4,906" delta="+12%" />
          <MetricCard kind="money" label="Attributed sales" value="$207K" delta="+19%" />
        </>}
      </div>
      <div className="g2">
        <Card title="Weekly reach by platform" actions={<div className="legend">{series.map(s => <span key={s.name}><i style={{ background: s.color }} />{s.name}</span>)}</div>}>
          <StackedBars series={series} labels={labels} />
        </Card>
        <Card title="Reach by channel" actions={<span className="faint small">30 days</span>}>
          {channels.map(([n, v]) => <div key={n} className="bar" style={{ gridTemplateColumns: '90px minmax(0,1fr) 44px' }}><span>{n}</span><div className="meter"><i style={{ width: `${v}%` }} /></div><span className="num" style={{ textAlign: 'right' }}>{v}%</span></div>)}
          <div className="note" style={{ marginTop: 12 }}>{creator ? 'TikTok drives reach; Instagram drives 64% of your link clicks.' : 'Creator collabs are 22% of reach but 41% of attributed sales.'}</div>
        </Card>
      </div>
      <Card title="Top posts" flush>
        <div className="scrollx">
          <table className="tbl">
            <thead><tr><th>Post</th><th>Channel</th><th className="r">Reach</th><th className="r">Result</th></tr></thead>
            <tbody>{top.map(([t, ch, r, res, cid]) => <tr key={t}><td><b>{t}</b> {cid && <button className="linkbtn" style={{ marginLeft: 6 }} onClick={() => open({ kind: 'profile', id: cid })}><Pill tone="creators">Creator</Pill></button>}</td><td><span className="plat">{ch}</span></td><td className="r">{r}</td><td className="r">{res}</td></tr>)}</tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ---------- Listen ---------- */
export function Listen() {
  const { role, listenPreview, setListenPreview, open, say, go } = useStore();
  const locked = role !== 'brand' && !listenPreview;
  if (locked) {
    return (
      <div className="stack">
        <Head title="Social listening" desc="Trends, competitors, brand health and mentions." />
        <div className="lock">
          <span className="lock__tag"><Icon name="radar" />Listen</span>
          <div><h2>{role === 'smm' ? 'Listen is part of the Scale plan' : 'Listen is built for brands'}</h2><p style={{ marginTop: 4, opacity: 0.85 }}>{role === 'smm' ? 'You’re on Growth. See it with your own competitors and trends before you decide. Nothing changes on your plan.' : 'See what brands see about trends in your categories, using sample data.'}</p></div>
          <Button onClick={() => setListenPreview(true)}>Preview with sample data</Button>
        </div>
        <div className="metrics">{['Future trends', 'Competitive benchmarking', 'Brand health', 'Brand mentions'].map(x => <Card key={x}><Pill tone="grow">Included</Pill><b style={{ display: 'block', marginTop: 8 }}>{x}</b></Card>)}</div>
      </div>
    );
  }
  const pos = 64, neu = 27, neg = 9, C = 2 * Math.PI * 40;
  return (
    <div className="stack">
      <Head title="Social listening" desc="What people say about Fernway and the outdoor category, and what’s about to trend." />
      {role !== 'brand' && <div className="note" style={{ background: 'var(--lo-color-grow-subtle)' }}>Previewing with sample data. <button className="linkbtn" style={{ color: 'var(--lo-color-action)' }} onClick={() => say('Scale adds Listen, custom analytics and 6 social sets')}>Compare plans</button></div>}
      <div className="g2">
        <Card title="Future trends" actions={<span className="faint small">Outdoor apparel · next 14 days</span>} flush>
          <div className="scrollx"><table className="tbl"><thead><tr><th>Topic</th><th className="r">Momentum</th><th>Signal</th><th /></tr></thead><tbody>
            {([['#shoulderseason', '+212%', true], ['quiet hiking', '+148%', true], ['packable puffer', '+96%', true], ['#gorpcore', '−12%', false]] as const).map(([t, m, up]) => (
              <tr key={t}><td><b>{t}</b></td><td className={`r ${up ? 'up' : 'down'}`}>{m}</td><td><Pill tone={up ? 'success' : 'warning'}>{up ? 'Rising' : 'Cooling'}</Pill></td>
                <td className="r">{up && <Button size="sm" onClick={() => { go({ page: 'tool', tool: 'plan' }); window.setTimeout(() => open({ kind: 'post', draft: { title: `Trend: ${t}`, day: 5, time: BEST[5], platforms: ['IG', 'TT'] } }), 0); }}>Plan a post</Button>}</td></tr>
            ))}
          </tbody></table></div>
        </Card>
        <Card title="Brand health" actions={<Pill tone="success">78 / 100</Pill>}>
          <div className="row" style={{ gap: 18, flexWrap: 'nowrap' }}>
            <svg viewBox="0 0 100 100" width="96" height="96" role="img" aria-label="Sentiment: 64% positive, 27% neutral, 9% negative">
              <circle cx="50" cy="50" r="40" fill="none" stroke="var(--lo-color-surface-sunken)" strokeWidth="12" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="var(--lo-color-success)" strokeWidth="12" strokeDasharray={`${(C * pos) / 100} ${C}`} transform="rotate(-90 50 50)" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="var(--lo-color-border-strong)" strokeWidth="12" strokeDasharray={`${(C * neu) / 100} ${C}`} strokeDashoffset={(-C * pos) / 100} transform="rotate(-90 50 50)" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="var(--lo-color-danger)" strokeWidth="12" strokeDasharray={`${(C * neg) / 100} ${C}`} strokeDashoffset={(-C * (pos + neu)) / 100} transform="rotate(-90 50 50)" />
            </svg>
            <div className="stack small" style={{ gap: 4 }}><span><b className="up">64%</b> positive</span><span><b>27%</b> neutral</span><span><b className="down">9%</b> negative · zipper complaints up</span></div>
          </div>
          <div style={{ marginTop: 12 }}><Button size="sm" icon="arrow" onClick={() => go({ page: 'tool', tool: 'engage' })}>Reply to flagged comments</Button></div>
        </Card>
      </div>
      <Card title="Competitive benchmarking" actions={<span className="faint small">Instagram · 30 days · 3 of 20 tracked</span>} flush>
        <div className="scrollx"><table className="tbl"><thead><tr><th>Brand</th><th className="r">Followers</th><th className="r">Growth</th><th className="r">Engagement</th><th className="r">Posts per week</th></tr></thead><tbody>
          {[['Fernway Outdoor (you)', '212K', '+2.4%', '4.2%', '6.5'], ['Summit Supply Co.', '480K', '+1.1%', '2.6%', '9.0'], ['Trailhead & Pine', '156K', '+3.0%', '4.8%', '4.0'], ['Basin Gear', '98K', '+0.4%', '1.9%', '11.5']].map(r => <tr key={r[0]}><td><b>{r[0]}</b></td>{r.slice(1).map((v, i) => <td key={i} className="r">{v}</td>)}</tr>)}
        </tbody></table></div>
      </Card>
    </div>
  );
}

/* ---------- Create ---------- */
export function Create() {
  const { role, credits, spendCredit, say } = useStore();
  const [filter, setFilter] = useState<'All' | 'Upload' | 'Canva' | 'Creator' | 'UGC'>('All');
  const [ideas, setIdeas] = useState<[string, string][]>([]);
  const list = MEDIA.filter(m => filter === 'All' || m.source === filter);
  const icon = { Upload: 'image', Canva: 'image', Creator: 'people', UGC: 'inbox' } as const;
  return (
    <div className="stack">
      <Head title="Media and ideas" desc="Uploads, Canva exports, creator content and UGC share one library. Anything here can go straight into a post or a Link in bio block."
        actions={<><Button onClick={() => say('Canva import isn’t built in this prototype')}>Import from Canva</Button><Button variant="primary" icon="plus" onClick={() => say('Uploads aren’t built in this prototype')}>Upload</Button></>} />
      <div className="g2">
        <Card title="Library" actions={<span className="faint small">{list.length} of 248</span>}>
          <div style={{ marginBottom: 14 }}><SegmentedControl label="Media source" value={filter} onChange={setFilter} options={(['All', 'Upload', 'Canva', 'Creator', 'UGC'] as const).map(v => ({ value: v, label: v }))} /></div>
          <div className="media">
            {list.map(m => (
              <div key={m.title} className="mtile">
                <div className={`mtile__im bg-${m.group}`}><Icon name={icon[m.source]} size={30} /></div>
                <div className="mtile__cap"><b>{m.title}</b><span className="row" style={{ gap: 4 }}><Pill>{m.source}</Pill>{'rights' in m && <Pill tone={m.rights === 'Granted' ? 'success' : 'warning'}>Rights: {m.rights}</Pill>}</span></div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="AI ideas" actions={<Pill>{credits[role]} credits</Pill>}>
          <p className="muted small">Ideas use your top posts and current trends from Listen. One credit makes three ideas.</p>
          <div style={{ margin: '12px 0' }}><Button icon="spark" onClick={() => { if (spendCredit()) setIdeas(IDEAS); }}>Generate 3 ideas</Button></div>
          <div className="stack" style={{ gap: 8 }}>{ideas.length ? ideas.map(([t, d]) => <div key={t} className="note note--ai"><b>{t}</b><br />{d}</div>) : <p className="faint small">No ideas yet this session.</p>}</div>
          <div className="note" style={{ marginTop: 14 }}><b>Collect UGC:</b> search by hashtag, profile, tags or mentions. New mentions show up in Engage.</div>
        </Card>
      </div>
    </div>
  );
}

/* ---------- Link in bio ---------- */
export function LinkInBio() {
  const { role, blocks, toggleBlock, say, links } = useStore();
  const creator = role === 'creator';
  const list = blocks[viewOf(role)];
  const url = `https://later.link/${creator ? 'jules' : 'fernway'}`;
  const copy = () => { navigator.clipboard?.writeText(url).then(() => say('Page link copied'), () => say(url)); };
  const preview = (name: string, desc: string) => {
    if (name === 'Featured banner') return <div className="pb pb--banner">{desc}<div style={{ fontWeight: 500, fontSize: 11, marginTop: 4 }}>Shop now</div></div>;
    if (name === 'Linked posts') return <div className="pgrid">{['publish', 'grow', 'creators', 'publish', 'creators', 'grow'].map((g, i) => <i key={i} className={`bg-${g}`} />)}</div>;
    if (name === 'Product carousel') return <div className="prow"><span>Ridge 28<b>$128</b></span><span>Alder jacket<b>$189</b></span><span>Basecamp 2<b>$249</b></span></div>;
    if (name === 'Affiliate links') return links.filter(l => l.live).slice(0, 3).map(l => <div key={l.id} className="pb">{l.product}</div>);
    if (name === 'Brand partner') return <div className="pb">Fernway Outdoor collab</div>;
    if (name === 'Email signup') return <div className="pb" style={{ textAlign: 'left', fontWeight: 500 }}>{desc}<div className="pb__field">Email address</div></div>;
    return <div className="row" style={{ justifyContent: 'center', gap: 6 }}>{['IG', 'TT', 'YT', 'PIN'].map(x => <span key={x} className="plat">{x}</span>)}</div>;
  };
  return (
    <div className="stack">
      <Head title={creator ? 'later.link/jules' : 'later.link/fernway'} desc={creator ? 'Your shoppable page. Affiliate links sync from Earn, so a new link is live here as soon as you create it.' : 'Your shoppable page. Linked posts update automatically when posts publish from Plan.'}
        actions={<Button icon="copy" onClick={copy}>Copy link</Button>} />
      <div className="metrics">
        {creator ? <>
          <MetricCard kind="volume" label="Page views" value="24,610" delta="+18%" note="vs last month" />
          <MetricCard kind="clicks" label="Clicks" value="9,143" delta="+22%" />
          <MetricCard kind="rate" label="Click-through" value="37.1%" delta="+1.4 pts" />
          <MetricCard kind="money" label="Commission" value="$3,261" delta="+31%" />
        </> : <>
          <MetricCard kind="volume" label="Page views" value="18,420" delta="+9%" note="vs last month" />
          <MetricCard kind="clicks" label="Clicks" value="4,906" delta="+12%" />
          <MetricCard kind="rate" label="Click-through" value="26.6%" delta="+0.8 pts" />
          <MetricCard kind="money" label="Attributed sales" value="$21,380" delta="+15%" />
        </>}
      </div>
      <div className="lib">
        <Card title="Blocks" actions={<Button size="sm" icon="plus" onClick={() => say('New blocks aren’t built in this prototype')}>Add block</Button>}>
          {list.map((b, i) => (
            <div key={b.name} className="blk">
              <span className="qi__ico bg-publish" style={{ width: 34, height: 34 }}><Icon name="link" size={16} /></span>
              <div><b>{b.name}</b><div className="faint small">{b.desc}</div></div>
              <span className="faint small num">{b.stat}</span>
              <Switch checked={b.on} label={`Show ${b.name}`} onChange={() => toggleBlock(i)} />
            </div>
          ))}
        </Card>
        <div className="phone" aria-label="Page preview">
          <div className="phone__pfp">{creator ? 'JO' : 'F'}</div>
          <div style={{ textAlign: 'center' }}><b>{creator ? 'Jules Ortiz' : 'Fernway Outdoor'}</b><div className="faint small">{creator ? 'Solo overnights and early starts' : 'Gear for shoulder season'}</div></div>
          {list.filter(b => b.on).map(b => <div key={b.name}>{preview(b.name, b.desc)}</div>)}
        </div>
      </div>
    </div>
  );
}

/* ---------- Earn ---------- */
export function Earn() {
  const { role, links, setLinks, say, go } = useStore();
  if (role !== 'creator') {
    return (
      <div className="stack">
        <Head title="Earn is for creators" desc="Creators use Earn to share affiliate links, track sales and get paid. Your creators’ sales from these links show up in Campaigns and Analyze." />
        <Card title="How creator sales reach you">
          <div className="three">
            {[['Creator posts', 'Plan', 'plan'], ['Shopper buys', 'Link in bio', 'linkinbio'], ['You see ROI', 'Campaigns', 'campaigns']].map(([a, b, t]) => (
              <button key={a} className="note linkbtn" style={{ background: 'var(--lo-color-creators-subtle)', fontWeight: 500 }} onClick={() => go({ page: 'tool', tool: t as 'plan' })}><span style={{ color: 'var(--lo-color-creators)', fontWeight: 600 }}>{a}</span><div style={{ fontSize: 16, fontWeight: 700 }}>{b}</div></button>
            ))}
          </div>
        </Card>
      </div>
    );
  }
  const copy = (u: string) => navigator.clipboard?.writeText(`https://${u}`).then(() => say('Link copied'), () => say(u));
  return (
    <div className="stack">
      <Head title="Earnings" desc="Every click, order and commission as it happens. Links you make here appear in Link in bio and can go straight into replies in Engage."
        actions={<Button variant="primary" icon="plus" onClick={() => say('Paste any product URL to make a link')}>New link</Button>} />
      <div className="metrics">
        <MetricCard kind="money" label="October" value="$4,812.40" delta="+38%" note="vs September" />
        <MetricCard kind="money" label="Pending" value="$1,236.00" note="In the return window" />
        <MetricCard kind="money" label="Next payout" value="$3,576.40" note="Nov 1" />
        <MetricCard kind="volume" label="Orders" value="484" delta="+29%" />
      </div>
      <div className="g2">
        <Card title="Your links" actions={<span className="faint small">October</span>} flush>
          <div className="scrollx"><table className="tbl"><thead><tr><th>Product</th><th className="r">Clicks</th><th className="r">Orders</th><th className="r">Commission</th><th /></tr></thead><tbody>
            {links.map(l => (
              <tr key={l.id}>
                <td><b>{l.product}</b><div className="faint small">{l.brand}{!l.live && <> · <span className="down">promo expired</span></>}</div></td>
                <td className="r">{l.clicks.toLocaleString()}</td><td className="r">{l.orders}</td><td className="r">{money(l.commission)}</td>
                <td className="r">{l.live ? <Button size="sm" icon="copy" onClick={() => copy(l.url)}>Copy</Button> : <Button size="sm" variant="primary" onClick={() => { setLinks(ls => ls.map(x => (x.id === l.id ? { ...x, live: true, product: `${x.product} (holiday offer)` } : x))); say('Swapped to a live offer. Link in bio updated.'); }}>Swap offer</Button>}</td>
              </tr>
            ))}
          </tbody></table></div>
        </Card>
        <Card title="Payouts">
          {[['Nov 1', '$3,576.40', 'Scheduled'], ['Oct 1', '$2,904.10', 'Paid'], ['Sep 1', '$2,118.75', 'Paid']].map(([d, a, s]) => <div key={d} className="li"><span className="grow">{d}</span><b className="num">{a}</b><Pill tone={s === 'Paid' ? 'success' : 'neutral'}>{s}</Pill></div>)}
          <div className="note" style={{ marginTop: 12 }}><b>Your strategist, Dana,</b> has office hours Thursday. Ask about the Northline invite.</div>
        </Card>
      </div>
    </div>
  );
}

/* ---------- Services ---------- */
export function Services() {
  const { role, say, go } = useStore();
  const [sent, setSent] = useState(false);
  const [goal, setGoal] = useState('Drive sales');
  const [budget, setBudget] = useState('$25K–50K');
  const [notes, setNotes] = useState('');
  return (
    <div className="stack">
      <Head title="Full-service programs" desc="Hand a campaign to Later’s team. They plan, source creators, produce and report, and everything they run shows up in your Campaigns and Analyze." />
      <div className="g2">
        <Card title={role === 'brand' ? 'Your programs' : 'How it works'}>
          {role === 'brand' ? <>
            <div className="li"><div className="grow"><button className="linkbtn" onClick={() => go({ page: 'campaign', id: 'hg' })}>Holiday Gifting ’26</button><div className="faint small">Strategy approved · creator sourcing starts Nov 3</div></div><Pill tone="warning">Planning</Pill></div>
            <div className="li"><div className="grow"><button className="linkbtn" onClick={() => go({ page: 'campaign', id: 'st' })}>Spring Trail ’26</button><div className="faint small">41M impressions · $1.1M earned media value</div></div><Pill tone="success">Complete</Pill></div>
            <div className="li"><span className="lo-avatar" aria-hidden="true">DR</span><div className="grow"><b>Dana Reyes</b><div className="faint small">Your campaign strategist</div></div><Button size="sm" onClick={() => go({ page: 'tool', tool: 'engage' })}>Message</Button></div>
          </> : <div className="three">{[['Strategy', 'By experts'], ['Creators', 'Sourced and managed'], ['Results', 'Tracked here']].map(([a, b]) => <div key={a} className="note" style={{ background: 'var(--lo-color-creators-subtle)' }}><span style={{ color: 'var(--lo-color-creators)', fontWeight: 600 }}>{a}</span><div style={{ fontWeight: 700 }}>{b}</div></div>)}</div>}
        </Card>
        <Card title="Request a program">
          {sent ? <div className="note note--ai"><b>Sent.</b> Dana from the strategy team will reply within 1 business day. You’ll see the program in Campaigns once it’s set up.</div> : (
            <form className="stack" style={{ gap: 12 }} onSubmit={e => { e.preventDefault(); setSent(true); say('Request sent to Later’s strategy team'); }}>
              <label className="flabel">Goal<select className="inp" value={goal} onChange={e => setGoal(e.target.value)}><option>Drive sales</option><option>Launch a product</option><option>Build awareness</option></select></label>
              <label className="flabel">Budget<select className="inp" value={budget} onChange={e => setBudget(e.target.value)}><option>$25K–50K</option><option>$50K–150K</option><option>$150K+</option></select></label>
              <label className="flabel">What should we know?<textarea className="inp" rows={3} value={notes} placeholder="Timing, products, creators you like" onChange={e => setNotes(e.target.value)} /></label>
              <Button type="submit" variant="primary">Send to Later’s strategy team</Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}

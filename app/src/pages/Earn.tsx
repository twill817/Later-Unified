import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Button, Card, Icon, IconButton, MetricCard, Pill, SegmentedControl, Tabs } from '@ds';
import { BOOSTS, BRAND_CATS, BRANDS, COMMISSION_MTD, QUICK, STATEMENTS, TIERS, parseProductUrl, topRate, type Brand, type Range } from '../data';
import { useStore } from '../store';
import { BenchChip, HowYouCompare } from './Benchmarks';

const usd = (n: number) => (n < 0 ? '−' : '') + '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const reached = TIERS.filter(t => COMMISSION_MTD >= t[0]);
const nextTier = TIERS.find(t => COMMISSION_MTD < t[0]);

/** Paste a product URL anywhere a creator is working and get a link back. Matches Later Creator's always-on link bar. */
export function LinkMaker({ className = '' }: { className?: string }) {
  const { makeLink, go, say } = useStore();
  const [url, setUrl] = useState('');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    const hit = parseProductUrl(url);
    if (!hit) { say('That store isn’t on Later Creator yet. Try a brand from Earn → Brands.'); return; }
    makeLink(hit.brand, hit.product);
    setUrl('');
    go({ page: 'tool', tool: 'earn', tab: 'links' });
  };
  return (
    <form className={`lm ${className}`} onSubmit={submit} role="search" aria-label="Make an affiliate link">
      <input className="lm__in" value={url} onChange={e => setUrl(e.target.value)} placeholder="Paste a product URL to make a link" aria-label="Product URL" />
      <button type="submit" className="lm__go" aria-label="Make link"><Icon name="link" size={16} /></button>
    </form>
  );
}

function Explainer() {
  const { go } = useStore();
  return (
    <div className="stack">
      <div className="head"><div><h1>Earn is for creators</h1><p className="muted">Creators use Earn to make affiliate links, track sales and get paid. Your creators’ sales from these links show up in Campaigns and Analyze.</p></div></div>
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

export function BonusTracker({ compact }: { compact?: boolean }) {
  const { go } = useStore();
  const cur = reached[reached.length - 1];
  const pct = nextTier ? Math.min(100, (COMMISSION_MTD / nextTier[0]) * 100) : 100;
  return (
    <div className="stack" style={{ gap: 12 }}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div><span className="lbl">October bonus · tier {reached.length}</span><div className="num" style={{ fontSize: compact ? 18 : 24, fontWeight: 700 }}>{cur ? `$${cur[1]} earned` : 'No bonus yet'}</div></div>
        <Pill tone="success">Pays Dec 1</Pill>
      </div>
      <div>
        <div className="meter" role="progressbar" aria-label="Progress to next bonus tier" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}><i style={{ width: `${pct}%` }} /></div>
        {nextTier && <div className="row faint small" style={{ justifyContent: 'space-between', marginTop: 5 }}><span>{usd(COMMISSION_MTD)} commission</span><span>${nextTier[0].toLocaleString()} unlocks ${nextTier[1]}</span></div>}
      </div>
      {!compact && <ol className="tiers" aria-label="Bonus tiers">
        {TIERS.map(([at, b], i) => <li key={at} className={COMMISSION_MTD >= at ? 'is-on' : ''}><span>Tier {i + 1}</span><b>${b}</b><small>${at.toLocaleString()}+</small></li>)}
      </ol>}
      {nextTier && <div className="note note--ai"><b>EdgeAI:</b> {usd(nextTier[0] - COMMISSION_MTD)} to go by Oct 31. The Fernway insulated layers boost pays 14%, so about 35 more Alder jacket orders gets you there.{!compact && <> <button className="inl" onClick={() => go({ page: 'tool', tool: 'campaigns', tab: 'boosts' })}>See boosts</button></>}</div>}
    </div>
  );
}

function Overview({ setTab }: { setTab: (t: EarnTab) => void }) {
  const { links, say } = useStore();
  const [range, setRange] = useState<Range>('mtd');
  const [sales, com, clicks, orders] = QUICK[range];
  const top = [...links].sort((a, b) => b.commission - a.commission).slice(0, 3);
  const copy = (u: string) => navigator.clipboard?.writeText(`https://${u}`).then(() => say('Link copied'), () => say(u));
  const next = STATEMENTS[0];
  return (
    <div className="stack">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h2 className="h2">Quick stats</h2>
        <SegmentedControl size="sm" label="Date range" value={range} onChange={setRange} options={[{ value: '1d', label: '1d' }, { value: '1w', label: '1w' }, { value: '1m', label: '1m' }, { value: 'mtd', label: 'MTD' }]} />
      </div>
      <div className="metrics">
        <MetricCard kind="money" label="Sales" value={usd(sales)} note="from your links" />
        <MetricCard kind="money" label="Commission" value={usd(com)} delta={range === 'mtd' ? '+38%' : undefined} note={range === 'mtd' ? 'vs September' : undefined} />
        <MetricCard kind="clicks" label="Clicks" value={clicks.toLocaleString()} />
        <MetricCard kind="rate" label="Conversion" value={`${((orders / clicks) * 100).toFixed(1)}%`} note={`${orders} orders`} badge={range === 'mtd' ? <BenchChip id="conv" /> : undefined} />
      </div>
      <HowYouCompare ids={['conv', 'epc', 'rate']} />
      <div className="g2">
        <Card title="Bonus tracker" actions={<Pill tone="action">Live</Pill>}><BonusTracker /></Card>
        <Card title="Next payout" actions={<Button size="sm" variant="ghost" onClick={() => setTab('payouts')}>All statements</Button>}>
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}><span className="num" style={{ fontSize: 28, fontWeight: 700 }}>{usd(next[2] + next[3] + next[4] + next[5] + next[6])}</span><span className="faint small">Nov 1 · scheduled</span></div>
          {[['Commission', next[2]], ['September bonus', next[3]], ['Fernway campaign fee, first half', next[4]], ['Referrals', next[5]]].map(([l, v]) => <div key={l as string} className="li"><span className="grow">{l}</span><b className="num">{usd(v as number)}</b></div>)}
          <div className="li"><span className="grow faint">Pending, still in the return window</span><span className="num faint">$1,236.00</span></div>
          <p className="faint small" style={{ margin: '10px 0 0' }}>Brand deal fees and affiliate commission arrive in one payout, so there’s one statement to reconcile.</p>
        </Card>
      </div>
      <Card title="Top links this month" actions={<Button size="sm" variant="ghost" onClick={() => setTab('links')}>All links</Button>}>
        {top.map(l => <div key={l.id} className="li"><div className="grow"><b>{l.product}</b><div className="faint small">{l.brand} · {l.orders} orders</div></div><b className="num">{usd(l.commission)}</b><Button size="sm" icon="copy" onClick={() => copy(l.url)}>Copy</Button></div>)}
      </Card>
    </div>
  );
}

function Links() {
  const { links, setLinks, say } = useStore();
  const [q, setQ] = useState('');
  const [brand, setBrand] = useState('all');
  const [folder, setFolder] = useState('all');
  const folders = ['all', ...Array.from(new Set(links.map(l => l.folder).filter(Boolean) as string[])), 'unfiled'];
  const shown = links.filter(l => (brand === 'all' || l.brand === brand) && (folder === 'all' || (folder === 'unfiled' ? !l.folder : l.folder === folder)) && `${l.product} ${l.brand}`.toLowerCase().includes(q.toLowerCase()));
  const copy = (u: string) => navigator.clipboard?.writeText(`https://${u}`).then(() => say('Link copied'), () => say(u));
  return (
    <div className="stack">
      <div className="row tools">
        <label className="inp inp--icon"><Icon name="search" size={15} /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search your links" aria-label="Search your links" /></label>
        <select className="inp" style={{ width: 'auto' }} value={brand} onChange={e => setBrand(e.target.value)} aria-label="Filter by brand"><option value="all">All brands</option>{Array.from(new Set(links.map(l => l.brand))).map(b => <option key={b}>{b}</option>)}</select>
      </div>
      <div className="row chips" role="group" aria-label="Folders">{folders.map(f => <button key={f} type="button" className="tog" aria-pressed={folder === f} onClick={() => setFolder(f)}>{f !== 'all' && f !== 'unfiled' && <Icon name="folder" size={13} />}{f === 'all' ? 'All links' : f === 'unfiled' ? 'Not in a folder' : f}</button>)}</div>
      <Card flush>
        <div className="scrollx"><table className="tbl"><thead><tr><th>Product</th><th className="r">Rate</th><th className="r">Clicks</th><th className="r">Orders</th><th className="r">Commission</th><th /></tr></thead><tbody>
          {shown.map(l => (
            <tr key={l.id}>
              <td><b>{l.product}</b> {l.isNew && <Pill tone="action">New</Pill>}<div className="faint small">{l.brand} · {l.url}{!l.live && <> · <span className="down">promo expired</span></>}</div></td>
              <td className="r num">{l.rate}%</td><td className="r">{l.clicks.toLocaleString()}</td><td className="r">{l.orders}</td><td className="r num">{usd(l.commission)}</td>
              <td className="r">{l.live ? <Button size="sm" icon="copy" onClick={() => copy(l.url)}>Copy</Button> : <Button size="sm" variant="primary" onClick={() => { setLinks(ls => ls.map(x => (x.id === l.id ? { ...x, live: true, product: `${x.product} (holiday offer)` } : x))); say('Swapped to a live offer. Link in bio updated.'); }}>Swap offer</Button>}</td>
            </tr>
          ))}
          {!shown.length && <tr><td colSpan={6} className="faint" style={{ textAlign: 'center', padding: 24 }}>No links match.</td></tr>}
        </tbody></table></div>
      </Card>
      <p className="faint small"><Icon name="spark" size={12} /> Try it: paste <b>fernway.example/ridge-fleece-hoodie</b> into the link bar. New links also appear in Link in bio and as one-tap replies in Engage.</p>
    </div>
  );
}

function Brands() {
  const { favs, toggleFav, makeLink, go } = useStore();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [sort, setSort] = useState<'name' | 'rate' | 'new'>('name');
  const [openId, setOpenId] = useState<string | null>(null);
  const list = useMemo(() => BRANDS
    .filter(b => (cat === 'All' || (cat === 'Favorites' ? favs.has(b.id) : b.cats.includes(cat))) && b.name.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (sort === 'rate' ? topRate(b) - topRate(a) : sort === 'new' ? Number(!!b.isNew) - Number(!!a.isNew) : a.name.localeCompare(b.name))), [q, cat, sort, favs]);
  const boostFor = (b: Brand) => BOOSTS.find(x => x.brand === b.name);
  return (
    <div className="stack">
      <div className="row tools">
        <label className="inp inp--icon"><Icon name="search" size={15} /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search 3,000+ brands" aria-label="Search brands" /></label>
        <select className="inp" style={{ width: 'auto' }} value={sort} onChange={e => setSort(e.target.value as 'name')} aria-label="Sort brands"><option value="name">Name (A–Z)</option><option value="rate">Highest commission</option><option value="new">New to Later</option></select>
      </div>
      <div className="row chips" role="group" aria-label="Category">{['All', 'Favorites', ...BRAND_CATS].map(c => <button key={c} type="button" className="tog" aria-pressed={cat === c} onClick={() => setCat(c)}>{c === 'Favorites' && <Icon name="heart" size={13} />}{c}</button>)}</div>
      <Card flush>
        {list.map(b => {
          const isOpen = openId === b.id, boost = boostFor(b);
          return (
            <div key={b.id} className={`brand ${isOpen ? 'is-open' : ''}`}>
              <div className="brand__row">
                <span className="brand__logo" aria-hidden="true">{b.name[0]}</span>
                <button className="brand__name" aria-expanded={isOpen} onClick={() => setOpenId(isOpen ? null : b.id)}><b>{b.name}</b>{b.isNew && <Pill tone="success">New to Later</Pill>}<span className="faint small">{b.site}</span></button>
                <span className="brand__rate"><span className="faint small">Up to</span><b className="num">{topRate(b)}%</b></span>
                <button className="fav" aria-pressed={favs.has(b.id)} aria-label={`${favs.has(b.id) ? 'Remove' : 'Add'} ${b.name} ${favs.has(b.id) ? 'from' : 'to'} favorites`} onClick={() => toggleFav(b.id)}><Icon name="heart" size={18} /></button>
                <span className="brand__cats d-only">{b.cats.map(c => <Pill key={c}>{c}</Pill>)}</span>
                <IconButton icon={isOpen ? 'chevronDown' : 'chevronRight'} label={isOpen ? 'Hide details' : 'Show details'} size={32} onClick={() => setOpenId(isOpen ? null : b.id)} />
              </div>
              {isOpen && (
                <div className="brand__body">
                  <div>
                    <span className="lbl">Commission</span>
                    {b.tiers.map(([l, r]) => <div key={l} className="li"><span className="grow">{l}</span><b className="num">{r}%</b></div>)}
                    <div className="li"><span className="grow">Cookie window</span><b className="num">{b.cookie} days</b></div>
                  </div>
                  <div className="stack" style={{ gap: 10 }}>
                    <p className="muted small" style={{ margin: 0 }}>{b.about}</p>
                    {b.promo && <div className="note"><Icon name="tag" size={13} /> <b>Promotion:</b> {b.promo}</div>}
                    {boost && <div className="note" style={{ background: 'var(--lo-color-creators-subtle)' }}><b>{boost.name} boost:</b> +{boost.boost}% through {boost.dates.split('–')[1].trim()}</div>}
                    <div className="row"><Button size="sm" variant="primary" icon="bolt" onClick={() => makeLink(b, `${b.name} storefront`)}>Quick link</Button>{boost && <Button size="sm" onClick={() => go({ page: 'tool', tool: 'campaigns', tab: 'boosts' })}>See boost</Button>}</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {!list.length && <p className="faint" style={{ padding: 20, margin: 0 }}>{cat === 'Favorites' ? 'No favorites yet. Tap the heart next to a brand to add it.' : 'No brands match.'}</p>}
      </Card>
    </div>
  );
}

function Payouts() {
  const { say } = useStore();
  const total = (r: (typeof STATEMENTS)[number]) => r[2] + r[3] + r[4] + r[5] + r[6];
  return (
    <div className="stack">
      <Card title="Past earnings · 2026" flush>
        <div className="scrollx"><table className="tbl"><thead><tr><th>Pay date</th><th className="r">Total</th><th className="r">Commission</th><th className="r">Bonus</th><th className="r">Campaigns</th><th className="r">Referrals</th><th className="r">Returns</th><th /></tr></thead><tbody>
          {STATEMENTS.map(r => (
            <tr key={r[0]}><td><b>{r[0]}</b></td><td className="r num"><b>{usd(total(r))}</b></td><td className="r num">{usd(r[2])}</td><td className="r num">{usd(r[3])}</td><td className="r num">{usd(r[4])}</td><td className="r num">{usd(r[5])}</td><td className={`r num ${r[6] < 0 ? 'down' : ''}`}>{r[6] ? usd(r[6]) : '—'}</td><td className="r"><Pill tone={r[1] === 'Paid' ? 'success' : 'neutral'}>{r[1]}</Pill></td></tr>
          ))}
        </tbody></table></div>
      </Card>
      <div className="g2">
        <Card title="Bonus tiers" subtitle="Monthly commission unlocks a bonus, paid on the 1st of the following month."><BonusTracker compact /><table className="tbl" style={{ marginTop: 12 }}><thead><tr><th>Tier</th><th className="r">Commission</th><th className="r">Bonus</th></tr></thead><tbody>{TIERS.map(([at, b], i) => <tr key={at}><td>{COMMISSION_MTD >= at ? <Icon name="check" size={13} /> : null} Tier {i + 1}</td><td className="r num">${at.toLocaleString()}+</td><td className="r num">${b}</td></tr>)}</tbody></table></Card>
        <Card title="Refer creators">
          <p className="muted small" style={{ marginTop: 0 }}>Earn 10% of a referred creator’s commission for their first 6 months. It’s paid out with your commission, under Referrals.</p>
          <div className="three"><div><span className="lbl">Referred</span><div className="num" style={{ fontSize: 20, fontWeight: 700 }}>2</div></div><div><span className="lbl">Earned</span><div className="num" style={{ fontSize: 20, fontWeight: 700 }}>$55.50</div></div><div><span className="lbl">Active</span><div className="num" style={{ fontSize: 20, fontWeight: 700 }}>2</div></div></div>
          <div className="row" style={{ marginTop: 14 }}><code className="code grow">later.link/r/jules</code><Button size="sm" icon="copy" onClick={() => navigator.clipboard?.writeText('https://later.link/r/jules').then(() => say('Referral link copied'), () => say('later.link/r/jules'))}>Copy</Button></div>
        </Card>
      </div>
    </div>
  );
}

type EarnTab = 'overview' | 'links' | 'brands' | 'payouts';

function CreatorEarn() {
  const { route, links } = useStore();
  const fromRoute = (route.page === 'tool' && route.tab) as EarnTab | undefined;
  const [tab, setTab] = useState<EarnTab>(fromRoute || 'overview');
  useEffect(() => { if (fromRoute) setTab(fromRoute); }, [route]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="stack">
      <div className="head"><div><h1>Earn</h1><p className="muted">Affiliate links for 3,000+ brands, brand deal fees and bonuses, paid out together. Links you make here show up in Link in bio and as one-tap replies in Engage.</p></div></div>
      <LinkMaker className="m-only" />
      <Tabs label="Earn" value={tab} onChange={setTab} tabs={[{ value: 'overview', label: 'Overview' }, { value: 'links', label: 'Links', count: links.filter(l => !l.live).length }, { value: 'brands', label: 'Brands' }, { value: 'payouts', label: 'Payouts' }]} />
      {tab === 'overview' && <Overview setTab={setTab} />}
      {tab === 'links' && <Links />}
      {tab === 'brands' && <Brands />}
      {tab === 'payouts' && <Payouts />}
    </div>
  );
}

export function Earn() {
  const { role } = useStore();
  return role === 'creator' ? <CreatorEarn /> : <Explainer />;
}

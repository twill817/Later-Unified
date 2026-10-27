import { useEffect, useMemo, useState } from 'react';
import { Avatar, Button, CountBadge, Icon, IconButton, Pill, Wordmark } from '@ds';
import { CAMPAIGNS, QUEUE, ROLES, TOOLS, allCreators, findCreator, toolLabel, type Role, type Route, type ToolId } from '../data';
import { useStore } from '../store';
import { PostEditor } from '../pages/Plan';
import { LinkMaker } from '../pages/Earn';
import { Customize } from './Customize';

const isActive = (route: Route, id: ToolId | 'home' | 'workspace') => {
  if (id === 'home') return route.page === 'home';
  if (id === 'workspace') return route.page === 'workspace';
  if (id === 'campaigns') return route.page === 'campaign' || route.page === 'agent' || (route.page === 'tool' && route.tool === 'campaigns');
  if (id === 'insights') return route.page === 'insights';
  return route.page === 'tool' && route.tool === id;
};

export const toolRoute = (id: ToolId): Route => (id === 'insights' ? { page: 'insights', tab: 'halo' } : { page: 'tool', tool: id });

function NavItem({ id, dim }: { id: ToolId; dim?: boolean }) {
  const { role, route, go, badge } = useStore();
  const t = TOOLS[id];
  const n = badge(id);
  return (
    <button className={`nav ${dim ? 'nav--dim' : ''}`} aria-current={isActive(route, id) ? 'page' : undefined} onClick={() => go(toolRoute(id))}>
      <Icon name={t.icon} />
      <span>{toolLabel(id, role)}</span>
      <CountBadge count={n} label="need attention" />
    </button>
  );
}

export function Sidebar() {
  const { role, route, go, open, say, pinned } = useStore();
  const r = ROLES[role];
  const more = (Object.keys(TOOLS) as ToolId[]).filter(id => !pinned.includes(id));
  const [menu, setMenu] = useState<null | { kind: 'create' | 'user'; x: number; y: number; up?: boolean }>(null);
  const showMenu = (kind: 'create' | 'user', el: HTMLElement) => {
    const b = el.getBoundingClientRect();
    const up = b.top > window.innerHeight / 2;
    setMenu(m => (m?.kind === kind ? null : { kind, x: Math.max(16, Math.min(b.left, window.innerWidth - 296)), y: up ? window.innerHeight - b.top + 8 : b.bottom + 6, up }));
  };
  useEffect(() => {
    if (!menu) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent && e.key !== 'Escape') return;
      if (e instanceof MouseEvent && (e.target as HTMLElement).closest('.menu, [data-menu]')) return;
      setMenu(null);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', close); };
  }, [menu]);

  const createItems: Record<Role, [string, string, () => void][]> = {
    brand: [['Campaign with EdgeAI', 'EdgeAI plans it and checks with you before spending', () => go({ page: 'campaign', id: 'wl' })], ['Creator shortlist', 'Find best-fit creators', () => go({ page: 'campaign', id: 'ft', tab: 'creators' })], ['Post', 'Schedule to Fernway profiles', () => go({ page: 'tool', tool: 'plan' })]],
    smm: [['Post', 'Schedule to any connected profile', () => go({ page: 'tool', tool: 'plan' })], ['Link in bio block', 'Add a banner, product or form', () => go({ page: 'tool', tool: 'linkinbio' })], ['Report', 'Share analytics with a link', () => say('Report link copied')]],
    creator: [['Affiliate link', 'Paste a product URL, or browse 3,000+ brands', () => go({ page: 'tool', tool: 'earn', tab: 'brands' })], ['Post', 'Schedule to your profiles', () => go({ page: 'tool', tool: 'plan' })]],
  };

  return (
    <nav className="rail" aria-label="Main navigation">
      <div className="rail__mark"><Wordmark /></div>
      <div className="rail__create" data-menu>
        <Button variant="primary" icon="plus" fullWidth aria-haspopup="menu" aria-expanded={menu?.kind === 'create'} onClick={e => showMenu('create', e.currentTarget)}>Create</Button>
      </div>
      <div className="rail__list">
        <button className="nav" aria-current={route.page === 'home' ? 'page' : undefined} onClick={() => go({ page: 'home' })}><Icon name="home" /><span>Home</span></button>
        <div className="rail__sect rail__sect--act"><span>Your tools</span><button className="rail__edit" onClick={() => open({ kind: 'tools' })}>Customize</button></div>
        {pinned.map(id => <NavItem key={id} id={id} />)}
        {more.length > 0 && <div className="rail__sect">More from Later</div>}
        {more.map(id => <NavItem key={id} id={id} dim />)}
      </div>
      <div className="rail__foot">
        <button className="nav" onClick={() => go({ page: 'home' })}><Icon name="bell" /><span>Notifications</span><CountBadge count={QUEUE[role].length} label="notifications" /></button>
        <button className="nav" aria-current={route.page === 'workspace' ? 'page' : undefined} onClick={() => go({ page: 'workspace' })}><Icon name="sliders" /><span>Workspace</span></button>
      </div>
      <p className="faint rail__note" style={{ fontSize: 11.5, padding: '8px 10px 4px' }}>Unofficial concept, not affiliated with Later. All data is fictional.</p>
      <button className="user" data-menu aria-haspopup="menu" aria-expanded={menu?.kind === 'user'} onClick={e => showMenu('user', e.currentTarget)}>
        <Avatar name={r.name} size={40} />
        <span className="grow"><b>{r.name}</b><small>{r.workspace}</small></span>
        <Icon name="chevronRight" size={16} />
      </button>
      {menu && (
        <div className="menu" role="menu" style={{ left: menu.x, ...(menu.up ? { bottom: menu.y } : { top: menu.y }) }}>
          {menu.kind === 'create'
            ? createItems[role].map(([t, d, fn]) => (
                <button key={t} role="menuitem" onClick={() => { setMenu(null); fn(); }} style={{ alignItems: 'flex-start' }}>
                  <Icon name="plus" size={16} /><span><b style={{ display: 'block' }}>{t}</b><small className="muted" style={{ fontWeight: 400 }}>{d}</small></span>
                </button>
              ))
            : <>
                <div className="menu__head"><Avatar name={r.name} size={40} /><span><b>{r.name}</b><small>{r.email}</small><small>{r.workspace}</small></span></div>
                <button role="menuitem" onClick={() => { setMenu(null); go({ page: 'workspace' }); }}><Icon name="sliders" size={16} />Workspace settings</button>
                <button role="menuitem" onClick={() => { setMenu(null); open({ kind: 'ai' }); }}><Icon name="spark" size={16} />Ask EdgeAI</button>
                <SignOut onDone={() => setMenu(null)} />
              </>}
        </div>
      )}
    </nav>
  );
}

function SignOut({ onDone }: { onDone: () => void }) {
  const { setAuth, setPick, role, go } = useStore();
  return <button role="menuitem" onClick={() => { onDone(); setPick(role); go({ page: 'home' }); setAuth('out'); }}><Icon name="logout" size={16} />Sign out</button>;
}

export function TopBar() {
  const { open, setNavOpen, role } = useStore();
  return (
    <div className="top">
      <IconButton className="m-only" icon="menu" label="Open menu" size={38} onClick={() => setNavOpen(true)} />
      <span className="m-only top__mark"><Wordmark /></span>
      <button className="search d-only" onClick={() => open({ kind: 'search' })}><Icon name="search" size={16} /><span>Search posts, creators and links</span><kbd>Ctrl K</kbd></button>
      {role === 'creator' && <LinkMaker className="d-only top__lm" />}
      <IconButton className="m-only" icon="search" label="Search" size={38} onClick={() => open({ kind: 'search' })} />
      <span className="m-only"><Avatar name={ROLES[role].name} size={32} /></span>
    </div>
  );
}

export function TabBar() {
  const { role, route, go, setNavOpen, pinned } = useStore();
  const ids = pinned.slice(0, 3);
  const short: Partial<Record<ToolId, string>> = { plan: 'Plan', engage: 'Inbox', campaigns: role === 'creator' ? 'Deals' : 'Campaigns' };
  return (
    <nav className="tabbar" aria-label="Primary">
      <button className="tab" aria-current={route.page === 'home' ? 'page' : undefined} onClick={() => go({ page: 'home' })}><Icon name="home" size={22} /><span>Home</span></button>
      {ids.map(id => (
        <button key={id} className="tab" aria-current={isActive(route, id) ? 'page' : undefined} onClick={() => go(toolRoute(id))}>
          <Icon name={TOOLS[id].icon} size={22} /><span>{short[id] ?? TOOLS[id].label}</span>
        </button>
      ))}
      <button className="tab" onClick={() => setNavOpen(true)}><Icon name="menu" size={22} /><span>More</span></button>
    </nav>
  );
}

export function PrototypeBar() {
  const { auth, pick, setPick, role, setRole, setAuth, go, say } = useStore();
  const cur = auth === 'in' ? role : pick;
  const roles: [Role, string][] = [['brand', 'Brand marketer'], ['smm', 'Social manager'], ['creator', 'Creator']];
  return (
    <div className="proto" role="region" aria-label="Prototype controls">
      <span className="proto__tag">Prototype</span>
      <span className="proto__lab" style={{ color: '#9B98A8' }}>View as</span>
      <span className="proto__seg" role="radiogroup" aria-label="Role">
        {roles.map(([v, l]) => (
          <button key={v} role="radio" aria-checked={cur === v} onClick={() => { if (auth === 'in') { setRole(v); say(`Viewing as ${l.toLowerCase()}`); } else setPick(v); }}>{l}</button>
        ))}
      </span>
      <button className="proto__btn" disabled={auth !== 'in'} onClick={() => { setPick(role); go({ page: 'home' }); setAuth('out'); }}><Icon name="refresh" size={14} /><span>Replay sign-in</span></button>
      <span className="proto__note">Unofficial concept, not affiliated with Later. All data is fictional.</span>
    </div>
  );
}

export function SignIn() {
  const { auth, pick, setPick, setAuth, setRole } = useStore();
  if (auth === 'in') return null;
  const accounts: [Role, string][] = [['brand', 'Influencer marketing lead, Fernway Outdoor'], ['smm', 'Social media manager, Fernway Outdoor'], ['creator', 'Creator, @julesoutside']];
  const signIn = () => {
    if (auth !== 'out') return;
    setAuth('signing');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.setTimeout(() => { setRole(pick); setAuth(reduce ? 'in' : 'revealing'); }, reduce ? 0 : 700);
  };
  return (
    <div className={`login ${auth === 'revealing' ? 'login--out' : ''}`} role="dialog" aria-modal="true" aria-labelledby="login-h" onKeyDown={e => { if (e.key === 'Enter' && !(e.target as HTMLElement).closest('.acct')) signIn(); }}>
      <div className="login__card">
        <div style={{ display: 'flex', justifyContent: 'center' }}><Wordmark /></div>
        <h1 id="login-h">Sign in to your workspace</h1>
        <p className="muted" style={{ textAlign: 'center', marginTop: -10 }}>Choose a demo account to continue.</p>
        <div role="radiogroup" aria-label="Demo account" style={{ display: 'grid', gap: 8 }}>
          {accounts.map(([v, d]) => (
            <button key={v} className="acct" role="radio" aria-checked={pick === v} onClick={() => setPick(v)}>
              <Avatar name={ROLES[v].name} /><span><b>{ROLES[v].name}</b><small>{d}</small></span><span className="radio" />
            </button>
          ))}
        </div>
        <Button variant="primary" fullWidth autoFocus onClick={signIn} disabled={auth === 'signing'}>{auth === 'signing' ? 'Signing in…' : 'Continue'}</Button>
        <p className="faint" style={{ textAlign: 'center', fontSize: 12 }}>Unofficial concept prototype. Demo accounts only, no passwords.</p>
      </div>
    </div>
  );
}

/** Counts each metric up from zero once the dashboard is revealed. */
export function countUp(root: HTMLElement) {
  const els = root.querySelectorAll<HTMLElement>('.lo-metric__value, .tile__v, .cu');
  const jobs = [...els].map(el => {
    const m = el.textContent?.trim().match(/^([^\d]*?)([\d,]*\.?\d+)(.*)$/);
    if (!m) return null;
    const raw = m[2];
    return { el, pre: m[1], n: parseFloat(raw.replace(/,/g, '')), dec: (raw.split('.')[1] || '').length, grp: raw.includes(','), suf: m[3] };
  }).filter(Boolean) as { el: HTMLElement; pre: string; n: number; dec: number; grp: boolean; suf: string }[];
  const fmt = (j: typeof jobs[number], v: number) => j.pre + v.toLocaleString('en-US', { minimumFractionDigits: j.dec, maximumFractionDigits: j.dec, useGrouping: j.grp }) + j.suf;
  const final = jobs.map(j => j.el.textContent);
  const t0 = performance.now();
  const step = (now: number) => {
    const k = Math.min(1, (now - t0) / 1700), e = 1 - Math.pow(1 - k, 3);
    jobs.forEach((j, i) => { j.el.textContent = k >= 1 ? final[i] : fmt(j, j.n * e); });
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const ANSWERS: Record<Role, [string, string][]> = {
  brand: [
    ['Which creators should I add next?', 'Tess Alder (95% fit, $1,400–1,900) and Iris Park (90% fit, $600–850). Both have under 10% audience overlap with your roster, so they add new buyers instead of repeat reach.'],
    ['Am I overspending?', 'No. You’re 61% spent at 60% of the flight with ROAS at 6.3×, above your 4.5× target. Paid amplification is the least efficient line; creator posts return about 2× more per dollar.'],
  ],
  smm: [['What should I post this weekend?', 'Saturday 9:00 AM on Instagram and Sunday 4:00 PM on TikTok are your strongest slots. Pair the rising #shoulderseason trend with the Alder jacket.']],
  creator: [['Should I take the Northline invite?', 'Probably yes. Coffee posts with your audience convert at 4.1%, and it doesn’t conflict with Fernway’s exclusivity terms.']],
};

export function Overlays() {
  const { overlay, open, invited, invite, go, role, agent } = useStore();
  const [asked, setAsked] = useState<[string, string][]>([]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open(overlay?.kind === 'search' ? null : { kind: 'search' }); }
      if (e.key === 'Escape' && overlay) open(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [overlay, open]);
  useEffect(() => setAsked([]), [role]);
  if (!overlay) return null;

  if (overlay.kind === 'search') return <><div className="scrim" onClick={() => open(null)} /><SearchPalette /></>;
  if (overlay.kind === 'tools') return <><div className="scrim" onClick={() => open(null)} /><Customize /></>;
  if (overlay.kind === 'post') return <><div className="scrim" onClick={() => open(null)} /><PostEditor key={overlay.id ?? 'new'} id={overlay.id} draft={overlay.draft} /></>;

  if (overlay.kind === 'ai') {
    return (
      <>
        <div className="scrim" onClick={() => open(null)} />
        <div className="drawer" role="dialog" aria-modal="true" aria-label="Ask EdgeAI">
          <div className="drawer__h"><h2>Ask EdgeAI</h2><IconButton icon="x" label="Close" size={36} onClick={() => open(null)} /></div>
          <div className="drawer__b">
            <p className="muted small">Answers draw on everything you can see in Later One.</p>
            {role === 'brand' && (
              <>
                <span className="lbl">Hand off a task</span>
                <button className="ask ask--agent" onClick={() => { agent.start(); go({ page: 'agent' }); }}>
                  <Icon name="spark" size={16} />
                  <span><b>Plan the Winter Layers drop for me</b><small>EdgeAI drafts the brief, picks creators and sets offers. It checks with you before spending or messaging anyone.</small></span>
                </button>
              </>
            )}
            {asked.map(([q, a]) => (
              <div key={q} className="stack" style={{ gap: 8 }}>
                <div style={{ alignSelf: 'flex-end', background: 'var(--lo-color-action)', color: 'var(--lo-color-on-action)', padding: '9px 12px', borderRadius: 12 }}>{q}</div>
                <div className="note note--ai">{a}</div>
              </div>
            ))}
            <span className="lbl">Try asking</span>
            {ANSWERS[role].filter(([q]) => !asked.some(a => a[0] === q)).map(qa => <button key={qa[0]} className="ask" onClick={() => setAsked(x => [...x, qa])}>{qa[0]}</button>)}
          </div>
        </div>
      </>
    );
  }

  const c = findCreator(overlay.id);
  if (!c) return null;
  const seed = [...c.id].reduce((a, ch) => a + ch.charCodeAt(0), 0);
  const ages: [string, number][] = [['18–24', 12 + (seed % 9)], ['25–34', 36 + (seed % 13)], ['35–44', 20 + (seed % 8)]];
  ages.push(['45+', 100 - ages.reduce((s, a) => s + a[1], 0)]);
  const done = invited.has(c.id) || c.stage !== undefined;
  return (
    <>
      <div className="scrim" onClick={() => open(null)} />
      <div className="drawer" role="dialog" aria-modal="true" aria-label={`${c.name} profile`}>
        <div className="drawer__h">
          <div className="row" style={{ gap: 12 }}><Avatar name={c.name} size={44} /><div><h2>{c.name}</h2><div className="faint small">{c.handle} · {c.followers} followers</div></div></div>
          <IconButton icon="x" label="Close" size={36} onClick={() => open(null)} />
        </div>
        <div className="drawer__b">
          <div className="row" style={{ gap: 6 }}>
            <Pill tone="action">{c.fit}% fit</Pill>
            {c.risk ? <Pill tone="warning" icon="alert">Brand-safety review</Pill> : <Pill tone="success">Brand safety clear</Pill>}
            {c.source === 'audience' && <Pill tone="grow">From your audience</Pill>}
          </div>
          <div className="note note--ai"><b>Why EdgeAI suggests {c.name.split(' ')[0]}:</b> {c.reason}.</div>
          <div>
            <span className="lbl">Audience age</span>
            {ages.map(([l, v]) => <div key={l} className="bar"><span>{l}</span><div className="meter"><i style={{ width: `${v * 1.6}%` }} /></div><span className="num" style={{ textAlign: 'right' }}>{v}%</span></div>)}
            <p className="faint small" style={{ marginTop: 4 }}>{48 + (seed % 22)}% women{c.overlap ? ` · ${c.overlap} overlap with your current roster` : ''}</p>
          </div>
          {c.risk && <div className="note note--warn">A March 2025 post criticized a competitor’s product recall. Read it before inviting.</div>}
          {c.rate && <div className="note"><b>Fair rate:</b> <span className="num">{c.rate}</span> per Reel or TikTok, from the incentive advisor.</div>}
        </div>
        <div className="drawer__f">
          {done ? <Button onClick={() => open(null)}>Close</Button> : <><Button onClick={() => open(null)}>Not now</Button><Button variant="primary" onClick={() => invite(c.id, c.name, c.rate)}>Invite to Fall Trail ’26</Button></>}
        </div>
      </div>
    </>
  );
}

function SearchPalette() {
  const { role, go, open } = useStore();
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const items = useMemo(() => {
    const r = ROLES[role];
    const out: { label: string; kind: string; act: () => void }[] = [{ label: 'Home', kind: 'Page', act: () => go({ page: 'home' }) }];
    [...r.order, ...r.more].forEach(id => out.push({ label: toolLabel(id, role), kind: 'Page', act: () => go(toolRoute(id)) }));
    if (role !== 'creator') {
      CAMPAIGNS.forEach(c => out.push({ label: c.name, kind: 'Campaign', act: () => go({ page: 'campaign', id: c.id }) }));
      allCreators().forEach(c => out.push({ label: `${c.name} ${c.handle}`, kind: 'Creator', act: () => open({ kind: 'profile', id: c.id }) }));
    }
    return out;
  }, [role, go, open]);
  const list = items.filter(i => !q || i.label.toLowerCase().includes(q.toLowerCase())).slice(0, 12);
  return (
    <div className="palette" role="dialog" aria-label="Search">
      <input autoFocus aria-label="Search" placeholder="Search posts, creators and links" value={q}
        onChange={e => { setQ(e.target.value); setSel(0); }}
        onKeyDown={e => {
          if (e.key === 'ArrowDown') { e.preventDefault(); setSel(s => Math.min(list.length - 1, s + 1)); }
          if (e.key === 'ArrowUp') { e.preventDefault(); setSel(s => Math.max(0, s - 1)); }
          if (e.key === 'Enter' && list[sel]) list[sel].act();
        }} />
      <div className="palette__list" role="listbox">
        {list.length ? list.map((i, k) => (
          <button key={i.label + i.kind} className="palette__i" role="option" aria-selected={k === sel} onClick={i.act}><span>{i.label}</span><small>{i.kind}</small></button>
        )) : <p className="faint" style={{ padding: 12 }}>No matches. Try a creator name or a campaign.</p>}
      </div>
    </div>
  );
}

export function Toast() {
  const { toast } = useStore();
  return toast ? <div className="toast" role="status"><Icon name="check" size={16} />{toast}</div> : null;
}

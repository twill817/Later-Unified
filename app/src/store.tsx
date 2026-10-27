import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { BLOCKS, CONVOS, LINKS, POSTS, ROLES, topRate, type Cohort, type AffLink, type Block, type Brand, type Convo, type Post, type Role, type Route, type ToolId } from './data';
import { useAgentRun, type AgentRun } from './agent';

export type Auth = 'out' | 'signing' | 'revealing' | 'in';
export type Overlay =
  | { kind: 'profile'; id: string }
  | { kind: 'post'; id?: string; draft?: Partial<Post> }
  | { kind: 'ai' }
  | { kind: 'search' }
  | { kind: 'tools' }
  | null;

/** Which posts and conversations a role sees: the brand team shares one workspace, the creator has their own. */
export const viewOf = (r: Role) => (r === 'creator' ? 'creator' : 'team') as 'team' | 'creator';

interface Store {
  auth: Auth;
  setAuth: (a: Auth) => void;
  pick: Role;
  setPick: (r: Role) => void;
  role: Role;
  setRole: (r: Role) => void;
  route: Route;
  go: (r: Route) => void;
  overlay: Overlay;
  open: (o: Overlay) => void;
  navOpen: boolean;
  setNavOpen: (b: boolean) => void;
  toast: string | null;
  say: (msg: string) => void;
  invited: Set<string>;
  invite: (id: string, name: string, rate?: string) => void;
  agent: AgentRun;
  posts: Post[];
  savePost: (p: Post) => void;
  convos: Convo[];
  updateConvo: (id: string, fn: (c: Convo) => Convo) => void;
  links: AffLink[];
  setLinks: (fn: (l: AffLink[]) => AffLink[]) => void;
  blocks: Record<'team' | 'creator', Block[]>;
  toggleBlock: (i: number) => void;
  credits: Record<Role, number>;
  spendCredit: () => boolean;
  listenPreview: boolean;
  setListenPreview: (b: boolean) => void;
  badge: (id: ToolId) => number;
  /** The tools pinned to the sidebar, in order. Any tool can be pinned; roles only set the starting point. */
  pinned: ToolId[];
  setPinned: (fn: (t: ToolId[]) => ToolId[]) => void;
  resetPinned: (preset: Role) => void;
  cohort: Cohort;
  setCohort: (c: Cohort) => void;
  favs: Set<string>;
  toggleFav: (id: string) => void;
  /** Make an affiliate link, copy it and show it at the top of Links. */
  makeLink: (brand: Brand, product: string, rate?: number) => void;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<Auth>('out');
  const [pick, setPick] = useState<Role>('brand');
  const [role, setRoleState] = useState<Role>('brand');
  const [route, setRoute] = useState<Route>({ page: 'home' });
  const [overlay, open] = useState<Overlay>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [invited, setInvited] = useState<Set<string>>(new Set());
  const [posts, setPosts] = useState<Post[]>(() => POSTS.map(p => ({ ...p, comments: [...p.comments] })));
  const [convos, setConvos] = useState<Convo[]>(() => CONVOS.map(c => ({ ...c })));
  const [links, setLinks] = useState<AffLink[]>(() => LINKS.map(l => ({ ...l })));
  const [blocks, setBlocks] = useState(() => ({ team: BLOCKS.team.map(b => ({ ...b })), creator: BLOCKS.creator.map(b => ({ ...b })) }));
  const [credits, setCredits] = useState<Record<Role, number>>({ brand: 88, smm: 31, creator: 12 });
  const [listenPreview, setListenPreview] = useState(false);
  const [pinnedBy, setPinnedBy] = useState<Record<Role, ToolId[]>>(() => ({ brand: [...ROLES.brand.order], smm: [...ROLES.smm.order], creator: [...ROLES.creator.order] }));
  const [cohort, setCohort] = useState<Cohort>('niche');
  const [favs, setFavs] = useState<Set<string>>(new Set(['fernway', 'northline']));
  const timer = useRef<number | undefined>(undefined);
  const agent = useAgentRun();

  const say = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  const go = useCallback((r: Route) => {
    setRoute(r);
    setNavOpen(false);
    open(null);
    window.scrollTo({ top: 0 });
  }, []);

  const setRole = (r: Role) => {
    setRoleState(r);
    setPick(r);
    open(null);
    setRoute({ page: 'home' });
  };

  const invite = (id: string, name: string, rate?: string) => {
    setInvited(s => new Set(s).add(id));
    open(null);
    say(`${name} invited${rate ? ` at ${rate}` : ''}`);
  };

  const savePost = (p: Post) => setPosts(list => (list.some(x => x.id === p.id) ? list.map(x => (x.id === p.id ? p : x)) : [...list, p]));
  const updateConvo = (id: string, fn: (c: Convo) => Convo) => setConvos(list => list.map(c => (c.id === id ? fn(c) : c)));
  const toggleBlock = (i: number) => {
    const v = viewOf(role);
    setBlocks(b => ({ ...b, [v]: b[v].map((x, k) => (k === i ? { ...x, on: !x.on } : x)) }));
  };
  const spendCredit = () => {
    if (credits[role] < 1) { say('No AI credits left this month'); return false; }
    setCredits(c => ({ ...c, [role]: c[role] - 1 }));
    return true;
  };

  const pinned = pinnedBy[role];
  const setPinned = (fn: (t: ToolId[]) => ToolId[]) => setPinnedBy(p => ({ ...p, [role]: fn(p[role]) }));
  const resetPinned = (preset: Role) => setPinnedBy(p => ({ ...p, [role]: [...ROLES[preset].order] }));
  const toggleFav = (id: string) => setFavs(s => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const makeLink = (brand: Brand, product: string, rate = topRate(brand)) => {
    const slug = product.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 24) || brand.id;
    const url = `later.link/jules/${slug}`;
    setLinks(ls => [{ id: `n${Date.now()}`, brand: brand.name, product, url, clicks: 0, orders: 0, commission: 0, live: true, rate, isNew: true }, ...ls.filter(l => l.url !== url)]);
    navigator.clipboard?.writeText(`https://${url}`).catch(() => undefined);
    say(`Link copied: ${url} · earns up to ${rate}%`);
  };

  const badge = (id: ToolId) => {
    const v = viewOf(role);
    if (id === 'plan') {
      const mine = posts.filter(p => p.views.includes(v));
      return v === 'creator' ? mine.filter(p => p.status === 'changes').length : mine.filter(p => p.status === 'approval' || p.status === 'failed').length;
    }
    if (id === 'engage') return convos.filter(c => c.view === v && c.unread).length;
    if (id === 'earn' && role === 'creator') return links.filter(l => !l.live).length;
    if (id === 'campaigns' && role === 'creator') return 1;
    return 0;
  };

  return (
    <Ctx.Provider value={{
      auth, setAuth, pick, setPick, role, setRole, route, go, overlay, open, navOpen, setNavOpen, toast, say, invited, invite, agent,
      posts, savePost, convos, updateConvo, links, setLinks, blocks, toggleBlock, credits, spendCredit, listenPreview, setListenPreview, badge, pinned, setPinned, resetPinned, cohort, setCohort, favs, toggleFav, makeLink,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore must be used inside StoreProvider');
  return s;
}

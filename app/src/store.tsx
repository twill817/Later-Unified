import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { BLOCKS, CONVOS, LINKS, POSTS, type AffLink, type Block, type Convo, type Post, type Role, type Route, type ToolId } from './data';
import { useAgentRun, type AgentRun } from './agent';

export type Auth = 'out' | 'signing' | 'revealing' | 'in';
export type Overlay =
  | { kind: 'profile'; id: string }
  | { kind: 'post'; id?: string; draft?: Partial<Post> }
  | { kind: 'ai' }
  | { kind: 'search' }
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
      posts, savePost, convos, updateConvo, links, setLinks, blocks, toggleBlock, credits, spendCredit, listenPreview, setListenPreview, badge,
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

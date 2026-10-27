import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import type { Role, Route } from './data';
import { useAgentRun, type AgentRun } from './agent';

export type Auth = 'out' | 'signing' | 'revealing' | 'in';
export type Overlay = { kind: 'profile'; id: string } | { kind: 'ai' } | { kind: 'search' } | null;

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

  return (
    <Ctx.Provider value={{ auth, setAuth, pick, setPick, role, setRole, route, go, overlay, open, navOpen, setNavOpen, toast, say, invited, invite, agent }}>
      {children}
    </Ctx.Provider>
  );
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore must be used inside StoreProvider');
  return s;
}

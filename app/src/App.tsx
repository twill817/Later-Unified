import { useEffect, useLayoutEffect, useRef } from 'react';
import { Button } from '@ds';
import { useStore } from './store';
import { Overlays, PrototypeBar, Sidebar, SignIn, TabBar, Toast, TopBar, countUp } from './shell/Shell';
import { Home } from './pages/Home';
import { CampaignDetail, CampaignList } from './pages/Campaigns';
import { Insights } from './pages/Insights';
import { AgentRun } from './pages/Agent';
import { Workspace } from './pages/Tool';
import { Plan } from './pages/Plan';
import { Engage } from './pages/Engage';
import { Analyze, Create, Earn, LinkInBio, Listen, Services } from './pages/Tools';

function Page() {
  const { route } = useStore();
  switch (route.page) {
    case 'home': return <Home />;
    case 'workspace': return <Workspace />;
    case 'insights': return <Insights tab={route.tab} />;
    case 'campaign': return <CampaignDetail id={route.id} tab={route.tab} />;
    case 'agent': return <AgentRun />;
    case 'tool': {
      const pages = { campaigns: CampaignList, plan: Plan, engage: Engage, analyze: Analyze, listen: Listen, create: Create, linkinbio: LinkInBio, earn: Earn, services: Services, insights: () => <Insights tab="halo" /> };
      const P = pages[route.tool];
      return <P />;
    }
  }
}

export default function App() {
  const { auth, setAuth, navOpen, setNavOpen, open, route } = useStore();
  const app = useRef<HTMLDivElement>(null);

  // Sign-in reveal: start blurred and blank, then sharpen while the numbers count up.
  useLayoutEffect(() => {
    const el = app.current;
    if (!el || auth !== 'revealing') return;
    el.classList.add('locked', 'blank');
    void el.offsetWidth;
    el.classList.add('revealing');
    el.classList.remove('locked', 'blank');
    countUp(el);
    const t = window.setTimeout(() => { el.classList.remove('revealing'); setAuth('in'); }, 2700);
    return () => window.clearTimeout(t);
  }, [auth, setAuth]);

  useEffect(() => {
    document.title = 'Later One';
  }, [route]);

  const locked = auth === 'out' || auth === 'signing';
  return (
    <div className="lo-root">
      <PrototypeBar />
      <div ref={app} className={`app ${locked ? 'locked blank' : ''} ${navOpen ? 'navopen' : ''}`} aria-hidden={locked || undefined}>
        <Sidebar />
        {navOpen && <div className="navscrim" onClick={() => setNavOpen(false)} />}
        <div className="main">
          <TopBar />
          <main><Page /></main>
        </div>
        <div className="askpill"><Button variant="ink" icon="spark" onClick={() => open({ kind: 'ai' })}>Ask EdgeAI</Button></div>
        <TabBar />
      </div>
      <Overlays />
      <Toast />
      <SignIn />
    </div>
  );
}

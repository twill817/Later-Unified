import { Card, Pill } from '@ds';
import { ROLES } from '../data';
import { useStore } from '../store';

export function Workspace() {
  const { role } = useStore();
  const r = ROLES[role];
  return (
    <div className="stack">
      <div className="head"><div><h1>Workspace</h1><p className="muted">One account for everything in Later One: profiles, people, credits and plan.</p></div></div>
      <div className="g2e">
        <Card title="Social profiles" actions={<span className="faint small">{r.workspace}</span>}>
          {(role === 'creator' ? [['Jules Ortiz', 'IG, TT, YT, PIN', true]] : [['Fernway Outdoor', 'IG, TT, FB, TH, YT, PIN, LI', false], ['Fernway Kids', 'IG, FB', true]]).map(([n, p, ok]) => (
            <div key={n as string} className="li"><div className="grow"><b>{n}</b><div className="faint small">{p}</div></div>{ok ? <Pill tone="success">Connected</Pill> : <Pill tone="danger">TikTok expired</Pill>}</div>
          ))}
        </Card>
        <Card title="People">
          {(role === 'creator' ? [['Jules Ortiz', 'Owner'], ['Dana Reyes', 'Later strategist']] : [['Maya Chen', 'Admin · Campaigns'], ['Priya Shah', 'Editor · Publish, Grow'], ['Sam Park', 'Contributor · needs approval'], ['Dana Reyes', 'Later strategist']]).map(([n, d]) => (
            <div key={n} className="li"><b className="grow">{n}</b><span className="faint small">{d}</span></div>
          ))}
        </Card>
      </div>
    </div>
  );
}

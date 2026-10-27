import { useEffect, useRef, useState } from 'react';
import { AgentStepCard, Button, Card, CreatorRow, Icon, Pill, SegmentedControl } from '@ds';
import { AGENT_STEPS, BRIEF_FIELDS, COMMISSION, PAID, fees, planned, type Brief, type StepStatus } from '../agent';
import { money } from '../data';
import { useStore } from '../store';

const LABEL: Partial<Record<StepStatus, string>> = { done: 'Done', working: 'Working', review: 'Needs you', blocked: 'Blocked', paused: 'Paused' };

function Dot({ s }: { s: StepStatus }) {
  if (s === 'done') return <span className="dot dot--done"><Icon name="check" size={13} /></span>;
  if (s === 'working') return <span className="dot dot--working"><span className="lo-spin" /></span>;
  if (s === 'blocked') return <span className="dot dot--blocked"><Icon name="alert" size={12} /></span>;
  if (s === 'paused') return <span className="dot dot--paused"><Icon name="pause" size={12} /></span>;
  return <span className={`dot ${s === 'review' ? 'dot--review' : ''}`} />;
}

function BriefStep() {
  const { agent } = useStore();
  const a = agent.state;
  const [draft, setDraft] = useState<Brief>(a.brief);
  const s = a.status[1];
  if (s !== 'review') {
    return <AgentStepCard title="Draft the brief" status={s === 'done' ? 'done' : s === 'paused' ? 'paused' : 'working'} statusLabel={s === 'done' ? (a.edited ? 'You edited' : 'Approved') : undefined} lines={s === 'done' ? [a.brief.goal, `${a.brief.deliverables} · ${a.brief.usage}`] : a.lines[1]} />;
  }
  return (
    <AgentStepCard title="Draft the brief" status="review" statusLabel="Needs your review" hint="Edit any field. EdgeAI will use your changes in later steps."
      why={{ text: 'Fall Trail ’26 used the same structure and reached 124% of its sales target. The goal comes from the forecast for a $30,000 launch (1,350–1,700 orders). Usage rights are shorter than Fall Trail’s 90 days because launch sales peak in the first 3 weeks.', confidence: 'High', sources: ['Fall Trail ’26 brief', 'Launch forecast', 'Fernway catalog'] }}
      actions={<Button variant="primary" icon="check" onClick={() => agent.approveBrief(draft)}>Approve brief</Button>}>
      <div className="stack" style={{ gap: 10 }}>
        {BRIEF_FIELDS.map(([k, label]) => (
          <label key={k} className="field"><span>{label}</span><input className="inp" value={draft[k]} onChange={e => setDraft(d => ({ ...d, [k]: e.target.value }))} /></label>
        ))}
      </div>
    </AgentStepCard>
  );
}

function ShortlistStep() {
  const { agent } = useStore();
  const a = agent.state;
  const s = a.status[2];
  if (s === 'working' || s === 'paused') return <AgentStepCard title="Build the shortlist" status={s} lines={a.lines[2]} />;
  const editable = s === 'review' || a.status[3] === 'todo' || a.status[3] === 'working';
  if (s === 'done' && a.step > 3) {
    return <AgentStepCard title="Build the shortlist" status="done" statusLabel={`${a.list.length} creators`}><div className="row" style={{ gap: 6 }}>{a.list.map(o => <Pill key={o.id} tone={o.source === 'audience' ? 'grow' : 'neutral'}>{o.name}</Pill>)}</div></AgentStepCard>;
  }
  return (
    <AgentStepCard title="Build the shortlist" status={s === 'review' ? 'review' : 'done'} statusLabel={s === 'review' ? 'Needs your review' : `${a.list.length} creators`}
      why={{ text: 'Fit combines audience match, past results in your category and purchase data from Later Creator links. Two picks come from your own audience because fans recruited that way converted 2.1× better in Spring Trail ’26. Lena Tor is a rebook for her strong halo.', confidence: 'High', sources: ['412 creators scored', 'Your audience', 'Fall Trail ’26 halo'] }}
      actions={<Button variant="primary" icon="check" onClick={agent.keepList}>Keep this shortlist</Button>}>
      <div>{a.list.map(o => <CreatorRow key={o.id} name={o.name} handle={o.handle} followers={o.followers} tier={o.tier} fit={o.fit} reason={o.reason} source={o.source} onRemove={editable ? () => agent.removeCreator(o.id) : undefined} />)}</div>
      <div style={{ marginTop: 12 }}>
        {a.grayExcluded
          ? <div className="note note--warn row" style={{ flexWrap: 'nowrap' }}><Icon name="alert" size={16} /><span className="grow"><b>Gray Holloway</b> (230K, 84% fit) was left out: a 2025 post criticized a competitor’s recall and needs a brand-safety review first.</span>{editable && <Button size="sm" onClick={agent.includeGray}>Include anyway</Button>}</div>
          : <div className="note">You added Gray Holloway despite the brand-safety flag. {editable && <button className="linkbtn" style={{ color: 'var(--lo-color-action)' }} onClick={agent.excludeGray}>Undo</button>}</div>}
      </div>
    </AgentStepCard>
  );
}

function OffersStep() {
  const { agent } = useStore();
  const a = agent.state;
  const s = a.status[3];
  if (s === 'working' || s === 'paused') return <AgentStepCard title="Set offers" status={s} lines={a.lines[3]} />;
  const total = planned(a), over = total > a.cap;
  if (s === 'done') {
    return <AgentStepCard title="Set offers" status="done" statusLabel="Approved" lines={[`${money(fees(a))} in creator fees to ${a.list.length} creators`, `${money(total)} planned of your ${money(a.cap)} cap, including commission and paid amplification`]} />;
  }
  const review = s === 'review';
  return (
    <AgentStepCard title="Set offers" status={review ? 'review' : 'done'} statusLabel={review ? 'Needs your approval' : 'Approved'}
      hint={`Approving commits up to ${money(total)} of the budget. Nothing is sent to creators yet.`}
      why={{ text: 'Each offer sits inside the fair range for the creator’s size, category and engagement. Projected result at these offers: 1,350–1,700 orders against your goal.', confidence: 'Medium', sources: ['Incentive advisor', 'Launch forecast'] }}
      actions={<Button variant="primary" icon="check" disabled={over} onClick={agent.approveOffers}>Approve offers</Button>}>
      <div className="scrollx">
        <table className="tbl" style={{ minWidth: 520 }}>
          <thead><tr><th>Creator</th><th>Fair range</th><th>Offer</th><th>Commission</th></tr></thead>
          <tbody>
            {a.list.map(o => (
              <tr key={o.id}>
                <td><b>{o.name}</b><div className="faint small">{o.tier}</div></td>
                <td className="faint">${o.low.toLocaleString()}–{o.high.toLocaleString()}</td>
                <td>
                  {review ? <span className="money"><span>$</span><input type="number" step={50} min={0} value={o.offer} aria-label={`Offer for ${o.name}`} onChange={e => agent.setOffer(o.id, Math.max(0, +e.target.value || 0))} /></span> : `$${o.offer.toLocaleString()}`}
                  {(o.offer < o.low || o.offer > o.high) && <div className={`small ${o.offer > o.high ? 'down' : 'faint'}`}>{o.offer > o.high ? 'Above' : 'Below'} fair range</div>}
                </td>
                <td>{o.commission ? `${o.commission}%` : 'Flat'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="budget">
        <div><span className="lbl">Creator fees</span><b>{money(fees(a))}</b></div>
        <div><span className="lbl">Est. commission</span><b>{money(COMMISSION)}</b></div>
        <div><span className="lbl">Paid amplification</span><b>{money(PAID)}</b></div>
        <div><span className="lbl">Total vs cap</span><b className={over ? 'down' : ''}>{money(total)} / {money(a.cap)}</b></div>
      </div>
      {over && <p className="err" role="alert">Over your {money(a.cap)} cap by {money(total - a.cap)}. Lower an offer, or raise the cap in Guardrails.</p>}
    </AgentStepCard>
  );
}

function AvailabilityStep() {
  const { agent } = useStore();
  const a = agent.state;
  const s = a.status[4];
  if (s === 'working' || s === 'paused') return <AgentStepCard title="Check availability" status={s} lines={a.lines[4]} />;
  if (s === 'done') {
    const r = { replace: 'Replaced Kofi Mensah with Dana Holt', delay: 'Kofi Mensah invited for after Jan 20', remove: 'Removed Kofi Mensah', none: 'No conflicts found' }[a.resolution ?? 'none'];
    return <AgentStepCard title="Check availability" status="done" statusLabel={a.resolution === 'none' ? 'Done' : 'Resolved by you'} lines={[r, 'Lu Andersen’s audience data refreshed']} />;
  }
  return (
    <AgentStepCard title="Check availability" status="blocked" lines={a.lines[4]}>
      <div className="note note--bad" style={{ marginTop: 12 }}>
        <div className="row" style={{ flexWrap: 'nowrap', alignItems: 'flex-start' }}>
          <span style={{ color: 'var(--lo-color-danger)' }}><Icon name="alert" size={18} /></span>
          <div><b>Kofi Mensah can’t take this campaign.</b><p className="muted" style={{ marginTop: 2 }}>His Later Creator profile shows an exclusive deal with a competing outdoor brand until Jan 20. EdgeAI won’t contact him while that’s active.</p></div>
        </div>
        <div className="opts">
          <button className="opt" onClick={() => agent.resolve('replace')}><b>Replace with Dana Holt</b><span>64K · Mid · 87% fit · $1,400 offer. Closest audience to Kofi’s. Saves $1,000.</span></button>
          <button className="opt" onClick={() => agent.resolve('delay')}><b>Invite Kofi for after Jan 20</b><span>He’d post in the last 3 weeks of the launch, when sales are lower.</span></button>
          <button className="opt" onClick={() => agent.resolve('remove')}><b>Remove Kofi</b><span>Run with 5 creators. Frees $2,400 for paid amplification.</span></button>
        </div>
      </div>
      <div className="note row" style={{ marginTop: 12, flexWrap: 'nowrap', alignItems: 'flex-start' }}><Icon name="clock" size={16} /><span><b>Heads up:</b> Lu Andersen’s audience data is 41 days old, so her fit score has lower confidence. EdgeAI will refresh it before invites go out.</span></div>
    </AgentStepCard>
  );
}

function InviteStep() {
  const { agent, say } = useStore();
  const a = agent.state;
  const first = a.list[0];
  if (a.sent) {
    return <AgentStepCard title="Send invites" status="done" statusLabel="Sent" lines={[`${a.list.length} invites sent through Later Opportunities`, 'You can withdraw any invite until the creator opens it.']}>
      <div style={{ marginTop: 10 }}><Button size="sm" onClick={() => { agent.withdraw(); say('Invites withdrawn'); }}>Withdraw all</Button></div>
    </AgentStepCard>;
  }
  return (
    <AgentStepCard title="Send invites" status="review" statusLabel="Needs your go-ahead"
      actions={<Button variant="primary" icon="send" onClick={() => { agent.send(); say(`Sent ${a.list.length} invites`); }}>Send {a.list.length} invites</Button>}>
      <p className="muted small">EdgeAI never messages creators without you. Here’s what each of {a.list.length} creators will get, personalized with their offer:</p>
      <div className="msg"><div className="faint small" style={{ marginBottom: 6 }}>To {first.name} · in Later Opportunities</div>Hi {first.name.split(' ')[0]}, Fernway is launching the Alder jacket in a new winter colorway (Jan 12 – Feb 8). We’d love you to post {a.brief.deliverables.charAt(0).toLowerCase() + a.brief.deliverables.slice(1)}. Offer: ${first.offer.toLocaleString()}{first.commission ? ` + ${first.commission}% commission on sales through your link` : ''}. The full brief is attached.</div>
      <div className="row" style={{ gap: 6, marginTop: 10 }}>{a.list.map(o => <Pill key={o.id}>{o.name}</Pill>)}</div>
    </AgentStepCard>
  );
}

export function AgentRun() {
  const { agent, go } = useStore();
  const a = agent.state;
  const focus = useRef<string>('');
  useEffect(() => { if (!a.started) agent.start(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);
  useEffect(() => {
    const key = `${a.step}:${a.status[a.step]}`;
    if (key === focus.current) return;
    focus.current = key;
    const el = document.querySelector('.lo-step--review, .lo-step--blocked');
    if (el && el.getBoundingClientRect().bottom > window.innerHeight - 40) el.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
  });
  const working = a.status.includes('working'), paused = a.status.includes('paused');
  const committed = a.status[3] === 'done' || a.status[3] === 'review';
  const steps = [null, <BriefStep key={1} />, <ShortlistStep key={2} />, <OffersStep key={3} />, <AvailabilityStep key={4} />, <InviteStep key={5} />];

  return (
    <div className="stack">
      <div className="crumb"><button onClick={() => go({ page: 'tool', tool: 'campaigns' })}>Campaigns</button><Icon name="chevronRight" size={14} /><button onClick={() => go({ page: 'campaign', id: 'wl' })}>Winter Layers drop</button><Icon name="chevronRight" size={14} /><span>Agent run</span></div>
      <div className="head">
        <div><h1>Plan Winter Layers drop</h1><p className="muted">EdgeAI is planning this campaign for you. It stops whenever money, messages to creators or a judgment call is involved.</p></div>
        {!a.sent && <div className="row">
          {working && <Button icon="pause" onClick={agent.pause}>Pause</Button>}
          {paused && <Button icon="play" onClick={agent.resume}>Resume</Button>}
          <Button variant="ghost" icon="refresh" onClick={agent.start}>Start over</Button>
        </div>}
      </div>
      <div className="agent">
        <Card className="agent__rail">
          <span className="lbl" style={{ marginBottom: 10 }}>Plan</span>
          {AGENT_STEPS.map((s, i) => (
            <div key={s} className={`stp ${i === a.step ? 'stp--cur' : ''}`}>
              <Dot s={a.status[i]} />
              <span><b>{s}</b>{LABEL[a.status[i]] && <small className={a.status[i] === 'review' ? 'acc' : ''}>{LABEL[a.status[i]]}</small>}</span>
            </div>
          ))}
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--lo-color-border)' }}>
            <div className="row" style={{ justifyContent: 'space-between', fontSize: 12.5 }}><span className="muted">Budget planned</span><b className="num">{money(committed ? planned(a) : 0)}</b></div>
            <div className="meter" style={{ marginTop: 6 }}><i style={{ width: `${committed ? Math.min(100, (planned(a) / a.cap) * 100) : 0}%`, background: planned(a) > a.cap && committed ? 'var(--lo-color-danger)' : undefined }} /></div>
            <div className="faint" style={{ fontSize: 11.5, marginTop: 4 }}>Cap {money(a.cap)}, set by you</div>
          </div>
        </Card>
        <div className="stack" style={{ gap: 14, minWidth: 0 }}>
          {a.status[0] !== 'todo' && <AgentStepCard title="Gather context" status={a.status[0] === 'done' ? 'done' : a.status[0] === 'paused' ? 'paused' : 'working'} statusLabel={a.status[0] === 'done' ? '5 sources' : undefined} lines={a.lines[0]} />}
          {steps.map((el, i) => (i > 0 && a.status[i] !== 'todo' ? el : null))}
          {a.sent && (
            <Card className="summary" title="Winter Layers drop is ready for creators">
              <p className="muted">EdgeAI did the research, drafting and checking. You made the calls that involved judgment, money and messages.</p>
              <div className="g2e" style={{ marginTop: 14, gap: 14 }}>
                <div><span className="lbl">EdgeAI did</span><ul className="lines">{['Read 5 data sources', 'Drafted the brief', 'Scored 412 creators', 'Priced offers in the fair range', 'Caught an exclusivity conflict', 'Refreshed stale audience data'].map(x => <li key={x}>{x}</li>)}</ul></div>
                <div><span className="lbl">You decided</span><ul className="lines">{a.decisions.map(x => <li key={x}>{x}</li>)}</ul></div>
              </div>
              <div className="row" style={{ marginTop: 14 }}><Button variant="primary" onClick={() => go({ page: 'tool', tool: 'campaigns' })}>Back to campaigns</Button><span className="faint small">Replies will show up in the campaign’s Creators tab.</span></div>
            </Card>
          )}
        </div>
        <div className="agent__side">
          <Card title="Guardrails" subtitle="What EdgeAI can do without asking. Changes apply to the next step.">
            {(['brief', 'list'] as const).map(k => (
              <div key={k} className="gr"><span>{k === 'brief' ? 'Draft the brief' : 'Build the shortlist'}</span>
                <SegmentedControl size="sm" label={k === 'brief' ? 'Draft the brief' : 'Build the shortlist'} value={a.auto[k] ? 'go' : 'ask'} onChange={v => agent.setAuto(k, v === 'go')} options={[{ value: 'ask', label: 'Ask me' }, { value: 'go', label: 'Continue' }]} />
              </div>
            ))}
            <div className="gr"><span>Commit budget</span><Pill icon="lock">Always asks</Pill></div>
            <div className="gr"><span>Message creators</span><Pill icon="lock">Always asks</Pill></div>
            <div className="gr"><span>Budget cap</span><span className="money"><span>$</span><input type="number" step={1000} min={0} value={a.cap} aria-label="Budget cap" onChange={e => agent.setCap(Math.max(0, +e.target.value || 0))} /></span></div>
            <div className="gr"><span>Leave out creators with brand-safety flags</span><Pill tone="success">On</Pill></div>
          </Card>
          <Card title="Activity">
            <ol className="log">
              {a.log.length ? a.log.slice().reverse().slice(0, 12).map((l, i) => <li key={i} className={l.who === 'you' ? 'you' : ''}><span>{l.at}</span>{l.who === 'you' && <b>You: </b>}{l.text}</li>) : <li className="faint">Nothing yet.</li>}
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
}

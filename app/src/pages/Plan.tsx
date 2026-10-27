import { useState } from 'react';
import { Button, Card, Icon, IconButton, Pill, SegmentedControl } from '@ds';
import { BEST, DAYS, PLATFORMS, POST_STATUS, ROLES, type Post, type PostStatus } from '../data';
import { useStore, viewOf } from '../store';

type Filter = 'all' | 'approvals' | 'drafts' | 'issues';
const DOT: Record<PostStatus, string> = { published: 'var(--lo-color-chart-2)', scheduled: 'var(--lo-color-chart-4)', approval: 'var(--lo-color-action)', draft: 'var(--lo-color-chart-5)', failed: 'var(--lo-color-danger)', changes: 'var(--lo-color-chart-1)' };

export function Plan() {
  const { role, posts, open } = useStore();
  const [filter, setFilter] = useState<Filter>('all');
  const v = viewOf(role);
  const mine = posts.filter(p => p.views.includes(v));
  const show = (p: Post) => filter === 'all' || (filter === 'approvals' && (p.status === 'approval' || p.status === 'changes')) || (filter === 'drafts' && p.status === 'draft') || (filter === 'issues' && p.status === 'failed');
  const queue = mine.filter(p => p.status === 'approval' || p.status === 'changes' || p.status === 'failed');
  return (
    <div className="stack">
      <div className="head">
        <div><h1>{role === 'creator' ? 'Your content calendar' : 'Content calendar'}</h1><p className="muted">Plan, approve and publish in one place. Creator collabs land here for approval, then publish from the creator’s own account.</p></div>
        <div className="row"><span className="num small" style={{ fontWeight: 600 }}>Oct 26 – Nov 1</span><Button variant="primary" icon="plus" onClick={() => open({ kind: 'post', draft: { day: 0, time: BEST[0], platforms: ['IG'] } })}>New post</Button></div>
      </div>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <SegmentedControl label="Show posts" value={filter} onChange={setFilter} options={[{ value: 'all', label: 'All' }, { value: 'approvals', label: 'Approvals' }, { value: 'drafts', label: 'Drafts' }, { value: 'issues', label: 'Issues' }]} />
        <div className="legend">{(Object.keys(POST_STATUS) as PostStatus[]).map(s => <span key={s}><span className="sdot" style={{ background: DOT[s] }} />{POST_STATUS[s][0]}</span>)}</div>
      </div>
      <div className="scrollx">
        <div className="cal">
          {DAYS.map((d, i) => (
            <div key={d} className={`day ${i === 0 ? 'day--today' : ''}`}>
              <div className="day__h"><b>{d}</b></div>
              <div className="best"><Icon name="spark" size={12} />Best time {BEST[i]}</div>
              {mine.filter(p => p.day === i && show(p)).map(p => (
                <button key={p.id} className="post" onClick={() => open({ kind: 'post', id: p.id })}>
                  <span className="post__tm"><span className="sdot" style={{ background: DOT[p.status] }} />{p.time}</span>
                  <span className="post__tt">{p.title}</span>
                  <span className="row" style={{ gap: 4 }}>{p.platforms.map(x => <span key={x} className="plat">{x}</span>)}{p.collab && <Pill tone="creators">Collab</Pill>}</span>
                  <span className="lo-sr-only">{POST_STATUS[p.status][0]}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
      <Card title={role === 'creator' ? 'Waiting on you or a brand' : 'Approval queue'} actions={<span className="faint small">{queue.length} items</span>}>
        {queue.length ? queue.map(p => (
          <div key={p.id} className="li">
            <span className="sdot" style={{ background: DOT[p.status] }} />
            <div className="grow"><b>{p.title}</b><div className="faint small">{DAYS[p.day]} · {p.time} · by {p.by}{p.collab ? ' · creator collab' : ''}</div></div>
            <Pill tone={POST_STATUS[p.status][1]}>{POST_STATUS[p.status][0]}</Pill>
            <Button size="sm" variant={p.status === 'approval' && role !== 'creator' ? 'primary' : 'secondary'} onClick={() => open({ kind: 'post', id: p.id })}>{p.status === 'approval' && role !== 'creator' ? 'Review' : 'Open'}</Button>
          </div>
        )) : <p className="faint">All caught up.</p>}
      </Card>
    </div>
  );
}

const CAPTION = (title: string) => `${title || 'This one'}. Built for shoulder season: light enough to forget, warm enough to stay out longer. Tap the link in bio to shop the kit. #shoulderseason #fernwayoutdoor`;

export function PostEditor({ id, draft }: { id?: string; draft?: Partial<Post> }) {
  const { role, posts, savePost, open, say, credits, spendCredit } = useStore();
  const existing = id ? posts.find(p => p.id === id) : undefined;
  const me = ROLES[role].name;
  const [p, setP] = useState<Post>(() => existing ? { ...existing } : {
    id: `n${Date.now()}`, day: 0, time: BEST[0], title: '', platforms: ['IG'], status: 'draft', by: me.split(' ')[0], caption: '', views: [viewOf(role)], comments: [], ...draft,
  });
  const [note, setNote] = useState('');
  const isNew = !existing;
  const reviewer = role !== 'creator';

  const commit = (status: PostStatus, msg: string, extra: Partial<Post> = {}) => {
    const comments = note.trim() ? [...p.comments, { who: me, text: note.trim(), when: 'Just now' }] : p.comments;
    savePost({ ...p, title: p.title.trim() || 'Untitled post', status, comments, ...extra });
    open(null);
    say(msg);
  };

  let actions;
  if (p.status === 'failed') {
    actions = <Button variant="primary" icon="refresh" onClick={() => commit('scheduled', `TikTok reconnected. The post will retry at ${p.time} ${DAYS[p.day].split(' ')[0]}.`, { error: undefined })}>Reconnect TikTok</Button>;
  } else if (!isNew && p.status === 'approval' && reviewer) {
    actions = <>
      <Button onClick={() => { if (!note.trim()) { setNote(''); document.getElementById('post-note')?.focus(); say('Add a note so the author knows what to change'); return; } commit('changes', p.collab ? 'Changes requested. Jules was notified.' : 'Changes requested. The author was notified.'); }}>Request changes</Button>
      <Button variant="primary" icon="check" onClick={() => commit('scheduled', p.collab ? 'Approved. It publishes from Jules’s account.' : 'Approved and scheduled')}>Approve</Button>
    </>;
  } else if (!isNew && p.status === 'approval' && !reviewer) {
    actions = <Button onClick={() => commit('approval', 'Changes saved. Still waiting on Fernway.')}>Save changes</Button>;
  } else if (p.status === 'changes' && !reviewer) {
    actions = <><Button onClick={() => commit('changes', 'Saved')}>Save</Button><Button variant="primary" icon="send" onClick={() => commit('approval', 'Sent back to Fernway for approval')}>Send back for approval</Button></>;
  } else {
    const needsApproval = isNew && role === 'smm';
    actions = <>
      <Button onClick={() => commit('draft', 'Saved as draft')}>Save draft</Button>
      <Button variant="primary" onClick={() => commit(needsApproval ? 'approval' : 'scheduled', needsApproval ? 'Sent to Maya for approval' : 'Scheduled')}>{needsApproval ? 'Send for approval' : 'Schedule'}</Button>
    </>;
  }

  const togglePlatform = (x: string) => setP(s => ({ ...s, platforms: s.platforms.includes(x) ? (s.platforms.length > 1 ? s.platforms.filter(y => y !== x) : s.platforms) : [...s.platforms, x] }));

  return (
    <div className="drawer" role="dialog" aria-modal="true" aria-label={isNew ? 'New post' : p.title}>
      <div className="drawer__h"><h2>{isNew ? 'New post' : p.title}</h2><IconButton icon="x" label="Close" size={36} onClick={() => open(null)} /></div>
      <div className="drawer__b">
        {!isNew && <div className="row" style={{ gap: 6 }}><Pill tone={POST_STATUS[p.status][1]}>{POST_STATUS[p.status][0]}</Pill>{p.collab && <Pill tone="creators">Creator collab · Fall Trail ’26</Pill>}</div>}
        {p.error && <div className="note note--bad">{p.error}</div>}
        <label className="flabel">Title<input className="inp" value={p.title} placeholder="Name this post" onChange={e => setP({ ...p, title: e.target.value })} /></label>
        <label className="flabel">Caption<textarea className="inp" rows={4} value={p.caption} placeholder="Write a caption" onChange={e => setP({ ...p, caption: e.target.value })} /></label>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <Button size="sm" icon="spark" onClick={() => { if (spendCredit()) { setP(s => ({ ...s, caption: CAPTION(s.title) })); say('Caption drafted · 1 credit used'); } }}>Write caption with AI</Button>
          <span className="faint small">1 credit · {credits[role]} left this month</span>
        </div>
        <div className="flabel" role="group" aria-label="Profiles">Profiles
          <div className="row" style={{ gap: 6 }}>{PLATFORMS.map(x => <button key={x} type="button" className="tog" aria-pressed={p.platforms.includes(x)} onClick={() => togglePlatform(x)}>{x}</button>)}</div>
        </div>
        <div className="g2e" style={{ gap: 10 }}>
          <label className="flabel">Day<select className="inp" value={p.day} onChange={e => setP({ ...p, day: +e.target.value })}>{DAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}</select></label>
          <label className="flabel">Time<input className="inp" value={p.time} onChange={e => setP({ ...p, time: e.target.value })} /></label>
        </div>
        <div className="note" style={{ background: 'var(--lo-color-publish-subtle)' }}>Best time on {DAYS[p.day]}: <b>{BEST[p.day]}</b> for Instagram, based on the last 90 days.</div>
        {p.collab && <div className="note">This post publishes from <b>@julesoutside</b>. Sales from its link count toward Fall Trail ’26 in Campaigns and toward Jules’s earnings in Earn.</div>}
        {p.comments.length > 0 && <div className="stack" style={{ gap: 10 }}>
          <span className="lbl">Comments</span>
          {p.comments.map((c, i) => <div key={i} className="small"><b>{c.who}</b> <span className="faint">{c.when}</span><div>{c.text}</div></div>)}
        </div>}
        <label className="flabel">{p.status === 'approval' && reviewer ? 'Note for the author' : 'Add a comment'}<textarea id="post-note" className="inp" rows={2} value={note} placeholder={p.status === 'approval' && reviewer ? 'Required if you request changes' : 'Optional'} onChange={e => setNote(e.target.value)} /></label>
      </div>
      <div className="drawer__f">{actions}</div>
    </div>
  );
}

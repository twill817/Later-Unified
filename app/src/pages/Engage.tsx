import { useState } from 'react';
import { Button, Card, Icon, Pill } from '@ds';
import type { Convo } from '../data';
import { useStore, viewOf } from '../store';

function Context({ c }: { c: Convo }) {
  const { go, open, say } = useStore();
  const x = c.ctx;
  switch (x.kind) {
    case 'customer': return <><span className="lbl">Customer</span><div className="li"><span className="grow">Orders</span><b className="num">{x.orders}</b></div><p className="muted small">{x.note}</p></>;
    case 'creator': return <><span className="lbl">Creator in your network</span><Pill tone="creators">{x.campaign}</Pill><div className="li"><span className="grow">Attributed sales</span><b className="num">{x.sales}</b></div><Button size="sm" icon="arrow" onClick={() => open({ kind: 'profile', id: x.creatorId })}>See profile</Button></>;
    case 'risk': return <><span className="lbl">Flagged</span><div className="note note--bad">{x.note}</div><div className="note note--ai"><b>Suggested reply:</b> apologize, ask for the order number, and offer the lifetime zipper repair.</div><Button size="sm" icon="arrow" onClick={() => go({ page: 'tool', tool: 'listen' })}>See brand health</Button></>;
    case 'ugc': return <><span className="lbl">User-generated content</span><p className="muted small">{x.note}</p><Button size="sm" onClick={() => say('Rights request sent to @sierrahikes')}>Request rights</Button></>;
    case 'brand': return <><span className="lbl">Brand partner</span><Pill tone="creators">{x.campaign}</Pill><p className="muted small">{x.note}</p><Button size="sm" icon="arrow" onClick={() => { go({ page: 'tool', tool: 'plan' }); window.setTimeout(() => open({ kind: 'post', id: 'p3' }), 0); }}>Open the post</Button></>;
    case 'shop': return <><span className="lbl">Shopping question</span><div className="note note--ai">Reply with your <b>Alder insulated jacket</b> link? You earn 9% on full-cart orders.</div></>;
    case 'fan': return <><span className="lbl">Follower</span><p className="muted small">{x.note}</p></>;
  }
}

export function Engage() {
  const { role, convos, updateConvo, say } = useStore();
  const list = convos.filter(c => c.view === viewOf(role) && !c.done);
  const [sel, setSel] = useState<string | undefined>(list[0]?.id);
  const [reply, setReply] = useState('');
  const c = list.find(x => x.id === sel) ?? list[0];
  const pick = (id: string) => { setSel(id); setReply(''); updateConvo(id, x => ({ ...x, unread: false })); };
  return (
    <div className="stack">
      <div className="head"><div><h1>Inbox</h1><p className="muted">{role === 'creator' ? 'Comments, DMs and brand messages together. Shopping questions come with a link ready to send.' : 'Instagram, Facebook and TikTok conversations in one queue, with context from Campaigns and Listen beside each one.'}</p></div></div>
      {!c ? <Card><p className="muted">Inbox zero. New comments and messages will show up here.</p></Card> : (
        <Card flush>
          <div className="inbox">
            <div className="inbox__list" role="listbox" aria-label="Conversations">
              {list.map(x => (
                <button key={x.id} role="option" aria-selected={x.id === c.id} className="conv" onClick={() => pick(x.id)}>
                  {x.unread ? <span className="unread" aria-label="Unread" /> : <span style={{ width: 8, flex: 'none' }} />}
                  <span className="grow">
                    <span className="conv__n">{x.who}<span className="plat">{x.platform}</span>{x.flag && <Pill tone="danger">Flag</Pill>}</span>
                    <span className="conv__x">{x.messages[x.messages.length - 1].text}</span>
                    <span className="faint" style={{ fontSize: 11.5 }}>{x.type} · {x.messages[x.messages.length - 1].at}</span>
                  </span>
                </button>
              ))}
            </div>
            <div className="thread">
              <div className="drawer__h" style={{ padding: '12px 16px' }}>
                <div><b>{c.who}</b> <span className="faint small">{c.type} on {c.platform}</span></div>
                <Button size="sm" icon="check" onClick={() => { updateConvo(c.id, x => ({ ...x, done: true, unread: false })); const next = list.find(x => x.id !== c.id); setSel(next?.id); say('Marked done'); }}>Mark done</Button>
              </div>
              <div className="msgs">
                {c.messages.map((m, i) => <div key={i} className={`bubble ${m.me ? 'bubble--me' : ''}`}>{m.text}<small>{m.at}</small></div>)}
              </div>
              <form className="compose" onSubmit={e => { e.preventDefault(); if (!reply.trim()) return; updateConvo(c.id, x => ({ ...x, unread: false, messages: [...x.messages, { me: true, text: reply.trim(), at: 'Just now' }] })); setReply(''); say('Reply sent'); }}>
                <input className="inp" value={reply} placeholder="Write a reply" aria-label="Reply" onChange={e => setReply(e.target.value)} />
                {c.ctx.kind === 'shop' && <Button size="sm" icon="link" onClick={() => setReply('It’s the Fernway Alder jacket! later.link/jules/alder')}>Insert link</Button>}
                <Button type="submit" variant="primary" icon="send" disabled={!reply.trim()}>Send</Button>
              </form>
            </div>
            <aside className="inbox__ctx"><Context c={c} /></aside>
          </div>
        </Card>
      )}
      <p className="faint small"><Icon name="lock" size={12} /> Replies post from the connected account shown on each conversation.</p>
    </div>
  );
}

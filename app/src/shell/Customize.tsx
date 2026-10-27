import { Button, Icon, IconButton } from '@ds';
import { ROLES, TOOLS, toolLabel, type Group, type Role, type ToolId } from '../data';
import { useStore } from '../store';

const GROUPS: [Group, string][] = [['publish', 'Publish'], ['grow', 'Grow'], ['creators', 'Creators']];

/** Every Later tool is available to everyone. Roles are only starting points. */
export function Customize() {
  const { role, pinned, setPinned, resetPinned, open, say } = useStore();
  const move = (i: number, d: -1 | 1) => setPinned(t => { const n = [...t]; [n[i], n[i + d]] = [n[i + d], n[i]]; return n; });
  const remove = (id: ToolId) => { setPinned(t => t.filter(x => x !== id)); say(`${toolLabel(id, role)} moved to More`); };
  const add = (id: ToolId) => { setPinned(t => [...t, id]); say(`${toolLabel(id, role)} added to your tools`); };
  const rest = (Object.keys(TOOLS) as ToolId[]).filter(id => !pinned.includes(id));
  const isDefault = (p: Role) => ROLES[p].order.join() === pinned.join();
  return (
    <div className="drawer" role="dialog" aria-modal="true" aria-label="Customize your tools">
      <div className="drawer__h"><h2>Your tools</h2><IconButton icon="x" label="Close" size={36} onClick={() => open(null)} /></div>
      <div className="drawer__b">
        <p className="muted small" style={{ margin: 0 }}>Every Later tool is part of your account. Pin the ones you use to your sidebar, home screen and phone tab bar, in the order you want. Everything else stays under More and in search.</p>

        <section className="stack" style={{ gap: 6 }}>
          <span className="lbl">In your sidebar · {pinned.length}</span>
          <ol className="pinlist">
            {pinned.map((id, i) => (
              <li key={id}>
                <span className={`g-${TOOLS[id].group}`}><Icon name={TOOLS[id].icon} size={18} /></span>
                <span className="grow"><b>{toolLabel(id, role)}</b>{i < 3 && <small className="faint"> · phone tab bar</small>}</span>
                <IconButton icon="chevronUp" label={`Move ${toolLabel(id, role)} up`} size={30} disabled={i === 0} onClick={() => move(i, -1)} />
                <IconButton icon="chevronDown" label={`Move ${toolLabel(id, role)} down`} size={30} disabled={i === pinned.length - 1} onClick={() => move(i, 1)} />
                <IconButton icon="x" label={`Unpin ${toolLabel(id, role)}`} size={30} onClick={() => remove(id)} />
              </li>
            ))}
          </ol>
          {!pinned.length && <p className="faint small">Nothing pinned. Your tools are all under More.</p>}
        </section>

        {rest.length > 0 && <section className="stack" style={{ gap: 10 }}>
          <span className="lbl">Add tools</span>
          {GROUPS.map(([g, name]) => {
            const ids = rest.filter(id => TOOLS[id].group === g);
            if (!ids.length) return null;
            return (
              <div key={g} className="stack" style={{ gap: 2 }}>
                <span className="faint small" style={{ fontWeight: 600 }}>{name}</span>
                {ids.map(id => (
                  <div key={id} className="li">
                    <span className={`g-${TOOLS[id].group}`}><Icon name={TOOLS[id].icon} size={18} /></span>
                    <span className="grow"><b>{toolLabel(id, role)}</b><span className="faint small" style={{ display: 'block' }}>{TOOLS[id].desc}</span></span>
                    <Button size="sm" icon="plus" onClick={() => add(id)}>Pin</Button>
                  </div>
                ))}
              </div>
            );
          })}
        </section>}

        <section className="stack" style={{ gap: 8 }}>
          <span className="lbl">Start from a preset</span>
          <p className="faint small" style={{ margin: 0 }}>Presets only change which tools are pinned. Your data and access stay the same.</p>
          <div className="row" style={{ flexWrap: 'wrap', gap: 6 }}>
            {(Object.keys(ROLES) as Role[]).map(p => (
              <button key={p} type="button" className="tog" aria-pressed={isDefault(p)} onClick={() => { resetPinned(p); say(`Pinned the ${ROLES[p].label.toLowerCase()} tools`); }}>{ROLES[p].label}</button>
            ))}
          </div>
        </section>
      </div>
      <div className="drawer__f"><Button variant="primary" onClick={() => open(null)}>Done</Button></div>
    </div>
  );
}

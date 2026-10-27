import { useRef, type KeyboardEvent } from 'react';
import { CountBadge } from '../Badge/Badge';
import './Tabs.css';

export interface TabItem<T extends string> { value: T; label: string; count?: number }

export interface TabsProps<T extends string> {
  tabs: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}

/** Moves between sections of one object, such as a campaign. Use SegmentedControl to change how the same content is shown. */
export function Tabs<T extends string>({ tabs, value, onChange, label }: TabsProps<T>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: KeyboardEvent, i: number) => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const n = (i + step + tabs.length) % tabs.length;
    onChange(tabs[n].value);
    refs.current[n]?.focus();
  };
  return (
    <div className="lo-tabs" role="tablist" aria-label={label}>
      {tabs.map((t, i) => (
        <button
          key={t.value}
          ref={el => { refs.current[i] = el; }}
          type="button"
          role="tab"
          className="lo-tab"
          aria-selected={t.value === value}
          tabIndex={t.value === value ? 0 : -1}
          onClick={() => onChange(t.value)}
          onKeyDown={e => onKey(e, i)}
        >
          {t.label}
          {t.count ? <CountBadge count={t.count} label="need attention" /> : null}
        </button>
      ))}
    </div>
  );
}

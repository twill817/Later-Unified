import { useRef, type KeyboardEvent, type ReactNode } from 'react';
import { CountBadge } from '../Badge/Badge';
import './Tabs.css';

export interface TabItem<T extends string> { value: T; label: string; count?: number }

export interface TabsProps<T extends string> {
  tabs: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  /** Pass the same id to TabPanel so each tab is linked to its panel (aria-controls / aria-labelledby). */
  idBase?: string;
}

/** Moves between sections of one object, such as a campaign. Use SegmentedControl to change how the same content is shown. */
export function Tabs<T extends string>({ tabs, value, onChange, label, idBase }: TabsProps<T>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: KeyboardEvent, i: number) => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    const jump = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : -1;
    if (!step && jump < 0) return;
    e.preventDefault();
    const n = jump >= 0 ? jump : (i + step + tabs.length) % tabs.length;
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
          id={idBase ? `${idBase}-tab-${t.value}` : undefined}
          aria-controls={idBase ? `${idBase}-panel-${t.value}` : undefined}
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

export interface TabPanelProps { idBase: string; value: string; children: ReactNode }
/** The content for the selected tab. Focusable so keyboard users can move from the tab into the content. */
export function TabPanel({ idBase, value, children }: TabPanelProps) {
  return <div role="tabpanel" id={`${idBase}-panel-${value}`} aria-labelledby={`${idBase}-tab-${value}`} tabIndex={0} className="lo-tabpanel">{children}</div>;
}

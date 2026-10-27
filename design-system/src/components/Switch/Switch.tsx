import './Switch.css';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** What the switch turns on, for screen readers, e.g. "Show featured banner". */
  label: string;
  disabled?: boolean;
}

/** Turns one setting on or off and takes effect right away. Use a checkbox when the change waits for a Save button. */
export function Switch({ checked, onChange, label, disabled }: SwitchProps) {
  return <button type="button" role="switch" className="lo-switch" aria-checked={checked} aria-label={label} disabled={disabled} onClick={() => onChange(!checked)} />;
}

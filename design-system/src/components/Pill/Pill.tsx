import type { HTMLAttributes } from 'react';
import { Icon, type IconName } from '../Icon/Icon';
import './Pill.css';

export type PillTone = 'neutral' | 'success' | 'warning' | 'danger' | 'action' | 'publish' | 'grow' | 'creators';

export interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  /** Status tones carry meaning; tool-group tones (publish, grow, creators) mark where something comes from. */
  tone?: PillTone;
  icon?: IconName;
}

export function Pill({ tone = 'neutral', icon, className = '', children, ...rest }: PillProps) {
  return (
    <span className={`lo-pill lo-pill--${tone} ${className}`.trim()} {...rest}>
      {icon && <Icon name={icon} size={12} />}
      {children}
    </span>
  );
}

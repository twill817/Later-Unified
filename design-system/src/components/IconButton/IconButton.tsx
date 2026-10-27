import type { ButtonHTMLAttributes } from 'react';
import { Icon, type IconName } from '../Icon/Icon';
import '../CreatorRow/CreatorRow.css';

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: IconName;
  /** Required: icon-only buttons need a name for screen readers. */
  label: string;
  size?: number;
}

export function IconButton({ icon, label, size = 30, className = '', type = 'button', ...rest }: IconButtonProps) {
  return (
    <button type={type} className={`lo-iconbtn ${className}`.trim()} aria-label={label} title={label} style={{ width: size, height: size }} {...rest}>
      <Icon name={icon} size={Math.round(size * 0.55)} />
    </button>
  );
}

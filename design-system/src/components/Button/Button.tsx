import type { ButtonHTMLAttributes } from 'react';
import { Icon, type IconName } from '../Icon/Icon';
import './Button.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary is reserved for the one main action in a view. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'ink';
  size?: 'md' | 'sm';
  icon?: IconName;
  fullWidth?: boolean;
}

/** Buttons say exactly what happens: "Approve offers", not "Submit". */
export function Button({ variant = 'secondary', size = 'md', icon, fullWidth, className = '', children, type = 'button', ...rest }: ButtonProps) {
  const cls = ['lo-btn', `lo-btn--${variant}`, size === 'sm' && 'lo-btn--sm', fullWidth && 'lo-btn--full', className].filter(Boolean).join(' ');
  return (
    <button type={type} className={cls} {...rest}>
      {icon && <Icon name={icon} size={size === 'sm' ? 14 : 16} />}
      {children}
    </button>
  );
}

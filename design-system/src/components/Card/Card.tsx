import type { HTMLAttributes, ReactNode } from 'react';
import './Card.css';

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title?: ReactNode;
  /** A short line under the title, such as the date range. */
  subtitle?: ReactNode;
  /** Controls on the right of the header: a filter, a button, a count. */
  actions?: ReactNode;
  /** No padding, for tables that run edge to edge. */
  flush?: boolean;
  /** Outlines the card in the action color, for the step that needs the person. */
  selected?: boolean;
}

/** The basic surface. Cards hold one idea each; group related numbers in one card instead of many. */
export function Card({ title, subtitle, actions, flush, selected, className = '', children, ...rest }: CardProps) {
  const cls = ['lo-card', flush && 'lo-card--flush', selected && 'lo-card--selected', className].filter(Boolean).join(' ');
  return (
    <section className={cls} {...rest}>
      {(title || actions) && (
        <div className="lo-card__head">
          <div>
            {title && <h2 className="lo-card__title">{title}</h2>}
            {subtitle && <p className="lo-card__sub">{subtitle}</p>}
          </div>
          {actions && <div className="lo-card__actions">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

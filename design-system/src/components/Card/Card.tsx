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
  /** Heading level for the title, to fit the page outline. Defaults to h2. */
  headingLevel?: 2 | 3 | 4;
}

/** The basic surface. Cards hold one idea each; group related numbers in one card instead of many. */
export function Card({ title, subtitle, actions, flush, selected, headingLevel = 2, className = '', children, ...rest }: CardProps) {
  const H = `h${headingLevel}` as 'h2';
  const cls = ['lo-card', flush && 'lo-card--flush', selected && 'lo-card--selected', className].filter(Boolean).join(' ');
  return (
    <section className={cls} {...rest}>
      {(title || actions) && (
        <div className="lo-card__head">
          <div>
            {title && <H className="lo-card__title">{title}</H>}
            {subtitle && <p className="lo-card__sub">{subtitle}</p>}
          </div>
          {actions && <div className="lo-card__actions">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

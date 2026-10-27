import type { ReactNode } from 'react';
import { Icon } from '../Icon/Icon';
import './MetricCard.css';

/** The icon follows what the number measures, never its position in a row. */
export type MetricKind = 'money' | 'volume' | 'clicks' | 'rate' | 'people';
const KIND_ICON = { money: 'dollar', volume: 'bars', clicks: 'cursor', rate: 'pie', people: 'people' } as const;

export interface MetricCardProps {
  label: string;
  value: string;
  kind: MetricKind;
  /** Change versus the comparison period, e.g. "+11%". */
  delta?: string;
  direction?: 'up' | 'down';
  /** Comparison or context, e.g. "vs prior 30 days". */
  note?: string;
  compact?: boolean;
  /** A short verdict after the note, such as a BenchmarkChip. */
  badge?: ReactNode;
}

export function MetricCard({ label, value, kind, delta, direction = 'up', note, compact, badge }: MetricCardProps) {
  return (
    <div className={`lo-metric ${compact ? 'lo-metric--compact' : ''}`}>
      <span className="lo-metric__tile" style={{ gridRow: '1 / span 3' }}>
        <Icon name={KIND_ICON[kind]} size={compact ? 20 : 24} strokeWidth={2} />
      </span>
      <span className="lo-metric__label">{label}</span>
      <span className="lo-metric__value">{value}</span>
      {(delta || note || badge) && (
        <span className="lo-metric__note">
          {delta && (
            <span className={`lo-metric__delta lo-metric__delta--${direction}`}>
              <span aria-hidden="true">{direction === 'up' ? '↗' : '↘'}</span>
              <span className="lo-sr-only">{direction === 'up' ? 'Up' : 'Down'}</span>
              {delta}
            </span>
          )}
          {note}
          {badge}
        </span>
      )}
    </div>
  );
}

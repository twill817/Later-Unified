import type { ReactNode } from 'react';
import { Icon } from '../Icon/Icon';
import { Pill } from '../Pill/Pill';
import './AgentStepCard.css';

export type AgentStepStatus = 'working' | 'review' | 'done' | 'blocked' | 'paused';

export interface AgentReasoning {
  text: string;
  confidence: 'High' | 'Medium' | 'Low';
  sources?: string[];
}

export interface AgentStepCardProps {
  title: string;
  status: AgentStepStatus;
  /** What the agent did or found, one short line each. */
  lines?: string[];
  /** Shown behind "Why EdgeAI chose this". Every agent output should explain itself. */
  why?: AgentReasoning;
  /** Overrides the default status label, e.g. "Needs your approval". */
  statusLabel?: string;
  /** Context next to the actions, e.g. what approving commits. */
  hint?: string;
  /** Step-specific content: an editable brief, a shortlist, a failure with options. */
  children?: ReactNode;
  /** Buttons for the person's decision. Shown for review and blocked steps. */
  actions?: ReactNode;
}

const STATUS = {
  working: { label: 'EdgeAI is working', tone: 'neutral' },
  review: { label: 'Needs you', tone: 'action' },
  done: { label: 'Done', tone: 'neutral' },
  blocked: { label: 'Blocked', tone: 'danger' },
  paused: { label: 'Paused', tone: 'warning' },
} as const;

const CONF_TONE = { High: 'success', Medium: 'warning', Low: 'danger' } as const;

function StatusDot({ status }: { status: AgentStepStatus }) {
  const inner =
    status === 'done' ? <Icon name="check" size={13} /> :
    status === 'blocked' ? <Icon name="alert" size={12} /> :
    status === 'paused' ? <Icon name="pause" size={12} /> :
    status === 'working' ? <span className="lo-spin" /> : null;
  return <span className={`lo-step__dot lo-step__dot--${status}`} aria-hidden="true">{inner}</span>;
}

/**
 * One step of an EdgeAI agent run. The agent works on its own until a step involves
 * judgment, money or messages to creators; then the step switches to review and waits.
 */
export function AgentStepCard({ title, status, lines, why, statusLabel, hint, children, actions }: AgentStepCardProps) {
  const s = STATUS[status];
  return (
    <section className={`lo-step lo-step--${status}`} aria-live={status === 'working' ? 'polite' : undefined}>
      <div className="lo-step__head">
        <h3 className="lo-step__title"><StatusDot status={status} />{title}</h3>
        <Pill tone={s.tone}>{statusLabel ?? s.label}</Pill>
      </div>
      {lines && lines.length > 0 && (
        <ul className="lo-step__lines">{lines.map(l => <li key={l}>{l}</li>)}</ul>
      )}
      {children}
      {why && (
        <details className="lo-why">
          <summary>
            <Icon name="spark" size={13} />Why EdgeAI chose this
            <Pill tone={CONF_TONE[why.confidence]}>{why.confidence} confidence</Pill>
          </summary>
          <p>{why.text}</p>
          {why.sources && <div className="lo-why__sources">{why.sources.map(x => <Pill key={x}>{x}</Pill>)}</div>}
        </details>
      )}
      {actions && (status === 'review' || status === 'blocked') && (
        <div className="lo-step__actions">
          {hint && <span className="lo-step__hint">{hint}</span>}
          {actions}
        </div>
      )}
    </section>
  );
}

import type { ReactNode } from 'react';
import { Icon } from '../Icon/Icon';
import { Pill } from '../Pill/Pill';
import { Avatar } from '../Avatar/Avatar';
import './CreatorRow.css';

export interface CreatorRowProps {
  name: string;
  handle: string;
  followers: string;
  tier?: 'Micro' | 'Mid' | 'Macro';
  /** Fit score, 0 to 100. */
  fit: number;
  /** One plain-language reason this creator is a match. */
  reason?: string;
  /** Where the creator came from or why they were added. */
  source?: 'audience' | 'replacement' | 'rebook';
  onRemove?: () => void;
  /** Makes the name a button, usually to open the creator's profile. */
  onOpen?: () => void;
  /** An extra control at the end of the row, such as an Invite button. */
  trailing?: ReactNode;
}

const SOURCE = {
  audience: { label: 'From your audience', tone: 'grow' },
  replacement: { label: 'Replacement', tone: 'action' },
  rebook: { label: 'Rebook', tone: 'neutral' },
} as const;

export function CreatorRow({ name, handle, followers, tier, fit, reason, source, onRemove, onOpen, trailing }: CreatorRowProps) {
  return (
    <div className="lo-creator">
      <Avatar name={name} />
      <div className="lo-creator__main">
        <div className="lo-creator__name">
          {onOpen ? <button type="button" className="lo-creator__open" onClick={onOpen}>{name}</button> : <b>{name}</b>}
          <span className="lo-creator__meta">{handle} · {followers}{tier ? ` · ${tier}` : ''}</span>
          {source && <Pill tone={SOURCE[source].tone}>{SOURCE[source].label}</Pill>}
        </div>
        {reason && <div className="lo-creator__why">{reason}</div>}
      </div>
      <span className="lo-creator__fit">{fit}%<small>fit</small></span>
      {trailing}
      {onRemove && (
        <button type="button" className="lo-iconbtn" onClick={onRemove} aria-label={`Remove ${name}`}>
          <Icon name="x" size={14} />
        </button>
      )}
    </div>
  );
}

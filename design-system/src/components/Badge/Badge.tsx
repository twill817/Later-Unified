import './Badge.css';

export interface CountBadgeProps {
  count: number;
  /** What is being counted, for screen readers, e.g. "items need approval". */
  label: string;
  /** Counts above max show as max+. */
  max?: number;
}

/** A purple count for things that need the person, used in navigation. Hidden at zero. */
export function CountBadge({ count, label, max = 99 }: CountBadgeProps) {
  if (count <= 0) return null;
  return (
    <span className="lo-badge">
      {count > max ? `${max}+` : count}
      <span className="lo-sr-only"> {label}</span>
    </span>
  );
}

/** The Later One wordmark. The One badge uses ink, never the action color. */
export function Wordmark() {
  return (
    <span className="lo-wordmark" role="img" aria-label="Later One">
      <b aria-hidden="true">Later</b>
      <span aria-hidden="true">One</span>
    </span>
  );
}

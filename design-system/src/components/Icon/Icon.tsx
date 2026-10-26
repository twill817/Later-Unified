import type { SVGProps } from 'react';

const PATHS = {
  plus: 'M12 5v14M5 12h14',
  check: 'M5 12l5 5 9-10',
  x: 'M6 6l12 12M18 6L6 18',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  spark: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z',
  alert: 'M12 4l9 16H3zM12 10v4M12 17h.01',
  pause: 'M8.5 5.5v13M15.5 5.5v13',
  play: 'M8 5.5v13l11-6.5z',
  send: 'M4 12l16-8-6 16-3-7z',
  copy: 'M8 8h12v12H8zM4 16V4h12',
  lock: 'M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3',
  dollar: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM15 9.2c-.6-1-1.7-1.5-3-1.5-1.7 0-3 .9-3 2.1s1.3 1.8 3 2.1 3 .9 3 2.1-1.3 2.1-3 2.1c-1.4 0-2.5-.5-3-1.5M12 6v12',
  bars: 'M5 19v-7M10 19V6M15 19v-9M20 19V4',
  cursor: 'M9 9l10 4-4.5 1.5L13 19zM5 3.5l1.2 2M3 8l2.2.6M9 3v2.3',
  pie: 'M12 3a9 9 0 1 0 9 9h-9zM15 3.4A9 9 0 0 1 20.6 9H15z',
  people: 'M9 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.2a6 6 0 0 1 3.5 5.8',
} as const;

export type IconName = keyof typeof PATHS;
export const iconNames = Object.keys(PATHS) as IconName[];

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: number;
  /** Accessible label. Leave empty for decorative icons next to text. */
  label?: string;
}

export function Icon({ name, size = 18, label, ...rest }: IconProps) {
  const filled = name === 'play';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={{ flex: 'none' }}
      {...rest}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}

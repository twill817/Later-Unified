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
  home: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  calendar: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  image: 'M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M15 9h.01',
  link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
  inbox: 'M4 13l3-8h10l3 8v6H4zM4 13h5l1 2h4l1-2h5',
  chart: 'M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-3',
  radar: 'M4 12a8 8 0 1 0 16 0 8 8 0 1 0-16 0M8 12a4 4 0 1 0 8 0 4 4 0 1 0-8 0M12 12l6-6',
  trend: 'M4 19h16M5 15l4-4 3 3 6-7M18 7h-3M18 7v3',
  wallet: 'M4 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4zM4 7V5a1 1 0 0 1 1-1h11M16 13.5h.01',
  briefcase: 'M4 8h16v11H4zM9 8V5h6v3M4 13h16',
  sliders: 'M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M14 4v4M8 10v4M16 16v4',
  search: 'M4 11a7 7 0 1 0 14 0 7 7 0 1 0-14 0M20 20l-4-4',
  bell: 'M6 16v-5a6 6 0 0 1 12 0v5l2 2H4zM10 21h4',
  menu: 'M4 7h16M4 12h16M4 17h16',
  chevronRight: 'M9 6l6 6-6 6',
  chevronLeft: 'M15 6l-6 6 6 6',
  chevronDown: 'M6 9l6 6 6-6',
  chevronUp: 'M6 15l6-6 6 6',
  refresh: 'M20 11a8 8 0 1 0-2.3 5.6M20 4v7h-7',
  logout: 'M9 4H5v16h4M14 8l4 4-4 4M18 12H9',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
  bolt: 'M13 3L5 13h6l-1 8 8-10h-6z',
  folder: 'M3 6h6l2 2h10v11H3z',
  tag: 'M3 12V4h8l9 9-8 8zM7.5 8h.01',
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

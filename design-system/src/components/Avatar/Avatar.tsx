import '../CreatorRow/CreatorRow.css';

export interface AvatarProps {
  name: string;
  size?: number;
}

/** Initials in a circle. Decorative: the person's name always appears next to it. */
export function Avatar({ name, size = 32 }: AvatarProps) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <span className="lo-avatar" aria-hidden="true" style={{ width: size, height: size, fontSize: Math.round(size * 0.37) }}>
      {initials}
    </span>
  );
}

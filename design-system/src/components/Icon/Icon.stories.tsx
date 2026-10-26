import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon, iconNames } from './Icon';

const meta = {
  title: 'Foundations/Icons',
  component: Icon,
  args: { name: 'spark', size: 24 },
  argTypes: { name: { control: 'select', options: iconNames } },
} satisfies Meta<typeof Icon>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {};

/** Outline icons on a 24px grid, 1.9px stroke. Decorative next to text; pass a label when an icon stands alone. */
export const AllIcons: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 12 }}>
      {iconNames.map(n => (
        <div key={n} style={{ display: 'grid', placeItems: 'center', gap: 8, padding: 14, borderRadius: 12, background: 'var(--lo-color-surface)', fontSize: 12.5, color: 'var(--lo-color-text-secondary)' }}>
          <span style={{ color: 'var(--lo-color-text)' }}><Icon name={n} size={24} /></span>
          {n}
        </div>
      ))}
    </div>
  ),
};

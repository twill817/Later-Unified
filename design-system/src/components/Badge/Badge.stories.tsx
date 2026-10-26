import type { Meta, StoryObj } from '@storybook/react-vite';
import { CountBadge, Wordmark } from './Badge';

const meta = {
  title: 'Components/Count badge',
  component: CountBadge,
  args: { count: 3, label: 'posts need approval' },
} satisfies Meta<typeof CountBadge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const OverMax: Story = { args: { count: 140 } };
/** Renders nothing at zero, so navigation stays quiet when nothing needs the person. */
export const Zero: Story = { args: { count: 0 } };

export const InNavigation: Story = {
  render: () => (
    <div style={{ width: 220, background: 'var(--lo-color-surface)', borderRadius: 12, padding: 8, display: 'grid', gap: 2 }}>
      {[['Plan + publish', 3], ['Engage', 3], ['Analyze', 0], ['Notifications', 5]].map(([n, c]) => (
        <div key={n as string} style={{ display: 'flex', alignItems: 'center', padding: '8px 10px', borderRadius: 8, fontWeight: 500 }}>
          <span style={{ flex: 1 }}>{n}</span><CountBadge count={c as number} label="items" />
        </div>
      ))}
    </div>
  ),
};

/** The wordmark. The One badge uses ink so it never reads as a button. */
export const LaterOneWordmark: Story = { render: () => <Wordmark /> };

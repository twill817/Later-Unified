import type { Meta, StoryObj } from '@storybook/react-vite';
import { MetricCard } from './MetricCard';

const meta = {
  title: 'Components/Metric card',
  component: MetricCard,
  args: { kind: 'money', label: 'Attributed sales', value: '$186,200', delta: '+19%', direction: 'up', note: 'vs prior 30 days' },
  decorators: [(S, c) => <div style={{ maxWidth: c.name === 'Row' ? 'none' : 320 }}><S /></div>],
} satisfies Meta<typeof MetricCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Decrease: Story = { args: { kind: 'rate', label: 'Engagement rate', value: '3.8%', delta: '-0.4 pts', direction: 'down' } };
export const WithoutChange: Story = { args: { kind: 'people', label: 'Creators', value: '9 of 12', delta: undefined, note: '3 in contracting' } };
export const Compact: Story = { args: { compact: true } };

/** The icon follows the kind of number, so a row reads at a glance. */
export const Row: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 20 }}>
      <MetricCard kind="volume" label="Reach" value="412K" delta="+11%" note="vs prior 30 days" />
      <MetricCard kind="rate" label="Engagement rate" value="4.2%" delta="+0.3 pts" />
      <MetricCard kind="clicks" label="Link clicks" value="4,906" delta="+12%" />
      <MetricCard kind="money" label="Attributed sales" value="$207K" delta="+19%" />
      <MetricCard kind="people" label="New followers" value="+5,950" note="Above the expected trend" />
    </div>
  ),
};

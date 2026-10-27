import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Tabs } from './Tabs';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  args: {
    label: 'Campaign sections',
    value: 'overview',
    onChange: () => {},
    tabs: [
      { value: 'overview', label: 'Overview' },
      { value: 'creators', label: 'Creators' },
      { value: 'content', label: 'Content', count: 3 },
      { value: 'payments', label: 'Payments', count: 1 },
      { value: 'results', label: 'Results' },
    ],
  },
} satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Counts show what needs attention in each section. Arrow keys move between tabs. */
export const Default: Story = {
  render: function Render(args) {
    const [v, setV] = useState(args.value);
    return <Tabs {...args} value={v} onChange={setV} />;
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { SegmentedControl } from './SegmentedControl';

const meta = {
  title: 'Components/Segmented control',
  component: SegmentedControl,
  args: {
    label: 'Reach view',
    value: 'paid',
    onChange: () => {},
    options: [
      { value: 'organic', label: 'Organic' },
      { value: 'paid', label: 'Organic + paid' },
      { value: 'creators', label: 'Organic + creators' },
    ],
  },
} satisfies Meta<typeof SegmentedControl>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Click an option, or focus the control and use the arrow keys. */
export const Default: Story = {
  render: function Render(args) {
    const [v, setV] = useState(args.value);
    return <SegmentedControl {...args} value={v} onChange={setV} />;
  },
};

export const Small: Story = {
  args: { size: 'sm', label: 'Draft the brief', value: 'ask', options: [{ value: 'ask', label: 'Ask me' }, { value: 'go', label: 'Continue' }] },
  render: function Render(args) {
    const [v, setV] = useState(args.value);
    return <SegmentedControl {...args} value={v} onChange={setV} />;
  },
};

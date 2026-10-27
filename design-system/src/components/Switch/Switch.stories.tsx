import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Switch } from './Switch';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  args: { checked: true, onChange: () => {}, label: 'Show featured banner' },
} satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Changes apply immediately, so there's no Save button next to a switch. */
export const Default: Story = {
  render: function Render(args) {
    const [on, setOn] = useState(args.checked);
    return <Switch {...args} checked={on} onChange={setOn} />;
  },
};
export const Off: Story = { args: { checked: false } };
export const Disabled: Story = { args: { disabled: true } };

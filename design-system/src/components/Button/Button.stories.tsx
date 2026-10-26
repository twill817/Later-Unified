import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from './Button';
import { iconNames } from '../Icon/Icon';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Approve offers', variant: 'primary', onClick: fn() },
  argTypes: { icon: { control: 'select', options: [undefined, ...iconNames] } },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

/** One per view, for the main action. */
export const Primary: Story = { args: { icon: 'check' } };
export const Secondary: Story = { args: { variant: 'secondary', children: 'Share report', icon: 'copy' } };
export const Ghost: Story = { args: { variant: 'ghost', children: 'Start over' } };
/** For floating actions such as Ask EdgeAI. */
export const Ink: Story = { args: { variant: 'ink', children: 'Ask EdgeAI', icon: 'spark' } };
export const Small: Story = { args: { size: 'sm', variant: 'secondary', children: 'Invite' } };
/** Disabled until the problem is fixed, with the reason shown nearby, e.g. offers over the budget cap. */
export const Disabled: Story = { args: { disabled: true } };

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button variant="primary" icon="plus">Create</Button>
      <Button variant="secondary" icon="copy">Share report</Button>
      <Button variant="ghost">Start over</Button>
      <Button variant="ink" icon="spark">Ask EdgeAI</Button>
      <Button variant="secondary" size="sm">Invite</Button>
      <Button variant="primary" disabled>Approve offers</Button>
    </div>
  ),
};

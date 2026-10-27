import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { IconButton } from './IconButton';
import { Avatar } from '../Avatar/Avatar';

const meta = {
  title: 'Components/Icon button and avatar',
  component: IconButton,
  args: { icon: 'x', label: 'Remove Kofi Mensah', onClick: fn() },
} satisfies Meta<typeof IconButton>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Every icon button has a label, read by screen readers and shown as a tooltip. */
export const Default: Story = {};
export const Large: Story = { args: { icon: 'bell', label: 'Notifications', size: 38 } };
export const Avatars: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Avatar name="Maya Chen" size={40} /><Avatar name="Jules Ortiz" /><Avatar name="Priya Shah" size={26} />
    </div>
  ),
};

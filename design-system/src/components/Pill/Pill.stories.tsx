import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pill } from './Pill';

const meta = {
  title: 'Components/Pill',
  component: Pill,
  args: { children: 'Needs approval', tone: 'action' },
} satisfies Meta<typeof Pill>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Status pills always carry a word, never color alone. */
export const Status: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Pill tone="success">Live</Pill>
      <Pill tone="action">Needs approval</Pill>
      <Pill tone="warning">Changes requested</Pill>
      <Pill tone="danger">Failed</Pill>
      <Pill tone="danger" icon="alert">Blocked</Pill>
      <Pill>Draft</Pill>
      <Pill icon="lock">Always asks</Pill>
    </div>
  ),
};

/** Marks where something comes from in Later One. */
export const ToolGroups: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Pill tone="publish">Publish</Pill>
      <Pill tone="grow">From your audience</Pill>
      <Pill tone="creators">Creator collab</Pill>
    </div>
  ),
};

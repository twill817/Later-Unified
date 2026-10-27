import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';
import { Button } from '../Button/Button';
import { Pill } from '../Pill/Pill';

const meta = {
  title: 'Components/Card',
  component: Card,
  decorators: [(S) => <div style={{ maxWidth: 560 }}><S /></div>],
  args: { title: 'Fall Trail ’26', actions: <Pill tone="success">On track</Pill>, children: <p style={{ margin: 0, color: 'var(--lo-color-text-secondary)' }}>Live with 9 creators and 3 more in contracting.</p> },
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithSubtitle: Story = { args: { title: 'Sales through your Link in bio', subtitle: 'Fall Trail ’26 · daily, Oct 1–26', actions: <Button size="sm" icon="copy">Share report</Button> } };
/** Outlined in the action color when it's the thing that needs the person. */
export const Selected: Story = { args: { selected: true, actions: <Pill tone="action">Needs you</Pill> } };

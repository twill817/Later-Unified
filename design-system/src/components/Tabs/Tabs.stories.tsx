import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { TabPanel, Tabs } from './Tabs';

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

/** Counts show what needs attention in each section. Arrow keys move between tabs; Home and End jump to the first and last. */
export const Default: Story = {
  render: function Render(args) {
    const [v, setV] = useState(args.value);
    return <Tabs {...args} value={v} onChange={setV} />;
  },
};

/** Give Tabs an idBase and wrap the content in TabPanel with the same id, so screen readers announce which tab controls the content. Tab moves from the tab list into the panel. */
export const WithPanels: Story = {
  render: function Render(args) {
    const [v, setV] = useState(args.value);
    const tab = args.tabs.find(t => t.value === v)!;
    return (
      <div style={{ display: 'grid', gap: 16 }}>
        <Tabs {...args} idBase="camp" value={v} onChange={setV} />
        <TabPanel idBase="camp" value={v}><p style={{ margin: 0 }}>{tab.label} content goes here.</p></TabPanel>
      </div>
    );
  },
};

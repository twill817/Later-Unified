import type { Meta, StoryObj } from '@storybook/react-vite';
import { AgentStepCard } from './AgentStepCard';
import { Button } from '../Button/Button';
import { CreatorRow } from '../CreatorRow/CreatorRow';

const meta = {
  title: 'Patterns/Agent step card',
  component: AgentStepCard,
  decorators: [(S) => <div style={{ maxWidth: 640 }}><S /></div>],
  args: { title: 'Gather context', status: 'done' },
} satisfies Meta<typeof AgentStepCard>;
export default meta;
type Story = StoryObj<typeof meta>;

/** EdgeAI narrates what it's doing while it works. */
export const Working: Story = {
  args: { title: 'Draft the brief', status: 'working', lines: ['Started from the Fall Trail ’26 brief, which hit 124% of its sales target', 'Set a launch goal from the forecast'] },
};

export const Done: Story = {
  args: { lines: ['Read the Winter Layers drop draft', 'Pulled results from Spring Trail ’26 and Fall Trail ’26', 'Found 37 fans who already sell the Alder jacket'] },
};

/** A step that involves judgment or money stops and waits, with reasoning the person can check. */
export const NeedsReview: Story = {
  args: {
    title: 'Build the shortlist',
    status: 'review',
    statusLabel: 'Needs your review',
    why: {
      text: 'Fit combines audience match, past results in your category and purchase data from Later Creator links. Two picks come from your own audience because fans recruited that way converted 2.1× better in Spring Trail ’26.',
      confidence: 'High',
      sources: ['412 creators scored', 'Your audience', 'Fall Trail ’26 halo'],
    },
    actions: <Button variant="primary" icon="check">Keep this shortlist</Button>,
    children: (
      <div>
        <CreatorRow name="Tess Alder" handle="@tessalder" followers="88K" tier="Micro" fit={95} reason="Strong saves on jacket content" onRemove={() => {}} />
        <CreatorRow name="Nina Okafor" handle="@northbound.nina" followers="41K" tier="Micro" fit={89} source="audience" reason="Already sold $4,120 of Fernway gear" onRemove={() => {}} />
      </div>
    ),
  },
};

/** Money always waits for a person. The hint says exactly what approving commits. */
export const CommitsBudget: Story = {
  args: {
    title: 'Set offers',
    status: 'review',
    statusLabel: 'Needs your approval',
    hint: 'Approving commits up to $26,950 of the budget. Nothing is sent to creators yet.',
    why: { text: 'Each offer sits inside the fair range for the creator’s size, category and engagement.', confidence: 'Medium', sources: ['Incentive advisor', 'Launch forecast'] },
    actions: <Button variant="primary" icon="check">Approve offers</Button>,
  },
};

/** When the agent hits something it can't resolve, it stops and lays out the options. */
export const Blocked: Story = {
  args: {
    title: 'Check availability',
    status: 'blocked',
    lines: ['Checked each creator’s calendar and active deals in Later Creator'],
    children: (
      <div style={{ marginTop: 12, padding: 14, borderRadius: 10, background: 'var(--lo-color-danger-subtle)' }}>
        <b>Kofi Mensah can’t take this campaign.</b>
        <p style={{ margin: '4px 0 0', color: 'var(--lo-color-text-secondary)' }}>He has an exclusive deal with a competing outdoor brand until Jan 20.</p>
      </div>
    ),
    actions: (
      <>
        <Button variant="secondary">Remove Kofi</Button>
        <Button variant="secondary">Invite for after Jan 20</Button>
        <Button variant="primary">Replace with Dana Holt</Button>
      </>
    ),
  },
};

export const Paused: Story = { args: { title: 'Build the shortlist', status: 'paused', lines: ['Ranked 412 creators by fit for a winter outerwear launch'] } };

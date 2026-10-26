import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { CreatorRow } from './CreatorRow';

const meta = {
  title: 'Components/Creator row',
  component: CreatorRow,
  parameters: { surface: 'card' },
  args: { name: 'Tess Alder', handle: '@tessalder', followers: '88K', tier: 'Micro', fit: 95, reason: 'Strong saves on jacket content; 8% overlap with your roster' },
} satisfies Meta<typeof CreatorRow>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
/** Found among people who already post about, message or sell the brand. */
export const FromYourAudience: Story = { args: { name: 'Nina Okafor', handle: '@northbound.nina', followers: '41K', fit: 89, source: 'audience', reason: 'Already sold $4,120 of Fernway gear without being paid' } };
export const Removable: Story = { args: { onRemove: fn() } };

export const Shortlist: Story = {
  render: () => (
    <div>
      <CreatorRow name="Tess Alder" handle="@tessalder" followers="88K" tier="Micro" fit={95} reason="Strong saves on jacket content; 8% overlap with your roster" onRemove={() => {}} />
      <CreatorRow name="Dana Holt" handle="@danaholtoutside" followers="64K" tier="Mid" fit={87} source="replacement" reason="Audience close to Kofi’s; no conflicting deals" onRemove={() => {}} />
      <CreatorRow name="Nina Okafor" handle="@northbound.nina" followers="41K" tier="Micro" fit={89} source="audience" reason="Already sold $4,120 of Fernway gear without being paid" onRemove={() => {}} />
      <CreatorRow name="Lena Tor" handle="@lenatrails" followers="322K" tier="Macro" fit={88} source="rebook" reason="Biggest halo in Fall Trail ’26" onRemove={() => {}} />
    </div>
  ),
};

import { useState } from 'react';
import { AgentStepCard, Button, CreatorRow, MetricCard, SegmentedControl, Wordmark } from './index';

/** A quick visual check of the components outside Storybook. Run with npm run dev. */
export default function App() {
  const [view, setView] = useState<'links' | 'full'>('links');
  return (
    <div className="lo-root" style={{ background: 'var(--lo-color-canvas)', minHeight: '100vh', padding: 24, display: 'grid', gap: 20, alignContent: 'start' }}>
      <Wordmark />
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Button variant="primary" icon="plus">Create</Button>
        <SegmentedControl label="Halo view" value={view} onChange={setView} options={[{ value: 'links', label: 'What links see' }, { value: 'full', label: 'Full picture' }]} />
      </div>
      <MetricCard kind="money" label="Attributed sales" value="$186,200" delta="+19%" note="vs prior 30 days" />
      <div style={{ background: 'var(--lo-color-surface)', borderRadius: 12, padding: 20 }}>
        <CreatorRow name="Nina Okafor" handle="@northbound.nina" followers="41K" tier="Micro" fit={89} source="audience" reason="Already sold $4,120 of Fernway gear without being paid" />
      </div>
      <AgentStepCard title="Gather context" status="done" lines={['Read the Winter Layers drop draft']} />
    </div>
  );
}

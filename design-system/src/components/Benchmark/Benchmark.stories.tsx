import type { Meta, StoryObj } from '@storybook/react-vite';
import { BenchmarkBar, BenchmarkChip, percentileOf } from './Benchmark';

const conversion = { p10: 1.1, p25: 1.8, p50: 2.5, p75: 3.4, p90: 4.4 };
const pctFmt = (n: number) => `${n.toFixed(1)}%`;

const meta = {
  title: 'Components/Benchmark',
  component: BenchmarkBar,
  args: { label: 'Link conversion', value: 5.3, points: conversion, format: pctFmt },
  decorators: [Story => <div style={{ maxWidth: 520, padding: 24 }}><Story /></div>],
} satisfies Meta<typeof BenchmarkBar>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Bands: below typical (under the 25th percentile), typical (middle half), better than most (75th–90th), top 10%. */
export const TopTenPercent: Story = {};
export const Typical: Story = { args: { label: 'Earnings per click', value: 0.33, points: { p10: 0.12, p25: 0.19, p50: 0.29, p75: 0.42, p90: 0.61 }, format: (n: number) => `$${n.toFixed(2)}` } };
export const BelowTypical: Story = { args: { value: 1.4 } };
/** A dashed tick marks an outside reference, such as a published industry average, separate from the peer group. */
export const WithIndustryReference: Story = { args: { reference: { value: 1.74, label: 'Shopify store median' } } };
export const Chips: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      {[1.4, 2.6, 3.9, 5.3].map(v => <BenchmarkChip key={v} percentile={percentileOf(v, conversion)} />)}
    </div>
  ),
};

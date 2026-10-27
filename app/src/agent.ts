import { useCallback, useEffect, useRef, useState } from 'react';

/* The EdgeAI agent run: six steps. Research and drafting run on their own; money and messages always wait for a person. */

export const AGENT_STEPS = ['Gather context', 'Draft the brief', 'Build the shortlist', 'Set offers', 'Check availability', 'Send invites'] as const;
export type StepStatus = 'todo' | 'working' | 'review' | 'done' | 'blocked' | 'paused';

const LOGS: string[][] = [
  ['Read the Winter Layers drop draft: product launch, $30,000, Jan 12 – Feb 8', 'Pulled results from Spring Trail ’26 and Fall Trail ’26', 'Loaded creator halo estimates for 4 creators', 'Found 37 fans who already sell the Alder jacket', 'Compared against 1,240 outdoor-category launches'],
  ['Started from the Fall Trail ’26 brief, which hit 124% of its sales target', 'Set a launch goal from the forecast', 'Shortened usage rights to 60 days because launches peak in the first 3 weeks'],
  ['Ranked 412 creators by fit for a winter outerwear launch', 'Added 2 creators from your own audience', 'Left out 1 creator flagged for brand-safety review', 'Balanced the mix: 4 micro, 1 mid, 1 macro'],
  ['Priced each offer inside the incentive advisor’s fair range', 'Reserved $9,000 for paid amplification', 'Projected commission from expected sales'],
  ['Checked each creator’s calendar and active deals in Later Creator', 'Checked audience data freshness'],
  [],
];

export interface Offer { id: string; name: string; handle: string; followers: string; tier: 'Micro' | 'Mid' | 'Macro'; fit: number; low: number; high: number; offer: number; commission: number; reason: string; source?: 'audience' | 'replacement' | 'rebook' }

const START: Offer[] = [
  { id: 'd1', name: 'Tess Alder', handle: '@tessalder', followers: '88K', tier: 'Micro', fit: 95, low: 1400, high: 1900, offer: 1600, commission: 12, reason: 'Strong saves on jacket content; 8% overlap with your roster' },
  { id: 'd2', name: 'Kofi Mensah', handle: '@kofiwalks', followers: '142K', tier: 'Mid', fit: 92, low: 2100, high: 2800, offer: 2400, commission: 10, reason: '1.9K linked-post clicks per outerwear post' },
  { id: 'd4', name: 'Iris Park', handle: '@irisparkoutdoors', followers: '36K', tier: 'Micro', fit: 90, low: 600, high: 850, offer: 700, commission: 12, reason: 'Strong Pinterest saves for winter gear; low overlap' },
  { id: 'a4', name: 'Nina Okafor', handle: '@northbound.nina', followers: '41K', tier: 'Micro', fit: 89, low: 800, high: 1200, offer: 1000, commission: 12, reason: 'Already sold $4,120 of Fernway gear without being paid', source: 'audience' },
  { id: 'a3', name: 'Lu Andersen', handle: '@lake.days.lu', followers: '22K', tier: 'Micro', fit: 91, low: 450, high: 700, offer: 550, commission: 12, reason: 'Sold $2,960 of Fernway gear; audience of families who camp', source: 'audience' },
  { id: 'lt', name: 'Lena Tor', handle: '@lenatrails', followers: '322K', tier: 'Macro', fit: 88, low: 3400, high: 4300, offer: 3900, commission: 0, reason: 'Biggest halo in Fall Trail ’26 (+45% on top of tracked sales)', source: 'rebook' },
];
const GRAY: Offer = { id: 'd3', name: 'Gray Holloway', handle: '@grayholloway', followers: '230K', tier: 'Mid', fit: 84, low: 3200, high: 4000, offer: 3400, commission: 8, reason: 'Included by you despite the brand-safety flag' };
const DANA: Offer = { id: 'r1', name: 'Dana Holt', handle: '@danaholtoutside', followers: '64K', tier: 'Mid', fit: 87, low: 1200, high: 1600, offer: 1400, commission: 10, reason: 'Audience close to Kofi’s; no conflicting deals', source: 'replacement' };

export const COMMISSION = 7800;
export const PAID = 9000;

export interface Brief { goal: string; audience: string; deliverables: string; talking: string; usage: string; exclusivity: string }
export const BRIEF_FIELDS: [keyof Brief, string][] = [['goal', 'Goal'], ['audience', 'Audience'], ['deliverables', 'Deliverables'], ['talking', 'Talking points'], ['usage', 'Usage rights'], ['exclusivity', 'Exclusivity']];
const BRIEF: Brief = {
  goal: 'Sell 1,500 Alder jackets in the new winter colorway in 4 weeks',
  audience: 'Hikers and winter campers 25–44 in the Pacific Northwest and Mountain West',
  deliverables: '1 Reel or TikTok with a linked post, plus a 3-frame story set',
  talking: 'Warm when you stop moving · packs into its own pocket · lifetime zipper repair',
  usage: '60 days paid amplification',
  exclusivity: '30 days, outdoor apparel only',
};

export interface LogLine { text: string; who: 'agent' | 'you'; at: string }
export type Resolution = 'replace' | 'delay' | 'remove' | 'none';

export interface AgentState {
  started: boolean;
  status: StepStatus[];
  step: number;
  lines: string[][];
  log: LogLine[];
  cap: number;
  auto: { brief: boolean; list: boolean };
  brief: Brief;
  edited: boolean;
  list: Offer[];
  grayExcluded: boolean;
  resolution: Resolution | null;
  sent: boolean;
  decisions: string[];
}

const fresh = (): AgentState => ({
  started: false, status: AGENT_STEPS.map(() => 'todo'), step: 0, lines: AGENT_STEPS.map(() => []), log: [], cap: 30000,
  auto: { brief: false, list: true }, brief: { ...BRIEF }, edited: false, list: START.map(o => ({ ...o })), grayExcluded: true,
  resolution: null, sent: false, decisions: [],
});

const now = () => new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
export const fees = (a: AgentState) => a.list.reduce((s, o) => s + o.offer, 0);
export const planned = (a: AgentState) => fees(a) + COMMISSION + PAID;

export function useAgentRun() {
  const [state, setState] = useState<AgentState>(fresh);
  const timers = useRef<number[]>([]);
  const ref = useRef(state);
  ref.current = state;

  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => clear, []);

  const set = (fn: (a: AgentState) => AgentState) => setState(a => fn(a));
  const log = (a: AgentState, text: string, who: 'agent' | 'you' = 'agent'): AgentState => ({ ...a, log: [...a.log, { text, who, at: now() }] });
  const withStatus = (a: AgentState, i: number, s: StepStatus): AgentState => ({ ...a, status: a.status.map((x, k) => (k === i ? s : x)) });

  const finishStep = useCallback((i: number) => {
    set(a => {
      if (i === 0) { queueMicrotask(() => run(1)); return withStatus(a, 0, 'done'); }
      if (i === 1) {
        if (a.auto.brief) { queueMicrotask(() => run(2)); return log(withStatus(a, 1, 'done'), 'Brief accepted automatically (your guardrail setting)'); }
        return log(withStatus(a, 1, 'review'), 'Paused for your review of the brief');
      }
      if (i === 2) {
        if (a.auto.list) { queueMicrotask(() => run(3)); return log(withStatus(a, 2, 'done'), 'Shortlist kept automatically (your guardrail setting)'); }
        return log(withStatus(a, 2, 'review'), 'Paused for your review of the shortlist');
      }
      if (i === 3) return log(withStatus(a, 3, 'review'), 'Offers commit budget, so EdgeAI is waiting for you');
      if (i === 4) {
        if (a.list.some(o => o.id === 'd2')) return log(withStatus(a, 4, 'blocked'), 'Found a conflict it can’t resolve on its own');
        let b = log({ ...withStatus(withStatus(a, 4, 'done'), 5, 'review'), resolution: 'none', step: 5 }, 'No conflicts. Refreshed Lu Andersen’s audience data');
        b = log(b, 'Ready to send invites. Waiting for you');
        return b;
      }
      return a;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const run = useCallback((i: number) => {
    set(a => ({ ...withStatus(a, i, 'working'), step: i, lines: a.lines.map((l, k) => (k === i ? [] : l)) }));
    const L = LOGS[i];
    L.forEach((line, k) => {
      timers.current.push(window.setTimeout(() => set(a => log({ ...a, lines: a.lines.map((l, j) => (j === i ? [...l, line] : l)) }, line)), 500 + k * 650));
    });
    timers.current.push(window.setTimeout(() => finishStep(i), 700 + L.length * 650));
  }, [finishStep]);

  const you = (text: string, decision?: string) => (a: AgentState) => {
    const b = log(a, text, 'you');
    return decision ? { ...b, decisions: [...b.decisions, decision] } : b;
  };

  return {
    state,
    start: () => { clear(); setState({ ...fresh(), started: true }); timers.current.push(window.setTimeout(() => run(0), 400)); },
    pause: () => { clear(); set(a => { const i = a.status.indexOf('working'); return i < 0 ? a : you('Paused')(withStatus(a, i, 'paused')); }); },
    resume: () => { const i = ref.current.status.indexOf('paused'); if (i >= 0) { set(you('Resumed')); run(i); } },
    setAuto: (key: 'brief' | 'list', on: boolean) => set(a => you(`${key === 'brief' ? 'Brief' : 'Shortlist'}: ${on ? 'continue automatically' : 'ask me first'}`)({ ...a, auto: { ...a.auto, [key]: on } })),
    setCap: (cap: number) => set(a => ({ ...a, cap })),
    setOffer: (id: string, offer: number) => set(a => ({ ...a, list: a.list.map(o => (o.id === id ? { ...o, offer } : o)) })),
    approveBrief: (brief: Brief) => {
      const changed = BRIEF_FIELDS.some(([k]) => brief[k] !== ref.current.brief[k]);
      set(a => you(changed ? 'Approved the brief with edits. EdgeAI will carry them forward.' : 'Approved the brief', changed ? 'Approved the brief with your edits' : 'Approved the brief')({ ...withStatus(a, 1, 'done'), brief, edited: changed }));
      run(2);
    },
    removeCreator: (id: string) => set(a => { const o = a.list.find(x => x.id === id); return you(`Removed ${o?.name} from the shortlist`)({ ...a, list: a.list.filter(x => x.id !== id), grayExcluded: id === 'd3' ? true : a.grayExcluded }); }),
    includeGray: () => set(a => you('Included Gray Holloway despite the brand-safety flag')({ ...a, grayExcluded: false, list: [...a.list, { ...GRAY }] })),
    excludeGray: () => set(a => you('Undid: left Gray Holloway out again')({ ...a, grayExcluded: true, list: a.list.filter(o => o.id !== 'd3') })),
    keepList: () => { set(a => you('Kept the shortlist', `Kept a shortlist of ${a.list.length} creators`)(withStatus(a, 2, 'done'))); run(3); },
    approveOffers: () => {
      const a = ref.current;
      if (planned(a) > a.cap) return;
      set(you(`Approved offers: $${planned(a).toLocaleString()} of $${a.cap.toLocaleString()}`, `Approved $${fees(a).toLocaleString()} in creator offers ($${planned(a).toLocaleString()} planned)`));
      set(b => withStatus(b, 3, 'done'));
      run(4);
    },
    resolve: (r: Exclude<Resolution, 'none'>) => set(a => {
      const list = r === 'replace' ? a.list.map(o => (o.id === 'd2' ? { ...DANA } : o)) : r === 'remove' ? a.list.filter(o => o.id !== 'd2') : a.list.map(o => (o.id === 'd2' ? { ...o, reason: 'Invited for after Jan 20, when his exclusivity ends' } : o));
      const text = { replace: 'Replaced Kofi Mensah with Dana Holt', delay: 'Moved Kofi Mensah to after Jan 20', remove: 'Removed Kofi Mensah' }[r];
      let b = you(text, text)({ ...withStatus(withStatus(a, 4, 'done'), 5, 'review'), list, resolution: r, step: 5 });
      b = log(b, 'Refreshed Lu Andersen’s audience data');
      return log(b, 'Ready to send invites. Waiting for you');
    }),
    send: () => set(a => you(`Sent ${a.list.length} invites`, `Sent ${a.list.length} invites`)({ ...withStatus(a, 5, 'done'), sent: true })),
    withdraw: () => set(a => you('Withdrew all invites before anyone opened them')({ ...withStatus(a, 5, 'review'), sent: false, decisions: a.decisions.slice(0, -1) })),
  };
}
export type AgentRun = ReturnType<typeof useAgentRun>;

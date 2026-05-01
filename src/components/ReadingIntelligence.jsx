import { AlertTriangle, BrainCircuit, CheckCircle2, Gauge } from 'lucide-react';

export default function ReadingIntelligence({ readingsCount, resultReady, error }) {
  const quality = !resultReady
    ? 'Collect more data'
    : error === null
      ? 'Model-only estimate'
      : error < 5
        ? 'Excellent'
        : error < 12
          ? 'Good'
          : 'Needs review';
  const Icon = error !== null && error >= 12 ? AlertTriangle : resultReady ? CheckCircle2 : Gauge;

  return (
    <section className="premium-panel rounded-lg p-4 shadow-lab">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-md border border-cyan-200/20 bg-cyan-300/10 text-cyan-100">
          <BrainCircuit className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">AI reading intelligence</p>
          <div className="mt-3 flex items-center gap-2">
            <Icon className="h-5 w-5 text-emerald-200" aria-hidden="true" />
            <p className="text-lg font-black text-white">{quality}</p>
          </div>
          <p className="mt-2 text-sm font-semibold leading-6 text-white/60">
            {readingsCount === 0
              ? 'Start the simulator and capture readings to let the assistant evaluate trend quality.'
              : error !== null && error >= 12
                ? 'The reading set is drifting from accepted values. Repeat threshold/resonance detection and keep controls stable.'
                : 'The observation set is consistent enough for calculations, report export, and viva discussion.'}
          </p>
        </div>
      </div>
    </section>
  );
}

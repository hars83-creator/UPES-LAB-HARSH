import { useMemo, useState } from 'react';
import { Bot, BrainCircuit, CheckCircle2, GraduationCap, Lightbulb, Wand2 } from 'lucide-react';

const tabs = [
  { id: 'guide', label: 'Guide', icon: Wand2 },
  { id: 'coach', label: 'Coach', icon: BrainCircuit },
  { id: 'viva', label: 'Viva', icon: GraduationCap },
  { id: 'improve', label: 'Improve', icon: Lightbulb }
];

export default function AssistantPanel({ experiment, currentStep, setCurrentStep, guided, setGuided, readingsCount = 0, error = null }) {
  const [activeTab, setActiveTab] = useState('guide');
  const activeStep = experiment.guide[currentStep] ?? experiment.guide[0];
  const completion = useMemo(
    () => Math.round(((currentStep + 1) / Math.max(experiment.guide.length, 1)) * 100),
    [currentStep, experiment.guide.length]
  );

  return (
    <section className="premium-panel rounded-lg p-4 shadow-lab">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-cyan-200" aria-hidden="true" />
          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.16em] text-cyan-200">
              AI Lab Assistant
            </h2>
            <p className="mt-1 text-xs font-semibold text-white/50">
              Guided help, viva prep, and reading quality checks
            </p>
          </div>
        </div>
        <label className="flex items-center gap-2 text-xs font-bold text-white/60">
          Guided
          <input type="checkbox" checked={guided} onChange={(event) => setGuided(event.target.checked)} />
        </label>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-1 rounded-md border border-white/10 bg-white/[0.06] p-1 sm:grid-cols-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex min-h-9 flex-1 items-center justify-center gap-2 rounded px-2 text-xs font-bold transition ${
                activeTab === tab.id
                  ? 'bg-cyan-600 text-white'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'guide' ? (
        <div>
          <div className="mb-3 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-fuchsia-300" style={{ width: `${completion}%` }} />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-200">
            Step {currentStep + 1} of {experiment.guide.length}
          </p>
          <p className="mt-2 text-sm font-semibold leading-6 text-white/75">{activeStep}</p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              className="min-h-9 flex-1 rounded-md border border-white/10 px-3 text-xs font-bold text-white/60 transition hover:bg-white/10 disabled:opacity-40"
              disabled={currentStep === 0}
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(Math.min(experiment.guide.length - 1, currentStep + 1))}
              className="min-h-9 flex-1 rounded-md bg-cyan-300 px-3 text-xs font-bold text-slate-950 transition hover:bg-cyan-200 disabled:opacity-50"
              disabled={currentStep === experiment.guide.length - 1}
            >
              Next
            </button>
          </div>
        </div>
      ) : null}

      {activeTab === 'coach' ? (
        <div className="rounded-md border border-white/10 bg-white/[0.05] p-3">
          <p className="text-sm font-black text-white">
            {readingsCount === 0
              ? 'Start with one clean baseline reading.'
              : error !== null && error > 12
                ? 'Your readings look noisy. Recheck threshold/resonance before exporting.'
                : 'The current dataset is suitable for calculations and viva discussion.'}
          </p>
          <p className="mt-2 text-sm font-semibold leading-6 text-white/60">
            The assistant compares live readings with accepted values, watches the guided-mode step, and recommends repeat trials when error rises.
          </p>
        </div>
      ) : null}

      {activeTab === 'viva' ? (
        <ul className="space-y-3">
          {experiment.viva.map((item) => (
            <li key={item} className="flex gap-2 text-sm leading-6 text-white/75">
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-200" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {activeTab === 'improve' ? (
        <ul className="space-y-3">
          {experiment.improvements.map((item) => (
            <li key={item} className="flex gap-2 text-sm leading-6 text-white/75">
              <Lightbulb className="mt-1 h-4 w-4 shrink-0 text-amber-200" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

import { useMemo, useState } from 'react';
import { Bot, CheckCircle2, GraduationCap, Lightbulb, Wand2 } from 'lucide-react';

const tabs = [
  { id: 'guide', label: 'Guide', icon: Wand2 },
  { id: 'viva', label: 'Viva', icon: GraduationCap },
  { id: 'improve', label: 'Improve', icon: Lightbulb }
];

export default function AssistantPanel({ experiment, currentStep, setCurrentStep, guided, setGuided }) {
  const [activeTab, setActiveTab] = useState('guide');
  const activeStep = experiment.guide[currentStep] ?? experiment.guide[0];
  const completion = useMemo(
    () => Math.round(((currentStep + 1) / Math.max(experiment.guide.length, 1)) * 100),
    [currentStep, experiment.guide.length]
  );

  return (
    <section className="glass-panel rounded-lg p-4 shadow-lab">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-cyan-600 dark:text-cyan-300" aria-hidden="true" />
          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-700 dark:text-slate-200">
              AI Lab Assistant
            </h2>
            <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
              Guided help, viva prep, and reading quality checks
            </p>
          </div>
        </div>
        <label className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-300">
          Guided
          <input type="checkbox" checked={guided} onChange={(event) => setGuided(event.target.checked)} />
        </label>
      </div>

      <div className="mb-4 flex rounded-md border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-950">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex min-h-9 flex-1 items-center justify-center gap-2 rounded px-2 text-xs font-bold transition ${
                activeTab === tab.id
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
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
          <div className="mb-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div className="h-full rounded-full bg-cyan-600" style={{ width: `${completion}%` }} />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-700 dark:text-cyan-300">
            Step {currentStep + 1} of {experiment.guide.length}
          </p>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">{activeStep}</p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              className="min-h-9 flex-1 rounded-md border border-slate-200 px-3 text-xs font-bold text-slate-600 transition hover:bg-slate-100 disabled:opacity-40 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
              disabled={currentStep === 0}
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(Math.min(experiment.guide.length - 1, currentStep + 1))}
              className="min-h-9 flex-1 rounded-md bg-cyan-600 px-3 text-xs font-bold text-white transition hover:bg-cyan-500 disabled:opacity-50"
              disabled={currentStep === experiment.guide.length - 1}
            >
              Next
            </button>
          </div>
        </div>
      ) : null}

      {activeTab === 'viva' ? (
        <ul className="space-y-3">
          {experiment.viva.map((item) => (
            <li key={item} className="flex gap-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {activeTab === 'improve' ? (
        <ul className="space-y-3">
          {experiment.improvements.map((item) => (
            <li key={item} className="flex gap-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
              <Lightbulb className="mt-1 h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

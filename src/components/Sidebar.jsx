import {
  Activity,
  Atom,
  Cable,
  CircuitBoard,
  Compass,
  Gauge,
  Lightbulb,
  Magnet,
  Moon,
  Radio,
  Sun,
  Zap
} from 'lucide-react';

const fallbackIcons = {
  planck: Lightbulb,
  sonometer: Radio,
  hall: Activity,
  coil: Compass,
  faraday: Magnet,
  fiber: Cable,
  diffraction: Zap,
  solar: Sun,
  photoelectric: Atom,
  diode: CircuitBoard
};

export default function Sidebar({ experiments, selectedId, onSelect, darkMode, onToggleDark }) {
  return (
    <aside className="flex h-full w-full flex-col border-r border-slate-200 bg-white/82 p-3 dark:border-slate-800 dark:bg-slate-950/88 lg:w-80">
      <div className="mb-4 flex items-center gap-3 px-2">
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-cyan-600 text-white shadow-lab">
          <Gauge className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">UPES</p>
          <h1 className="truncate text-base font-black text-slate-950 dark:text-white">Physics Virtual Lab</h1>
        </div>
      </div>

      <nav className="thin-scrollbar flex-1 space-y-1 overflow-y-auto pr-1" aria-label="Experiments">
        {experiments.map((experiment, index) => {
          const Icon = fallbackIcons[experiment.id] ?? Gauge;
          const selected = experiment.id === selectedId;
          return (
            <button
              key={experiment.id}
              onClick={() => onSelect(experiment.id)}
              className={`flex w-full items-center gap-3 rounded-md border px-3 py-3 text-left transition ${
                selected
                  ? 'border-cyan-500 bg-cyan-50 text-cyan-900 dark:border-cyan-400/70 dark:bg-cyan-950/45 dark:text-cyan-50'
                  : 'border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-100 dark:text-slate-300 dark:hover:border-slate-800 dark:hover:bg-slate-900'
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span className="min-w-0">
                <span className="block text-xs font-semibold text-slate-400 dark:text-slate-500">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="block truncate text-sm font-bold">{experiment.shortTitle}</span>
              </span>
            </button>
          );
        })}
      </nav>

      <button
        onClick={onToggleDark}
        className="mt-4 flex min-h-11 items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-700 transition hover:border-cyan-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
      >
        <span className="flex items-center gap-2">
          {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          Dark mode
        </span>
        <span className="text-xs text-slate-500">{darkMode ? 'On' : 'Off'}</span>
      </button>
    </aside>
  );
}

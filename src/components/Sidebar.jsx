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
    <aside className="flex h-full w-full flex-col border-r border-white/10 bg-[#050816]/84 p-3 backdrop-blur-2xl lg:w-80">
      <div className="mb-4 flex items-center gap-3 px-2">
        <div className="grid h-11 w-11 place-items-center rounded-lg border border-cyan-200/20 bg-cyan-300/12 text-cyan-100 shadow-[0_0_42px_rgba(34,211,238,0.24)]">
          <Gauge className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">UPES</p>
          <h1 className="truncate text-base font-black text-white">Physics Virtual Lab</h1>
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
                  ? 'border-cyan-200/50 bg-cyan-300/12 text-cyan-50 shadow-[0_0_28px_rgba(34,211,238,0.14)]'
                  : 'border-transparent text-white/60 hover:border-white/10 hover:bg-white/[0.06] hover:text-white'
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
        className="mt-4 flex min-h-11 items-center justify-between rounded-md border border-white/10 bg-white/[0.06] px-3 text-sm font-bold text-white/75 transition hover:border-cyan-200/40 hover:bg-cyan-300/10"
      >
        <span className="flex items-center gap-2">
          {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          Dark mode
        </span>
        <span className="text-xs text-cyan-200">{darkMode ? 'On' : 'Off'}</span>
      </button>
    </aside>
  );
}

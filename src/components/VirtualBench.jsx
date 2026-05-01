import { useMemo, useState } from 'react';
import { Beaker, Cable, Move, Power, ScanLine, Sparkles } from 'lucide-react';

const icons = [Beaker, Cable, Power, ScanLine];
const zones = ['source', 'sensor', 'sample'];

export default function VirtualBench({ apparatus }) {
  const [bench, setBench] = useState({ source: apparatus[0], sensor: apparatus[1], sample: apparatus[2] });
  const unplaced = useMemo(
    () => apparatus.filter((item) => !Object.values(bench).includes(item)),
    [apparatus, bench]
  );

  function onDrop(zone, event) {
    const item = event.dataTransfer.getData('text/plain');
    if (!item) {
      return;
    }
    setBench((current) => ({ ...current, [zone]: item }));
  }

  return (
    <section className="premium-panel rounded-lg p-4 shadow-lab">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Digital lab setup
          </p>
          <h2 className="mt-1 text-lg font-black text-white">Drag apparatus onto the bench</h2>
        </div>
        <Move className="h-5 w-5 text-white/50" aria-hidden="true" />
      </div>

      <div className="grid gap-3">
        <div className="grid gap-3 sm:grid-cols-3">
          {zones.map((zone) => (
            <div
              key={zone}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => onDrop(zone, event)}
              className="bench-zone min-h-24 rounded-lg border border-dashed border-cyan-200/30 bg-slate-950/40 p-3"
            >
              <p className="text-xs font-black uppercase tracking-[0.18em] text-white/40">{zone}</p>
              <p className="mt-3 text-sm font-black text-white">{bench[zone] ?? 'Drop apparatus'}</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-3/4 rounded-full bg-cyan-300/100" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {[...unplaced, ...apparatus.slice(0, 2)].map((item, index) => {
            const Icon = icons[index % icons.length];
            return (
              <button
                key={`${item}-${index}`}
                draggable
                onDragStart={(event) => event.dataTransfer.setData('text/plain', item)}
                className="flex min-h-10 items-center gap-2 rounded-md border border-white/10 bg-white/[0.07] px-3 text-xs font-black text-white/80 transition hover:border-cyan-200/40 hover:bg-cyan-300/10"
              >
                <Icon className="h-4 w-4 text-cyan-200" aria-hidden="true" />
                {item}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

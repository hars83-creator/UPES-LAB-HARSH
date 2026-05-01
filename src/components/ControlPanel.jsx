import { SlidersHorizontal } from 'lucide-react';
import { formatValue } from '../lib/utils.js';

function parseValue(raw, control) {
  if (control.type === 'select') {
    return raw;
  }
  if (control.type === 'toggle') {
    return Boolean(raw);
  }
  return Number(raw);
}

export default function ControlPanel({ controls, values, onChange }) {
  return (
    <section className="premium-panel rounded-lg p-4 shadow-lab">
      <div className="mb-4 flex items-center gap-2">
        <SlidersHorizontal className="h-5 w-5 text-cyan-200" aria-hidden="true" />
        <h2 className="text-sm font-black uppercase tracking-[0.16em] text-cyan-200">
          Controls
        </h2>
      </div>

      <div className="space-y-4">
        {controls.map((control) => {
          const value = values[control.key];

          if (control.type === 'select') {
            return (
              <label key={control.key} className="block">
                <span className="mb-2 block text-sm font-bold text-white/80">
                  {control.label}
                </span>
                <select
                  value={value}
                  onChange={(event) => onChange(control.key, parseValue(event.target.value, control))}
                  className="h-11 w-full rounded-md border border-white/10 bg-slate-950/70 px-3 text-sm font-semibold text-white outline-none transition focus:border-cyan-200/50"
                >
                  {control.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            );
          }

          if (control.type === 'toggle') {
            return (
              <label
                key={control.key}
                className="flex min-h-12 items-center justify-between rounded-md border border-white/10 bg-white/[0.06] px-3"
              >
                <span className="text-sm font-bold text-white/80">{control.label}</span>
                <input
                  type="checkbox"
                  checked={Boolean(value)}
                  onChange={(event) => onChange(control.key, event.target.checked)}
                  className="h-5 w-5"
                />
              </label>
            );
          }

          return (
            <label key={control.key} className="block">
              <span className="mb-2 flex items-center justify-between gap-3 text-sm font-bold text-white/80">
                <span>{control.label}</span>
                <span className="font-mono text-xs text-cyan-200">
                  {formatValue(value, control.unit, control.digits ?? 2)}
                </span>
              </span>
              <input
                type="range"
                min={control.min}
                max={control.max}
                step={control.step}
                value={value}
                onChange={(event) => onChange(control.key, parseValue(event.target.value, control))}
                className="w-full"
              />
              <span className="mt-1 flex justify-between text-[11px] font-semibold text-white/40">
                <span>{formatValue(control.min, control.unit, control.digits ?? 2)}</span>
                <span>{formatValue(control.max, control.unit, control.digits ?? 2)}</span>
              </span>
            </label>
          );
        })}
      </div>
    </section>
  );
}

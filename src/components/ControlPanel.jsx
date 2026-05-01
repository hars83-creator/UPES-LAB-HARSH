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
    <section className="glass-panel rounded-lg p-4 shadow-lab">
      <div className="mb-4 flex items-center gap-2">
        <SlidersHorizontal className="h-5 w-5 text-cyan-600 dark:text-cyan-300" aria-hidden="true" />
        <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-700 dark:text-slate-200">
          Controls
        </h2>
      </div>

      <div className="space-y-4">
        {controls.map((control) => {
          const value = values[control.key];

          if (control.type === 'select') {
            return (
              <label key={control.key} className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                  {control.label}
                </span>
                <select
                  value={value}
                  onChange={(event) => onChange(control.key, parseValue(event.target.value, control))}
                  className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
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
                className="flex min-h-12 items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{control.label}</span>
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
              <span className="mb-2 flex items-center justify-between gap-3 text-sm font-bold text-slate-700 dark:text-slate-200">
                <span>{control.label}</span>
                <span className="font-mono text-xs text-cyan-700 dark:text-cyan-300">
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
              <span className="mt-1 flex justify-between text-[11px] font-semibold text-slate-400">
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

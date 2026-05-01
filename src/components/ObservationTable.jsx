import { Table2 } from 'lucide-react';
import { formatValue } from '../lib/utils.js';

export default function ObservationTable({ columns, readings }) {
  return (
    <section className="glass-panel rounded-lg p-4 shadow-lab">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Table2 className="h-5 w-5 text-cyan-600 dark:text-cyan-300" aria-hidden="true" />
          <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-700 dark:text-slate-200">
            Observations
          </h2>
        </div>
        <span className="rounded bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
          {readings.length} readings
        </span>
      </div>

      <div className="thin-scrollbar max-h-80 overflow-auto rounded-md border border-slate-200 dark:border-slate-800">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-800">
          <thead className="sticky top-0 bg-slate-100 text-xs uppercase tracking-[0.12em] text-slate-500 dark:bg-slate-900 dark:text-slate-400">
            <tr>
              <th className="px-3 py-3">Trial</th>
              {columns.map((column) => (
                <th key={column.key} className="whitespace-nowrap px-3 py-3">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white/70 dark:divide-slate-800 dark:bg-slate-950/40">
            {!readings.length ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-3 py-8 text-center text-sm text-slate-500">
                  Press Take Reading to auto-fill the observation table with noisy lab-style data.
                </td>
              </tr>
            ) : (
              readings.map((reading, index) => (
                <tr key={reading.id ?? index}>
                  <td className="px-3 py-3 font-mono text-xs text-slate-500">{index + 1}</td>
                  {columns.map((column) => {
                    const value = reading[column.key];
                    return (
                      <td key={column.key} className="whitespace-nowrap px-3 py-3 font-mono text-xs text-slate-700 dark:text-slate-200">
                        {column.format ? column.format(value, reading) : formatValue(value, column.unit, column.digits ?? 3)}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

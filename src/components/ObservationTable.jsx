import { Table2 } from 'lucide-react';
import { formatValue } from '../lib/utils.js';

export default function ObservationTable({ columns, readings }) {
  return (
    <section className="premium-panel rounded-lg p-4 shadow-lab">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Table2 className="h-5 w-5 text-cyan-200" aria-hidden="true" />
          <h2 className="text-sm font-black uppercase tracking-[0.16em] text-cyan-200">
            Observations
          </h2>
        </div>
        <span className="rounded border border-white/10 bg-white/[0.06] px-2 py-1 text-xs font-bold text-white/60">
          {readings.length} readings
        </span>
      </div>

      <div className="thin-scrollbar max-h-80 overflow-auto rounded-md border border-white/10">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm">
          <thead className="sticky top-0 bg-slate-950/90 text-xs uppercase tracking-[0.12em] text-white/50 backdrop-blur-xl">
            <tr>
              <th className="px-3 py-3">Trial</th>
              {columns.map((column) => (
                <th key={column.key} className="whitespace-nowrap px-3 py-3">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 bg-white/[0.04]">
            {!readings.length ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-3 py-8 text-center text-sm text-white/50">
                  Press Take Reading to auto-fill the observation table with noisy lab-style data.
                </td>
              </tr>
            ) : (
              readings.map((reading, index) => (
                <tr key={reading.id ?? index}>
                  <td className="px-3 py-3 font-mono text-xs text-white/40">{index + 1}</td>
                  {columns.map((column) => {
                    const value = reading[column.key];
                    return (
                      <td key={column.key} className="whitespace-nowrap px-3 py-3 font-mono text-xs text-white/75">
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

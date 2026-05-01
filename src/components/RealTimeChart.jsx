import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

const palette = ['#0891b2', '#16a34a', '#f59e0b', '#dc2626', '#7c3aed'];

export default function RealTimeChart({ title, data, xLabel, yLabel, graphOptions, activeGraph, onGraphChange }) {
  const keys = Object.keys(data?.[0] ?? {}).filter(
    (key) => key !== 'x' && !key.startsWith('raw') && key !== 'delta'
  );

  return (
    <section className="glass-panel rounded-lg p-4 shadow-lab">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-700 dark:text-slate-200">
            {title}
          </h2>
          <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            {yLabel} plotted against {xLabel}
          </p>
        </div>

        {graphOptions?.length > 1 ? (
          <div className="flex rounded-md border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-950">
            {graphOptions.map((graph) => (
              <button
                key={graph.id}
                onClick={() => onGraphChange(graph.id)}
                className={`rounded px-3 py-1.5 text-xs font-bold transition ${
                  activeGraph === graph.id
                    ? 'bg-cyan-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                {graph.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 12, right: 20, left: 0, bottom: 12 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.25)" />
            <XAxis
              dataKey="x"
              tick={{ fill: '#64748b', fontSize: 11 }}
              label={{ value: xLabel, position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 11 }}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 11 }}
              label={{ value: yLabel, angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: '1px solid rgba(148,163,184,0.35)',
                background: 'rgba(15,23,42,0.92)',
                color: 'white'
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {keys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                dot={data.length < 20}
                stroke={palette[index % palette.length]}
                strokeWidth={2.5}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

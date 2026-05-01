import { useEffect, useMemo, useState } from 'react';
import {
  ClipboardPlus,
  Download,
  FlaskConical,
  Gauge,
  Play,
  RotateCcw,
  Save,
  Square,
  Wrench,
  Zap
} from 'lucide-react';
import ActionButton from './ActionButton.jsx';
import AssistantPanel from './AssistantPanel.jsx';
import ControlPanel from './ControlPanel.jsx';
import LabVisualization from './LabVisualization.jsx';
import ObservationTable from './ObservationTable.jsx';
import QuizPanel from './QuizPanel.jsx';
import RealTimeChart from './RealTimeChart.jsx';
import { exportLabReport } from '../lib/report.js';
import { formatValue, percentError, readingId } from '../lib/utils.js';

const apparatusIcons = [FlaskConical, Gauge, Zap, Wrench];

function getApiBaseUrl() {
  const { protocol, hostname } = window.location;

  if (hostname.endsWith('.app.github.dev')) {
    return `${protocol}//${hostname.replace(/-\d+\.app\.github\.dev$/, '-4000.app.github.dev')}`;
  }

  return 'http://localhost:4000';
}

export default function ExperimentShell({ experiment }) {
  const [controls, setControls] = useState(experiment.initialControls);
  const [readings, setReadings] = useState([]);
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [activeGraph, setActiveGraph] = useState(experiment.graphs[0].id);
  const [guided, setGuided] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    if (!running) {
      return undefined;
    }

    const timer = window.setInterval(() => setTime((value) => value + 0.08), 80);
    return () => window.clearInterval(timer);
  }, [running]);

  const current = useMemo(
    () => experiment.compute(controls, time, readings),
    [controls, experiment, readings, time]
  );

  const graph = useMemo(
    () => experiment.graphs.find((item) => item.id === activeGraph) ?? experiment.graphs[0],
    [activeGraph, experiment.graphs]
  );

  const graphData = useMemo(
    () => graph.getData({ controls, current, readings, time }),
    [controls, current, graph, readings, time]
  );

  const result = useMemo(
    () => experiment.getResult(readings, controls, current),
    [controls, current, experiment, readings]
  );

  const minimumReadings = experiment.minimumReadings ?? 1;
  const resultReady = readings.length >= minimumReadings || experiment.allowLiveResult;
  const error = resultReady ? percentError(result.value, result.reference) : null;

  function updateControl(key, value) {
    setControls((currentControls) => ({ ...currentControls, [key]: value }));
  }

  function takeReading() {
    const reading = {
      id: readingId(experiment.id),
      ...experiment.makeReading(controls, true, time)
    };
    setReadings((items) => [...items, reading]);
    if (guided) {
      setCurrentStep((step) => Math.min(step + 1, experiment.guide.length - 1));
    }
  }

  function reset() {
    setControls(experiment.initialControls);
    setReadings([]);
    setRunning(false);
    setTime(0);
    setCurrentStep(0);
    setSaveStatus('');
  }

  function exportPdf() {
    exportLabReport({ experiment, controls, readings, result });
  }

  async function saveReport() {
    setSaveStatus('Saving...');
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experimentId: experiment.id,
          experimentTitle: experiment.title,
          controls,
          readings,
          result
        })
      });

      if (!response.ok) {
        throw new Error('Report API returned an error.');
      }
      const payload = await response.json();
      setSaveStatus(`Saved as ${payload.report.id}`);
    } catch (error) {
      setSaveStatus('API offline. PDF export is still available.');
    }
  }

  return (
    <main className="min-w-0 flex-1 overflow-y-auto">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <header className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">
              Engineering Physics Lab
            </p>
            <h1 className="mt-2 text-2xl font-black text-slate-950 dark:text-white sm:text-3xl">
              {experiment.title}
            </h1>
            <p className="mt-3 text-sm font-medium leading-6 text-slate-600 dark:text-slate-300">
              {experiment.summary}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 lg:justify-end">
            <ActionButton icon={Play} variant="primary" onClick={() => setRunning(true)}>
              Start
            </ActionButton>
            <ActionButton icon={Square} onClick={() => setRunning(false)}>
              Stop
            </ActionButton>
            <ActionButton icon={RotateCcw} onClick={reset}>
              Reset
            </ActionButton>
            <ActionButton icon={ClipboardPlus} onClick={takeReading}>
              Take Reading
            </ActionButton>
            <ActionButton icon={Download} onClick={exportPdf}>
              PDF
            </ActionButton>
            <ActionButton icon={Save} onClick={saveReport}>
              Save
            </ActionButton>
          </div>
        </header>

        {saveStatus ? (
          <div className="mb-4 rounded-md border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-bold text-cyan-800 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-100">
            {saveStatus}
          </div>
        ) : null}

        <section className="mb-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="glass-panel rounded-lg p-4 shadow-lab">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-700 dark:text-slate-200">
                  Aim
                </h2>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">
                  {experiment.aim}
                </p>
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-700 dark:text-slate-200">
                  Theory
                </h2>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">
                  {experiment.theory}
                </p>
              </div>
            </div>

            <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-800">
              <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-700 dark:text-slate-200">
                Real-time Formula
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {experiment.formulas.map((formula) => (
                  <code
                    key={formula}
                    className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                  >
                    {formula}
                  </code>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-lg p-4 shadow-lab">
            <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-700 dark:text-slate-200">
              Apparatus
            </h2>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {experiment.apparatus.map((item, index) => {
                const Icon = apparatusIcons[index % apparatusIcons.length];
                return (
                  <div
                    key={item}
                    className="flex min-h-14 items-center gap-3 rounded-md border border-slate-200 bg-white/70 px-3 dark:border-slate-800 dark:bg-slate-950/40"
                  >
                    <Icon className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-300" aria-hidden="true" />
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{item}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-4">
            <LabVisualization
              experimentId={experiment.id}
              controls={controls}
              current={current}
              running={running}
              time={time}
            />
            <RealTimeChart
              title="Real-time Graph"
              data={graphData}
              xLabel={graph.xLabel}
              yLabel={graph.yLabel}
              graphOptions={experiment.graphs}
              activeGraph={activeGraph}
              onGraphChange={setActiveGraph}
            />
            <ObservationTable columns={experiment.observationColumns} readings={readings} />
          </div>

          <div className="space-y-4">
            <ControlPanel controls={experiment.controls} values={controls} onChange={updateControl} />
            <section className="glass-panel rounded-lg p-4 shadow-lab">
              <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-700 dark:text-slate-200">
                Final Calculations
              </h2>
              {!resultReady ? (
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">
                  Capture at least {minimumReadings} reading{minimumReadings > 1 ? 's' : ''} to finalize this result.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  <div className="rounded-md border border-slate-200 bg-white/70 p-3 dark:border-slate-800 dark:bg-slate-950/40">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{result.label}</p>
                    <p className="mt-2 font-mono text-xl font-black text-slate-950 dark:text-white">
                      {formatValue(result.value, result.unit, 4)}
                    </p>
                  </div>
                  {result.reference ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-md border border-slate-200 bg-white/70 p-3 dark:border-slate-800 dark:bg-slate-950/40">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Accepted</p>
                        <p className="mt-2 font-mono text-sm font-black text-slate-800 dark:text-slate-100">
                          {formatValue(result.reference, result.unit, 4)}
                        </p>
                      </div>
                      <div className="rounded-md border border-slate-200 bg-white/70 p-3 dark:border-slate-800 dark:bg-slate-950/40">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Error</p>
                        <p className="mt-2 font-mono text-sm font-black text-rose-700 dark:text-rose-300">
                          {error === null ? '-' : `${error.toFixed(2)} percent`}
                        </p>
                      </div>
                    </div>
                  ) : null}
                  <ul className="space-y-2">
                    {result.details?.map((detail) => (
                      <li key={detail} className="text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
            <AssistantPanel
              experiment={experiment}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              guided={guided}
              setGuided={setGuided}
            />
            <QuizPanel quiz={experiment.quiz} />
          </div>
        </section>
      </div>
    </main>
  );
}

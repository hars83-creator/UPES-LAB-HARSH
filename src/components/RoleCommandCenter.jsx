import { useMemo, useState } from 'react';
import {
  BarChart3,
  CheckCircle2,
  ClipboardList,
  FlaskConical,
  GraduationCap,
  RadioTower,
  Radar,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users
} from 'lucide-react';

const roles = [
  { id: 'student', label: 'Student', icon: GraduationCap },
  { id: 'teacher', label: 'Teacher', icon: ClipboardList },
  { id: 'admin', label: 'Admin', icon: ShieldCheck }
];

const students = ['Aarav S.', 'Isha M.', 'Kabir R.', 'Meera V.'];
const cohorts = ['B.Tech CSE A', 'B.Tech ECE B', 'Applied Physics Lab 1'];

function MetricCard({ icon: Icon, label, value, detail, tone = 'cyan' }) {
  const toneClass = {
    cyan: 'from-cyan-400/20 to-sky-500/5 text-cyan-200 ring-cyan-300/25',
    violet: 'from-violet-400/20 to-fuchsia-500/5 text-violet-100 ring-violet-300/25',
    emerald: 'from-emerald-400/20 to-teal-500/5 text-emerald-100 ring-emerald-300/25',
    amber: 'from-amber-300/20 to-orange-500/5 text-amber-100 ring-amber-300/25'
  };

  return (
    <div className={`rounded-lg bg-gradient-to-br ${toneClass[tone]} p-4 ring-1 backdrop-blur-xl`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-white/50">{label}</p>
          <p className="mt-2 text-2xl font-black text-white">{value}</p>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-md border border-white/10 bg-white/[0.08]">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      <p className="mt-3 text-xs font-semibold leading-5 text-white/60">{detail}</p>
    </div>
  );
}

function ProgressRow({ name, value, label }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-xs font-bold text-white/70">
        <span>{name}</span>
        <span>{label}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-violet-300 to-fuchsia-300 shadow-[0_0_22px_rgba(34,211,238,0.45)]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default function RoleCommandCenter({ experiments, selectedExperiment, onSelectExperiment }) {
  const [role, setRole] = useState('student');
  const [assignment, setAssignment] = useState({
    experimentId: selectedExperiment.id,
    cohort: cohorts[0],
    due: 'Friday'
  });
  const [assignments, setAssignments] = useState([
    { id: 1, experiment: "Planck's Constant", cohort: 'B.Tech CSE A', due: 'Friday', completion: 76 },
    { id: 2, experiment: 'Hall Effect', cohort: 'B.Tech ECE B', due: 'Monday', completion: 54 }
  ]);

  const selectedIndex = experiments.findIndex((experiment) => experiment.id === selectedExperiment.id);
  const completion = Math.round(((selectedIndex + 1) / experiments.length) * 100);
  const activeRole = roles.find((item) => item.id === role);

  const radarStats = useMemo(
    () => [
      { label: 'Accuracy', value: 92 },
      { label: 'Report quality', value: 88 },
      { label: 'Concept mastery', value: 81 },
      { label: 'Setup skill', value: 74 }
    ],
    []
  );

  function addAssignment() {
    const experiment = experiments.find((item) => item.id === assignment.experimentId) ?? selectedExperiment;
    setAssignments((items) => [
      {
        id: Date.now(),
        experiment: experiment.shortTitle,
        cohort: assignment.cohort,
        due: assignment.due,
        completion: 0
      },
      ...items
    ]);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
      <div className="premium-panel overflow-hidden rounded-xl p-4 shadow-lab">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-cyan-200">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Quantum Workspace
            </p>
            <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
              UPES virtual lab command center
            </h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-white/60">
              A role-aware digital lab for experiments, live progress, report review, and futuristic scientific visualization.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 rounded-lg border border-white/10 bg-white/[0.05] p-1">
            {roles.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setRole(item.id)}
                  className={`flex min-h-11 items-center justify-center gap-2 rounded-md px-3 text-xs font-black transition ${
                    role === item.id
                      ? 'bg-white text-slate-950 shadow-[0_0_30px_rgba(125,211,252,0.32)]'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-4">
          <MetricCard icon={FlaskConical} label="Active lab" value={selectedExperiment.shortTitle} detail="Current experiment loaded on the digital bench." />
          <MetricCard icon={Trophy} label="XP earned" value="8,420" detail="Badges unlock through accuracy, clean reports, and completion." tone="violet" />
          <MetricCard icon={Radar} label="Accuracy" value="92%" detail="Rolling estimate from readings and accepted values." tone="emerald" />
          <MetricCard icon={RadioTower} label="Live session" value={role === 'teacher' ? 'Ready' : 'Joinable'} detail="Codespaces-friendly ports for app and report API." tone="amber" />
        </div>

        {role === 'student' ? (
          <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-white/50">Personal progress</p>
                  <h3 className="mt-2 text-lg font-black text-white">Student mastery profile</h3>
                </div>
                <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-xs font-black text-cyan-100">
                  Level 12
                </span>
              </div>
              <div className="mt-4 space-y-4">
                {radarStats.map((item) => (
                  <ProgressRow key={item.label} name={item.label} value={item.value} label={`${item.value}%`} />
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-white/50">Recommended route</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {experiments.slice(0, 4).map((experiment, index) => (
                  <button
                    key={experiment.id}
                    onClick={() => onSelectExperiment(experiment.id)}
                    className={`rounded-lg border p-3 text-left transition ${
                      experiment.id === selectedExperiment.id
                        ? 'border-cyan-300/50 bg-cyan-300/10'
                        : 'border-white/10 bg-white/[0.04] hover:border-white/25 hover:bg-white/[0.08]'
                    }`}
                  >
                    <span className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
                      Module {index + 1}
                    </span>
                    <span className="mt-2 block text-sm font-black text-white">{experiment.shortTitle}</span>
                    <span className="mt-2 block text-xs font-semibold leading-5 text-white/50">
                      Guided mode, charting, and PDF report ready.
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <ProgressRow name="Overall lab path" value={completion} label={`${completion}%`} />
              </div>
            </div>
          </div>
        ) : null}

        {role === 'teacher' ? (
          <div className="mt-5 grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-white/50">Assign experiment</p>
              <div className="mt-4 grid gap-3">
                <select
                  value={assignment.experimentId}
                  onChange={(event) => setAssignment((current) => ({ ...current, experimentId: event.target.value }))}
                  className="h-11 rounded-md border border-white/10 bg-slate-950/70 px-3 text-sm font-bold text-white outline-none"
                >
                  {experiments.map((experiment) => (
                    <option key={experiment.id} value={experiment.id}>
                      {experiment.shortTitle}
                    </option>
                  ))}
                </select>
                <select
                  value={assignment.cohort}
                  onChange={(event) => setAssignment((current) => ({ ...current, cohort: event.target.value }))}
                  className="h-11 rounded-md border border-white/10 bg-slate-950/70 px-3 text-sm font-bold text-white outline-none"
                >
                  {cohorts.map((cohort) => (
                    <option key={cohort}>{cohort}</option>
                  ))}
                </select>
                <button
                  onClick={addAssignment}
                  className="min-h-11 rounded-md bg-white text-sm font-black text-slate-950 transition hover:bg-cyan-100"
                >
                  Assign to class
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-white/50">Live class monitor</p>
                <span className="rounded-full bg-emerald-400/12 px-3 py-1 text-xs font-black text-emerald-100">
                  {students.length} online
                </span>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {assignments.map((item) => (
                  <div key={item.id} className="rounded-md border border-white/10 bg-slate-950/30 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-black text-white">{item.experiment}</p>
                      <span className="text-xs font-bold text-white/50">{item.due}</span>
                    </div>
                    <p className="mt-1 text-xs font-semibold text-white/50">{item.cohort}</p>
                    <div className="mt-3">
                      <ProgressRow name="Completion" value={item.completion} label={`${item.completion}%`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {role === 'admin' ? (
          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-white/50">System analytics</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <MetricCard icon={Users} label="Users" value="1,284" detail="Across student, teacher, and admin roles." tone="cyan" />
                <MetricCard icon={CheckCircle2} label="Reports" value="6,912" detail="Saved and export-ready submissions." tone="emerald" />
                <MetricCard icon={BarChart3} label="Uptime" value="99.9%" detail="Local API health and Pages workflow ready." tone="violet" />
              </div>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-white/50">Access matrix</p>
              <div className="mt-4 space-y-3">
                {['Student experiment access', 'Teacher grading console', 'Admin analytics view'].map((item) => (
                  <label key={item} className="flex min-h-11 items-center justify-between rounded-md border border-white/10 bg-slate-950/30 px-3">
                    <span className="text-sm font-bold text-white/80">{item}</span>
                    <input type="checkbox" defaultChecked className="h-5 w-5 accent-cyan-300" />
                  </label>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

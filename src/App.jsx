import { useEffect, useMemo, useState } from 'react';
import AmbientStage from './components/AmbientStage.jsx';
import ExperimentShell from './components/ExperimentShell.jsx';
import RoleCommandCenter from './components/RoleCommandCenter.jsx';
import Sidebar from './components/Sidebar.jsx';
import { experiments } from './experiments/index.js';

export default function App() {
  const [selectedId, setSelectedId] = useState(experiments[0].id);
  const [darkMode, setDarkMode] = useState(true);
  const selectedExperiment = useMemo(
    () => experiments.find((experiment) => experiment.id === selectedId) ?? experiments[0],
    [selectedId]
  );
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen text-slate-950 dark:text-slate-100">
      <AmbientStage />
      <div className="flex min-h-screen flex-col lg:flex-row">
        <div className="lg:sticky lg:top-0 lg:h-screen">
          <Sidebar
            experiments={experiments}
            selectedId={selectedId}
            onSelect={setSelectedId}
            darkMode={darkMode}
            onToggleDark={() => setDarkMode((value) => !value)}
          />
        </div>
        <div className="min-w-0 flex-1">
          <RoleCommandCenter
            experiments={experiments}
            selectedExperiment={selectedExperiment}
            onSelectExperiment={setSelectedId}
          />
          <ExperimentShell key={selectedExperiment.id} experiment={selectedExperiment} />
        </div>
      </div>
    </div>
  );
}

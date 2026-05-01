import { useEffect, useMemo, useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import { experiments } from './experiments/index.js';

export default function App() {
  const [selectedId, setSelectedId] = useState(experiments[0].id);
  const [darkMode, setDarkMode] = useState(true);
  const selectedExperiment = useMemo(
    () => experiments.find((experiment) => experiment.id === selectedId) ?? experiments[0],
    [selectedId]
  );
  const SelectedComponent = selectedExperiment.Component;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
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
        <SelectedComponent key={selectedExperiment.id} />
      </div>
    </div>
  );
}

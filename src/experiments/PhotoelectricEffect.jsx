import ExperimentShell from '../components/ExperimentShell.jsx';
import {
  photoelectricGraphData,
  photoelectricReading,
  photoelectricResult,
  photoelectricValues
} from '../lib/physics.js';

export const photoelectricExperiment = {
  id: 'photoelectric',
  shortTitle: 'Photoelectric Effect',
  title: 'Photoelectric Effect',
  summary: 'Change incident frequency and intensity, observe electron emission, and estimate Planck\'s constant.',
  aim: 'To verify the photoelectric equation and determine Planck\'s constant from stopping potential versus frequency.',
  theory:
    'Photoelectrons are emitted only when photon energy hf exceeds the work function. Einstein\'s equation is eVs = hf - phi, so the slope of stopping potential versus frequency is h/e.',
  apparatus: ['Phototube', 'UV light source', 'Retarding supply', 'Microammeter'],
  formulas: ['eVs = hf - phi', 'f0 = phi / h', 'h = slope x e'],
  initialControls: {
    frequencyE14: 7.2,
    intensityPercent: 65,
    workFunctionEv: 2.1
  },
  controls: [
    { type: 'range', key: 'frequencyE14', label: 'Frequency', min: 3.5, max: 12, step: 0.05, unit: 'x10^14 Hz' },
    { type: 'range', key: 'intensityPercent', label: 'Intensity', min: 0, max: 100, step: 1, unit: 'percent', digits: 0 },
    { type: 'range', key: 'workFunctionEv', label: 'Work function', min: 1.6, max: 3.2, step: 0.02, unit: 'eV' }
  ],
  observationColumns: [
    { key: 'frequencyE14', label: 'f (x10^14 Hz)', digits: 2 },
    { key: 'intensityPercent', label: 'Intensity (%)', unit: 'percent', digits: 0 },
    { key: 'stoppingPotentialV', label: 'Vs (V)', unit: 'V', digits: 3 },
    { key: 'photoCurrentUa', label: 'Current (uA)', unit: 'uA', digits: 3 },
    { key: 'emission', label: 'State' }
  ],
  graphs: [
    {
      id: 'stopping-frequency',
      label: 'Vs vs f',
      xLabel: 'Frequency (x10^14 Hz)',
      yLabel: 'Stopping potential (V)',
      getData: ({ readings, controls }) => photoelectricGraphData(readings, controls)
    }
  ],
  compute: (controls) => {
    const values = photoelectricValues(controls);
    return {
      ...values,
      emission: values.kineticEnergyEv > 0
    };
  },
  makeReading: (controls, noisy) => photoelectricReading(controls, noisy),
  getResult: (readings) => photoelectricResult(readings),
  minimumReadings: 2,
  guide: [
    'Set a frequency above the threshold and start the simulation.',
    'Increase intensity to see photo-current increase without changing stopping potential much.',
    'Take readings at several frequencies above threshold.',
    'Plot stopping potential against frequency and calculate the slope.',
    'Use h = slope x e and calculate the percentage error.'
  ],
  viva: [
    'Why does intensity affect photo-current but not maximum kinetic energy?',
    'What is threshold frequency?',
    'How does the photoelectric effect support quantum theory?'
  ],
  improvements: [
    'Use only readings above threshold for slope calculation.',
    'Keep intensity constant when plotting stopping potential versus frequency.',
    'Take multiple readings close to threshold to reduce intercept error.'
  ],
  quiz: [
    {
      prompt: 'Stopping potential depends mainly on:',
      options: ['Frequency', 'Intensity', 'Lamp size'],
      answer: 'Frequency'
    },
    {
      prompt: 'Below threshold frequency:',
      options: ['No photoemission occurs', 'Current becomes infinite', 'Stopping potential doubles'],
      answer: 'No photoemission occurs'
    }
  ]
};

export default function PhotoelectricEffect() {
  return <ExperimentShell experiment={photoelectricExperiment} />;
}

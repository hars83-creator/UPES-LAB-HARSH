import ExperimentShell from '../components/ExperimentShell.jsx';
import { hallGraphData, hallReading, hallResult, hallVoltage } from '../lib/physics.js';

export const hallExperiment = {
  id: 'hall',
  shortTitle: 'Hall Effect',
  title: 'Hall Effect in a Semiconductor',
  summary: 'Vary magnetic field and current to measure Hall voltage and calculate carrier concentration.',
  aim: 'To determine the Hall coefficient and carrier concentration of a semiconductor sample.',
  theory:
    'A current-carrying semiconductor in a perpendicular magnetic field develops a transverse Hall voltage. VH = RH IB/t, where RH = 1/(ne).',
  apparatus: ['Hall probe', 'Electromagnet', 'Constant current supply', 'Millivoltmeter'],
  formulas: ['VH = RH I B / t', 'RH = VH t / IB', 'n = 1/(e RH)'],
  initialControls: {
    magneticFieldT: 0.42,
    currentMa: 10,
    thicknessMm: 1,
    carrierDensityE22: 8
  },
  controls: [
    { type: 'range', key: 'magneticFieldT', label: 'Magnetic field', min: 0.05, max: 0.8, step: 0.01, unit: 'T' },
    { type: 'range', key: 'currentMa', label: 'Current', min: 1, max: 20, step: 0.1, unit: 'mA' },
    { type: 'range', key: 'thicknessMm', label: 'Sample thickness', min: 0.4, max: 2, step: 0.05, unit: 'mm' },
    { type: 'range', key: 'carrierDensityE22', label: 'Actual n', min: 4, max: 14, step: 0.1, unit: 'x10^22/m3' }
  ],
  observationColumns: [
    { key: 'currentMa', label: 'I (mA)', unit: 'mA', digits: 2 },
    { key: 'magneticFieldT', label: 'B (T)', unit: 'T', digits: 3 },
    { key: 'thicknessMm', label: 't (mm)', unit: 'mm', digits: 2 },
    { key: 'hallMv', label: 'VH (mV)', unit: 'mV', digits: 4 },
    { key: 'carrierDensityE22', label: 'n (x10^22/m3)', digits: 3 }
  ],
  graphs: [
    {
      id: 'hall-current',
      label: 'VH vs I',
      xLabel: 'Current (mA)',
      yLabel: 'Hall voltage (mV)',
      getData: ({ controls }) => hallGraphData(controls, 'current')
    },
    {
      id: 'hall-field',
      label: 'VH vs B',
      xLabel: 'Magnetic field (T)',
      yLabel: 'Hall voltage (mV)',
      getData: ({ controls }) => hallGraphData(controls, 'field')
    }
  ],
  compute: (controls) => ({ hallMv: hallVoltage(controls) }),
  makeReading: (controls, noisy) => hallReading(controls, noisy),
  getResult: (readings, controls) => hallResult(readings, controls),
  minimumReadings: 1,
  guide: [
    'Set a moderate magnetic field and current before starting the simulation.',
    'Take a reading for Hall voltage at the chosen current.',
    'Keep B constant and vary current to verify the straight-line VH versus I relation.',
    'Switch graph mode and vary B at fixed current.',
    'Use RH to calculate carrier concentration and compare it with the sample value.'
  ],
  viva: [
    'Why is Hall voltage transverse to current?',
    'How can the sign of Hall voltage identify carrier type?',
    'Why is Hall voltage larger in semiconductors than in metals?'
  ],
  improvements: [
    'Reverse magnetic field polarity and average magnitudes to reduce contact offset.',
    'Keep current low enough to avoid heating the sample.',
    'Use several current and field values for a better Hall coefficient.'
  ],
  quiz: [
    {
      prompt: 'Hall voltage is directly proportional to:',
      options: ['Current and magnetic field', 'Thickness only', 'Temperature only'],
      answer: 'Current and magnetic field'
    },
    {
      prompt: 'Hall coefficient for one carrier type is:',
      options: ['1/(ne)', 'ne', 'n/e'],
      answer: '1/(ne)'
    }
  ]
};

export default function HallEffect() {
  return <ExperimentShell experiment={hallExperiment} />;
}

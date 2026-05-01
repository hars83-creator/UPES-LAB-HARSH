import ExperimentShell from '../components/ExperimentShell.jsx';
import { averageResult, sonometerFrequency, sonometerGraphData, sonometerReading } from '../lib/physics.js';
import { clamp } from '../lib/utils.js';

export const sonometerExperiment = {
  id: 'sonometer',
  shortTitle: 'Sonometer',
  title: 'Sonometer Frequency of AC Mains',
  summary: 'Tune length and tension of a stretched wire, observe resonance, and estimate the AC mains frequency.',
  aim: 'To determine the frequency of AC mains using a sonometer under resonance conditions.',
  theory:
    'A stretched string resonates when its natural frequency equals the driving frequency. For a string, f = n/(2L) sqrt(T/m), where L is vibrating length, T is tension, and m is linear density.',
  apparatus: ['Sonometer box', 'Electromagnet', 'Weight hanger', 'AC source'],
  formulas: ['f = n/(2L) sqrt(T/m)', 'resonance when f = mains frequency'],
  initialControls: {
    tensionN: 49,
    lengthCm: 72,
    linearDensityGm: 1.45,
    harmonic: 1
  },
  controls: [
    { type: 'range', key: 'tensionN', label: 'Tension', min: 15, max: 110, step: 1, unit: 'N', digits: 0 },
    { type: 'range', key: 'lengthCm', label: 'Vibrating length', min: 35, max: 100, step: 0.5, unit: 'cm' },
    { type: 'range', key: 'linearDensityGm', label: 'Linear density', min: 0.7, max: 2.5, step: 0.01, unit: 'g/m' },
    {
      type: 'select',
      key: 'harmonic',
      label: 'Mode',
      options: [
        { value: 1, label: 'Fundamental' },
        { value: 2, label: 'Second harmonic' }
      ]
    }
  ],
  observationColumns: [
    { key: 'tensionN', label: 'Tension (N)', unit: 'N', digits: 1 },
    { key: 'lengthCm', label: 'Length (cm)', unit: 'cm', digits: 1 },
    { key: 'linearDensityGm', label: 'm (g/m)', unit: 'g/m', digits: 2 },
    { key: 'frequencyHz', label: 'Frequency (Hz)', unit: 'Hz', digits: 2 },
    { key: 'resonance', label: 'State' }
  ],
  graphs: [
    {
      id: 'frequency-length',
      label: 'f vs L',
      xLabel: 'Length (cm)',
      yLabel: 'Frequency (Hz)',
      getData: ({ controls }) => sonometerGraphData(controls)
    }
  ],
  compute: (controls) => {
    const frequencyHz = sonometerFrequency(controls);
    return {
      frequencyHz,
      resonanceStrength: clamp(1 - Math.abs(frequencyHz - 50) / 18, 0, 1)
    };
  },
  makeReading: (controls, noisy) => sonometerReading(controls, noisy),
  getResult: (readings) => averageResult(readings, 'frequencyHz', 'AC mains frequency', 'Hz', 50),
  minimumReadings: 1,
  guide: [
    'Set the string length and tension so the calculated frequency approaches 50 Hz.',
    'Start the simulation and watch the wire amplitude increase near resonance.',
    'Press Take Reading at the sharpest vibration.',
    'Repeat for nearby lengths and average the resonant frequency.',
    'Compare the result with the standard AC mains frequency.'
  ],
  viva: [
    'Why does string frequency increase with tension?',
    'How does linear density affect resonance?',
    'Why is resonance sharper when damping is low?'
  ],
  improvements: [
    'Tune length slowly near resonance to avoid missing the peak amplitude.',
    'Take readings on both sides of the maximum and average them.',
    'Use a thin uniform wire for a clearer vibration loop.'
  ],
  quiz: [
    {
      prompt: 'For a fixed string, increasing tension makes frequency:',
      options: ['Increase', 'Decrease', 'Remain unchanged'],
      answer: 'Increase'
    },
    {
      prompt: 'At resonance, the sonometer wire has:',
      options: ['Maximum amplitude', 'Zero amplitude', 'Random amplitude'],
      answer: 'Maximum amplitude'
    }
  ]
};

export default function Sonometer() {
  return <ExperimentShell experiment={sonometerExperiment} />;
}

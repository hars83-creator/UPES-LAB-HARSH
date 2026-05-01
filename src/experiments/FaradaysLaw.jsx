import ExperimentShell from '../components/ExperimentShell.jsx';
import { faradayEmf, faradayGraphData, faradayReading, faradayResult } from '../lib/physics.js';

export const faradayExperiment = {
  id: 'faraday',
  shortTitle: "Faraday's Law",
  title: "Faraday's Law of Electromagnetic Induction",
  summary: 'Move a magnet through a coil and observe the induced EMF waveform produced by changing flux.',
  aim: 'To verify Faraday\'s law by studying induced EMF in a coil due to changing magnetic flux.',
  theory:
    'When magnetic flux linked with a coil changes, an EMF is induced. Faraday\'s law gives emf = -N d(phi)/dt, and the negative sign represents Lenz\'s law.',
  apparatus: ['Bar magnet', 'Copper coil', 'Galvanometer', 'Motion guide'],
  formulas: ['emf = -N d(phi)/dt', 'phi = B A cos(theta)', 'peak emf increases with speed'],
  initialControls: {
    speedMs: 0.8,
    turns: 180,
    magnetStrengthT: 0.45,
    coilRadiusCm: 4.8
  },
  controls: [
    { type: 'range', key: 'speedMs', label: 'Magnet speed', min: 0.1, max: 2, step: 0.05, unit: 'm/s' },
    { type: 'range', key: 'turns', label: 'Coil turns', min: 50, max: 500, step: 10, digits: 0 },
    { type: 'range', key: 'magnetStrengthT', label: 'Magnet strength', min: 0.1, max: 1, step: 0.02, unit: 'T' },
    { type: 'range', key: 'coilRadiusCm', label: 'Coil radius', min: 2, max: 8, step: 0.1, unit: 'cm' }
  ],
  observationColumns: [
    { key: 'speedMs', label: 'Speed (m/s)', unit: 'm/s', digits: 2 },
    { key: 'turns', label: 'Turns', digits: 0 },
    { key: 'magnetStrengthT', label: 'B (T)', unit: 'T', digits: 2 },
    { key: 'peakEmfV', label: 'Peak EMF (V)', unit: 'V', digits: 4 }
  ],
  graphs: [
    {
      id: 'emf-time',
      label: 'emf vs t',
      xLabel: 'Time offset (s)',
      yLabel: 'EMF (V)',
      getData: ({ controls, time }) => faradayGraphData(controls, time)
    }
  ],
  compute: (controls, time) => ({
    emfV: faradayEmf(controls, time),
    magnetX: (((time * controls.speedMs + 0.28) % 0.56) - 0.28) * 650
  }),
  makeReading: (controls, noisy) => faradayReading(controls, noisy),
  getResult: (readings, controls) => faradayResult(readings, controls),
  minimumReadings: 1,
  guide: [
    'Start with moderate speed and coil turns.',
    'Run the simulation and watch the galvanometer reverse direction.',
    'Take a reading for peak induced EMF.',
    'Increase magnet speed and observe the larger waveform amplitude.',
    'Explain the sign reversal using Lenz\'s law.'
  ],
  viva: [
    'Why is EMF zero when flux is not changing?',
    'What does the negative sign in Faraday\'s law mean?',
    'How does increasing the number of turns affect induced EMF?'
  ],
  improvements: [
    'Keep coil radius and turns fixed while studying speed dependence.',
    'Use repeated passes and average the peak readings.',
    'Move the magnet along the coil axis for maximum flux linkage.'
  ],
  quiz: [
    {
      prompt: 'Induced EMF depends on:',
      options: ['Rate of change of flux', 'Flux only', 'Resistance only'],
      answer: 'Rate of change of flux'
    },
    {
      prompt: 'Lenz\'s law describes the:',
      options: ['Direction of induced EMF', 'Mass of magnet', 'Area of wire only'],
      answer: 'Direction of induced EMF'
    }
  ]
};

export default function FaradaysLaw() {
  return <ExperimentShell experiment={faradayExperiment} />;
}

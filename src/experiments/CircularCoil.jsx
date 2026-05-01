import ExperimentShell from '../components/ExperimentShell.jsx';
import {
  circularCoilGraphData,
  circularCoilReading,
  circularCoilResult
} from '../lib/physics.js';

export const circularCoilExperiment = {
  id: 'coil',
  shortTitle: 'Circular Coil',
  title: 'Magnetic Field of a Circular Coil',
  summary: 'Move a compass along the axis of a current-carrying circular coil and observe magnetic field variation.',
  aim: 'To study the variation of magnetic field along the axis of a circular coil.',
  theory:
    'The axial field of a circular coil is B = mu0 N I R^2 / [2(R^2 + x^2)^(3/2)]. At the center it becomes mu0 N I / 2R.',
  apparatus: ['Circular coil', 'Compass box', 'Ammeter', 'DC power supply'],
  formulas: ['B = mu0 N I R^2 / 2(R^2 + x^2)^(3/2)', 'tan(theta) = B / BH'],
  initialControls: {
    currentA: 1.5,
    distanceCm: 0,
    turns: 100,
    radiusCm: 10
  },
  controls: [
    { type: 'range', key: 'currentA', label: 'Current', min: 0.2, max: 5, step: 0.05, unit: 'A' },
    { type: 'range', key: 'distanceCm', label: 'Compass distance', min: -18, max: 18, step: 0.5, unit: 'cm' },
    { type: 'range', key: 'turns', label: 'Number of turns', min: 40, max: 220, step: 5, digits: 0 },
    { type: 'range', key: 'radiusCm', label: 'Coil radius', min: 5, max: 16, step: 0.2, unit: 'cm' }
  ],
  observationColumns: [
    { key: 'currentA', label: 'I (A)', unit: 'A', digits: 2 },
    { key: 'distanceCm', label: 'x (cm)', unit: 'cm', digits: 1 },
    { key: 'turns', label: 'N', digits: 0 },
    { key: 'fieldMt', label: 'B (mT)', unit: 'mT', digits: 4 },
    { key: 'deflectionDeg', label: 'theta (deg)', unit: 'deg', digits: 2 }
  ],
  graphs: [
    {
      id: 'b-distance',
      label: 'B vs x',
      xLabel: 'Distance from center (cm)',
      yLabel: 'Magnetic field (mT)',
      getData: ({ controls }) => circularCoilGraphData(controls)
    }
  ],
  compute: (controls) => circularCoilReading(controls, false),
  makeReading: (controls, noisy) => circularCoilReading(controls, noisy),
  getResult: (readings, controls) => circularCoilResult(readings, controls),
  minimumReadings: 1,
  allowLiveResult: true,
  guide: [
    'Set the coil radius, turns, and current.',
    'Move the compass to the center and observe maximum deflection.',
    'Take a reading, then move the compass symmetrically on both sides.',
    'Plot B versus x and verify that field reduces away from the center.',
    'Use the central reading to compare with the theoretical field.'
  ],
  viva: [
    'Why is the field maximum at the center of the coil?',
    'What is the role of the number of turns?',
    'Why does compass deflection follow the tangent law?'
  ],
  improvements: [
    'Keep the coil plane vertical and aligned with magnetic meridian.',
    'Take readings at equal positive and negative distances.',
    'Avoid high current for long periods to reduce heating.'
  ],
  quiz: [
    {
      prompt: 'At the center of a circular coil, magnetic field is proportional to:',
      options: ['Current', '1/current', 'Distance squared'],
      answer: 'Current'
    },
    {
      prompt: 'Moving away from the coil center makes B:',
      options: ['Decrease', 'Increase indefinitely', 'Stay constant'],
      answer: 'Decrease'
    }
  ]
};

export default function CircularCoil() {
  return <ExperimentShell experiment={circularCoilExperiment} />;
}

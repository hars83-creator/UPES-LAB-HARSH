import ExperimentShell from '../components/ExperimentShell.jsx';
import { opticalGraphData, opticalReading, opticalResult, opticalValues } from '../lib/physics.js';

export const opticalFiberExperiment = {
  id: 'fiber',
  shortTitle: 'Optical Fiber',
  title: 'Optical Fiber Numerical Aperture',
  summary: 'Visualize total internal reflection, numerical aperture, acceptance angle, and bending losses.',
  aim: 'To determine the numerical aperture and acceptance angle of an optical fiber.',
  theory:
    'Light remains guided in a fiber by total internal reflection at the core-cladding boundary. Numerical aperture is NA = sqrt(n1^2 - n2^2), assuming air outside the fiber.',
  apparatus: ['Optical fiber', 'Laser source', 'Index-matching setup', 'Power meter'],
  formulas: ['NA = sqrt(n1^2 - n2^2)', 'theta_a = sin^-1(NA)', 'loss rises at small bend radius'],
  initialControls: {
    coreIndex: 1.5,
    claddingIndex: 1.46,
    incidentAngleDeg: 18,
    bendRadiusCm: 5
  },
  controls: [
    { type: 'range', key: 'coreIndex', label: 'Core refractive index n1', min: 1.45, max: 1.56, step: 0.001, digits: 3 },
    { type: 'range', key: 'claddingIndex', label: 'Cladding index n2', min: 1.4, max: 1.52, step: 0.001, digits: 3 },
    { type: 'range', key: 'incidentAngleDeg', label: 'Incident angle', min: 0, max: 55, step: 0.5, unit: 'deg' },
    { type: 'range', key: 'bendRadiusCm', label: 'Bend radius', min: 1.2, max: 8, step: 0.1, unit: 'cm' }
  ],
  observationColumns: [
    { key: 'coreIndex', label: 'n1', digits: 3 },
    { key: 'claddingIndex', label: 'n2', digits: 3 },
    { key: 'bendRadiusCm', label: 'Bend (cm)', unit: 'cm', digits: 1 },
    { key: 'numericalAperture', label: 'NA', digits: 4 },
    { key: 'lossPercent', label: 'Loss (%)', unit: 'percent', digits: 2 }
  ],
  graphs: [
    {
      id: 'loss-bend',
      label: 'Loss vs bend',
      xLabel: 'Bend radius (cm)',
      yLabel: 'Loss (percent)',
      getData: ({ controls }) => opticalGraphData(controls)
    }
  ],
  compute: (controls) => opticalValues(controls),
  makeReading: (controls, noisy) => opticalReading(controls, noisy),
  getResult: (readings, controls) => opticalResult(readings, controls),
  minimumReadings: 1,
  allowLiveResult: true,
  guide: [
    'Set core and cladding refractive indices with n1 greater than n2.',
    'Adjust the incident angle and watch whether the ray remains guided.',
    'Reduce bend radius to observe bending loss.',
    'Take readings for NA, acceptance angle, and loss.',
    'Compare measured NA with the theoretical value.'
  ],
  viva: [
    'What condition is needed for total internal reflection?',
    'Why must n1 be greater than n2?',
    'What causes bending loss in an optical fiber?'
  ],
  improvements: [
    'Keep the fiber end clean and aligned with the light source.',
    'Avoid very sharp bends when measuring NA.',
    'Use multiple angular readings near the acceptance cone.'
  ],
  quiz: [
    {
      prompt: 'Numerical aperture measures:',
      options: ['Light gathering ability', 'Electrical resistance', 'Mass density'],
      answer: 'Light gathering ability'
    },
    {
      prompt: 'Guiding requires:',
      options: ['n1 greater than n2', 'n1 equal to n2', 'n1 less than n2 always'],
      answer: 'n1 greater than n2'
    }
  ]
};

export default function OpticalFiber() {
  return <ExperimentShell experiment={opticalFiberExperiment} />;
}

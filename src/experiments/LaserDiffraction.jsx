import ExperimentShell from '../components/ExperimentShell.jsx';
import { fringeWidthMm, laserGraphData, laserReading, laserResult } from '../lib/physics.js';

export const laserDiffractionExperiment = {
  id: 'diffraction',
  shortTitle: 'Laser Diffraction',
  title: 'Laser Diffraction by a Thin Wire',
  summary: 'Observe a diffraction pattern, measure fringe width, and calculate wire diameter using Babinet behavior.',
  aim: 'To determine the diameter of a thin wire from its laser diffraction pattern.',
  theory:
    'A thin wire produces a diffraction pattern similar to a slit of the same width. The fringe width beta is related to wire diameter d by beta = lambda D / d.',
  apparatus: ['Laser source', 'Thin wire', 'Screen', 'Micrometer scale'],
  formulas: ['beta = lambda D / d', 'd = lambda D / beta'],
  initialControls: {
    wavelengthNm: 632.8,
    screenDistanceM: 1.4,
    wireDiameterUm: 145
  },
  controls: [
    { type: 'range', key: 'wavelengthNm', label: 'Laser wavelength', min: 450, max: 700, step: 0.1, unit: 'nm' },
    { type: 'range', key: 'screenDistanceM', label: 'Screen distance', min: 0.5, max: 2.5, step: 0.01, unit: 'm' },
    { type: 'range', key: 'wireDiameterUm', label: 'Actual wire diameter', min: 50, max: 250, step: 1, unit: 'um', digits: 0 }
  ],
  observationColumns: [
    { key: 'wavelengthNm', label: 'lambda (nm)', unit: 'nm', digits: 1 },
    { key: 'screenDistanceM', label: 'D (m)', unit: 'm', digits: 2 },
    { key: 'fringeWidthMm', label: 'beta (mm)', unit: 'mm', digits: 3 },
    { key: 'wireDiameterUm', label: 'd (um)', unit: 'um', digits: 2 }
  ],
  graphs: [
    {
      id: 'intensity-position',
      label: 'I vs y',
      xLabel: 'Screen position (mm)',
      yLabel: 'Relative intensity',
      getData: ({ controls }) => laserGraphData(controls)
    }
  ],
  compute: (controls) => ({ fringeWidthMm: fringeWidthMm(controls) }),
  makeReading: (controls, noisy) => laserReading(controls, noisy),
  getResult: (readings, controls) => laserResult(readings, controls),
  minimumReadings: 1,
  allowLiveResult: true,
  guide: [
    'Set the laser wavelength and screen distance.',
    'Adjust the wire diameter and observe the spacing of the fringes.',
    'Take a reading for fringe width beta.',
    'Use d = lambda D / beta to calculate wire diameter.',
    'Compare the calculated diameter with the micrometer value.'
  ],
  viva: [
    'Why does a wire show a slit-like diffraction pattern?',
    'What happens to fringe width when screen distance increases?',
    'Why should the wire be thin and straight?'
  ],
  improvements: [
    'Measure across several fringes and divide to reduce reading error.',
    'Keep the laser beam perpendicular to the wire.',
    'Darken the background to identify weak side fringes.'
  ],
  quiz: [
    {
      prompt: 'Increasing screen distance D makes fringe width:',
      options: ['Increase', 'Decrease', 'Become zero'],
      answer: 'Increase'
    },
    {
      prompt: 'Wire diameter is inversely proportional to:',
      options: ['Fringe width beta', 'Wavelength', 'Screen distance'],
      answer: 'Fringe width beta'
    }
  ]
};

export default function LaserDiffraction() {
  return <ExperimentShell experiment={laserDiffractionExperiment} />;
}

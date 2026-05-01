import ExperimentShell from '../components/ExperimentShell.jsx';
import { solarCurve, solarReading, solarResult } from '../lib/physics.js';

export const solarCellExperiment = {
  id: 'solar',
  shortTitle: 'Solar Cell',
  title: 'Solar Cell Characteristics',
  summary: 'Adjust illumination and load resistance to plot V-I and power curves and locate the maximum power point.',
  aim: 'To study the V-I characteristics of a solar cell and determine its maximum power point.',
  theory:
    'A solar cell converts light energy into electrical energy. Its current depends strongly on illumination, while output power P = VI has a maximum at an optimal load.',
  apparatus: ['Solar cell module', 'Lamp', 'Variable load', 'Voltmeter and ammeter'],
  formulas: ['P = V I', 'fill factor = Pmax / (Voc Isc)', 'MPP occurs at maximum V I'],
  initialControls: {
    intensityWm2: 800,
    temperatureC: 30,
    loadOhm: 24
  },
  controls: [
    { type: 'range', key: 'intensityWm2', label: 'Light intensity', min: 150, max: 1000, step: 10, unit: 'W/m2', digits: 0 },
    { type: 'range', key: 'temperatureC', label: 'Cell temperature', min: 15, max: 65, step: 1, unit: 'C', digits: 0 },
    { type: 'range', key: 'loadOhm', label: 'Load resistance', min: 1, max: 200, step: 1, unit: 'Ohm', digits: 0 }
  ],
  observationColumns: [
    { key: 'intensityWm2', label: 'G (W/m2)', unit: 'W/m2', digits: 0 },
    { key: 'loadOhm', label: 'Load (Ohm)', unit: 'Ohm', digits: 0 },
    { key: 'voltageV', label: 'V (V)', unit: 'V', digits: 3 },
    { key: 'currentMa', label: 'I (mA)', unit: 'mA', digits: 3 },
    { key: 'powerMw', label: 'P (mW)', unit: 'mW', digits: 3 }
  ],
  graphs: [
    {
      id: 'solar-vi',
      label: 'V-I',
      xLabel: 'Voltage (V)',
      yLabel: 'Current (mA)',
      getData: ({ controls }) => solarCurve(controls).data.map(({ x, Current }) => ({ x, Current }))
    },
    {
      id: 'solar-power',
      label: 'Power',
      xLabel: 'Voltage (V)',
      yLabel: 'Power (mW)',
      getData: ({ controls }) => solarCurve(controls).data.map(({ x, Power }) => ({ x, Power }))
    }
  ],
  compute: (controls) => {
    const curve = solarCurve(controls);
    return {
      mpp: curve.mpp,
      operatingPowerMw: curve.operating.Power,
      operatingVoltageV: curve.operating.x,
      operatingCurrentMa: curve.operating.Current
    };
  },
  makeReading: (controls, noisy) => solarReading(controls, noisy),
  getResult: (readings, controls) => solarResult(readings, controls),
  minimumReadings: 1,
  allowLiveResult: true,
  guide: [
    'Set the illumination intensity and temperature.',
    'Vary load resistance and observe the operating point on the V-I curve.',
    'Take readings across low, medium, and high resistance values.',
    'Switch to the power graph and identify the maximum power point.',
    'Calculate fill factor using Voc, Isc, and Pmax.'
  ],
  viva: [
    'Why does short-circuit current rise with light intensity?',
    'What is the maximum power point?',
    'How does temperature affect open-circuit voltage?'
  ],
  improvements: [
    'Keep the lamp distance fixed while taking one full characteristic curve.',
    'Avoid shading any part of the solar cell.',
    'Allow temperature to stabilize before recording readings.'
  ],
  quiz: [
    {
      prompt: 'Solar cell output power is:',
      options: ['V multiplied by I', 'V divided by I', 'I divided by V'],
      answer: 'V multiplied by I'
    },
    {
      prompt: 'MPP is the point where:',
      options: ['Power is maximum', 'Voltage is zero', 'Current is zero only'],
      answer: 'Power is maximum'
    }
  ]
};

export default function SolarCell() {
  return <ExperimentShell experiment={solarCellExperiment} />;
}

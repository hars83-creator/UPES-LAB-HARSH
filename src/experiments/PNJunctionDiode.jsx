import ExperimentShell from '../components/ExperimentShell.jsx';
import { diodeGraphData, diodeReading, diodeResult } from '../lib/physics.js';

export const pnJunctionExperiment = {
  id: 'diode',
  shortTitle: 'PN Junction Diode',
  title: 'PN Junction Diode Characteristics',
  summary: 'Sweep forward and reverse bias, observe current response, and identify cut-in and breakdown regions.',
  aim: 'To study the forward and reverse bias V-I characteristics of a PN junction diode.',
  theory:
    'In forward bias, diode current rises exponentially after the cut-in voltage. In reverse bias, only a small leakage current flows until breakdown voltage is reached.',
  apparatus: ['PN diode', 'DC supply', 'Series resistor', 'Voltmeter and ammeter'],
  formulas: ['I = Is (exp(V/nVT) - 1)', 'VT = kT/e', 'dynamic resistance = dV/dI'],
  initialControls: {
    biasV: 0.62,
    temperatureC: 27,
    diodeType: 'silicon',
    currentLimitMa: 35
  },
  controls: [
    { type: 'range', key: 'biasV', label: 'Bias voltage', min: -8, max: 1, step: 0.01, unit: 'V' },
    { type: 'range', key: 'temperatureC', label: 'Temperature', min: 15, max: 80, step: 1, unit: 'C', digits: 0 },
    {
      type: 'select',
      key: 'diodeType',
      label: 'Diode material',
      options: [
        { value: 'silicon', label: 'Silicon' },
        { value: 'germanium', label: 'Germanium' }
      ]
    },
    { type: 'range', key: 'currentLimitMa', label: 'Current limit', min: 5, max: 60, step: 1, unit: 'mA', digits: 0 }
  ],
  observationColumns: [
    { key: 'biasV', label: 'V (V)', unit: 'V', digits: 3 },
    { key: 'diodeType', label: 'Type' },
    { key: 'currentMa', label: 'I (mA)', unit: 'mA', digits: 4 },
    { key: 'region', label: 'Region' }
  ],
  graphs: [
    {
      id: 'diode-iv',
      label: 'I-V',
      xLabel: 'Voltage (V)',
      yLabel: 'Current (mA)',
      getData: ({ controls }) => diodeGraphData(controls)
    }
  ],
  compute: (controls) => diodeReading(controls, false),
  makeReading: (controls, noisy) => diodeReading(controls, noisy),
  getResult: (readings, controls) => diodeResult(readings, controls),
  minimumReadings: 1,
  allowLiveResult: true,
  guide: [
    'Start with small forward bias and gradually increase voltage.',
    'Take readings below and above the cut-in region.',
    'Move into reverse bias and observe leakage current.',
    'Increase reverse voltage to see breakdown behavior.',
    'Use the graph to estimate cut-in voltage and discuss diode material differences.'
  ],
  viva: [
    'Why does forward current rise rapidly after cut-in voltage?',
    'What is reverse breakdown?',
    'Why is germanium cut-in voltage lower than silicon?'
  ],
  improvements: [
    'Use current limiting to avoid damaging the diode.',
    'Take closely spaced readings near cut-in voltage.',
    'Do not keep the diode in breakdown for long in real hardware.'
  ],
  quiz: [
    {
      prompt: 'A silicon diode typically starts conducting near:',
      options: ['0.7 V', '7 V', '0 V always'],
      answer: '0.7 V'
    },
    {
      prompt: 'Reverse breakdown occurs at:',
      options: ['High reverse voltage', 'Low forward voltage', 'Zero resistance only'],
      answer: 'High reverse voltage'
    }
  ]
};

export default function PNJunctionDiode() {
  return <ExperimentShell experiment={pnJunctionExperiment} />;
}

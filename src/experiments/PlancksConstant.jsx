import ExperimentShell from '../components/ExperimentShell.jsx';
import { LEDS, planckGraphData, planckReading, planckResult } from '../lib/physics.js';
import { clamp } from '../lib/utils.js';

const ledOptions = Object.entries(LEDS).map(([value, led]) => ({ value, label: `${led.label} (${led.wavelengthNm} nm)` }));

export const planckExperiment = {
  id: 'planck',
  shortTitle: "Planck's Constant",
  title: "Planck's Constant using LEDs",
  summary: "Use LED threshold voltages to plot V0 against 1/lambda and estimate Planck's constant from the slope.",
  aim: "To determine Planck's constant by measuring the threshold voltage of LEDs of different wavelengths.",
  theory:
    'An LED begins to glow when the electrical energy eV0 is approximately equal to the photon energy hc/lambda. A plot of V0 versus 1/lambda gives a slope equal to hc/e.',
  apparatus: ['LED array', 'Variable DC supply', 'Digital voltmeter', 'Series resistor'],
  formulas: ['eV0 = hc/lambda', 'slope = hc/e', 'h = slope x e / c'],
  initialControls: {
    ledColor: 'red',
    voltage: 1.85
  },
  controls: [
    { type: 'select', key: 'ledColor', label: 'LED color', options: ledOptions },
    { type: 'range', key: 'voltage', label: 'Applied voltage', min: 0, max: 4, step: 0.01, unit: 'V' }
  ],
  observationColumns: [
    { key: 'color', label: 'LED' },
    { key: 'wavelengthNm', label: 'lambda (nm)', unit: 'nm', digits: 0 },
    { key: 'inverseLambda', label: '1/lambda (10^6/m)', digits: 3 },
    { key: 'thresholdV', label: 'V0 (V)', unit: 'V', digits: 3 },
    { key: 'status', label: 'Observation' }
  ],
  graphs: [
    {
      id: 'planck-graph',
      label: 'V0 vs 1/lambda',
      xLabel: '1/lambda (10^6 per m)',
      yLabel: 'Threshold voltage (V)',
      getData: ({ readings }) => planckGraphData(readings)
    }
  ],
  compute: (controls) => {
    const reading = planckReading(controls, false);
    const led = LEDS[controls.ledColor];
    return {
      ...reading,
      led,
      glow: clamp((controls.voltage - reading.thresholdV + 0.08) / 0.55, 0, 1)
    };
  },
  makeReading: (controls, noisy) => planckReading(controls, noisy),
  getResult: (readings) => planckResult(readings),
  minimumReadings: 2,
  guide: [
    'Select a red LED and slowly increase the voltage until the LED just starts glowing.',
    'Press Take Reading to capture the threshold voltage with small instrument noise.',
    'Repeat the process for amber, green, blue, and violet LEDs.',
    'Check the V0 versus 1/lambda graph and use the slope to calculate Planck\'s constant.',
    'Compare the calculated value with the accepted value and report the percentage error.'
  ],
  viva: [
    'Why does an LED have a threshold voltage?',
    'Why is 1/lambda used on the x-axis instead of lambda?',
    'What causes the measured value of Planck\'s constant to differ from the accepted value?'
  ],
  improvements: [
    'Take readings when the glow is just visible, not when the LED is bright.',
    'Use multiple colors to improve the slope fit.',
    'Avoid overheating the LED because temperature changes the forward voltage.'
  ],
  quiz: [
    {
      prompt: 'The slope of V0 versus 1/lambda is equal to:',
      options: ['hc/e', 'e/hc', 'h/eV'],
      answer: 'hc/e'
    },
    {
      prompt: 'A shorter wavelength LED generally needs:',
      options: ['Higher threshold voltage', 'Lower threshold voltage', 'No threshold voltage'],
      answer: 'Higher threshold voltage'
    }
  ]
};

export default function PlancksConstant() {
  return <ExperimentShell experiment={planckExperiment} />;
}

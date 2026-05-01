import { clamp, linearRegression, randomNoise, range, safeAverage } from './utils.js';

export const PHYSICS = {
  h: 6.62607015e-34,
  c: 299792458,
  e: 1.602176634e-19,
  mu0: 4 * Math.PI * 1e-7,
  k: 1.380649e-23
};

export const LEDS = {
  red: { label: 'Red', wavelengthNm: 650, color: '#ef4444' },
  amber: { label: 'Amber', wavelengthNm: 590, color: '#f59e0b' },
  green: { label: 'Green', wavelengthNm: 525, color: '#22c55e' },
  blue: { label: 'Blue', wavelengthNm: 470, color: '#3b82f6' },
  violet: { label: 'Violet', wavelengthNm: 405, color: '#8b5cf6' }
};

export function planckThreshold(wavelengthNm) {
  return (PHYSICS.h * PHYSICS.c) / (PHYSICS.e * wavelengthNm * 1e-9);
}

export function planckReading(controls, noisy = false) {
  const led = LEDS[controls.ledColor];
  const threshold = planckThreshold(led.wavelengthNm);
  const measured = threshold + (noisy ? randomNoise(0.035) : 0);
  const x = 1 / (led.wavelengthNm * 1e-9);
  return {
    color: led.label,
    wavelengthNm: led.wavelengthNm,
    inverseLambda: x / 1e6,
    thresholdV: measured,
    status: controls.voltage >= measured ? 'Visible glow' : 'Below threshold'
  };
}

export function planckResult(readings) {
  const usable = readings.map((reading) => ({
    x: 1 / (reading.wavelengthNm * 1e-9),
    y: reading.thresholdV
  }));
  const regression = linearRegression(usable);
  const value = regression.slope * PHYSICS.e / PHYSICS.c;

  return {
    label: "Planck's constant",
    value,
    unit: 'J s',
    reference: PHYSICS.h,
    details: [
      `Slope = ${regression.slope.toExponential(3)} V m`,
      `R squared = ${regression.r2.toFixed(3)}`
    ]
  };
}

export function planckGraphData(readings) {
  const source = readings.length
    ? readings
    : Object.values(LEDS).map((led) => ({
        color: led.label,
        wavelengthNm: led.wavelengthNm,
        thresholdV: planckThreshold(led.wavelengthNm)
      }));

  return source
    .map((reading) => ({
      x: Number((1 / (reading.wavelengthNm * 1e-9) / 1e6).toFixed(3)),
      'V0': Number(reading.thresholdV.toFixed(3))
    }))
    .sort((a, b) => a.x - b.x);
}

export function sonometerFrequency(controls) {
  const lengthM = controls.lengthCm / 100;
  const linearDensity = controls.linearDensityGm / 1000;
  return (controls.harmonic / (2 * lengthM)) * Math.sqrt(controls.tensionN / linearDensity);
}

export function sonometerReading(controls, noisy = false) {
  const frequency = sonometerFrequency(controls);
  return {
    tensionN: controls.tensionN,
    lengthCm: controls.lengthCm,
    linearDensityGm: controls.linearDensityGm,
    harmonic: controls.harmonic,
    frequencyHz: frequency + (noisy ? randomNoise(0.22) : 0),
    resonance: Math.abs(frequency - 50) < 1.5 ? 'Sharp resonance' : 'Tuning'
  };
}

export function sonometerGraphData(controls) {
  return range(35, 100, 42).map((lengthCm) => {
    const frequency = sonometerFrequency({ ...controls, lengthCm });
    return {
      x: Number(lengthCm.toFixed(1)),
      Frequency: Number(frequency.toFixed(2)),
      Mains: 50
    };
  });
}

export function averageResult(readings, key, label, unit, reference, detailLabel = 'Average') {
  const value = safeAverage(readings.map((reading) => reading[key]));
  return {
    label,
    value,
    unit,
    reference,
    details: [`${detailLabel} from ${readings.length || 0} readings`]
  };
}

export function hallVoltage(controls) {
  const currentA = controls.currentMa * 1e-3;
  const carrierDensity = controls.carrierDensityE22 * 1e22;
  const thicknessM = controls.thicknessMm * 1e-3;
  const voltage = (currentA * controls.magneticFieldT) / (carrierDensity * PHYSICS.e * thicknessM);
  return voltage * 1000;
}

export function hallReading(controls, noisy = false) {
  const hallMv = hallVoltage(controls) + (noisy ? randomNoise(0.012) : 0);
  const currentA = controls.currentMa * 1e-3;
  const thicknessM = controls.thicknessMm * 1e-3;
  const magneticField = Math.max(controls.magneticFieldT, 0.001);
  const hallCoefficient = (hallMv / 1000) * thicknessM / (currentA * magneticField);
  const carrierDensity = 1 / (PHYSICS.e * hallCoefficient);
  return {
    currentMa: controls.currentMa,
    magneticFieldT: controls.magneticFieldT,
    thicknessMm: controls.thicknessMm,
    hallMv,
    carrierDensityE22: carrierDensity / 1e22
  };
}

export function hallResult(readings, controls) {
  const value = safeAverage(readings.map((reading) => reading.carrierDensityE22)) * 1e22;
  return {
    label: 'Carrier concentration',
    value,
    unit: 'per m3',
    reference: controls.carrierDensityE22 * 1e22,
    details: ['n = 1 / (e RH)', 'RH = VH t / IB']
  };
}

export function hallGraphData(controls, mode) {
  if (mode === 'field') {
    return range(0.05, 0.8, 36).map((magneticFieldT) => ({
      x: Number(magneticFieldT.toFixed(3)),
      'Hall voltage': Number(hallVoltage({ ...controls, magneticFieldT }).toFixed(4))
    }));
  }

  return range(1, 20, 36).map((currentMa) => ({
    x: Number(currentMa.toFixed(2)),
    'Hall voltage': Number(hallVoltage({ ...controls, currentMa }).toFixed(4))
  }));
}

export function circularCoilField(controls, distanceCm = controls.distanceCm) {
  const radiusM = controls.radiusCm / 100;
  const xM = distanceCm / 100;
  const numerator = PHYSICS.mu0 * controls.turns * controls.currentA * radiusM ** 2;
  const denominator = 2 * (radiusM ** 2 + xM ** 2) ** 1.5;
  return numerator / denominator;
}

export function circularCoilReading(controls, noisy = false) {
  const fieldT = circularCoilField(controls) * (1 + (noisy ? randomNoise(0.015) : 0));
  const horizontalField = 3.6e-5;
  return {
    currentA: controls.currentA,
    distanceCm: controls.distanceCm,
    turns: controls.turns,
    fieldMt: fieldT * 1000,
    deflectionDeg: Math.atan(fieldT / horizontalField) * (180 / Math.PI)
  };
}

export function circularCoilGraphData(controls) {
  return range(-20, 20, 70).map((distanceCm) => ({
    x: Number(distanceCm.toFixed(2)),
    'B field': Number((circularCoilField(controls, distanceCm) * 1000).toFixed(4))
  }));
}

export function circularCoilResult(readings, controls) {
  const measuredCenter = readings.filter((reading) => Math.abs(reading.distanceCm) <= 1);
  const fallback = circularCoilReading({ ...controls, distanceCm: 0 });
  const valueMt = measuredCenter.length
    ? safeAverage(measuredCenter.map((reading) => reading.fieldMt))
    : fallback.fieldMt;
  return {
    label: 'Magnetic field at center',
    value: valueMt,
    unit: 'mT',
    reference: circularCoilField({ ...controls, distanceCm: 0 }) * 1000,
    details: ['B = mu0 N I / 2R at x = 0']
  };
}

export function faradayEmf(controls, time) {
  const area = Math.PI * (controls.coilRadiusCm / 100) ** 2;
  const sigma = 0.075;
  const phase = ((time * controls.speedMs + 0.28) % 0.56) - 0.28;
  const flux = controls.turns * controls.magnetStrengthT * area * Math.exp(-(phase ** 2) / (2 * sigma ** 2));
  const dFluxDx = flux * (-phase / sigma ** 2);
  return -dFluxDx * controls.speedMs;
}

export function faradayReading(controls, noisy = false) {
  const samples = range(0, 1.6, 100).map((time) => Math.abs(faradayEmf(controls, time)));
  const peak = Math.max(...samples) + (noisy ? randomNoise(0.025) : 0);
  return {
    speedMs: controls.speedMs,
    turns: controls.turns,
    magnetStrengthT: controls.magnetStrengthT,
    peakEmfV: Math.max(0, peak)
  };
}

export function faradayGraphData(controls, time = 0) {
  return range(0, 2.4, 120).map((offset) => {
    const t = time + offset;
    return {
      x: Number(offset.toFixed(2)),
      EMF: Number(faradayEmf(controls, t).toFixed(4))
    };
  });
}

export function faradayResult(readings, controls) {
  const theoretical = faradayReading(controls).peakEmfV;
  return {
    label: 'Peak induced EMF',
    value: safeAverage(readings.map((reading) => reading.peakEmfV)),
    unit: 'V',
    reference: theoretical,
    details: ['Peak EMF rises with turns, field strength, area, and magnet speed']
  };
}

export function opticalValues(controls) {
  const n1 = Math.max(controls.coreIndex, controls.claddingIndex + 0.005);
  const n2 = Math.min(controls.claddingIndex, n1 - 0.005);
  const na = Math.sqrt(Math.max(n1 ** 2 - n2 ** 2, 0));
  const acceptanceDeg = Math.asin(clamp(na, 0, 0.99)) * (180 / Math.PI);
  const criticalDeg = Math.asin(n2 / n1) * (180 / Math.PI);
  const bendCriticalCm = 2.8 + (na < 0.25 ? 1.7 : 0.7);
  const bendLoss = Math.max(0, ((bendCriticalCm - controls.bendRadiusCm) / bendCriticalCm) ** 2) * 28;
  const angleLoss = Math.max(0, controls.incidentAngleDeg - acceptanceDeg) * 2.2;
  return {
    n1,
    n2,
    numericalAperture: na,
    acceptanceDeg,
    criticalDeg,
    lossPercent: clamp(bendLoss + angleLoss, 0, 100),
    guided: controls.incidentAngleDeg <= acceptanceDeg
  };
}

export function opticalReading(controls, noisy = false) {
  const values = opticalValues(controls);
  return {
    coreIndex: values.n1,
    claddingIndex: values.n2,
    bendRadiusCm: controls.bendRadiusCm,
    numericalAperture: values.numericalAperture + (noisy ? randomNoise(0.006) : 0),
    acceptanceDeg: values.acceptanceDeg + (noisy ? randomNoise(0.25) : 0),
    lossPercent: values.lossPercent + (noisy ? randomNoise(0.8) : 0)
  };
}

export function opticalGraphData(controls) {
  return range(1.2, 8, 45).map((bendRadiusCm) => ({
    x: Number(bendRadiusCm.toFixed(2)),
    Loss: Number(opticalValues({ ...controls, bendRadiusCm }).lossPercent.toFixed(2))
  }));
}

export function opticalResult(readings, controls) {
  const actual = opticalValues(controls).numericalAperture;
  return {
    label: 'Numerical aperture',
    value: safeAverage(readings.map((reading) => reading.numericalAperture)) || actual,
    unit: '',
    reference: actual,
    details: ['NA = sqrt(n1^2 - n2^2)']
  };
}

export function fringeWidthMm(controls) {
  const lambda = controls.wavelengthNm * 1e-9;
  const distance = controls.screenDistanceM;
  const diameter = controls.wireDiameterUm * 1e-6;
  return (lambda * distance * 1000) / diameter;
}

export function laserReading(controls, noisy = false) {
  const beta = fringeWidthMm(controls) * (1 + (noisy ? randomNoise(0.012) : 0));
  const diameterUm = (controls.wavelengthNm * 1e-9 * controls.screenDistanceM * 1e6) / (beta / 1000);
  return {
    wavelengthNm: controls.wavelengthNm,
    screenDistanceM: controls.screenDistanceM,
    fringeWidthMm: beta,
    wireDiameterUm: diameterUm
  };
}

export function laserGraphData(controls) {
  return range(-8, 8, 160).map((positionMm) => {
    const lambda = controls.wavelengthNm * 1e-9;
    const d = controls.wireDiameterUm * 1e-6;
    const distance = controls.screenDistanceM;
    const alpha = (Math.PI * d * (positionMm / 1000)) / (lambda * distance);
    const sinc = Math.abs(alpha) < 0.0001 ? 1 : Math.sin(alpha) / alpha;
    return {
      x: Number(positionMm.toFixed(2)),
      Intensity: Number((sinc ** 2).toFixed(4))
    };
  });
}

export function laserResult(readings, controls) {
  return {
    label: 'Wire diameter',
    value: safeAverage(readings.map((reading) => reading.wireDiameterUm)) || controls.wireDiameterUm,
    unit: 'um',
    reference: controls.wireDiameterUm,
    details: ['d = lambda D / beta']
  };
}

export function solarCurve(controls) {
  const intensityRatio = controls.intensityWm2 / 1000;
  const tempShift = controls.temperatureC - 25;
  const isc = 0.038 * intensityRatio * (1 - 0.0006 * tempShift);
  const voc = clamp(0.62 + 0.055 * Math.log(Math.max(intensityRatio, 0.08)) - 0.0021 * tempShift, 0.2, 0.75);
  const data = range(0, voc, 80).map((voltage) => {
    const shape = Math.pow(clamp(voltage / voc, 0, 1), 2.15);
    const current = Math.max(0, isc * (1 - shape));
    return {
      x: Number(voltage.toFixed(3)),
      Current: Number((current * 1000).toFixed(3)),
      Power: Number((voltage * current * 1000).toFixed(3)),
      rawCurrentA: current,
      rawPowerW: voltage * current
    };
  });
  const mpp = data.reduce((best, point) => (point.rawPowerW > best.rawPowerW ? point : best), data[0]);
  const operating = data.reduce((best, point) => {
    const resistance = point.rawCurrentA > 0 ? point.x / point.rawCurrentA : Infinity;
    return Math.abs(resistance - controls.loadOhm) < best.delta
      ? { ...point, delta: Math.abs(resistance - controls.loadOhm) }
      : best;
  }, { ...data[0], delta: Infinity });

  return { data, isc, voc, mpp, operating };
}

export function solarReading(controls, noisy = false) {
  const curve = solarCurve(controls);
  return {
    intensityWm2: controls.intensityWm2,
    loadOhm: controls.loadOhm,
    voltageV: curve.operating.x + (noisy ? randomNoise(0.004) : 0),
    currentMa: curve.operating.Current + (noisy ? randomNoise(0.12) : 0),
    powerMw: curve.operating.Power + (noisy ? randomNoise(0.08) : 0)
  };
}

export function solarResult(readings, controls) {
  const curve = solarCurve(controls);
  const value = readings.length ? Math.max(...readings.map((reading) => reading.powerMw)) : curve.mpp.Power;
  return {
    label: 'Maximum power point',
    value,
    unit: 'mW',
    reference: curve.mpp.Power,
    details: [
      `Vmpp = ${curve.mpp.x.toFixed(3)} V`,
      `Impp = ${curve.mpp.Current.toFixed(2)} mA`,
      `Fill factor = ${(curve.mpp.rawPowerW / (curve.voc * curve.isc)).toFixed(3)}`
    ]
  };
}

export function photoelectricValues(controls) {
  const hEvS = PHYSICS.h / PHYSICS.e;
  const frequencyHz = controls.frequencyE14 * 1e14;
  const photonEnergyEv = hEvS * frequencyHz;
  const kineticEnergyEv = Math.max(0, photonEnergyEv - controls.workFunctionEv);
  const stoppingPotential = kineticEnergyEv;
  const thresholdFrequencyE14 = controls.workFunctionEv / hEvS / 1e14;
  const currentUa = kineticEnergyEv > 0 ? controls.intensityPercent * kineticEnergyEv * 0.9 : 0;
  return {
    frequencyHz,
    photonEnergyEv,
    kineticEnergyEv,
    stoppingPotential,
    thresholdFrequencyE14,
    currentUa
  };
}

export function photoelectricReading(controls, noisy = false) {
  const values = photoelectricValues(controls);
  return {
    frequencyE14: controls.frequencyE14,
    intensityPercent: controls.intensityPercent,
    stoppingPotentialV: values.stoppingPotential + (noisy ? randomNoise(0.018) : 0),
    photoCurrentUa: values.currentUa + (noisy ? randomNoise(0.25) : 0),
    emission: values.kineticEnergyEv > 0 ? 'Emission' : 'No emission'
  };
}

export function photoelectricGraphData(readings, controls) {
  const source = readings.length
    ? readings.map((reading) => ({
        x: reading.frequencyE14,
        'Stopping potential': reading.stoppingPotentialV
      }))
    : range(3.5, 12, 60).map((frequencyE14) => ({
        x: Number(frequencyE14.toFixed(2)),
        'Stopping potential': Number(photoelectricValues({ ...controls, frequencyE14 }).stoppingPotential.toFixed(3))
      }));
  return source.sort((a, b) => a.x - b.x);
}

export function photoelectricResult(readings) {
  const regression = linearRegression(readings.map((reading) => ({
    x: reading.frequencyE14 * 1e14,
    y: reading.stoppingPotentialV
  })));
  const value = regression.slope * PHYSICS.e;

  return {
    label: "Planck's constant",
    value,
    unit: 'J s',
    reference: PHYSICS.h,
    details: [
      `Slope = ${regression.slope.toExponential(3)} V s`,
      `R squared = ${regression.r2.toFixed(3)}`
    ]
  };
}

export function diodeCurrentMa(controls, voltage = controls.biasV) {
  const tempK = controls.temperatureC + 273.15;
  const vt = (PHYSICS.k * tempK) / PHYSICS.e;
  const isA = controls.diodeType === 'germanium' ? 4e-7 : 2e-9;
  const ideality = controls.diodeType === 'germanium' ? 1.55 : 1.9;
  const breakdown = controls.diodeType === 'germanium' ? 3.2 : 5.6;

  if (voltage < -breakdown) {
    const excess = Math.abs(voltage) - breakdown;
    return -controls.currentLimitMa * (1 - Math.exp(-excess / 0.85));
  }

  if (voltage < 0) {
    return -isA * 1000;
  }

  const currentA = isA * (Math.exp(voltage / (ideality * vt)) - 1);
  return clamp(currentA * 1000, 0, controls.currentLimitMa);
}

export function diodeReading(controls, noisy = false) {
  const currentMa = diodeCurrentMa(controls) + (noisy ? randomNoise(0.03) : 0);
  const knee = controls.diodeType === 'germanium' ? 0.32 : 0.68;
  return {
    biasV: controls.biasV,
    diodeType: controls.diodeType,
    currentMa,
    region: controls.biasV < -5 ? 'Breakdown' : controls.biasV < 0 ? 'Reverse bias' : controls.biasV >= knee ? 'Conduction' : 'Forward bias'
  };
}

export function diodeGraphData(controls) {
  return range(-8, 1, 130).map((biasV) => ({
    x: Number(biasV.toFixed(3)),
    Current: Number(diodeCurrentMa(controls, biasV).toFixed(4))
  }));
}

export function diodeResult(readings, controls) {
  const knee = controls.diodeType === 'germanium' ? 0.32 : 0.68;
  const nearKnee = readings.find((reading) => reading.currentMa >= 1);
  return {
    label: 'Cut-in voltage',
    value: nearKnee?.biasV ?? knee,
    unit: 'V',
    reference: knee,
    details: ['Cut-in voltage estimated near 1 mA forward current']
  };
}

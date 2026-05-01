export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function randomNoise(amplitude = 1) {
  return (Math.random() - 0.5) * 2 * amplitude;
}

export function range(start, end, count) {
  if (count <= 1) {
    return [start];
  }
  return Array.from({ length: count }, (_, index) => {
    const ratio = index / (count - 1);
    return start + (end - start) * ratio;
  });
}

export function formatNumber(value, digits = 3) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '-';
  }

  const number = Number(value);
  if (number !== 0 && Math.abs(number) < 0.001) {
    return number.toExponential(2);
  }
  if (Math.abs(number) >= 1000) {
    return number.toLocaleString(undefined, { maximumFractionDigits: 1 });
  }
  return Number(number.toFixed(digits)).toString();
}

export function formatValue(value, unit = '', digits = 3) {
  const formatted = formatNumber(value, digits);
  return unit ? `${formatted} ${unit}` : formatted;
}

export function percentError(value, reference) {
  if (!reference || Number.isNaN(value) || Number.isNaN(reference)) {
    return null;
  }
  return Math.abs(((value - reference) / reference) * 100);
}

export function linearRegression(points) {
  const clean = points.filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y));
  const n = clean.length;

  if (n < 2) {
    return { slope: 0, intercept: 0, r2: 0 };
  }

  const sumX = clean.reduce((sum, point) => sum + point.x, 0);
  const sumY = clean.reduce((sum, point) => sum + point.y, 0);
  const sumXY = clean.reduce((sum, point) => sum + point.x * point.y, 0);
  const sumXX = clean.reduce((sum, point) => sum + point.x * point.x, 0);
  const meanY = sumY / n;
  const denominator = n * sumXX - sumX * sumX;
  const slope = denominator === 0 ? 0 : (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;
  const ssRes = clean.reduce((sum, point) => {
    const expected = slope * point.x + intercept;
    return sum + (point.y - expected) ** 2;
  }, 0);
  const ssTot = clean.reduce((sum, point) => sum + (point.y - meanY) ** 2, 0);

  return {
    slope,
    intercept,
    r2: ssTot === 0 ? 1 : clamp(1 - ssRes / ssTot, 0, 1)
  };
}

export function readingId(prefix) {
  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 10000)}`;
}

export function safeAverage(values) {
  const clean = values.filter((value) => Number.isFinite(value));
  if (!clean.length) {
    return 0;
  }
  return clean.reduce((sum, value) => sum + value, 0) / clean.length;
}

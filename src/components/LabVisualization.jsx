import { motion } from 'framer-motion';
import { clamp, formatValue, range } from '../lib/utils.js';

function Meter({ x, y, label, value, unit, angle = 0 }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="0" width="130" height="78" rx="10" fill="rgba(15,23,42,0.88)" stroke="rgba(148,163,184,0.55)" />
      <path d="M22 55 A43 43 0 0 1 108 55" fill="none" stroke="rgba(148,163,184,0.65)" strokeWidth="3" />
      <motion.line
        x1="65"
        y1="55"
        x2="65"
        y2="20"
        stroke="#f59e0b"
        strokeWidth="4"
        strokeLinecap="round"
        animate={{ rotate: angle }}
        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        style={{ originX: '65px', originY: '55px' }}
      />
      <circle cx="65" cy="55" r="5" fill="#f59e0b" />
      <text x="65" y="18" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="700">
        {label}
      </text>
      <text x="65" y="72" textAnchor="middle" fill="#67e8f9" fontSize="11" fontWeight="700">
        {formatValue(value, unit, 3)}
      </text>
    </g>
  );
}

function WaveString({ amplitude, harmonic, time }) {
  const path = range(0, 1, 52)
    .map((ratio, index) => {
      const x = 62 + ratio * 480;
      const envelope = Math.sin(Math.PI * ratio);
      const y = 152 + Math.sin(ratio * Math.PI * 2 * harmonic + time * 18) * amplitude * envelope;
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');

  return <path d={path} fill="none" stroke="#14b8a6" strokeWidth="4" strokeLinecap="round" />;
}

function FiberRay({ controls, guided, time }) {
  const amplitude = guided ? 30 : 65;
  const path = range(0, 1, 36)
    .map((ratio, index) => {
      const x = 55 + ratio * 500;
      const y = 150 + Math.sin(ratio * Math.PI * 7 + time * 1.8) * amplitude * (guided ? 1 : ratio);
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');

  return (
    <path
      d={path}
      fill="none"
      stroke={guided ? '#fbbf24' : '#fb7185'}
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={guided ? 0.95 : 0.72}
      strokeDasharray={guided ? '0' : '9 8'}
    />
  );
}

function DiffractionBars({ wavelength, diameter }) {
  const centerWidth = clamp((wavelength / diameter) * 7.2, 12, 42);
  return Array.from({ length: 17 }, (_, index) => {
    const offset = index - 8;
    const width = Math.max(2, centerWidth / (Math.abs(offset) + 1));
    const opacity = Math.max(0.08, 0.9 / (Math.abs(offset) + 1));
    return (
      <rect
        key={offset}
        x={434 + offset * 12 - width / 2}
        y="42"
        width={width}
        height="216"
        rx="5"
        fill="#38bdf8"
        opacity={opacity}
      />
    );
  });
}

function PanelReadout({ label, value }) {
  return (
    <div className="rounded-md border border-slate-700 bg-slate-950/86 px-3 py-2 font-mono text-xs text-cyan-100 shadow-lab">
      <span className="block text-[10px] uppercase tracking-[0.16em] text-slate-400">{label}</span>
      <span className="text-sm font-bold">{value}</span>
    </div>
  );
}

export default function LabVisualization({ experimentId, controls, current, running, time }) {
  const ledColor = current.led?.color ?? '#22d3ee';

  return (
    <section className="glass-panel overflow-hidden rounded-lg shadow-lab">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-700 dark:text-slate-200">
            Interactive Simulation
          </h2>
          <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Live instrument response with model-based readings
          </p>
        </div>
        <span className={`rounded px-2 py-1 text-xs font-black ${running ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300'}`}>
          {running ? 'Running' : 'Idle'}
        </span>
      </div>

      <div className="lab-grid relative min-h-[360px] bg-slate-50 p-4 dark:bg-slate-950">
        {experimentId === 'planck' ? (
          <div className="relative h-[330px]">
            <svg viewBox="0 0 640 320" className="h-full w-full">
              <defs>
                <filter id="ledGlow" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="13" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <rect x="42" y="206" width="556" height="28" rx="6" fill="#334155" />
              <rect x="66" y="70" width="172" height="110" rx="14" fill="#0f172a" stroke="#64748b" />
              <text x="152" y="100" textAnchor="middle" fill="#e2e8f0" fontSize="13" fontWeight="800">
                DC Supply
              </text>
              <text x="152" y="140" textAnchor="middle" fill="#67e8f9" fontSize="24" fontWeight="800">
                {controls.voltage.toFixed(2)} V
              </text>
              <path d="M238 124 C292 124 286 138 338 138" stroke="#ef4444" strokeWidth="5" fill="none" />
              <path d="M238 150 C292 150 286 166 338 166" stroke="#22c55e" strokeWidth="5" fill="none" />
              <line x1="396" y1="128" x2="396" y2="196" stroke="#94a3b8" strokeWidth="5" />
              <line x1="438" y1="128" x2="438" y2="196" stroke="#94a3b8" strokeWidth="5" />
              <path d="M372 128 L462 128 L417 60 Z" fill={ledColor} opacity="0.24" filter="url(#ledGlow)" />
              <motion.circle
                cx="417"
                cy="128"
                r="34"
                fill={ledColor}
                opacity={current.glow}
                filter="url(#ledGlow)"
                animate={{ scale: running ? [1, 1.08, 1] : 1 }}
                transition={{ repeat: running ? Infinity : 0, duration: 1.2 }}
              />
              <circle cx="417" cy="128" r="24" fill="#e2e8f0" opacity="0.18" stroke={ledColor} strokeWidth="4" />
              <Meter x={466} y={70} label="V0 meter" value={current.thresholdV} unit="V" angle={clamp(current.glow * 72 - 36, -36, 38)} />
              <text x="417" y="256" textAnchor="middle" fill="#64748b" fontSize="13" fontWeight="800">
                Threshold: {current.thresholdV.toFixed(3)} V | Wavelength: {current.led?.wavelengthNm} nm
              </text>
            </svg>
          </div>
        ) : null}

        {experimentId === 'sonometer' ? (
          <div className="relative h-[330px]">
            <svg viewBox="0 0 640 320" className="h-full w-full">
              <rect x="46" y="208" width="548" height="34" rx="8" fill="#7c2d12" />
              <rect x="78" y="82" width="18" height="142" rx="4" fill="#475569" />
              <rect x="512" y="82" width="18" height="142" rx="4" fill="#475569" />
              <line x1="62" y1="152" x2="542" y2="152" stroke="#cbd5e1" strokeWidth="2" />
              <WaveString amplitude={current.resonanceStrength * 32 + 4} harmonic={controls.harmonic} time={running ? time : 0} />
              <rect x="254" y="58" width="92" height="52" rx="8" fill="#0f172a" stroke="#64748b" />
              <text x="300" y="88" textAnchor="middle" fill="#67e8f9" fontSize="18" fontWeight="800">
                {current.frequencyHz.toFixed(2)} Hz
              </text>
              <motion.circle
                cx="300"
                cy="152"
                r="16"
                fill="#f59e0b"
                animate={{ y: running ? [0, -5, 0, 5, 0] : 0 }}
                transition={{ repeat: running ? Infinity : 0, duration: 0.25 }}
              />
              <line x1="530" y1="152" x2="582" y2="190" stroke="#e2e8f0" strokeWidth="4" />
              <circle cx="586" cy="194" r="18" fill="#64748b" />
              <text x="320" y="270" textAnchor="middle" fill="#64748b" fontSize="13" fontWeight="800">
                Resonance strength: {(current.resonanceStrength * 100).toFixed(0)} percent
              </text>
            </svg>
          </div>
        ) : null}

        {experimentId === 'hall' ? (
          <div className="relative h-[330px]">
            <svg viewBox="0 0 640 320" className="h-full w-full">
              <defs>
                <linearGradient id="hallPlate" x1="0" x2="1">
                  <stop offset="0%" stopColor="#155e75" />
                  <stop offset="100%" stopColor="#334155" />
                </linearGradient>
              </defs>
              <rect x="155" y="98" width="330" height="120" rx="16" fill="url(#hallPlate)" stroke="#67e8f9" strokeWidth="2" />
              {range(0, 1, 8).map((ratio) => (
                <motion.path
                  key={ratio}
                  d={`M${170 + ratio * 285} 76 L${185 + ratio * 285} 98 L${200 + ratio * 285} 76`}
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="3"
                  animate={{ y: running ? [0, 14, 0] : 0 }}
                  transition={{ repeat: running ? Infinity : 0, duration: 1.1, delay: ratio * 0.1 }}
                />
              ))}
              <path d="M92 158 H155" stroke="#f97316" strokeWidth="8" strokeLinecap="round" />
              <path d="M485 158 H548" stroke="#f97316" strokeWidth="8" strokeLinecap="round" />
              <text x="320" y="164" textAnchor="middle" fill="#e0f2fe" fontSize="18" fontWeight="900">
                I
              </text>
              <line x1="320" y1="98" x2="320" y2="54" stroke="#f8fafc" strokeWidth="4" />
              <line x1="320" y1="218" x2="320" y2="268" stroke="#f8fafc" strokeWidth="4" />
              <Meter x={440} y={46} label="VH" value={current.hallMv} unit="mV" angle={clamp(current.hallMv * 58, -40, 40)} />
              <text x="320" y="294" textAnchor="middle" fill="#64748b" fontSize="13" fontWeight="800">
                B = {controls.magneticFieldT.toFixed(2)} T | I = {controls.currentMa.toFixed(1)} mA
              </text>
            </svg>
          </div>
        ) : null}

        {experimentId === 'coil' ? (
          <div className="relative h-[330px]">
            <svg viewBox="0 0 640 320" className="h-full w-full">
              <g transform="translate(210 42)">
                {range(0, 1, 9).map((ratio) => (
                  <ellipse
                    key={ratio}
                    cx={105 + ratio * 6}
                    cy="112"
                    rx="78"
                    ry="112"
                    fill="none"
                    stroke="#d97706"
                    strokeWidth="4"
                    opacity={0.95 - ratio * 0.05}
                  />
                ))}
              </g>
              <line x1="70" y1="154" x2="572" y2="154" stroke="#94a3b8" strokeDasharray="8 8" />
              <motion.g animate={{ x: controls.distanceCm * 6 }} transition={{ type: 'spring', stiffness: 90, damping: 18 }}>
                <circle cx="320" cy="154" r="58" fill="#0f172a" stroke="#94a3b8" strokeWidth="3" />
                <circle cx="320" cy="154" r="6" fill="#e2e8f0" />
                <motion.line
                  x1="320"
                  y1="154"
                  x2="320"
                  y2="102"
                  stroke="#ef4444"
                  strokeWidth="7"
                  strokeLinecap="round"
                  animate={{ rotate: current.deflectionDeg }}
                  style={{ originX: '320px', originY: '154px' }}
                />
                <motion.line
                  x1="320"
                  y1="154"
                  x2="320"
                  y2="206"
                  stroke="#38bdf8"
                  strokeWidth="7"
                  strokeLinecap="round"
                  animate={{ rotate: current.deflectionDeg }}
                  style={{ originX: '320px', originY: '154px' }}
                />
              </motion.g>
              <Meter x={452} y={54} label="Gaussmeter" value={current.fieldMt} unit="mT" angle={clamp(current.fieldMt * 16 - 28, -38, 40)} />
              <text x="320" y="292" textAnchor="middle" fill="#64748b" fontSize="13" fontWeight="800">
                Compass deflection: {current.deflectionDeg.toFixed(2)} deg
              </text>
            </svg>
          </div>
        ) : null}

        {experimentId === 'faraday' ? (
          <div className="relative h-[330px]">
            <svg viewBox="0 0 640 320" className="h-full w-full">
              <g transform="translate(246 56)">
                {range(0, 1, 10).map((ratio) => (
                  <ellipse
                    key={ratio}
                    cx={82 + ratio * 5}
                    cy="110"
                    rx="62"
                    ry="106"
                    fill="none"
                    stroke="#b45309"
                    strokeWidth="4"
                  />
                ))}
              </g>
              <motion.g
                animate={{ x: running ? [-185, 185, -185] : current.magnetX }}
                transition={{ repeat: running ? Infinity : 0, duration: Math.max(1.3, 3 / controls.speedMs), ease: 'easeInOut' }}
              >
                <rect x="110" y="124" width="108" height="56" rx="8" fill="#ef4444" />
                <rect x="218" y="124" width="108" height="56" rx="8" fill="#3b82f6" />
                <text x="164" y="158" textAnchor="middle" fill="white" fontWeight="900">
                  N
                </text>
                <text x="272" y="158" textAnchor="middle" fill="white" fontWeight="900">
                  S
                </text>
              </motion.g>
              <Meter x={438} y={48} label="EMF" value={current.emfV} unit="V" angle={clamp(current.emfV * 30, -38, 38)} />
              <path d="M336 62 C470 16 520 72 502 124" stroke="#94a3b8" strokeWidth="3" fill="none" />
              <text x="320" y="292" textAnchor="middle" fill="#64748b" fontSize="13" fontWeight="800">
                EMF reverses sign as magnetic flux rises and falls through the coil
              </text>
            </svg>
          </div>
        ) : null}

        {experimentId === 'fiber' ? (
          <div className="relative h-[330px]">
            <svg viewBox="0 0 640 320" className="h-full w-full">
              <path d="M54 146 C190 84 305 222 458 126 C520 86 562 116 590 148" fill="none" stroke="#0f172a" strokeWidth="64" strokeLinecap="round" opacity="0.9" />
              <path d="M54 146 C190 84 305 222 458 126 C520 86 562 116 590 148" fill="none" stroke="#164e63" strokeWidth="44" strokeLinecap="round" />
              <FiberRay controls={controls} guided={current.guided} time={running ? time : 0} />
              <motion.circle
                cx="64"
                cy="146"
                r="11"
                fill="#facc15"
                animate={{ opacity: running ? [0.4, 1, 0.4] : 0.85 }}
                transition={{ repeat: running ? Infinity : 0, duration: 1.1 }}
              />
              <text x="320" y="274" textAnchor="middle" fill="#64748b" fontSize="13" fontWeight="800">
                NA = {current.numericalAperture.toFixed(3)} | Acceptance angle = {current.acceptanceDeg.toFixed(2)} deg
              </text>
            </svg>
            <div className="absolute right-5 top-5">
              <PanelReadout label="Bending loss" value={`${current.lossPercent.toFixed(1)} percent`} />
            </div>
          </div>
        ) : null}

        {experimentId === 'diffraction' ? (
          <div className="relative h-[330px]">
            <svg viewBox="0 0 640 320" className="h-full w-full">
              <rect x="78" y="132" width="130" height="38" rx="8" fill="#7f1d1d" stroke="#fca5a5" />
              <circle cx="207" cy="151" r="10" fill="#ef4444" />
              <motion.line
                x1="218"
                y1="151"
                x2="338"
                y2="151"
                stroke="#ef4444"
                strokeWidth="5"
                strokeLinecap="round"
                animate={{ opacity: running ? [0.45, 1, 0.45] : 0.75 }}
                transition={{ repeat: running ? Infinity : 0, duration: 0.8 }}
              />
              <line x1="338" y1="78" x2="338" y2="224" stroke="#e2e8f0" strokeWidth="5" />
              <text x="338" y="65" textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="800">
                wire
              </text>
              <rect x="404" y="30" width="120" height="250" rx="12" fill="#0f172a" stroke="#64748b" />
              <DiffractionBars wavelength={controls.wavelengthNm} diameter={controls.wireDiameterUm} />
              <text x="320" y="302" textAnchor="middle" fill="#64748b" fontSize="13" fontWeight="800">
                Fringe width: {current.fringeWidthMm.toFixed(3)} mm | Wire diameter: {controls.wireDiameterUm.toFixed(1)} um
              </text>
            </svg>
          </div>
        ) : null}

        {experimentId === 'solar' ? (
          <div className="relative h-[330px]">
            <svg viewBox="0 0 640 320" className="h-full w-full">
              <circle cx="112" cy="82" r="34" fill="#facc15" />
              {range(0, 1, 8).map((ratio) => (
                <motion.line
                  key={ratio}
                  x1={150 + ratio * 14}
                  y1={90 + ratio * 10}
                  x2={306 + ratio * 12}
                  y2={138 + ratio * 7}
                  stroke="#fbbf24"
                  strokeWidth="4"
                  strokeLinecap="round"
                  opacity={controls.intensityWm2 / 1100}
                  animate={{ x: running ? [0, 8, 0] : 0 }}
                  transition={{ repeat: running ? Infinity : 0, duration: 1.1, delay: ratio * 0.08 }}
                />
              ))}
              <g transform="translate(298 102) rotate(-8)">
                <rect x="0" y="0" width="190" height="122" rx="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="4" />
                {range(0, 1, 5).map((ratio) => (
                  <line key={ratio} x1={ratio * 38} y1="0" x2={ratio * 38} y2="122" stroke="#1e40af" strokeWidth="2" />
                ))}
                {range(0, 1, 4).map((ratio) => (
                  <line key={ratio} x1="0" y1={ratio * 40} x2="190" y2={ratio * 40} stroke="#1e40af" strokeWidth="2" />
                ))}
              </g>
              <Meter x={70} y={190} label="Load" value={current.operatingPowerMw} unit="mW" angle={clamp(current.operatingPowerMw * 3 - 36, -36, 40)} />
              <text x="418" y="286" textAnchor="middle" fill="#64748b" fontSize="13" fontWeight="800">
                MPP: {current.mpp.Power.toFixed(2)} mW at {current.mpp.x.toFixed(2)} V
              </text>
            </svg>
          </div>
        ) : null}

        {experimentId === 'photoelectric' ? (
          <div className="relative h-[330px]">
            <svg viewBox="0 0 640 320" className="h-full w-full">
              <rect x="260" y="72" width="220" height="160" rx="80" fill="#0f172a" stroke="#64748b" strokeWidth="3" />
              <rect x="300" y="116" width="18" height="72" rx="6" fill="#facc15" />
              <rect x="424" y="102" width="16" height="100" rx="6" fill="#94a3b8" />
              {range(0, 1, 7).map((ratio) => (
                <motion.circle
                  key={ratio}
                  cx={94 + ratio * 17}
                  cy={100 + ratio * 18}
                  r="7"
                  fill="#60a5fa"
                  animate={{ x: running ? [0, 178, 0] : 0, opacity: running ? [0, 1, 0] : 0.55 }}
                  transition={{ repeat: running ? Infinity : 0, duration: 1.4, delay: ratio * 0.15 }}
                />
              ))}
              {current.emission
                ? range(0, 1, 8).map((ratio) => (
                    <motion.circle
                      key={ratio}
                      cx="322"
                      cy={122 + ratio * 52}
                      r="5"
                      fill="#67e8f9"
                      animate={{ x: running ? [0, 100, 0] : 54, opacity: running ? [0.25, 1, 0.25] : 0.75 }}
                      transition={{ repeat: running ? Infinity : 0, duration: 1, delay: ratio * 0.09 }}
                    />
                  ))
                : null}
              <Meter x={78} y={200} label="Vs" value={current.stoppingPotential} unit="V" angle={clamp(current.stoppingPotential * 16 - 32, -35, 40)} />
              <text x="370" y="282" textAnchor="middle" fill="#64748b" fontSize="13" fontWeight="800">
                Threshold frequency: {current.thresholdFrequencyE14.toFixed(2)} x 10^14 Hz
              </text>
            </svg>
          </div>
        ) : null}

        {experimentId === 'diode' ? (
          <div className="relative h-[330px]">
            <svg viewBox="0 0 640 320" className="h-full w-full">
              <path d="M118 154 H256" stroke="#94a3b8" strokeWidth="5" fill="none" />
              <path d="M382 154 H522" stroke="#94a3b8" strokeWidth="5" fill="none" />
              <polygon points="256,98 256,210 354,154" fill="#0e7490" stroke="#67e8f9" strokeWidth="4" />
              <line x1="366" y1="96" x2="366" y2="212" stroke="#67e8f9" strokeWidth="6" />
              <motion.circle
                cx="318"
                cy="154"
                r={clamp(Math.abs(current.currentMa), 6, 34)}
                fill={current.region === 'Breakdown' ? '#ef4444' : '#22c55e'}
                opacity={clamp(Math.abs(current.currentMa) / controls.currentLimitMa, 0.15, 0.6)}
                animate={{ scale: running ? [1, 1.12, 1] : 1 }}
                transition={{ repeat: running ? Infinity : 0, duration: 0.9 }}
              />
              <rect x="92" y="110" width="62" height="88" rx="8" fill="#0f172a" stroke="#64748b" />
              <text x="123" y="146" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="800">
                DC
              </text>
              <text x="123" y="170" textAnchor="middle" fill="#67e8f9" fontSize="15" fontWeight="900">
                {controls.biasV.toFixed(2)} V
              </text>
              <Meter x={436} y={64} label="Ammeter" value={current.currentMa} unit="mA" angle={clamp(current.currentMa * 1.4, -38, 40)} />
              <text x="320" y="282" textAnchor="middle" fill="#64748b" fontSize="13" fontWeight="800">
                Region: {current.region}
              </text>
            </svg>
          </div>
        ) : null}
      </div>
    </section>
  );
}

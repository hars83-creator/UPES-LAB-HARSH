import { motion } from 'framer-motion';

export default function AmbientStage() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#050816]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(34,211,238,0.20),transparent_28%),radial-gradient(circle_at_78%_4%,rgba(168,85,247,0.16),transparent_26%),radial-gradient(circle_at_80%_82%,rgba(20,184,166,0.17),transparent_30%),linear-gradient(135deg,#050816_0%,#08111f_45%,#12091f_100%)]" />
      <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(125,211,252,0.20)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,0.20)_1px,transparent_1px)] [background-size:72px_72px]" />
      <motion.div
        className="absolute left-[8%] top-[10%] h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl"
        animate={{ x: [0, 30, -12, 0], y: [0, 18, -16, 0], scale: [1, 1.12, 0.96, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-[9%] top-[18%] h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl"
        animate={{ x: [0, -28, 20, 0], y: [0, 24, -20, 0], scale: [1, 0.92, 1.1, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[8%] left-[34%] h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl"
        animate={{ x: [0, 22, -28, 0], y: [0, -18, 20, 0], scale: [1, 1.08, 0.95, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#050816] to-transparent" />
    </div>
  );
}

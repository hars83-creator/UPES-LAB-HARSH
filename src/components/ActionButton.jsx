export default function ActionButton({ icon: Icon, children, variant = 'default', className = '', ...props }) {
  const styles = {
    default:
      'border-white/10 bg-white/[0.07] text-white/80 hover:border-cyan-200/50 hover:bg-cyan-300/12 hover:text-white',
    primary:
      'border-cyan-200/30 bg-cyan-300 text-slate-950 shadow-[0_0_34px_rgba(34,211,238,0.34)] hover:border-cyan-100 hover:bg-cyan-200',
    danger:
      'border-rose-300/40 bg-rose-400/12 text-rose-100 hover:bg-rose-400/20',
    quiet:
      'border-transparent bg-white/[0.06] text-white/70 hover:bg-white/[0.10] hover:text-white'
  };

  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold transition ${styles[variant]} ${className}`}
      {...props}
    >
      {Icon ? <Icon className="h-4 w-4 shrink-0" aria-hidden="true" /> : null}
      <span className="truncate">{children}</span>
    </button>
  );
}

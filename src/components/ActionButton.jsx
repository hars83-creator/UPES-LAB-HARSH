export default function ActionButton({ icon: Icon, children, variant = 'default', className = '', ...props }) {
  const styles = {
    default:
      'border-slate-300 bg-white text-slate-800 hover:border-cyan-500 hover:text-cyan-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-cyan-400 dark:hover:text-cyan-200',
    primary:
      'border-cyan-600 bg-cyan-600 text-white hover:border-cyan-500 hover:bg-cyan-500 dark:border-cyan-500 dark:bg-cyan-500 dark:text-slate-950',
    danger:
      'border-rose-400 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-500/60 dark:bg-rose-950/40 dark:text-rose-200',
    quiet:
      'border-transparent bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
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

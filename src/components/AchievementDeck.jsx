import { Award, Flame, Medal, Sparkles } from 'lucide-react';

const badges = [
  { label: 'Precision Streak', detail: '3 readings below 5% error', icon: Medal, progress: 72 },
  { label: 'Graph Master', detail: 'Slope and trend verified', icon: Sparkles, progress: 88 },
  { label: 'Lab Discipline', detail: 'Clean report exported', icon: Award, progress: 54 }
];

export default function AchievementDeck({ readingsCount, error }) {
  const points = 1200 + readingsCount * 85 + Math.max(0, Math.round(100 - (error ?? 12)) * 6);

  return (
    <section className="premium-panel rounded-lg p-4 shadow-lab">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">Gamification</p>
          <h2 className="mt-1 text-lg font-black text-white">Achievement system</h2>
        </div>
        <div className="rounded-md border border-amber-200/20 bg-amber-300/12 px-3 py-2 text-right">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-amber-100">XP</p>
          <p className="font-mono text-lg font-black text-white">{points}</p>
        </div>
      </div>

      <div className="space-y-3">
        {badges.map((badge, index) => {
          const Icon = badge.icon;
          const progress = Math.min(100, badge.progress + readingsCount * 4 - index * 3);
          return (
            <div key={badge.label} className="rounded-md border border-white/10 bg-white/[0.05] p-3">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-md bg-white/10 text-cyan-100">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black text-white">{badge.label}</p>
                  <p className="text-xs font-semibold text-white/50">{badge.detail}</p>
                </div>
                <Flame className="h-4 w-4 text-amber-200" aria-hidden="true" />
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

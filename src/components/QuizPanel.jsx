import { useMemo, useState } from 'react';
import { HelpCircle } from 'lucide-react';

export default function QuizPanel({ quiz }) {
  const [answers, setAnswers] = useState({});
  const score = useMemo(
    () => quiz.reduce((sum, question, index) => sum + (answers[index] === question.answer ? 1 : 0), 0),
    [answers, quiz]
  );

  return (
    <section className="glass-panel rounded-lg p-4 shadow-lab">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-cyan-600 dark:text-cyan-300" aria-hidden="true" />
          <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-700 dark:text-slate-200">
            Quiz
          </h2>
        </div>
        <span className="rounded bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
          {score}/{quiz.length}
        </span>
      </div>

      <div className="space-y-4">
        {quiz.map((question, index) => (
          <div key={question.prompt} className="rounded-md border border-slate-200 bg-white/60 p-3 dark:border-slate-800 dark:bg-slate-950/35">
            <p className="text-sm font-bold leading-6 text-slate-800 dark:text-slate-100">{question.prompt}</p>
            <div className="mt-3 grid gap-2">
              {question.options.map((option) => {
                const selected = answers[index] === option;
                const answered = answers[index] !== undefined;
                const correct = question.answer === option;
                return (
                  <button
                    key={option}
                    onClick={() => setAnswers((current) => ({ ...current, [index]: option }))}
                    className={`min-h-10 rounded-md border px-3 text-left text-xs font-bold transition ${
                      selected && correct
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200'
                        : selected && !correct
                          ? 'border-rose-500 bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-200'
                          : answered && correct
                            ? 'border-emerald-300 bg-emerald-50/60 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-200'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-cyan-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

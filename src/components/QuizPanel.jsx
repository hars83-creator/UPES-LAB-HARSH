import { useMemo, useState } from 'react';
import { HelpCircle } from 'lucide-react';

export default function QuizPanel({ quiz }) {
  const [answers, setAnswers] = useState({});
  const score = useMemo(
    () => quiz.reduce((sum, question, index) => sum + (answers[index] === question.answer ? 1 : 0), 0),
    [answers, quiz]
  );

  return (
    <section className="premium-panel rounded-lg p-4 shadow-lab">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-cyan-200" aria-hidden="true" />
          <h2 className="text-sm font-black uppercase tracking-[0.16em] text-cyan-200">
            Quiz
          </h2>
        </div>
        <span className="rounded border border-white/10 bg-white/[0.06] px-2 py-1 text-xs font-bold text-white/60">
          {score}/{quiz.length}
        </span>
      </div>

      <div className="space-y-4">
        {quiz.map((question, index) => (
          <div key={question.prompt} className="rounded-md border border-white/10 bg-white/[0.05] p-3">
            <p className="text-sm font-bold leading-6 text-white/90">{question.prompt}</p>
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
                        ? 'border-emerald-300/50 bg-emerald-300/12 text-emerald-100'
                        : selected && !correct
                          ? 'border-rose-300/50 bg-rose-300/12 text-rose-100'
                          : answered && correct
                            ? 'border-emerald-300/40 bg-emerald-300/8 text-emerald-100'
                            : 'border-white/10 bg-white/[0.05] text-white/70 hover:border-cyan-200/40 hover:bg-cyan-300/10'
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

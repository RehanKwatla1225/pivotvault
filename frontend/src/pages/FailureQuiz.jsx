import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, CheckCircle2, XCircle, RefreshCw, ArrowRight } from 'lucide-react';
import api from '../lib/api';
import { clsx } from 'clsx';

const FailureQuiz = () => {
  const [questions, setQuestions] = React.useState([]);
  const [answers, setAnswers] = React.useState({});
  const [loading, setLoading] = React.useState(true);

  const loadQuiz = React.useCallback(async () => {
    setLoading(true);
    setAnswers({});
    try {
      const { data } = await api.get('/quiz?count=5');
      setQuestions(data.questions || []);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadQuiz();
  }, [loadQuiz]);

  const score = questions.reduce((sum, q, i) => sum + (answers[i] === q.answer ? 1 : 0), 0);
  const complete = questions.length > 0 && Object.keys(answers).length === questions.length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <div className="text-xs text-accent font-bold uppercase tracking-widest mb-2">Pattern Training</div>
          <h1 className="text-4xl font-display font-extrabold">Failure Quiz</h1>
          <p className="text-text-secondary mt-2">Train your founder intuition against real postmortem data.</p>
        </div>
        <button onClick={loadQuiz} className="inline-flex items-center gap-2 bg-surface-2 border border-border px-4 py-2.5 rounded-lg text-sm font-semibold text-text-secondary hover:text-text-primary">
          <RefreshCw className="w-4 h-4" />
          New quiz
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-36 glass-card animate-pulse" />)}</div>
      ) : questions.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <Brain className="w-12 h-12 text-accent mx-auto mb-4" />
          <h2 className="text-xl font-display font-bold mb-2">Not enough data for a quiz yet</h2>
          <p className="text-text-secondary text-sm">Seed at least four startups with failure reasons to generate questions.</p>
        </div>
      ) : (
        <>
          {complete && (
            <div className="glass-card p-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-accent/30">
              <div>
                <div className="text-xs text-accent font-bold uppercase tracking-widest">Result</div>
                <div className="text-2xl font-display font-bold">You scored {score}/{questions.length}</div>
              </div>
              <Link to="/explore" className="inline-flex items-center gap-2 text-accent font-semibold">
                Study postmortems <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          <div className="space-y-5">
            {questions.map((q, i) => {
              const picked = answers[i];
              const answered = Boolean(picked);
              return (
                <section key={`${q.slug}-${i}`} className="glass-card p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
                    <div>
                      <div className="text-xs text-text-muted uppercase font-bold tracking-wider">Question {i + 1} / {questions.length}</div>
                      <h2 className="text-xl font-display font-bold mt-1">{q.question}</h2>
                      <p className="text-sm text-text-secondary mt-2">{q.summary}</p>
                    </div>
                    <Link to={`/startup/${q.slug}`} className="text-xs text-accent font-semibold">View case</Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map((option) => {
                      const correct = option === q.answer;
                      const selected = picked === option;
                      return (
                        <button
                          key={option}
                          disabled={answered}
                          onClick={() => setAnswers((prev) => ({ ...prev, [i]: option }))}
                          className={clsx(
                            'text-left border rounded-xl p-4 transition-all',
                            !answered && 'bg-surface-2/40 border-border hover:border-accent/40',
                            answered && correct && 'bg-success/10 border-success/40 text-success',
                            answered && selected && !correct && 'bg-danger/10 border-danger/40 text-danger',
                            answered && !selected && !correct && 'bg-surface/40 border-border/60 text-text-secondary'
                          )}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-semibold">{option}</span>
                            {answered && correct && <CheckCircle2 className="w-4 h-4" />}
                            {answered && selected && !correct && <XCircle className="w-4 h-4" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {answered && (
                    <div className="mt-5 text-sm text-text-secondary bg-bg/40 border border-border/60 rounded-xl p-4">
                      <span className="font-bold text-text-primary">Lesson:</span> {q.explanation}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default FailureQuiz;

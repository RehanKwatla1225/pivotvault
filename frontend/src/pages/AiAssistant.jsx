import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Search, BookOpen, AlertCircle, ArrowRight, ShieldAlert, ListRestart, HelpCircle } from 'lucide-react';
import StartupCard from '../components/StartupCard';
import api from '../lib/api';

const AiAssistant = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const [error, setError] = React.useState(null);

  const urlQuery = searchParams.get('q') || '';

  const executeResearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/ai/research', {
        query: searchQuery
      });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch research analytics. Check backend status.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (urlQuery) {
      setQuery(urlQuery);
      executeResearch(urlQuery);
    }
  }, [urlQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchParams({ q: query });
    executeResearch(query);
  };

  const sampleQuestions = [
    "Compare Byju's and Quibi.",
    "Show startups that failed because of poor PMF.",
    "What patterns exist among food delivery startups?",
    "Find startups with broken unit economics."
  ];

  // Helper function to render inline markdown strings
  const renderMarkdown = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, idx) => {
      let content = line;
      // Replace **bold** with <strong>bold</strong>
      content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-sm text-text-secondary mb-2" 
              dangerouslySetInnerHTML={{ __html: content.replace(/^[*-\s]+/, '') }} />
        );
      }
      if (line.trim().startsWith('1. ') || line.trim().startsWith('2. ') || line.trim().startsWith('3. ')) {
        return (
          <li key={idx} className="ml-4 list-decimal text-sm text-text-secondary mb-2" 
              dangerouslySetInnerHTML={{ __html: content.replace(/^\d+\.\s+/, '') }} />
        );
      }
      if (line.trim().startsWith('### ')) {
        return <h4 key={idx} className="text-base font-bold text-text-primary mt-5 mb-2" dangerouslySetInnerHTML={{ __html: content.replace(/^###\s+/, '') }} />;
      }
      if (line.trim().startsWith('## ')) {
        return <h3 key={idx} className="text-lg font-bold text-text-primary mt-6 mb-3 border-b border-border pb-1" dangerouslySetInnerHTML={{ __html: content.replace(/^##\s+/, '') }} />;
      }
      return <p key={idx} className="text-sm sm:text-base text-text-secondary leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: content }} />;
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Title */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-accent text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Failure Analyst Core
        </div>
        <h1 className="text-4xl font-display font-extrabold text-text-primary">AI Research Assistant</h1>
        <p className="text-text-secondary text-base mt-2 max-w-lg mx-auto">
          Query failures, extract historical insights, and compare failed business strategies semantically.
        </p>
      </div>

      {/* Perplexity-style Large Glowing Query Input */}
      <div className="max-w-3xl mx-auto mb-10">
        <form onSubmit={handleSubmit} className="relative glass-card p-2 rounded-2xl border border-border/80 flex flex-col sm:flex-row items-center gap-2 bg-surface/80 shadow-[0_15px_40px_rgba(0,0,0,0.4)]">
          <div className="flex items-center w-full px-3 py-2">
            <Search className="w-5.5 h-5.5 text-text-muted shrink-0 mr-3" />
            <input
              type="text"
              placeholder="e.g. Compare WeWork and Quibi or Ask about Food delivery burn rates..."
              className="w-full bg-transparent border-none py-1 focus:outline-none text-text-primary placeholder:text-text-muted text-base sm:text-lg"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-accent hover:bg-indigo-600 disabled:opacity-50 text-white px-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shrink-0 shadow-md cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Run Analysis
          </button>
        </form>

        {/* Example Suggestions */}
        {!result && !loading && (
          <div className="mt-8 text-center">
            <h3 className="text-xs text-text-muted font-bold uppercase tracking-wider mb-4 flex items-center justify-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-accent" />
              Suggested Research Directions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(q);
                    setSearchParams({ q });
                    executeResearch(q);
                  }}
                  className="text-left text-sm text-text-secondary bg-surface-2/40 border border-border hover:border-accent/30 hover:bg-surface-2/70 p-4 rounded-xl transition-all duration-200"
                >
                  <div className="font-semibold text-text-primary mb-1 flex items-center justify-between">
                    <span>Topic {idx + 1}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-accent" />
                  </div>
                  <div className="text-xs text-text-secondary">{q}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Loading Skeletal state */}
      {loading && (
        <div className="max-w-4xl mx-auto space-y-8 animate-pulse mt-12">
          <div className="h-6 bg-surface-2 rounded w-1/4" />
          <div className="space-y-3">
            <div className="h-4 bg-surface-2 rounded" />
            <div className="h-4 bg-surface-2 rounded w-5/6" />
            <div className="h-4 bg-surface-2 rounded w-4/6" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <div className="h-40 bg-surface-2 rounded-xl" />
            <div className="h-40 bg-surface-2 rounded-xl" />
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="max-w-md mx-auto bg-red-500/10 border border-red-500/20 p-5 rounded-xl text-center text-danger mt-12">
          <AlertCircle className="w-8 h-8 mx-auto mb-3" />
          <p className="font-semibold text-sm">{error}</p>
          <button 
            onClick={() => executeResearch(query)}
            className="mt-3 text-xs bg-red-500/20 text-text-primary px-4 py-2 rounded-lg font-bold hover:bg-red-500/30"
          >
            Retry Call
          </button>
        </div>
      )}

      {/* Result presentation */}
      {!loading && result && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12"
        >
          {/* Main content pane */}
          <div className="lg:col-span-2 space-y-10">
            {/* AI Summary */}
            <section className="glass-card p-8 bg-surface/40">
              <div className="flex items-center gap-2 text-accent-2 font-bold text-xs uppercase tracking-wider mb-4">
                <BookOpen className="w-4 h-4" />
                AI Analysis Summary
              </div>
              <div className="text-text-secondary leading-relaxed">
                {renderMarkdown(result.aiSummary)}
              </div>
            </section>

            {/* Timeline comparison */}
            {result.timeline && result.timeline.length > 0 && (
              <section className="glass-card p-8 bg-surface/40">
                <h3 className="font-display font-bold text-lg mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-accent rounded" />
                  Comparative Timeline
                </h3>
                <div className="relative pl-6 border-l border-border/80 ml-2 space-y-6">
                  {result.timeline.map((evt, idx) => (
                    <div key={idx} className="relative">
                      <span className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-accent border-2 border-bg" />
                      <div>
                        <span className="text-[10px] font-data font-bold text-accent-2 uppercase tracking-widest">{evt.year} — {evt.startup}</span>
                        <h4 className="text-sm font-bold text-text-primary mt-0.5">{evt.event}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Sidebar: Sources and Lessons */}
          <div className="space-y-8">
            {/* Cited references */}
            {result.sources && result.sources.length > 0 && (
              <section className="glass-card p-6 bg-surface/40">
                <h3 className="text-xs text-text-muted font-bold uppercase tracking-wider mb-4">Cited Sources</h3>
                <div className="space-y-3">
                  {result.sources.map((src, i) => (
                    <Link 
                      key={i} 
                      to={`/startup/${src}`}
                      className="block p-3 bg-surface-2/50 border border-border/80 hover:border-accent/30 rounded-xl transition-all hover:bg-surface-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-text-primary capitalize">{src.replace(/-/g, ' ')}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-accent" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Lessons panel */}
            {result.keyLessons && result.keyLessons.length > 0 && (
              <section className="glass-card p-6 bg-surface/40 border border-accent/20">
                <h3 className="text-sm font-display font-bold text-text-primary mb-4 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-accent" />
                  Key Lessons
                </h3>
                <div className="space-y-4">
                  {result.keyLessons.map((les, i) => (
                    <div key={i} className="text-xs">
                      <div className="font-bold text-text-primary mb-1 border-b border-border/40 pb-1 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        {les.lesson}
                      </div>
                      <p className="text-text-secondary leading-relaxed pl-3">{les.details}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Related startups grid at the bottom */}
          {result.relatedStartups && result.relatedStartups.length > 0 && (
            <div className="lg:col-span-3 mt-4">
              <h3 className="font-display font-bold text-lg mb-6 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-accent-2 rounded" />
                Related Failures
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {result.relatedStartups.map((rs, idx) => (
                  <StartupCard key={idx} {...rs} topFailureReason={null} />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default AiAssistant;

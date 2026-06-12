import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Search, Sparkles, AlertTriangle, ArrowRight, TrendingUp, BarChart3, Database, ShieldAlert } from 'lucide-react';
import StartupCard from '../components/StartupCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const LandingPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState('');
  const [featured, setFeatured] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/startups?limit=4`);
        setFeatured(response.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = (e, type) => {
    e?.preventDefault();
    if (!search.trim()) return;
    if (type === 'ai') {
      navigate(`/assistant?q=${encodeURIComponent(search)}`);
    } else {
      navigate(`/explore?q=${encodeURIComponent(search)}`);
    }
  };

  const samplePrompts = [
    "Why did WeWork fail?",
    "Show fintech failures after Series B.",
    "Find startups that burned cash too fast.",
    "Compare Juicero and Theranos."
  ];

  const trendingPatterns = [
    { category: 'pmf', label: 'No Product-Market Fit', share: '38%', color: 'from-red-500/10 to-rose-500/5 border-red-500/20 text-danger', desc: 'Building products that have zero validated market demand or utility.' },
    { category: 'unit_economics', label: 'Broken Unit Economics', share: '24%', color: 'from-amber-500/10 to-orange-500/5 border-amber-500/20 text-warning', desc: 'Logistics, delivery, or operational costs exceeding customer price points.' },
    { category: 'cashflow', label: 'Fatal Cash Burn', share: '18%', color: 'from-purple-500/10 to-indigo-500/5 border-purple-500/20 text-accent', desc: 'Scaling operations and marketing spend before contribution-positive.' },
    { category: 'competition', label: 'Incumbent Displacement', share: '12%', color: 'from-blue-500/10 to-cyan-500/5 border-blue-500/20 text-blue-400', desc: 'Outcompeted by larger tech companies entering the niche with default placement.' }
  ];

  const industryHeatmap = [
    { name: 'Grocery & Delivery', risk: 'Critical', rate: '84%', color: 'text-danger border-red-500/20' },
    { name: 'FinTech', risk: 'High', rate: '71%', color: 'text-danger border-red-500/10' },
    { name: 'Consumer Hardware', risk: 'High', rate: '69%', color: 'text-warning border-amber-500/20' },
    { name: 'Social Network', risk: 'Medium', rate: '58%', color: 'text-warning border-amber-500/10' },
    { name: 'EdTech', risk: 'Medium', rate: '52%', color: 'text-warning border-amber-500/10' },
    { name: 'SaaS / B2B', risk: 'Low', rate: '32%', color: 'text-success border-emerald-500/20' }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg">
      {/* Animated premium background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293755_1px,transparent_1px),linear-gradient(to_bottom,#1f293755_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-accent text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Startup Intelligence Platform
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight leading-[1.1] mb-6">
              Learn Why Startups Fail.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-accent-2 to-indigo-400">
                Avoid Their Mistakes.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
              Explore documented failure postmortems, study financial and product design errors, and run AI risk assessments before writing a single line of code.
            </p>
          </motion.div>

          {/* Dual mode Search & Ask bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-3xl mx-auto mb-6"
          >
            <form onSubmit={(e) => handleSearch(e, 'explore')} className="relative glass-card p-2 rounded-full border border-border/80 flex items-center shadow-2xl bg-surface/80">
              <div className="pl-4 flex items-center shrink-0">
                <Search className="w-5 h-5 text-text-muted" />
              </div>
              <input
                type="text"
                placeholder="Search startups or Ask AI: 'Why did WeWork fail?'"
                className="w-full bg-transparent border-none py-3 px-4 text-base sm:text-lg focus:outline-none text-text-primary placeholder:text-text-muted"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={(e) => handleSearch(e, 'explore')}
                  className="bg-surface-2 hover:bg-border text-text-primary text-xs sm:text-sm px-4 py-2.5 rounded-full font-semibold transition-colors duration-200"
                >
                  Explore
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSearch(e, 'ai')}
                  className="bg-accent hover:bg-indigo-600 text-white text-xs sm:text-sm px-5 py-2.5 rounded-full font-semibold flex items-center gap-1.5 transition-all shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  Ask AI
                </button>
              </div>
            </form>
          </motion.div>

          {/* AI Ask Box Suggestions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="max-w-3xl mx-auto flex flex-wrap justify-center gap-2 mb-16"
          >
            <span className="text-xs text-text-muted self-center mr-2 font-bold uppercase tracking-wider">Try Asking:</span>
            {samplePrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => {
                  setSearch(prompt);
                  navigate(`/assistant?q=${encodeURIComponent(prompt)}`);
                }}
                className="text-xs text-text-secondary bg-surface/50 border border-border/60 hover:border-accent/30 hover:text-accent px-3 py-1.5 rounded-full transition-all duration-200 font-medium cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Failures Preview */}
      <section className="py-20 border-t border-border/60 bg-surface/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="text-xs text-accent font-bold uppercase tracking-widest mb-1.5">Failures Database</div>
              <h2 className="text-3xl font-display font-extrabold text-text-primary">Featured Postmortems</h2>
            </div>
            <Link to="/explore" className="text-sm font-semibold text-accent hover:text-indigo-400 flex items-center gap-1 group">
              Explore All Failures
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-[280px] glass-card animate-pulse bg-surface-2/40" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((startup) => (
                <StartupCard key={startup.id} {...startup} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trending Failure Patterns */}
      <section className="py-20 border-t border-border/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-xs text-accent font-bold uppercase tracking-widest mb-2">Macro Analysis</div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold">Trending Failure Patterns</h2>
            <p className="text-text-secondary mt-3 max-w-xl mx-auto">
              We catalog the root strategic errors that destroy high-growth companies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingPatterns.map((pattern, idx) => (
              <Link to={`/explore?q=${pattern.category}`} key={idx} className="group block">
                <div className={`h-full border bg-gradient-to-b ${pattern.color} p-6 rounded-card transition-all duration-300 group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] group-hover:border-accent/40`}>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-3xl font-display font-bold font-data">{pattern.share}</span>
                    <AlertTriangle className="w-5 h-5 opacity-60" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-accent transition-colors">{pattern.label}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{pattern.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Failure Heatmap */}
      <section className="py-20 border-t border-border/60 bg-surface/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-1">
              <div className="text-xs text-accent font-bold uppercase tracking-widest mb-2">System Risk</div>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold leading-tight">Industry Risk Heatmap</h2>
              <p className="text-text-secondary mt-4 leading-relaxed">
                Aggregated failure indices across key sectors. Food tech and direct-to-consumer delivery present critical operational hazards, while SaaS is structurally safer.
              </p>
              <div className="mt-8">
                <Link to="/insights" className="inline-flex items-center gap-2 bg-surface-2 hover:bg-border text-text-primary px-6 py-3 rounded-full text-sm font-semibold transition-colors duration-200">
                  <BarChart3 className="w-4 h-4" />
                  View Failure Insights
                </Link>
              </div>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {industryHeatmap.map((ind, i) => (
                <div key={i} className="glass-card p-5 border border-border/60 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-text-primary text-base">{ind.name}</h3>
                    <div className="text-xs text-text-muted mt-1">Overall Failure Rate</div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${ind.color}`}>
                      {ind.risk}
                    </span>
                    <div className="text-xl font-data font-bold text-text-primary mt-1">{ind.rate}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 border-t border-border/60 relative">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="glass-card p-12 relative overflow-hidden bg-gradient-to-br from-surface to-bg border border-accent/20">
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-accent/10 rounded-full blur-[100px]" />
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold mb-4">Are you building a startup?</h2>
            <p className="text-text-secondary mb-8 max-w-xl mx-auto text-base">
              Test your business model constraints against our catalog of 12,437 historical failure points in 30 seconds.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/scan" className="bg-accent hover:bg-indigo-600 text-white font-bold px-8 py-3.5 rounded-full flex items-center justify-center gap-2 transition-all shadow-lg text-sm sm:text-base">
                <ShieldAlert className="w-5 h-5" />
                Scan Idea for Risk
              </Link>
              <Link to="/explore" className="bg-surface-2 hover:bg-border text-text-primary font-semibold px-8 py-3.5 rounded-full transition-colors text-sm sm:text-base">
                Search Archive
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Radial Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-20 w-full h-[600px] pointer-events-none opacity-25">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[140px]" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-accent-2/20 rounded-full blur-[120px]" />
      </div>
    </div>
  );
};

export default LandingPage;
import React from 'react';
import { Link } from 'react-router-dom';
import { GitCompare, ArrowRight } from 'lucide-react';
import api from '../lib/api';

const formatINR = (val) => {
  if (!val) return 'Undisclosed';
  const num = Number(val);
  if (num >= 1000000000) return `₹${(num / 1000000000).toFixed(1)} B`;
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)} L`;
  return `₹${num.toLocaleString('en-IN')}`;
};

const CompareStartups = () => {
  const [startups, setStartups] = React.useState([]);
  const [leftSlug, setLeftSlug] = React.useState('');
  const [rightSlug, setRightSlug] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadStartups = async () => {
      try {
        const { data } = await api.get('/startups?limit=100&sort=name&order=asc');
        const rows = data.data || [];
        setStartups(rows);
        setLeftSlug(rows[0]?.slug || '');
        setRightSlug(rows[1]?.slug || rows[0]?.slug || '');
      } finally {
        setLoading(false);
      }
    };
    loadStartups();
  }, []);

  const left = startups.find((s) => s.slug === leftSlug);
  const right = startups.find((s) => s.slug === rightSlug);
  const metrics = [
    ['Industry', left?.industry, right?.industry],
    ['Outcome', left?.status, right?.status],
    ['Founded', left?.foundingYear, right?.foundingYear],
    ['Shutdown', left?.shutdownYear || 'N/A', right?.shutdownYear || 'N/A'],
    ['Lifetime', left?.lifetimeMonths ? `${left.lifetimeMonths} months` : 'N/A', right?.lifetimeMonths ? `${right.lifetimeMonths} months` : 'N/A'],
    ['Funding', formatINR(left?.fundingInr), formatINR(right?.fundingInr)],
    ['Peak users', left?.peakUsers?.toLocaleString() || 'N/A', right?.peakUsers?.toLocaleString() || 'N/A'],
    ['Primary failure', left?.topFailureReason?.replace(/_/g, ' ') || 'N/A', right?.topFailureReason?.replace(/_/g, ' ') || 'N/A'],
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-accent text-xs font-semibold uppercase tracking-wider mb-3">
          <GitCompare className="w-4 h-4" />
          Comparative Postmortems
        </div>
        <h1 className="text-4xl font-display font-extrabold">Compare Startups</h1>
        <p className="text-text-secondary mt-2 max-w-xl mx-auto">Put two failures side-by-side and spot the pattern differences quickly.</p>
      </div>

      {loading ? (
        <div className="h-96 glass-card animate-pulse" />
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 border-b border-border">
            <div className="p-5 bg-bg/30 hidden md:block" />
            <div className="p-5 border-b md:border-b-0 md:border-l border-border">
              <select value={leftSlug} onChange={(e) => setLeftSlug(e.target.value)} className="w-full bg-surface-2 border border-border rounded-lg p-3 focus:outline-none focus:border-accent">
                {startups.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
              </select>
            </div>
            <div className="p-5 md:border-l border-border">
              <select value={rightSlug} onChange={(e) => setRightSlug(e.target.value)} className="w-full bg-surface-2 border border-border rounded-lg p-3 focus:outline-none focus:border-accent">
                {startups.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
              </select>
            </div>
          </div>

          {left && right && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 border-b border-border">
                <div className="p-5 bg-bg/30 text-xs uppercase tracking-wider font-bold text-text-muted">Summary</div>
                <div className="p-5 md:border-l border-border">
                  <h2 className="text-xl font-display font-bold mb-2">{left.name}</h2>
                  <p className="text-sm text-text-secondary leading-relaxed">{left.summary}</p>
                  <Link to={`/startup/${left.slug}`} className="mt-4 inline-flex items-center gap-1 text-accent text-sm font-semibold">
                    View postmortem <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="p-5 md:border-l border-border">
                  <h2 className="text-xl font-display font-bold mb-2">{right.name}</h2>
                  <p className="text-sm text-text-secondary leading-relaxed">{right.summary}</p>
                  <Link to={`/startup/${right.slug}`} className="mt-4 inline-flex items-center gap-1 text-accent text-sm font-semibold">
                    View postmortem <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {metrics.map(([label, a, b]) => (
                <div key={label} className="grid grid-cols-1 md:grid-cols-3 border-b border-border last:border-b-0">
                  <div className="p-4 bg-bg/30 text-xs uppercase tracking-wider font-bold text-text-muted">{label}</div>
                  <div className="p-4 md:border-l border-border text-sm font-semibold capitalize">{a}</div>
                  <div className="p-4 md:border-l border-border text-sm font-semibold capitalize">{b}</div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CompareStartups;

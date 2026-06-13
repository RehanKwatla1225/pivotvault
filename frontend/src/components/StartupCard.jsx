import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, DollarSign, ArrowRight, ShieldAlert } from 'lucide-react';
import { clsx } from 'clsx';
import BookmarkButton from './BookmarkButton';

const StartupCard = ({ name, slug, status, industry, fundingInr, peakUsers, lifetimeMonths, summary, topFailureReason, foundingYear, shutdownYear }) => {
  const formatINR = (val) => {
    if (!val) return 'Undisclosed';
    const num = Number(val);
    if (num >= 1000000000) return `₹${(num / 1000000000).toFixed(1)} B`;
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)} L`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  // Compute a deterministic failure score (40-100)
  const getFailureScore = (reason) => {
    if (!reason) return 72;
    const r = reason.toLowerCase();
    if (r.includes('fraud') || r.includes('ethics')) return 99;
    if (r.includes('pmf') || r.includes('product-market')) return 95;
    if (r.includes('unit_economics') || r.includes('economics')) return 92;
    if (r.includes('cashflow') || r.includes('burn') || r.includes('cac')) return 88;
    if (r.includes('competition')) return 85;
    if (r.includes('legal') || r.includes('regulation')) return 82;
    if (r.includes('timing')) return 78;
    return 74;
  };

  const failureScore = getFailureScore(topFailureReason);

  const statusColors = {
    failed: 'bg-red-500/10 text-danger border-red-500/20',
    acquired: 'bg-emerald-500/10 text-success border-emerald-500/20',
    pivoted: 'bg-amber-500/10 text-warning border-amber-500/20',
    zombie: 'bg-slate-500/10 text-text-secondary border-slate-500/20',
  };

  // Custom logo color based on hash of the name
  const getLogoGradient = (str) => {
    const hash = str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const gradients = [
      'from-pink-500 to-rose-500',
      'from-purple-600 to-indigo-600',
      'from-blue-500 to-cyan-500',
      'from-emerald-500 to-teal-500',
      'from-amber-500 to-orange-500',
      'from-violet-500 to-fuchsia-500',
    ];
    return gradients[hash % gradients.length];
  };

  const cleanReason = topFailureReason
    ? topFailureReason.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    : 'Market Friction';

  return (
    <Link to={`/startup/${slug}`} className="group block h-full">
      <div className="glass-card p-6 h-full flex flex-col hover:-translate-y-2 hover:border-accent/30 hover:shadow-[0_12px_30px_rgba(109,94,245,0.18)] transition-all duration-350 relative overflow-hidden">
        
        {/* Glow overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="flex items-start justify-between mb-5 relative z-10">
          <div className={clsx(
            "w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-lg text-white shadow-md bg-gradient-to-br",
            getLogoGradient(name)
          )}>
            {name.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <BookmarkButton slug={slug} />
            <span className={clsx(
              'px-2.5 py-0.5 rounded-badge text-[10px] font-bold uppercase tracking-wider border',
              statusColors[status] || statusColors.failed
            )}>
              {status}
            </span>
            <span className="text-[10px] text-text-secondary bg-surface-2/80 px-2 py-0.5 rounded-badge border border-border/40 font-data">
              {foundingYear && shutdownYear ? `${foundingYear} - ${shutdownYear}` : `${lifetimeMonths || 12} Mo.`}
            </span>
          </div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col">
          <h3 className="text-xl font-display font-bold mb-1 text-text-primary group-hover:text-accent transition-colors duration-200">{name}</h3>
          <p className="text-xs text-accent font-semibold tracking-wider uppercase mb-3">{industry}</p>
          
          <p className="text-sm text-text-secondary line-clamp-3 mb-5 leading-relaxed flex-1">
            {summary}
          </p>

          <div className="grid grid-cols-2 gap-4 py-3 border-y border-border/50 mb-4 bg-bg/30 px-3 rounded-lg">
            <div>
              <div className="text-[9px] uppercase tracking-wider text-text-muted mb-0.5 font-bold">Capital Raised</div>
              <div className="flex items-center gap-1 text-xs font-semibold text-text-primary font-data">
                <DollarSign className="w-3.5 h-3.5 text-accent" />
                {formatINR(fundingInr)}
              </div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-wider text-text-muted mb-0.5 font-bold">Failure Score</div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-danger font-data">
                <ShieldAlert className="w-3.5 h-3.5" />
                {failureScore}%
              </div>
            </div>
          </div>
        </div>

        {/* Action / Expand Preview Area */}
        <div className="relative z-10 flex items-center justify-between mt-2 pt-1">
          <div className="text-xs text-text-muted font-medium group-hover:text-text-secondary transition-colors">
            Core Root: <span className="text-danger font-semibold">{cleanReason}</span>
          </div>
          <span className="text-accent group-hover:translate-x-1.5 transition-transform duration-300">
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default StartupCard;

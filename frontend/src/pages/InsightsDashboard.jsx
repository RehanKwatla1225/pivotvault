import { Link } from "react-router-dom";
import React from 'react';
import axios from 'axios';
import CountUp from 'react-countup';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend, AreaChart, Area
} from 'recharts';
import { 
  TrendingDown, PieChart as PieIcon, BarChart3, Clock, 
  Skull, AlertTriangle, ShieldAlert, DollarSign 
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const InsightsDashboard = () => {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/insights`); 
        setData(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatTotalFunding = (val) => {
    if (!val) return 'Undisclosed';
    const num = Number(val);
    if (num >= 100000000000) return `₹${(num / 100000000000).toFixed(1)} L Cr`;
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(0)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(0)} L`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  if (loading) {
    return (
      <div className="py-40 text-center animate-pulse text-accent font-data flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
        COMPUTING FAILURE METRICS...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-40 text-center text-danger max-w-sm mx-auto">
        <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
        <h2 className="text-lg font-bold">Failed to load insights</h2>
        <p className="text-text-secondary text-sm mt-2">Check database connection or backend deployment status.</p>
      </div>
    );
  }

  const COLORS = ['#6D5EF5', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899'];
  const metrics = data.metrics || {
    totalFailed: 12437,
    totalFundingLost: '145250000000',
    mostCommonReason: 'pmf',
    fastestCollapse: 'FitAI (3 Months)',
    industryRiskScore: 78
  };

  const cleanMostCommonReason = metrics.mostCommonReason
    ? metrics.mostCommonReason.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    : 'No PMF';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <div className="text-xs text-accent font-bold uppercase tracking-widest mb-1.5 font-data">Analytics Dashboard</div>
        <h1 className="text-4xl font-display font-extrabold text-text-primary">Failure Insights</h1>
        <p className="text-text-secondary text-base mt-2 max-w-xl">
          Aggregated diagnostic metrics across documented startup failures to identify systemic industry risks.
        </p>
      </div>

      {/* Glassmorphic Metric Cards with CountUp */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        
        {/* Total Failed */}
        <div className="glass-card p-5 bg-surface/40 flex flex-col justify-between">
          <div>
            <Skull className="w-5 h-5 text-accent mb-3" />
            <div className="text-[10px] uppercase tracking-wider text-text-muted font-bold">Failures Documented</div>
          </div>
          <div className="text-2xl sm:text-3xl font-data font-bold mt-4 text-text-primary">
            <CountUp end={metrics.totalFailed} duration={2} separator="," />
          </div>
        </div>

        {/* Total Funding Lost */}
        <div className="glass-card p-5 bg-surface/40 flex flex-col justify-between">
          <div>
            <DollarSign className="w-5 h-5 text-success mb-3" />
            <div className="text-[10px] uppercase tracking-wider text-text-muted font-bold">Capital Dissolved</div>
          </div>
          <div className="text-xl sm:text-2xl font-data font-bold mt-4 text-text-primary">
            {formatTotalFunding(metrics.totalFundingLost)}
          </div>
        </div>

        {/* Primary Failure Reason */}
        <div className="glass-card p-5 bg-surface/40 flex flex-col justify-between">
          <div>
            <AlertTriangle className="w-5 h-5 text-warning mb-3" />
            <div className="text-[10px] uppercase tracking-wider text-text-muted font-bold">Primary Killer</div>
          </div>
          <div className="text-base sm:text-lg font-bold mt-4 text-text-primary truncate">
            {cleanMostCommonReason}
          </div>
        </div>

        {/* Fastest Collapse */}
        <div className="glass-card p-5 bg-surface/40 flex flex-col justify-between">
          <div>
            <Clock className="w-5 h-5 text-danger mb-3" />
            <div className="text-[10px] uppercase tracking-wider text-text-muted font-bold">Fastest Collapse</div>
          </div>
          <div className="text-xs sm:text-sm font-semibold mt-4 text-text-primary truncate">
            {metrics.fastestCollapse}
          </div>
        </div>

        {/* Industry Risk Score */}
        <div className="glass-card p-5 bg-surface/40 flex flex-col justify-between col-span-2 sm:col-span-1">
          <div>
            <ShieldAlert className="w-5 h-5 text-accent-2 mb-3" />
            <div className="text-[10px] uppercase tracking-wider text-text-muted font-bold">Market Risk Factor</div>
          </div>
          <div className="text-2xl sm:text-3xl font-data font-bold mt-4 text-accent-2">
            <CountUp end={metrics.industryRiskScore} duration={2.5} />%
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Industry breakdown pie chart */}
        <div className="glass-card p-6 sm:p-8 bg-surface/30">
          <h3 className="text-lg font-display font-bold mb-6 flex items-center gap-2 text-text-primary">
            <PieIcon className="w-4.5 h-4.5 text-accent" />
            Failures by Sector
          </h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.industryBreakdown}
                  dataKey="count"
                  nameKey="industry"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  stroke="#111827"
                  strokeWidth={2}
                >
                  {(data.industryBreakdown || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #1F2937', borderRadius: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 10 Failure Killers bar chart */}
        <div className="glass-card p-6 sm:p-8 bg-surface/30">
          <h3 className="text-lg font-display font-bold mb-6 flex items-center gap-2 text-text-primary">
            <BarChart3 className="w-4.5 h-4.5 text-accent" />
            Top 10 Failure Modes
          </h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topFailureReasonsByIndustry} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="category" 
                  type="category" 
                  tick={{ fill: '#94A3B8', fontSize: 10 }}
                  tickFormatter={(val) => val.toUpperCase().replace(/_/g, ' ')}
                  width={110}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(109, 94, 245, 0.03)' }}
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #1F2937', borderRadius: '12px' }}
                />
                <Bar dataKey="count" fill="#8B5CF6" radius={[0, 4, 4, 0]} barSize={16}>
                  {(data.topFailureReasonsByIndustry || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#6D5EF5' : '#8B5CF6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Yearly shutdown trend */}
        <div className="lg:col-span-2 glass-card p-6 sm:p-8 bg-surface/30">
          <h3 className="text-lg font-display font-bold mb-6 flex items-center gap-2 text-text-primary">
            <TrendingDown className="w-4.5 h-4.5 text-accent" />
            Annual Shutdown Density
          </h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.yearlyTrends}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6D5EF5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6D5EF5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis dataKey="year" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #1F2937', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="count" stroke="#6D5EF5" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top viewed list */}
        <div className="glass-card p-6 sm:p-8 bg-surface/30">
          <h3 className="text-lg font-display font-bold mb-6 flex items-center gap-2 text-text-primary">
            <Clock className="w-4.5 h-4.5 text-accent" />
            Most Studied Postmortems
          </h3>
          <div className="space-y-4">
            {(data.topViewed || []).map((item, i) => (
              <Link 
                key={i} 
                to={`/startup/${item.slug}`} 
                className="flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-border/60 hover:bg-surface-2/40 transition-all duration-200 group"
              >
                <div>
                  <div className="font-bold text-text-primary group-hover:text-accent transition-colors text-sm sm:text-base">{item.name}</div>
                  <div className="text-[10px] text-text-muted uppercase font-bold tracking-wider mt-0.5">{item.industry}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-data font-bold text-accent-2">{item.lifetimeMonths} Mo.</div>
                  <div className="text-[9px] text-text-muted uppercase tracking-wider mt-0.5">Lifespan</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* VC Anti-Portfolio: Death Zones */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-display font-bold text-text-primary flex items-center gap-3">
              <Skull className="w-6 h-6 text-red" />
              VC Anti-Portfolio: Death Zones
            </h2>
            <p className="text-text-secondary text-sm mt-1">Sectors showing the highest failure intensity and shortest lifespans.</p>
          </div>
          <div className="hidden sm:block px-4 py-1.5 rounded-full bg-red/10 border border-red/20 text-red text-[10px] font-bold uppercase tracking-widest">
            Critical Risk Warning
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(data.deathZones || []).map((zone, i) => (
            <div 
              key={i} 
              className={clsx(
                "glass-card p-6 border-l-4 transition-all hover:scale-[1.02]",
                zone.riskLevel === 'extreme' ? "border-l-red bg-red/5" : 
                zone.riskLevel === 'critical' ? "border-l-orange-600 bg-orange-600/5" : "border-l-warning bg-warning/5"
              )}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="text-lg font-bold text-text-primary">{zone.industry}</div>
                <div className={clsx(
                  "text-[9px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded",
                  zone.riskLevel === 'extreme' ? "bg-red text-white" : 
                  zone.riskLevel === 'critical' ? "bg-orange-600 text-white" : "bg-warning text-black"
                )}>
                  {zone.riskLevel}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-[10px] text-text-muted uppercase font-bold mb-1">Failures</div>
                  <div className="text-xl font-data font-bold text-text-primary">{zone.deathCount}</div>
                </div>
                <div>
                  <div className="text-[10px] text-text-muted uppercase font-bold mb-1">Avg. Life</div>
                  <div className="text-xl font-data font-bold text-text-primary">{zone.avgLifespan} Mo</div>
                </div>
              </div>

              <div className="text-xs text-text-secondary leading-relaxed border-t border-border/20 pt-4">
                <span className="font-bold text-text-muted mr-1">ANALYSIS:</span>
                {zone.reason}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InsightsDashboard;

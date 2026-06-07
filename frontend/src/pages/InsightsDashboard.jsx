import React from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend
} from 'recharts';
import { TrendingDown, PieChart as PieIcon, BarChart3, Clock } from 'lucide-react';

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

  if (loading) {
  return (
    <div className="py-40 text-center animate-pulse text-accent font-data">
      LOADING INSIGHTS...
    </div>
  );
}

if (!data) {
  return (
    <div className="py-40 text-center text-red-500">
      Failed to load insights data. Check backend connection.
    </div>
  );
}
  const COLORS = ['#F97316', '#8B5CF6', '#10B981', '#EF4444', '#06B6D4', '#F59E0B'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="mb-16">
        <h1 className="text-5xl font-display font-bold mb-4">Failure Insights</h1>
        <p className="text-text-secondary text-lg">Aggregated analytics across {(data.industryBreakdown || []).reduce((a,b)=>a+b.count, 0)} startup failures to identify macro-level survival patterns.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Industry Breakdown */}
        <div className="glass-card p-8">
          <h3 className="text-xl font-display font-bold mb-8 flex items-center gap-3">
            <PieIcon className="w-5 h-5 text-accent" />
            Failures by Industry
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.industryBreakdown}
                  dataKey="count"
                  nameKey="industry"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  stroke="none"
                >
                  {(data.industryBreakdown || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #1E293B', borderRadius: '8px' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Failure Categories */}
        <div className="glass-card p-8">
          <h3 className="text-xl font-display font-bold mb-8 flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-accent" />
            Top 10 Failure Killers
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topFailureReasonsByIndustry} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="category" 
                  type="category" 
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                  tickFormatter={(val) => val.toUpperCase()}
                  width={100}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #1E293B', borderRadius: '8px' }}
                />
                <Bar dataKey="count" fill="#F97316" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Yearly Trend */}
        <div className="lg:col-span-2 glass-card p-8">
          <h3 className="text-xl font-display font-bold mb-8 flex items-center gap-3">
            <TrendingDown className="w-5 h-5 text-accent" />
            Annual Shutdown Volume
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.yearlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="year" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #1E293B', borderRadius: '8px' }}
                />
                <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Viewed List */}
        <div className="glass-card p-8">
          <h3 className="text-xl font-display font-bold mb-8 flex items-center gap-3">
            <Clock className="w-5 h-5 text-accent" />
            Most Viewed Archives
          </h3>
          <div className="space-y-6">
            {(data.topViewed || []).map((item, i) => (
              <a key={i} href={`/startup/${item.slug}`} className="flex items-center justify-between group">
                <div>
                  <div className="font-bold group-hover:text-accent transition-colors">{item.name}</div>
                  <div className="text-[10px] text-text-muted uppercase font-bold">{item.industry}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-data font-bold text-accent-2">{item.lifetimeMonths} Mo.</div>
                  <div className="text-[9px] text-text-muted uppercase">Lifetime</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsDashboard;

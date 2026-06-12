import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import StartupCard from '../components/StartupCard';
import { Search, Filter, X, SlidersHorizontal, ArrowUpDown, ChevronDown } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const FailureExplorer = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [startups, setStartups] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [total, setTotal] = React.useState(0);
  const [showMobileFilters, setShowMobileFilters] = React.useState(false);

  const query = searchParams.get('q') || '';
  const industry = searchParams.get('industry') || '';
  const status = searchParams.get('status') || '';
  const country = searchParams.get('country') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'name';
  const order = searchParams.get('order') || 'asc';

  React.useEffect(() => {
    const fetchStartups = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/api/startups`, {
          params: Object.fromEntries(searchParams)
        });
        setStartups(response.data.data);
        setTotal(response.data.total);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStartups();
  }, [searchParams]);

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setShowMobileFilters(false);
  };

  const industries = [
    'Consumer Hardware', 'Media / Entertainment', 'Health Tech', 'E-Commerce', 
    'Grocery Delivery', 'Entertainment', 'Marketplace', 'Home Services', 
    'Wearables', 'Social Media', 'Music Streaming', 'Logistics'
  ];

  const failureCategories = [
    { key: 'pmf', label: 'No PMF' },
    { key: 'unit_economics', label: 'Unit Economics' },
    { key: 'cashflow', label: 'Cash Burn' },
    { key: 'competition', label: 'Competition' },
    { key: 'legal', label: 'Legal & Regulatory' },
    { key: 'product', label: 'Product Quality' },
    { key: 'timing', label: 'Poor Timing' }
  ];

  const sidebarContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border/80">
        <h3 className="font-display font-bold text-lg flex items-center gap-2">
          <SlidersHorizontal className="w-4.5 h-4.5 text-accent" />
          Filter Archive
        </h3>
        {Object.keys(Object.fromEntries(searchParams)).length > 0 && (
          <button 
            onClick={clearAllFilters}
            className="text-xs text-accent hover:underline flex items-center gap-1 font-semibold"
          >
            <X className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      {/* Industry Filter */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Industry</label>
        <div className="relative">
          <select 
            className="w-full bg-surface-2 border border-border/80 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent text-text-primary appearance-none cursor-pointer"
            value={industry}
            onChange={(e) => handleFilterChange('industry', e.target.value)}
          >
            <option value="">All Industries</option>
            {industries.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
        </div>
      </div>

      {/* Stage / Status Filter */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Failure Outcome</label>
        <div className="relative">
          <select 
            className="w-full bg-surface-2 border border-border/80 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent text-text-primary appearance-none cursor-pointer"
            value={status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Outcomes</option>
            <option value="failed">Failed / Liquidated</option>
            <option value="acquired">Acquired / Asset Sale</option>
            <option value="pivoted">Pivoted / Rebranded</option>
            <option value="zombie">Zombie State</option>
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
        </div>
      </div>

      {/* Failure Mode Filter */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Primary Failure Mode</label>
        <div className="relative">
          <select 
            className="w-full bg-surface-2 border border-border/80 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent text-text-primary appearance-none cursor-pointer"
            value={category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All Failure Modes</option>
            {failureCategories.map((cat) => (
              <option key={cat.key} value={cat.key}>{cat.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
        </div>
      </div>

      {/* Origin Country */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Country of Origin</label>
        <div className="relative">
          <select 
            className="w-full bg-surface-2 border border-border/80 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent text-text-primary appearance-none cursor-pointer"
            value={country}
            onChange={(e) => handleFilterChange('country', e.target.value)}
          >
            <option value="">All Countries</option>
            <option value="USA">USA</option>
            <option value="India">India</option>
            <option value="Europe">Europe</option>
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
        </div>
      </div>

      {/* Sort Metrics */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Sort Archives</label>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <select 
              className="w-full bg-surface-2 border border-border/80 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-accent text-text-primary appearance-none cursor-pointer"
              value={sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
            >
              <option value="name">Name</option>
              <option value="funding">Capital Raised</option>
              <option value="lifetime">Lifespan</option>
              <option value="users">Peak Users</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-text-secondary pointer-events-none" />
          </div>
          <div className="relative">
            <select 
              className="w-full bg-surface-2 border border-border/80 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-accent text-text-primary appearance-none cursor-pointer"
              value={order}
              onChange={(e) => handleFilterChange('order', e.target.value)}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-text-secondary pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Top title and Search Bar */}
      <div className="mb-10">
        <div className="text-xs text-accent font-bold uppercase tracking-widest mb-1.5 font-data">Discovery Deck</div>
        <h1 className="text-4xl font-display font-extrabold text-text-primary mb-6">Failure Explorer</h1>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Search startup name, industry description, or key lessons..."
              className="w-full bg-surface/80 border border-border/80 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-accent text-text-primary focus:shadow-[0_0_12px_rgba(109,94,245,0.1)] transition-all"
              value={query}
              onChange={(e) => handleFilterChange('q', e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowMobileFilters(true)}
            className="sm:hidden flex items-center justify-center gap-2 bg-surface-2 border border-border px-4 py-3.5 rounded-xl text-text-secondary font-semibold hover:text-white"
          >
            <Filter className="w-5 h-5 text-accent" />
            Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sticky Filter sidebar for desktop */}
        <aside className="hidden lg:block lg:col-span-1 bg-surface/50 border border-border/60 p-6 rounded-card sticky top-24">
          {sidebarContent}
        </aside>

        {/* Startups dynamic grid */}
        <div className="lg:col-span-3">
          <div className="mb-6 flex justify-between items-center text-xs text-text-secondary">
            <div>
              Showing <span className="text-text-primary font-bold">{startups.length}</span> of <span className="text-text-primary font-bold">{total}</span> documented failures
            </div>
            {Object.keys(Object.fromEntries(searchParams)).length > 0 && (
              <button 
                onClick={clearAllFilters}
                className="text-accent hover:underline flex items-center gap-1 font-semibold"
              >
                Clear all filters
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-[280px] glass-card animate-pulse bg-surface-2/30" />
              ))}
            </div>
          ) : startups.length > 0 ? (
            <motion.div 
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.08
                  }
                }
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {startups.map((startup, idx) => (
                <motion.div
                  key={startup.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
                  }}
                >
                  <StartupCard {...startup} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-24 bg-surface/10 rounded-card border border-dashed border-border/60">
              <AlertTriangle className="w-12 h-12 text-warning mx-auto mb-4 animate-bounce" />
              <h3 className="text-lg font-bold text-text-primary">No postmortems found</h3>
              <p className="text-text-secondary text-sm mt-2 max-w-sm mx-auto">
                No archived startups matched your current filters. Try searching for other terms or resetting filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-6 bg-accent hover:bg-indigo-600 text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-md transition-colors"
              >
                Reset Filter Config
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Filter modal */}
      <AnimatePresence>
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="relative w-80 max-w-full bg-surface border-l border-border h-full p-6 overflow-y-auto flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-border/80 mb-6">
                  <h2 className="font-display font-bold text-lg">Filters</h2>
                  <button 
                    onClick={() => setShowMobileFilters(false)}
                    className="p-1 text-text-secondary hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                {sidebarContent}
              </div>
              <div className="mt-8 pt-4 border-t border-border/80 flex gap-3">
                <button
                  onClick={clearAllFilters}
                  className="flex-1 bg-surface-2 text-text-primary py-3 rounded-lg text-sm font-semibold hover:bg-border transition-colors"
                >
                  Reset All
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 bg-accent text-white py-3 rounded-lg text-sm font-semibold hover:bg-indigo-600 transition-colors shadow-md"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FailureExplorer;
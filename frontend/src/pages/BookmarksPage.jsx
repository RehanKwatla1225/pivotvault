import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, ArrowRight, RefreshCw } from 'lucide-react';
import api from '../lib/api';
import StartupCard from '../components/StartupCard';
import { useBookmarks } from '../context/BookmarkContext';

const BookmarksPage = () => {
  const { refresh } = useBookmarks();
  const [startups, setStartups] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const loadBookmarks = React.useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/bookmarks');
      setStartups(data.data || []);
      await refresh();
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  React.useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <div className="text-xs text-accent font-bold uppercase tracking-widest mb-2">Personal Vault</div>
          <h1 className="text-4xl font-display font-extrabold">Saved Failures</h1>
          <p className="text-text-secondary mt-2">Your private reading list of postmortems worth revisiting.</p>
        </div>
        <button
          onClick={loadBookmarks}
          className="inline-flex items-center justify-center gap-2 bg-surface-2 border border-border px-4 py-2.5 rounded-lg text-sm font-semibold text-text-secondary hover:text-text-primary"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <div key={i} className="h-[280px] glass-card animate-pulse" />)}
        </div>
      ) : startups.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {startups.map((startup) => <StartupCard key={startup.id} {...startup} />)}
        </div>
      ) : (
        <div className="glass-card p-10 text-center max-w-xl mx-auto">
          <Bookmark className="w-12 h-12 text-accent mx-auto mb-4" />
          <h2 className="text-xl font-display font-bold mb-2">No saved postmortems yet</h2>
          <p className="text-text-secondary text-sm mb-6">Use the bookmark icon on startup cards to build your founder lesson vault.</p>
          <Link to="/explore" className="inline-flex items-center gap-2 bg-accent text-white px-5 py-3 rounded-lg font-bold">
            Explore failures <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default BookmarksPage;

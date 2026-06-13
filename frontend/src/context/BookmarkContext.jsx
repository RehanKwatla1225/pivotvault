import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../lib/api';
import { useAuth } from './AuthContext';

const BookmarkContext = createContext({ slugs: [], isBookmarked: () => false, toggleBookmark: () => {}, refresh: () => {} });

export const BookmarkProvider = ({ children }) => {
  const { isAuthed } = useAuth();
  const [slugs, setSlugs] = useState([]);

  const refresh = useCallback(async () => {
    if (!isAuthed) {
      setSlugs([]);
      return;
    }
    try {
      const { data } = await api.get('/bookmarks');
      setSlugs(data.slugs || []);
    } catch {
      setSlugs([]);
    }
  }, [isAuthed]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isBookmarked = useCallback((slug) => slugs.includes(slug), [slugs]);

  const toggleBookmark = useCallback(
    async (slug) => {
      const currentlyOn = slugs.includes(slug);
      // optimistic update
      setSlugs((prev) => (currentlyOn ? prev.filter((s) => s !== slug) : [...prev, slug]));
      try {
        if (currentlyOn) {
          await api.delete(`/bookmarks/${slug}`);
        } else {
          await api.post('/bookmarks', { slug });
        }
      } catch {
        // revert on failure
        refresh();
      }
    },
    [slugs, refresh]
  );

  return (
    <BookmarkContext.Provider value={{ slugs, isBookmarked, toggleBookmark, refresh }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => useContext(BookmarkContext);

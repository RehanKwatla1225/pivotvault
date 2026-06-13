import React from 'react';
import { Bookmark } from 'lucide-react';
import { clsx } from 'clsx';
import { useBookmarks } from '../context/BookmarkContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const BookmarkButton = ({ slug, className }) => {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { isAuthed } = useAuth();
  const navigate = useNavigate();
  const active = isBookmarked(slug);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthed) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    toggleBookmark(slug);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={active ? 'Remove bookmark' : 'Save startup'}
      className={clsx(
        'p-2 rounded-lg border transition-all',
        active
          ? 'bg-accent/15 border-accent/40 text-accent'
          : 'bg-surface-2/60 border-border/60 text-text-muted hover:text-accent hover:border-accent/30',
        className
      )}
    >
      <Bookmark className={clsx('w-4 h-4', active && 'fill-current')} />
    </button>
  );
};

export default BookmarkButton;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Skull, Search, Zap, BarChart2, MessageSquare, Share2, Menu, X, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Explore', path: '/explore', icon: Search },
    { name: 'AI Assistant', path: '/assistant', icon: Sparkles },
    { name: 'Risk Scanner', path: '/scan', icon: Zap },
    { name: 'Insights', path: '/insights', icon: BarChart2 },
    { name: 'Graph', path: '/graph', icon: Share2 },
    { name: 'Confessions', path: '/confessions', icon: MessageSquare },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Skull className="w-8 h-8 text-accent animate-pulse" />
            <span className="font-display font-bold text-xl tracking-tight">PIVOTVAULT</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={clsx(
                  'flex items-center gap-2 text-sm font-medium transition-colors hover:text-accent',
                  location.pathname === link.path ? 'text-accent' : 'text-text-secondary'
                )}
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-text-secondary hover:text-white p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-b border-border bg-surface px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={clsx(
                'flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium',
                location.pathname === link.path ? 'bg-surface-2 text-accent' : 'text-text-secondary hover:bg-surface-2 hover:text-white'
              )}
            >
              <link.icon className="w-5 h-5" />
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
import React, { useState, useEffect } from 'react';
import { Menu, X, TerminalSquare, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const MobileNav = ({ resolvedTheme, onTerminalOpen, onPaletteOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const isDark = resolvedTheme === 'dark';

  // Close on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const navItems = [
    { label: 'Overview', href: '/#overview' },
    { label: 'Research', href: '/#research' },
    { label: 'Contact', href: '/#contact' },
    { label: 'CV', href: '/cv', isRoute: true },
  ];

  const linkClass = `text-2xl font-mono tracking-widest uppercase transition-colors ${
    isDark
      ? 'text-neutral-300 hover:text-emerald-500'
      : 'text-neutral-600 hover:text-indigo-600'
  }`;

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg transition-colors ${
          isDark
            ? 'text-neutral-300 hover:bg-neutral-800'
            : 'text-neutral-600 hover:bg-neutral-100'
        }`}
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ top: 0 }}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 backdrop-blur-xl ${
            isDark ? 'bg-black/90' : 'bg-white/90'
          }`}
          onClick={() => setIsOpen(false)}
        />

        {/* Nav content */}
        <nav className="relative z-10 flex flex-col items-center justify-center h-full gap-8">
          {navItems.map((item, i) => (
            <div
              key={item.label}
              className={`transform ${
                isOpen
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-4 opacity-0'
              }`}
              style={{
                transitionProperty: 'transform, opacity',
                transitionDuration: '300ms',
                transitionDelay: isOpen ? `${i * 75}ms` : '0ms',
              }}
            >
              {item.isRoute ? (
                <Link
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={linkClass}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={linkClass}
                >
                  {item.label}
                </a>
              )}
            </div>
          ))}

          {/* Divider */}
          <div
            className={`w-12 border-t ${isDark ? 'border-neutral-700' : 'border-neutral-300'}`}
            style={{
              transitionProperty: 'opacity',
              transitionDuration: '300ms',
              transitionDelay: isOpen ? `${navItems.length * 75}ms` : '0ms',
              opacity: isOpen ? 1 : 0,
            }}
          />

          {/* Terminal & Search buttons */}
          <div
            className={`flex gap-6 transform ${
              isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{
              transitionProperty: 'transform, opacity',
              transitionDuration: '300ms',
              transitionDelay: isOpen ? `${(navItems.length + 1) * 75}ms` : '0ms',
            }}
          >
            <button
              onClick={() => {
                setIsOpen(false);
                setTimeout(() => onTerminalOpen?.(), 150);
              }}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-colors ${
                isDark
                  ? 'text-neutral-400 hover:text-emerald-500 hover:bg-neutral-800/50'
                  : 'text-neutral-500 hover:text-indigo-600 hover:bg-neutral-100/50'
              }`}
              aria-label="Open terminal"
            >
              <TerminalSquare size={24} />
              <span className="text-xs font-mono tracking-wider uppercase">Terminal</span>
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                setTimeout(() => onPaletteOpen?.(), 150);
              }}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-colors ${
                isDark
                  ? 'text-neutral-400 hover:text-emerald-500 hover:bg-neutral-800/50'
                  : 'text-neutral-500 hover:text-indigo-600 hover:bg-neutral-100/50'
              }`}
              aria-label="Open search"
            >
              <Search size={24} />
              <span className="text-xs font-mono tracking-wider uppercase">Search</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default MobileNav;

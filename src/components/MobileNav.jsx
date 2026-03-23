import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const MobileNav = ({ resolvedTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();

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

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg transition-colors ${
          resolvedTheme === 'dark'
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
            resolvedTheme === 'dark' ? 'bg-black/90' : 'bg-white/90'
          }`}
          onClick={() => setIsOpen(false)}
        />

        {/* Nav content */}
        <nav className="relative z-10 flex flex-col items-center justify-center h-full gap-8">
          {navItems.map((item, i) => (
            <div
              key={item.label}
              className={`transform transition-all duration-300 ${
                isOpen
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: isOpen ? `${i * 75}ms` : '0ms' }}
            >
              {item.isRoute ? (
                <Link
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-2xl font-mono tracking-widest uppercase transition-colors ${
                    resolvedTheme === 'dark'
                      ? 'text-neutral-300 hover:text-emerald-500'
                      : 'text-neutral-600 hover:text-indigo-600'
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-2xl font-mono tracking-widest uppercase transition-colors ${
                    resolvedTheme === 'dark'
                      ? 'text-neutral-300 hover:text-emerald-500'
                      : 'text-neutral-600 hover:text-indigo-600'
                  }`}
                >
                  {item.label}
                </a>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default MobileNav;

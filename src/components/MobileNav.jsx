import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext.jsx';

const MobileNav = ({ onPaletteOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const { t } = useLang();

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
    { label: t.nav.overview, href: '/', isRoute: true },
    { label: t.locations.tokyo.name, href: '/work/tokyo', isRoute: true },
    { label: t.locations.singapore.name, href: '/work/singapore', isRoute: true },
    { label: 'CV', href: '/cv', isRoute: true },
  ];

  const linkClass = 'text-2xl font-light tracking-tight text-ink hover:text-accent transition-colors';

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full text-ink-2 hover:bg-mist transition-colors"
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Overlay — portaled to <body>: the glass nav's backdrop-filter would
          otherwise become the containing block for this fixed element */}
      {createPortal(
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="glass-veil absolute inset-0"
          onClick={() => setIsOpen(false)}
        />

        <nav className="relative z-10 flex flex-col items-center justify-center h-full gap-8">
          {navItems.map((item, i) => (
            <div
              key={item.label}
              className={`transform ${
                isOpen ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
              }`}
              style={{
                transitionProperty: 'transform, opacity',
                transitionDuration: '300ms',
                transitionDelay: isOpen ? `${i * 60}ms` : '0ms',
              }}
            >
              {item.isRoute ? (
                <Link to={item.href} onClick={() => setIsOpen(false)} className={linkClass}>
                  {item.label}
                </Link>
              ) : (
                <a href={item.href} onClick={() => setIsOpen(false)} className={linkClass}>
                  {item.label}
                </a>
              )}
            </div>
          ))}

          <button
            onClick={() => {
              setIsOpen(false);
              setTimeout(() => onPaletteOpen?.(), 150);
            }}
            className="flex items-center gap-2 mt-4 px-4 py-2 rounded-full border border-hairline text-sm text-ink-2 hover:text-ink transition-colors"
            style={{
              transitionProperty: 'opacity',
              transitionDuration: '300ms',
              transitionDelay: isOpen ? `${navItems.length * 60}ms` : '0ms',
              opacity: isOpen ? 1 : 0,
            }}
            aria-label="Open search"
          >
            <Search size={15} />
            <span>{t.footer.search_hint}</span>
          </button>
        </nav>
      </div>,
      document.body
      )}
    </div>
  );
};

export default MobileNav;

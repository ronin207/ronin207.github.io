import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { Sun, Moon, Monitor, Search } from 'lucide-react';
import useTheme from './hooks/useTheme.jsx';
import MobileNav from './components/MobileNav';
import PageTransition from './components/PageTransition';
import CommandPalette from './components/CommandPalette';
import { LanguageProvider, useLang } from './i18n/LanguageContext.jsx';
import Home from './pages/Home';

const Cv = lazy(() => import('./pages/Cv'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const NotFound = lazy(() => import('./pages/NotFound'));

const ThemeToggle = ({ theme, setTheme }) => {
  const options = [
    { value: 'light', icon: Sun, label: 'Switch to light mode' },
    { value: 'system', icon: Monitor, label: 'Switch to system theme' },
    { value: 'dark', icon: Moon, label: 'Switch to dark mode' },
  ];
  return (
    <div className="flex items-center gap-0.5 p-0.5 rounded-full border border-hairline">
      {options.map((option) => {
        const Icon = option.icon;
        return (
          <button
            key={option.value}
            onClick={() => setTheme(option.value)}
            className={`p-1.5 rounded-full transition-colors ${
              theme === option.value
                ? 'bg-mist text-ink'
                : 'text-ink-3 hover:text-ink-2'
            }`}
            aria-label={option.label}
            aria-pressed={theme === option.value}
          >
            <Icon size={13} />
          </button>
        );
      })}
    </div>
  );
};

const LanguageToggle = () => {
  const { lang, toggleLang } = useLang();
  return (
    <button
      onClick={toggleLang}
      className="px-2.5 py-1 rounded-full border border-hairline text-xs text-ink-3 hover:text-ink transition-colors"
      aria-label={lang === 'en' ? 'Switch to Japanese' : 'Switch to English'}
    >
      {lang === 'en' ? '日本語' : 'EN'}
    </button>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-sm text-ink-3">Loading…</div>
  </div>
);

function AppInner() {
  const { theme, setTheme } = useTheme();
  const { t } = useLang();
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
        return;
      }
      if (e.key === 'Escape') {
        setPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { key: 'work', label: t.nav.research },
    { key: 'contact', label: t.nav.contact },
  ];

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen font-sans text-ink bg-canvas transition-colors duration-300">
        <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />

        {/* Floating glass navigation (DESIGN.md §4.2, §10) */}
        <header className="fixed top-0 left-0 w-full z-50 px-4 pt-4">
          <nav className="glass max-w-3xl mx-auto rounded-2xl px-4 md:px-5 py-2.5 flex items-center justify-between">
            <Link to="/" className="text-sm font-medium tracking-tight text-ink">
              Takumi Otsuka
            </Link>

            <div className="flex items-center gap-2 md:gap-3">
              <div className="hidden md:flex items-center gap-1 mr-2">
                {navItems.map((item) => (
                  <a
                    key={item.key}
                    href={`/#${item.key}`}
                    className="px-3 py-1.5 rounded-full text-sm text-ink-2 hover:text-ink hover:bg-mist transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
                <Link
                  to="/cv"
                  className="px-3 py-1.5 rounded-full text-sm text-ink-2 hover:text-ink hover:bg-mist transition-colors"
                >
                  CV
                </Link>
                <button
                  onClick={() => setPaletteOpen(true)}
                  className="p-2 rounded-full text-ink-3 hover:text-ink hover:bg-mist transition-colors"
                  aria-label="Search"
                >
                  <Search size={14} />
                </button>
              </div>
              <LanguageToggle />
              <ThemeToggle theme={theme} setTheme={setTheme} />
              <MobileNav onPaletteOpen={() => setPaletteOpen(true)} />
            </div>
          </nav>
        </header>

        <main>
          <Suspense fallback={<LoadingFallback />}>
            <PageTransition>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cv" element={<Cv />} />
                <Route path="/projects/:slug" element={<ProjectDetail />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </PageTransition>
          </Suspense>
        </main>
      </div>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <LanguageProvider>
        <AppInner />
      </LanguageProvider>
    </Router>
  );
}

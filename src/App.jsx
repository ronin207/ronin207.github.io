import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { Sun, Moon, Monitor } from 'lucide-react';
import useTheme from './hooks/useTheme.jsx';
import { DecryptText } from './hooks/useScramble.jsx';
import MobileNav from './components/MobileNav';
import ScrollProgress from './components/ScrollProgress';
import PageTransition from './components/PageTransition';
import Terminal from './components/Terminal';
import CommandPalette from './components/CommandPalette';
import { LanguageProvider, useLang } from './i18n/LanguageContext.jsx';
import IntroAnimation from './components/IntroAnimation';
import Home from './pages/Home';

const Cv = lazy(() => import('./pages/Cv'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const NotFound = lazy(() => import('./pages/NotFound'));

/**
 * Component: Interactive Background
 * Adapts particle color based on the current theme.
 * Pauses when tab is hidden or user prefers reduced motion.
 */
const NeuralBackground = ({ theme }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let mouse = { x: null, y: null };
    let paused = false;

    const particleColor = theme === 'dark' ? 'rgba(150, 150, 150, 0.3)' : 'rgba(50, 50, 50, 0.2)';
    const lineColorBase = theme === 'dark' ? '150, 150, 150' : '50, 50, 50';

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    };

    const handleVisibility = () => {
      paused = document.hidden;
      if (!paused) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('visibilitychange', handleVisibility);

    resize();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 1.5;
        this.density = (Math.random() * 30) + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        if (mouse.x != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          let maxDistance = 120;

          if (distance < maxDistance) {
            let force = (maxDistance - distance) / maxDistance;
            this.x -= (dx / distance) * force * this.density;
            this.y -= (dy / distance) * force * this.density;
          }
        }
      }

      draw() {
        ctx.fillStyle = particleColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      const particleCount = Math.min(window.innerWidth / 10, 100);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      if (paused) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, index) => {
        p.update();
        p.draw();

        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.strokeStyle = `rgba(${lineColorBase}, ${0.15 - distance / 1000})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed top-0 left-0 w-full h-full -z-10 transition-colors duration-500 ${theme === 'dark' ? 'bg-[#050505]' : 'bg-[#FAFAFA]'}`}
    />
  );
};

const ThemeToggle = ({ theme, setTheme }) => (
  <div className="flex items-center gap-1 p-1 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm">
    <button
      onClick={() => setTheme('light')}
      className={`p-1.5 rounded-full transition-all ${theme === 'light' ? 'bg-neutral-200 text-neutral-900' : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'}`}
      aria-label="Switch to light mode"
    >
      <Sun size={14} />
    </button>
    <button
      onClick={() => setTheme('system')}
      className={`p-1.5 rounded-full transition-all ${theme === 'system' ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100' : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'}`}
      aria-label="Switch to system theme"
    >
      <Monitor size={14} />
    </button>
    <button
      onClick={() => setTheme('dark')}
      className={`p-1.5 rounded-full transition-all ${theme === 'dark' ? 'bg-neutral-800 text-neutral-100' : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'}`}
      aria-label="Switch to dark mode"
    >
      <Moon size={14} />
    </button>
  </div>
);

const LanguageToggle = () => {
  const { lang, toggleLang } = useLang();
  return (
    <button
      onClick={toggleLang}
      className="px-2 py-1 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm text-[11px] font-mono text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
      aria-label={lang === 'en' ? 'Switch to Japanese' : 'Switch to English'}
    >
      {lang === 'en' ? 'JP' : 'EN'}
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
    <div className="text-sm font-mono text-neutral-500 animate-pulse">Loading...</div>
  </div>
);

function AppInner() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { t } = useLang();
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [introComplete, setIntroComplete] = useState(() => {
    if (typeof window === 'undefined') return true;
    return !!sessionStorage.getItem('intro_played');
  });

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target.tagName;
      const isInput = tag === 'INPUT' || tag === 'TEXTAREA';

      if ((e.key === '`' || e.key === '~') && !isInput) {
        e.preventDefault();
        setTerminalOpen((prev) => !prev);
        setPaletteOpen(false);
        return;
      }

      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
        setTerminalOpen(false);
        return;
      }

      if (e.key === 'Escape') {
        setTerminalOpen(false);
        setPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { key: 'overview', label: t.nav.overview },
    { key: 'research', label: t.nav.research },
    { key: 'contact', label: t.nav.contact },
  ];

  return (
    <>
      {!introComplete && (
        <IntroAnimation
          onComplete={() => setIntroComplete(true)}
          resolvedTheme={resolvedTheme}
        />
      )}
      <ScrollToTop />
      <div className={`min-h-screen transition-colors duration-500 font-sans overflow-x-hidden relative z-0
        ${resolvedTheme === 'dark' ? 'text-neutral-200 selection:bg-emerald-900 selection:text-emerald-50' : 'text-neutral-900 selection:bg-indigo-100 selection:text-indigo-900'}
      `}>
        <NeuralBackground theme={resolvedTheme} />
        <ScrollProgress resolvedTheme={resolvedTheme} />

        <Terminal
          isOpen={terminalOpen}
          onClose={() => setTerminalOpen(false)}
          resolvedTheme={resolvedTheme}
        />

        <CommandPalette
          isOpen={paletteOpen}
          onClose={() => setPaletteOpen(false)}
          resolvedTheme={resolvedTheme}
        />

        {/* Navigation */}
        <nav className="fixed top-0 left-0 w-full z-50 px-4 md:px-6 py-6 flex justify-between items-center bg-transparent pointer-events-none">
          <div className={`text-sm font-bold tracking-tight pointer-events-auto ${resolvedTheme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
            <Link to="/">
              <DecryptText text="TAKUMI.DEV" />
            </Link>
          </div>

          <div className="flex items-center gap-4 md:gap-8 pointer-events-auto">
            <div className="hidden md:flex gap-8 text-xs font-mono text-neutral-500">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href={`/#${item.key}`}
                  className="hover:text-indigo-600 dark:hover:text-emerald-500 transition-colors uppercase tracking-widest"
                >
                  {item.label}
                </a>
              ))}
            </div>
            <LanguageToggle />
            <ThemeToggle theme={theme} setTheme={setTheme} />
            <MobileNav resolvedTheme={resolvedTheme} />
          </div>
        </nav>

        <main className="relative z-10">
          <Suspense fallback={<LoadingFallback />}>
            <PageTransition>
              <Routes>
                <Route path="/" element={<Home resolvedTheme={resolvedTheme} />} />
                <Route path="/cv" element={<Cv resolvedTheme={resolvedTheme} />} />
                <Route path="/projects/:slug" element={<ProjectDetail resolvedTheme={resolvedTheme} />} />
                <Route path="*" element={<NotFound resolvedTheme={resolvedTheme} />} />
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

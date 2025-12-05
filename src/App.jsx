import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { Sun, Moon, Monitor } from 'lucide-react';
import Home from './pages/Home';
import Cv from './pages/Cv';

/**
 * Hook: Scramble Effect
 * Visual "decryption" of text on hover/load.
 */
const useScramble = (text, speed = 30) => {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef(null);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+";

  const scramble = useCallback(() => {
    let iteration = 0;
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(prev =>
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(intervalRef.current);
      }

      iteration += 1 / 2;
    }, speed);
  }, [text, speed]);

  useEffect(() => {
    scramble();
    return () => clearInterval(intervalRef.current);
  }, [scramble]);

  const trigger = () => scramble();
  return { displayText, trigger };
};

const DecryptText = ({ text, className = "" }) => {
  const { displayText, trigger } = useScramble(text);
  return (
    <span className={`font-mono cursor-default inline-block ${className}`} onMouseEnter={trigger}>
      {displayText}
    </span>
  );
};

/**
 * Hook: Theme Management
 * Handles Light, Dark, and System preferences.
 */
const useTheme = () => {
  const [theme, setTheme] = useState('dark'); // 'light', 'dark', 'system'

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'system';
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const root = window.document.documentElement;

    const applyTheme = (t) => {
      if (t === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
      }
    };

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      applyTheme(systemTheme);

      const listener = (e) => applyTheme(e.matches ? 'dark' : 'light');
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', listener);
      return () => window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', listener);
    } else {
      applyTheme(theme);
    }
  }, [theme]);

  // Return the resolved theme for JS-based styling (canvas)
  const resolvedTheme = theme === 'system'
    ? (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;

  return { theme, setTheme, resolvedTheme };
};

/**
 * Component: Interactive Background
 * Adapts particle color based on the current theme.
 */
const NeuralBackground = ({ theme }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let mouse = { x: null, y: null };

    // Colors based on theme
    const particleColor = theme === 'dark' ? 'rgba(150, 150, 150, 0.3)' : 'rgba(50, 50, 50, 0.2)';
    const lineColorBase = theme === 'dark' ? '150, 150, 150' : '50, 50, 50';

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });

    resize();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 1.5;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Mouse interaction - particles flee slightly
        if (mouse.x != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          let forceDirectionX = dx / distance;
          let forceDirectionY = dy / distance;
          let maxDistance = 120;
          let force = (maxDistance - distance) / maxDistance;
          let directionX = forceDirectionX * force * this.density;
          let directionY = forceDirectionY * force * this.density;

          if (distance < maxDistance) {
            this.x -= directionX;
            this.y -= directionY;
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
      const particleCount = Math.min(window.innerWidth / 10, 100); // Increased density slightly
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
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
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      // BG color moved here to ensure canvas is the background layer
      className={`fixed top-0 left-0 w-full h-full -z-10 transition-colors duration-500 ${theme === 'dark' ? 'bg-[#050505]' : 'bg-[#FAFAFA]'}`}
    />
  );
};

const ThemeToggle = ({ theme, setTheme }) => (
  <div className="flex items-center gap-1 p-1 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm">
    <button
      onClick={() => setTheme('light')}
      className={`p-1.5 rounded-full transition-all ${theme === 'light' ? 'bg-neutral-200 text-neutral-900' : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'}`}
      title="Light Mode"
    >
      <Sun size={14} />
    </button>
    <button
      onClick={() => setTheme('system')}
      className={`p-1.5 rounded-full transition-all ${theme === 'system' ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100' : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'}`}
      title="System Mode"
    >
      <Monitor size={14} />
    </button>
    <button
      onClick={() => setTheme('dark')}
      className={`p-1.5 rounded-full transition-all ${theme === 'dark' ? 'bg-neutral-800 text-neutral-100' : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'}`}
      title="Dark Mode"
    >
      <Moon size={14} />
    </button>
  </div>
);

// ScrollToTop component to handle scroll restoration
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default function App() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <Router>
      <ScrollToTop />
      <div className={`min-h-screen transition-colors duration-500 font-sans overflow-x-hidden relative z-0
        ${resolvedTheme === 'dark' ? 'text-neutral-200 selection:bg-emerald-900 selection:text-emerald-50' : 'text-neutral-900 selection:bg-indigo-100 selection:text-indigo-900'}
      `}>
        {/* Background canvas now handles the background color to avoid z-index masking issues */}
        <NeuralBackground theme={resolvedTheme} />

        {/* Navigation */}
        <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center bg-transparent pointer-events-none">
          <div className={`text-sm font-bold tracking-tight pointer-events-auto ${resolvedTheme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
            <Link to="/">
              <DecryptText text="TAKUMI.DEV" />
            </Link>
          </div>

          <div className="flex items-center gap-8 pointer-events-auto">
            <div className="hidden md:flex gap-8 text-xs font-mono text-neutral-500">
              {['overview', 'research', 'contact'].map((item) => (
                <a
                  key={item}
                  href={`/#${item}`}
                  className={`hover:text-indigo-600 dark:hover:text-emerald-500 transition-colors uppercase tracking-widest`}
                >
                  {item}
                </a>
              ))}
            </div>
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>
        </nav>

        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<Home resolvedTheme={resolvedTheme} DecryptText={DecryptText} />} />
            <Route path="/cv" element={<Cv resolvedTheme={resolvedTheme} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}


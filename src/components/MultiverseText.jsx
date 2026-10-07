import React, { useState, useEffect, useRef } from 'react';

/**
 * MultiverseText — periodic glitch with chromatic aberration echoes
 * and a brief clip/skew distortion on the main text.
 */
const MultiverseText = ({ children, className = '', resolvedTheme, forceHard = false }) => {
  const [active, setActive] = useState(false);
  const [intensity, setIntensity] = useState(0); // 0 = off, 1 = normal, 2 = strong (hard-rupture)
  const [mode, setMode] = useState('iri'); // 'iri' (iridescent, common) | 'hard' (red/accent, rare)
  const tickRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const trigger = () => {
      // 80% of glitches stay in the iridescent vocabulary (cyan/magenta — Sue-coded).
      // The other 20% are hard-rupture (theme-accent / red — Wanda-coded), and only ~30% of
      // those go to full strong intensity with double-flicker + scanline. Net: ~6% strong.
      // `forceHard` overrides this for contexts where Wanda is the whole point (e.g. 404).
      const isHard = forceHard || Math.random() < 0.2;
      const isStrong = isHard && (forceHard ? Math.random() < 0.55 : Math.random() < 0.3);
      setMode(isHard ? 'hard' : 'iri');
      setIntensity(isStrong ? 2 : 1);
      setActive(true);

      // Strong-only: quick off-on-off flicker within the glitch window.
      if (isStrong) {
        tickRef.current = setTimeout(() => {
          setActive(false);
          setTimeout(() => setActive(true), 60);
        }, 150);
      }

      setTimeout(() => {
        setActive(false);
        setIntensity(0);
      }, isStrong ? 800 : 400);

      const next = 3000 + Math.random() * 5000;
      timeoutId = setTimeout(trigger, next);
    };

    let timeoutId = setTimeout(trigger, 2000 + Math.random() * 2000);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(tickRef.current);
    };
  }, [forceHard]);

  const isDark = resolvedTheme === 'dark';
  const s = intensity === 2;
  const isHard = mode === 'hard';

  // Iridescent mode = cyan/magenta soap-bubble channels. Hard mode = original theme-accent + red,
  // reserved for ~20% of triggers as the rare "world is breaking" rupture.
  const echo1Color = isHard
    ? (isDark
        ? `rgba(16, 185, 129, ${s ? 0.55 : 0.35})`
        : `rgba(79, 70, 229, ${s ? 0.45 : 0.28})`)
    : (isDark
        ? `rgba(103, 232, 249, ${s ? 0.55 : 0.32})`
        : `rgba(34, 156, 180, ${s ? 0.5 : 0.3})`);
  const echo2Color = isHard
    ? (isDark
        ? `rgba(239, 68, 68, ${s ? 0.35 : 0.2})`
        : `rgba(220, 38, 38, ${s ? 0.3 : 0.18})`)
    : (isDark
        ? `rgba(240, 171, 252, ${s ? 0.45 : 0.28})`
        : `rgba(180, 90, 200, ${s ? 0.45 : 0.28})`);

  const offset1 = s ? 'translate(-5px, -3px)' : 'translate(-3px, -1px)';
  const offset2 = s ? 'translate(4px, 2px)' : 'translate(2px, 1px)';

  // Main text distortion during glitch
  const mainTransform = active
    ? s
      ? 'skewX(-2deg) translate(1px, 0)'
      : 'skewX(-0.5deg)'
    : 'none';

  return (
    <span className={`relative inline-block ${className}`}>
      {/* Echo 1 — green/indigo channel */}
      <span
        className="absolute inset-0 pointer-events-none select-none"
        aria-hidden="true"
        style={{
          transform: active ? offset1 : 'translate(0, 0)',
          opacity: active ? 1 : 0,
          color: echo1Color,
          transition: active ? 'none' : 'all 0.3s ease-out',
          mixBlendMode: 'screen',
        }}
      >
        {children}
      </span>

      {/* Echo 2 — red channel */}
      <span
        className="absolute inset-0 pointer-events-none select-none"
        aria-hidden="true"
        style={{
          transform: active ? offset2 : 'translate(0, 0)',
          opacity: active ? 1 : 0,
          color: echo2Color,
          transition: active ? 'none' : 'all 0.4s ease-out',
          mixBlendMode: 'screen',
        }}
      >
        {children}
      </span>

      {/* Scan line flash — only fires on strong (hard-rupture) glitches, so it gets the Wanda red. */}
      {active && s && (
        <span
          className="absolute inset-0 pointer-events-none select-none overflow-hidden"
          aria-hidden="true"
        >
          <span
            className="absolute w-full"
            style={{
              height: '2px',
              top: `${30 + Math.random() * 40}%`,
              background: isDark
                ? 'rgba(239, 68, 68, 0.4)'
                : 'rgba(220, 38, 38, 0.35)',
            }}
          />
        </span>
      )}

      {/* Real text — subtle skew during glitch */}
      <span
        className="relative z-10"
        style={{
          display: 'inline-block',
          transform: mainTransform,
          transition: active ? 'none' : 'transform 0.2s ease-out',
        }}
      >
        {children}
      </span>
    </span>
  );
};

export default MultiverseText;

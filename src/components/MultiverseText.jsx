import React, { useState, useEffect, useRef } from 'react';

/**
 * MultiverseText — periodic glitch with chromatic aberration echoes
 * and a brief clip/skew distortion on the main text.
 */
const MultiverseText = ({ children, className = '', resolvedTheme }) => {
  const [active, setActive] = useState(false);
  const [intensity, setIntensity] = useState(0); // 0 = off, 1 = normal, 2 = strong
  const tickRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const trigger = () => {
      // Occasionally do a stronger glitch
      const strong = Math.random() < 0.3;
      setIntensity(strong ? 2 : 1);
      setActive(true);

      // Quick flicker: off-on-off within the glitch window
      if (strong) {
        tickRef.current = setTimeout(() => {
          setActive(false);
          setTimeout(() => setActive(true), 60);
        }, 150);
      }

      setTimeout(() => {
        setActive(false);
        setIntensity(0);
      }, strong ? 800 : 400);

      const next = 3000 + Math.random() * 5000;
      timeoutId = setTimeout(trigger, next);
    };

    let timeoutId = setTimeout(trigger, 2000 + Math.random() * 2000);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(tickRef.current);
    };
  }, []);

  const isDark = resolvedTheme === 'dark';
  const s = intensity === 2; // strong

  // Chromatic aberration: red and cyan channels split
  const echo1Color = isDark
    ? `rgba(16, 185, 129, ${s ? 0.55 : 0.35})`
    : `rgba(79, 70, 229, ${s ? 0.45 : 0.28})`;
  const echo2Color = isDark
    ? `rgba(239, 68, 68, ${s ? 0.35 : 0.2})`
    : `rgba(220, 38, 38, ${s ? 0.3 : 0.18})`;

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

      {/* Scan line flash */}
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
                ? 'rgba(16, 185, 129, 0.3)'
                : 'rgba(79, 70, 229, 0.25)',
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

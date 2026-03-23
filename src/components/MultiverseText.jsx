import React, { useState, useEffect } from 'react';

/**
 * MultiverseText — periodically shows faint "parallel timeline" echoes
 * of the text at slight offsets, as if glimpsing the same content
 * across adjacent realities. Triggers automatically at random intervals.
 */
const MultiverseText = ({ children, className = '', resolvedTheme }) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const trigger = () => {
      setActive(true);
      setTimeout(() => setActive(false), 1500);

      // Schedule next trigger randomly between 6-14 seconds
      const next = 6000 + Math.random() * 8000;
      timeoutId = setTimeout(trigger, next);
    };

    // First trigger after 3-6 seconds
    let timeoutId = setTimeout(trigger, 3000 + Math.random() * 3000);

    return () => clearTimeout(timeoutId);
  }, []);

  const echoColor = resolvedTheme === 'dark'
    ? 'rgba(16, 185, 129, 0.15)'
    : 'rgba(79, 70, 229, 0.12)';

  const echoColor2 = resolvedTheme === 'dark'
    ? 'rgba(16, 185, 129, 0.07)'
    : 'rgba(79, 70, 229, 0.06)';

  return (
    <span className={`relative inline-block ${className}`}>
      {/* Echo layers — parallel timelines */}
      <span
        className="absolute inset-0 pointer-events-none transition-all duration-700 ease-in-out select-none"
        aria-hidden="true"
        style={{
          transform: active ? 'translate(-3px, -2px)' : 'translate(0, 0)',
          opacity: active ? 1 : 0,
          color: echoColor,
        }}
      >
        {children}
      </span>
      <span
        className="absolute inset-0 pointer-events-none transition-all duration-1000 ease-in-out select-none"
        aria-hidden="true"
        style={{
          transform: active ? 'translate(2px, 3px)' : 'translate(0, 0)',
          opacity: active ? 1 : 0,
          color: echoColor2,
        }}
      >
        {children}
      </span>

      {/* Real text */}
      <span className="relative z-10">{children}</span>
    </span>
  );
};

export default MultiverseText;

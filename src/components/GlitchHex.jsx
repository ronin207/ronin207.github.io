import React, { useState, useEffect, useRef } from 'react';

/**
 * GlitchHex — a hex number that periodically flickers through
 * random values, as if the section index is unstable across
 * parallel timelines. Triggers automatically at random intervals.
 */
const GlitchHex = ({ value, prefix = '0x0' }) => {
  const [display, setDisplay] = useState(`${prefix}${value}`);
  const [glitching, setGlitching] = useState(false);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const hexChars = '0123456789ABCDEF';
    const original = `${prefix}${value}`;

    const glitch = () => {
      let ticks = 0;
      clearInterval(intervalRef.current);
      setGlitching(true);

      intervalRef.current = setInterval(() => {
        if (ticks < 6) {
          const randomHex = hexChars[Math.floor(Math.random() * hexChars.length)];
          const prefixes = ['0x0', '0xF', '0x1', '0xA', '0xD'];
          const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
          setDisplay(`${randomPrefix}${randomHex}`);
        } else {
          setDisplay(original);
          setGlitching(false);
          clearInterval(intervalRef.current);
        }
        ticks++;
      }, 50);

      // Demoted from 8-20s → 30-60s. The flicker reads as rare signal interference,
      // not constant chatter — the iridescent vocabulary now carries the always-on motion.
      const next = 30000 + Math.random() * 30000;
      timeoutRef.current = setTimeout(glitch, next);
    };

    // First glitch after 15-30 seconds
    timeoutRef.current = setTimeout(glitch, 15000 + Math.random() * 15000);

    return () => {
      clearTimeout(timeoutRef.current);
      clearInterval(intervalRef.current);
    };
  }, [value, prefix]);

  return (
    <span
      style={{
        display: 'inline-block',
        filter: glitching ? 'blur(1.2px)' : 'none',
        transition: 'filter 0.18s ease-out',
      }}
    >
      {display}
    </span>
  );
};

export default GlitchHex;

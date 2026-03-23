import React, { useState, useEffect, useRef } from 'react';

/**
 * GlitchHex — a hex number that periodically flickers through
 * random values, as if the section index is unstable across
 * parallel timelines. Triggers automatically at random intervals.
 */
const GlitchHex = ({ value, prefix = '0x0' }) => {
  const [display, setDisplay] = useState(`${prefix}${value}`);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const hexChars = '0123456789ABCDEF';
    const original = `${prefix}${value}`;

    const glitch = () => {
      let ticks = 0;
      clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        if (ticks < 6) {
          const randomHex = hexChars[Math.floor(Math.random() * hexChars.length)];
          const prefixes = ['0x0', '0xF', '0x1', '0xA', '0xD'];
          const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
          setDisplay(`${randomPrefix}${randomHex}`);
        } else {
          setDisplay(original);
          clearInterval(intervalRef.current);
        }
        ticks++;
      }, 50);

      // Schedule next glitch randomly between 8-20 seconds
      const next = 8000 + Math.random() * 12000;
      timeoutRef.current = setTimeout(glitch, next);
    };

    // First glitch after 4-10 seconds
    timeoutRef.current = setTimeout(glitch, 4000 + Math.random() * 6000);

    return () => {
      clearTimeout(timeoutRef.current);
      clearInterval(intervalRef.current);
    };
  }, [value, prefix]);

  return <span>{display}</span>;
};

export default GlitchHex;

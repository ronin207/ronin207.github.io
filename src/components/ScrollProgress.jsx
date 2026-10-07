import React, { useState, useEffect } from 'react';

const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = null;
    const handleScroll = () => {
      if (raf) return; // coalesce scroll events into one update per frame
      raf = requestAnimationFrame(() => {
        raf = null;
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  if (progress < 1) return null;

  return (
    <div aria-hidden="true" className="fixed top-0 left-0 w-full h-[2px] z-[60] overflow-hidden">
      {/* Iridescent ribbon spans the full viewport; clip-path reveals it as scroll advances. */}
      <div
        className="h-full w-full"
        style={{
          background: 'linear-gradient(90deg, rgba(103,232,249,0.95) 0%, rgba(240,171,252,0.95) 50%, rgba(254,243,199,0.9) 100%)',
          clipPath: `inset(0 ${100 - progress}% 0 0)`,
          transition: 'clip-path 0.1s ease-out',
        }}
      />
    </div>
  );
};

export default ScrollProgress;

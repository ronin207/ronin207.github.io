import React, { useState, useEffect } from 'react';

const ScrollProgress = ({ resolvedTheme }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (progress < 1) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-[2px] z-[60]">
      <div
        className={`h-full transition-[width] duration-100 ease-out ${
          resolvedTheme === 'dark' ? 'bg-emerald-500' : 'bg-indigo-600'
        }`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ScrollProgress;

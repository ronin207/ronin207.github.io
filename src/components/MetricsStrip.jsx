import React, { useState, useEffect, useRef } from 'react';
import useInView from '../hooks/useInView.jsx';

const AnimatedNumber = ({ target, suffix = '', prefix = '', duration = 1500 }) => {
  const [count, setCount] = useState(0);
  const [ref, isInView] = useInView();
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const start = performance.now();
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };
    requestAnimationFrame(animate);
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

const MetricsStrip = ({ resolvedTheme }) => {
  const metrics = [
    { value: 3, suffix: '', label: 'Publications' },
    { value: 2000, prefix: '$', suffix: '', label: 'Bug Bounty' },
    { value: 5, suffix: '', label: 'Languages' },
    { value: 68, suffix: '%', label: 'RAG Accuracy' },
  ];

  return (
    <div className="border-y border-neutral-200 dark:border-neutral-800 py-8 my-8 ml-2 md:ml-12 pl-4 md:pl-12 transition-colors duration-500">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {metrics.map((metric, i) => (
          <div key={i} className="text-center md:text-left">
            <div className={`text-3xl md:text-4xl font-light tracking-tight mb-1 ${
              resolvedTheme === 'dark' ? 'text-white' : 'text-neutral-900'
            }`}>
              <AnimatedNumber
                target={metric.value}
                suffix={metric.suffix}
                prefix={metric.prefix}
              />
            </div>
            <div className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
              {metric.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetricsStrip;

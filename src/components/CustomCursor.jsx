import React, { useState, useEffect, useRef } from 'react';

/**
 * CustomCursor — a subtle dot + ring cursor that reacts to interactive elements.
 * Hidden on touch devices. The ring expands when hovering links/buttons.
 */
const CustomCursor = ({ resolvedTheme }) => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    // Don't render on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const handleMouseMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
    };

    const handleMouseEnterInteractive = () => setHovering(true);
    const handleMouseLeaveInteractive = () => setHovering(false);

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    // Animate ring with lerp for smooth trailing
    const animate = () => {
      const lerp = 0.15;
      ringPos.current.x += (pos.current.x - ringPos.current.x) * lerp;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * lerp;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%) scale(${hovering ? 1.8 : 1})`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    // Attach interactive listeners to links, buttons, inputs
    const addInteractiveListeners = () => {
      const interactives = document.querySelectorAll('a, button, input, textarea, [role="button"]');
      interactives.forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnterInteractive);
        el.addEventListener('mouseleave', handleMouseLeaveInteractive);
      });
      return interactives;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    let interactives = addInteractiveListeners();

    // Re-attach on DOM changes (route changes, modals, etc.)
    const observer = new MutationObserver(() => {
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnterInteractive);
        el.removeEventListener('mouseleave', handleMouseLeaveInteractive);
      });
      interactives = addInteractiveListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnterInteractive);
        el.removeEventListener('mouseleave', handleMouseLeaveInteractive);
      });
      observer.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [visible, hovering]);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  const isDark = resolvedTheme === 'dark';
  const accentColor = isDark ? 'rgb(16, 185, 129)' : 'rgb(79, 70, 229)';

  return (
    <>
      <style>{`
        * { cursor: none !important; }
        @media (pointer: coarse) { * { cursor: auto !important; } }
      `}</style>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: accentColor,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.2s, width 0.3s, height 0.3s',
          mixBlendMode: 'difference',
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: `1.5px solid ${accentColor}`,
          opacity: visible ? (hovering ? 0.6 : 0.3) : 0,
          transition: 'opacity 0.3s, width 0.3s, height 0.3s',
        }}
      />
    </>
  );
};

export default CustomCursor;

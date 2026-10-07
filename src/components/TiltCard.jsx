import React, { useRef, useCallback } from 'react';

/**
 * TiltCard — 3D perspective tilt that follows the mouse.
 * Wraps any child element with a smooth, spring-like tilt effect.
 *
 * Styles are written directly to the DOM via refs so mouse movement never
 * re-renders the (potentially large) children subtree.
 */
const TiltCard = ({ children, className = '', maxTilt = 8, scale = 1.01, glareOpacity = 0.08 }) => {
  const ref = useRef(null);
  const glareRef = useRef(null);
  const rimRef = useRef(null);

  const reducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleMouseMove = useCallback((e) => {
    if (!ref.current || reducedMotion()) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;  // 0..1
    const y = (e.clientY - rect.top) / rect.height;   // 0..1

    const tiltX = (0.5 - y) * maxTilt;  // vertical tilt
    const tiltY = (x - 0.5) * maxTilt;  // horizontal tilt

    ref.current.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${scale})`;
    if (glareRef.current) {
      glareRef.current.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(254,243,199,${glareOpacity * 0.9}) 0%, rgba(240,171,252,${glareOpacity * 0.7}) 30%, rgba(103,232,249,${glareOpacity * 0.5}) 60%, transparent 80%)`;
      glareRef.current.style.opacity = '1';
    }
    if (rimRef.current) rimRef.current.style.opacity = '1';
  }, [maxTilt, scale, glareOpacity]);

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
    if (glareRef.current) glareRef.current.style.opacity = '0';
    if (rimRef.current) rimRef.current.style.opacity = '0';
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)',
        transition: 'transform 0.4s cubic-bezier(0.03, 0.98, 0.52, 0.99)',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {/* Iridescent surface shimmer — pale-yellow → magenta → cyan, like a soap-bubble film */}
      <div
        ref={glareRef}
        className="absolute inset-0 pointer-events-none rounded-lg"
        style={{
          transition: 'opacity 0.4s ease',
          opacity: 0,
        }}
      />
      {/* Iridescent rim — thin conic-gradient border revealed on tilt via mask trick */}
      <div
        ref={rimRef}
        className="absolute inset-0 pointer-events-none rounded-lg"
        style={{
          padding: '1px',
          background: 'conic-gradient(from 0deg, rgba(103,232,249,0.55), rgba(240,171,252,0.55), rgba(254,243,199,0.45), rgba(240,171,252,0.55), rgba(103,232,249,0.55))',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          opacity: 0,
          transition: 'opacity 0.4s ease',
        }}
      />
    </div>
  );
};

export default TiltCard;

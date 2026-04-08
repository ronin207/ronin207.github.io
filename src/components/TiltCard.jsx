import React, { useRef, useState, useCallback } from 'react';

/**
 * TiltCard — 3D perspective tilt that follows the mouse.
 * Wraps any child element with a smooth, spring-like tilt effect.
 */
const TiltCard = ({ children, className = '', maxTilt = 8, scale = 1.01, glareOpacity = 0.08 }) => {
  const ref = useRef(null);
  const [style, setStyle] = useState({
    transform: 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)',
  });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;  // 0..1
    const y = (e.clientY - rect.top) / rect.height;   // 0..1

    const tiltX = (0.5 - y) * maxTilt;  // vertical tilt
    const tiltY = (x - 0.5) * maxTilt;  // horizontal tilt

    setStyle({
      transform: `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${scale})`,
    });
    setGlare({ x: x * 100, y: y * 100, opacity: glareOpacity });
  }, [maxTilt, scale, glareOpacity]);

  const handleMouseLeave = useCallback(() => {
    setStyle({
      transform: 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)',
    });
    setGlare({ x: 50, y: 50, opacity: 0 });
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        transition: 'transform 0.4s cubic-bezier(0.03, 0.98, 0.52, 0.99)',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {/* Glare overlay */}
      <div
        className="absolute inset-0 pointer-events-none rounded-lg"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}), transparent 60%)`,
          transition: 'opacity 0.4s ease',
          opacity: glare.opacity > 0 ? 1 : 0,
        }}
      />
    </div>
  );
};

export default TiltCard;

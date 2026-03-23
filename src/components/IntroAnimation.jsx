import React, { useState, useEffect, useRef } from 'react';

/**
 * IntroAnimation — Lattice Convergence
 *
 * Particles converge from chaos into a "T" lattice structure (the favicon),
 * hold briefly, then disperse outward into the neural background.
 * Only plays once per session.
 */
const IntroAnimation = ({ onComplete, resolvedTheme }) => {
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState('animate'); // 'animate' | 'fadeout' | 'done'

  useEffect(() => {
    // Skip if already played this session
    if (sessionStorage.getItem('intro_played')) {
      onComplete();
      setPhase('done');
      return;
    }

    // Skip for reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      sessionStorage.setItem('intro_played', '1');
      onComplete();
      setPhase('done');
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const accentColor = resolvedTheme === 'dark' ? [16, 185, 129] : [79, 70, 229];

    // Define the "T" lattice target points (relative to center, scaled)
    const scale = Math.min(canvas.width, canvas.height) * 0.12;
    const tPoints = [
      // Top bar
      { x: -3, y: -2 }, { x: -2, y: -2 }, { x: -1, y: -2 },
      { x: 0, y: -2 }, { x: 1, y: -2 }, { x: 2, y: -2 }, { x: 3, y: -2 },
      // Top bar extra nodes
      { x: -2.5, y: -1.5 }, { x: 2.5, y: -1.5 },
      { x: 0, y: -2.8 },
      // Stem
      { x: 0, y: -1 }, { x: 0, y: 0 }, { x: 0, y: 1 },
      { x: 0, y: 2 }, { x: 0, y: 3 },
      // Stem lattice braces
      { x: -0.5, y: -0.5 }, { x: 0.5, y: -0.5 },
      { x: -0.3, y: 1.5 }, { x: 0.3, y: 1.5 },
    ].map(p => ({
      tx: cx + p.x * scale,
      ty: cy + p.y * scale,
    }));

    // Create particles at random positions
    const particles = tPoints.map(target => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      tx: target.tx,
      ty: target.ty,
      size: 1.5 + Math.random() * 2,
      vx: 0,
      vy: 0,
    }));

    // Add ambient particles (won't converge, just drift)
    const ambientCount = 40;
    const ambient = [];
    for (let i = 0; i < ambientCount; i++) {
      ambient.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 1.2,
        alpha: 0.15 + Math.random() * 0.15,
      });
    }

    let startTime = performance.now();
    const convergeDuration = 1200; // ms to converge
    const holdDuration = 600;     // ms to hold the T shape
    const disperseDuration = 500; // ms to disperse
    const totalDuration = convergeDuration + holdDuration + disperseDuration;
    let animId;

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw ambient particles
      ambient.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.fillStyle = `rgba(${accentColor.join(',')}, ${p.alpha * 0.3})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      if (elapsed < convergeDuration) {
        // Phase 1: Converge — particles ease toward targets
        const t = elapsed / convergeDuration;
        const ease = 1 - Math.pow(1 - t, 3); // ease-out cubic

        particles.forEach(p => {
          p.x = p.x + (p.tx - p.x) * ease * 0.08;
          p.y = p.y + (p.ty - p.y) * ease * 0.08;
        });
      } else if (elapsed < convergeDuration + holdDuration) {
        // Phase 2: Hold — particles vibrate slightly at target
        particles.forEach(p => {
          p.x = p.tx + (Math.random() - 0.5) * 1;
          p.y = p.ty + (Math.random() - 0.5) * 1;
        });
      } else {
        // Phase 3: Disperse — particles fly outward
        const t = (elapsed - convergeDuration - holdDuration) / disperseDuration;
        const ease = t * t; // ease-in
        particles.forEach(p => {
          const dx = p.tx - cx;
          const dy = p.ty - cy;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          p.x = p.tx + (dx / dist) * ease * 800;
          p.y = p.ty + (dy / dist) * ease * 800;
        });
      }

      // Draw connecting lines between nearby particles
      const lineAlpha = elapsed < convergeDuration
        ? Math.min(elapsed / convergeDuration, 0.5)
        : elapsed < convergeDuration + holdDuration
          ? 0.5
          : 0.5 * (1 - (elapsed - convergeDuration - holdDuration) / disperseDuration);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < scale * 2) {
            ctx.strokeStyle = `rgba(${accentColor.join(',')}, ${lineAlpha * (1 - dist / (scale * 2))})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      const nodeAlpha = elapsed < convergeDuration + holdDuration
        ? Math.min(elapsed / 400, 1)
        : 1 - (elapsed - convergeDuration - holdDuration) / disperseDuration;

      particles.forEach((p, i) => {
        const isCenter = i === Math.floor(particles.length / 2);
        const r = isCenter ? p.size * 1.5 : p.size;
        ctx.fillStyle = `rgba(${accentColor.join(',')}, ${nodeAlpha * 0.9})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();

        // Glow on center node during hold
        if (isCenter && elapsed > convergeDuration * 0.5 && elapsed < convergeDuration + holdDuration) {
          ctx.fillStyle = `rgba(${accentColor.join(',')}, 0.08)`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r * 6, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      if (progress < 1) {
        animId = requestAnimationFrame(animate);
      } else {
        // Animation complete
        sessionStorage.setItem('intro_played', '1');
        setPhase('fadeout');
        setTimeout(() => {
          onComplete();
          setPhase('done');
        }, 400);
      }
    };

    animId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animId);
  }, [onComplete, resolvedTheme]);

  if (phase === 'done') return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center transition-opacity duration-400 ${
        phase === 'fadeout' ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ background: resolvedTheme === 'dark' ? '#050505' : '#FAFAFA' }}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default IntroAnimation;

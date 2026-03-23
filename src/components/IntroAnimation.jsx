import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * IntroAnimation — Lattice Convergence v2
 *
 * Phase 1: Emergence — particles materialize from center in a wave
 * Phase 2: Convergence — spring physics pull particles into T formation
 * Phase 3: Recognition — T holds, "TAKUMI.DEV" types out, hero bleeds through
 * Phase 4: Integration — particles release into ambient drift, merging with neural bg
 *
 * The animation doesn't "end and fade" — it dissolves into the actual site.
 */
const IntroAnimation = ({ onComplete, resolvedTheme }) => {
  const canvasRef = useRef(null);
  const [opacity, setOpacity] = useState(1);
  const [textProgress, setTextProgress] = useState(0);
  const [phase, setPhase] = useState('running');
  const completedRef = useRef(false);

  const handleComplete = useCallback(() => {
    if (!completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  }, [onComplete]);

  useEffect(() => {
    if (sessionStorage.getItem('intro_played')) {
      handleComplete();
      setPhase('done');
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      sessionStorage.setItem('intro_played', '1');
      handleComplete();
      setPhase('done');
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const accent = resolvedTheme === 'dark' ? [16, 185, 129] : [79, 70, 229];
    const dimColor = resolvedTheme === 'dark' ? '150, 150, 150' : '80, 80, 80';

    // T formation points (relative to center)
    const scale = Math.min(canvas.width, canvas.height) * 0.1;
    const tShape = [
      // Top bar — 7 nodes
      [-3, -2.2], [-2, -2.2], [-1, -2.2], [0, -2.5],
      [1, -2.2], [2, -2.2], [3, -2.2],
      // Cross braces
      [-1.5, -1.3], [1.5, -1.3],
      // Stem — 5 nodes
      [0, -1], [0, 0], [0, 1], [0, 2], [0, 3.2],
      // Stem lattice detail
      [-0.6, -0.3], [0.6, -0.3], [-0.4, 1.5], [0.4, 1.5],
    ];

    // T formation edges (index pairs for drawing lines)
    const tEdges = [
      [0,1],[1,2],[2,3],[3,4],[4,5],[5,6], // top bar
      [2,7],[4,8], // diagonal braces
      [7,9],[8,9], // braces to stem
      [3,9], // center top to stem
      [9,10],[10,11],[11,12],[12,13], // stem
      [9,14],[9,15],[11,16],[11,17], // lattice detail
      [14,10],[15,10],[16,12],[17,12],
      [0,7],[6,8], // outer braces
    ];

    const particles = tShape.map(([px, py], i) => {
      // Start from random positions far from center
      const angle = Math.random() * Math.PI * 2;
      const dist = 300 + Math.random() * 400;
      return {
        // Current position
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        // Target (T formation)
        tx: cx + px * scale,
        ty: cy + py * scale,
        // Velocity for spring physics
        vx: 0, vy: 0,
        // Properties
        size: 1.5 + Math.random() * 1.5,
        born: false,
        bornAt: 200 + i * 60, // staggered birth
        // Post-release drift
        driftVx: (Math.random() - 0.5) * 0.3,
        driftVy: (Math.random() - 0.5) * 0.3,
        released: false,
      };
    });

    // Ambient dust particles
    const dust = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 1,
      alpha: 0.1 + Math.random() * 0.1,
    }));

    const EMERGE = 1200;     // particles materialize
    const CONVERGE = 2200;   // spring physics to T
    const HOLD = 3400;       // T holds, text types
    const RELEASE = 4200;    // particles release to drift
    const END = 5000;        // fully integrated

    let startTime = null;
    let animId;

    const animate = (now) => {
      if (!startTime) startTime = now;
      const t = now - startTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // --- Dust ---
      dust.forEach(d => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
        const dustAlpha = t < 300 ? (t / 300) * d.alpha : d.alpha;
        ctx.fillStyle = `rgba(${dimColor}, ${dustAlpha})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // --- Phase logic ---

      // Birth particles with a wave from center
      particles.forEach(p => {
        if (!p.born && t >= p.bornAt) {
          p.born = true;
          // Start with a small burst velocity toward target
          const dx = p.tx - p.x;
          const dy = p.ty - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          p.vx = (dx / dist) * 2;
          p.vy = (dy / dist) * 2;
        }
      });

      // Spring physics (converge phase)
      if (t < RELEASE) {
        const springStrength = t < EMERGE ? 0.008 : t < CONVERGE ? 0.04 : 0.06;
        const damping = t < CONVERGE ? 0.92 : 0.85;

        particles.forEach(p => {
          if (!p.born) return;
          const dx = p.tx - p.x;
          const dy = p.ty - p.y;
          // Spring force
          p.vx += dx * springStrength;
          p.vy += dy * springStrength;
          // Damping
          p.vx *= damping;
          p.vy *= damping;
          p.x += p.vx;
          p.y += p.vy;
        });
      }

      // Release phase — particles detach and drift
      if (t >= RELEASE) {
        const releaseProgress = Math.min((t - RELEASE) / (END - RELEASE), 1);
        particles.forEach((p, i) => {
          if (!p.released) {
            p.released = true;
            // Keep current velocity + add gentle outward drift
            p.vx = p.vx * 0.3 + p.driftVx;
            p.vy = p.vy * 0.3 + p.driftVy;
          }
          p.x += p.vx;
          p.y += p.vy;
          // Gentle deceleration to match neural bg speed
          p.vx *= 0.995;
          p.vy *= 0.995;
        });
      }

      // --- Draw edges ---
      if (t > EMERGE * 0.5) {
        // Edge visibility ramps up during convergence, holds, then fades during release
        let edgeAlpha;
        if (t < CONVERGE) {
          edgeAlpha = Math.min((t - EMERGE * 0.5) / (CONVERGE - EMERGE * 0.5), 0.5);
        } else if (t < RELEASE) {
          edgeAlpha = 0.5;
        } else {
          edgeAlpha = 0.5 * (1 - Math.min((t - RELEASE) / (END - RELEASE), 1));
        }

        tEdges.forEach(([a, b]) => {
          const pa = particles[a];
          const pb = particles[b];
          if (!pa.born || !pb.born) return;
          const dist = Math.sqrt((pa.x - pb.x) ** 2 + (pa.y - pb.y) ** 2);
          const maxDist = scale * 4;
          if (dist < maxDist) {
            const lineAlpha = edgeAlpha * (1 - dist / maxDist);
            ctx.strokeStyle = `rgba(${accent.join(',')}, ${lineAlpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(pa.x, pa.y);
            ctx.lineTo(pb.x, pb.y);
            ctx.stroke();
          }
        });
      }

      // --- Draw particles ---
      let particleAlpha;
      if (t < 400) {
        particleAlpha = t / 400;
      } else if (t < RELEASE) {
        particleAlpha = 1;
      } else {
        // Fade particles to match neural bg opacity
        const rp = Math.min((t - RELEASE) / (END - RELEASE), 1);
        particleAlpha = 1 - rp * 0.6; // don't fully disappear, blend with bg
      }

      particles.forEach((p, i) => {
        if (!p.born) return;

        // Birth flash
        const age = t - p.bornAt;
        const flash = age < 200 ? 1 + (1 - age / 200) * 2 : 1;
        const r = p.size * flash;

        ctx.fillStyle = `rgba(${accent.join(',')}, ${particleAlpha * 0.85})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();

        // Glow on center node during hold
        if (i === 3 && t > CONVERGE && t < RELEASE) {
          const pulse = 0.5 + Math.sin(t * 0.005) * 0.3;
          ctx.fillStyle = `rgba(${accent.join(',')}, ${0.06 * pulse})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r * 8, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // --- Text typing ---
      if (t > CONVERGE + 200) {
        const textStr = 'TAKUMI.DEV';
        const charProgress = Math.min((t - CONVERGE - 200) / 800, 1);
        const chars = Math.floor(charProgress * textStr.length);
        const visibleText = textStr.substring(0, chars);

        if (chars > 0) {
          const textAlpha = t < RELEASE ? 1 : 1 - Math.min((t - RELEASE) / (END - RELEASE), 1);
          ctx.font = '14px monospace';
          ctx.textAlign = 'center';
          ctx.fillStyle = `rgba(${accent.join(',')}, ${textAlpha * 0.6})`;
          ctx.fillText(visibleText, cx, cy + scale * 4.5);

          // Cursor blink
          if (chars < textStr.length || Math.floor(t / 400) % 2 === 0) {
            const textWidth = ctx.measureText(visibleText).width;
            ctx.fillRect(cx + textWidth / 2 + 2, cy + scale * 4.5 - 10, 1, 14);
          }
        }

        setTextProgress(charProgress);
      }

      // --- Overlay fade ---
      if (t > HOLD) {
        const fadeProgress = Math.min((t - HOLD) / (END - HOLD), 1);
        // Ease out — fast start, slow end
        const easedFade = 1 - Math.pow(fadeProgress, 0.5);
        setOpacity(easedFade);
      }

      // --- Completion ---
      if (t >= END) {
        sessionStorage.setItem('intro_played', '1');
        setPhase('done');
        handleComplete();
        return;
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [handleComplete, resolvedTheme]);

  if (phase === 'done') return null;

  return (
    <div
      className="fixed inset-0 z-[200]"
      style={{
        opacity,
        background: resolvedTheme === 'dark' ? '#050505' : '#FAFAFA',
        pointerEvents: opacity < 0.1 ? 'none' : 'auto',
        transition: 'none', // we control opacity manually per-frame
      }}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default IntroAnimation;

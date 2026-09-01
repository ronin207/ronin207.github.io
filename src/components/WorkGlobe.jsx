import React, { useEffect, useRef } from 'react';
import createGlobe from 'cobe';

/*
 * Where the work happens, stated as fact (DESIGN.md §43): Tokyo and
 * Singapore, joined by one thin flight arc. COBE v2 (~5KB WebGL, the
 * quiet dotted globe built at Vercel). Motion is input-driven only:
 * a one-time rotate-in when the globe enters view, drag to spin, and
 * a spring back to the resting view on release — no idle rotation.
 */

const SINGAPORE = [1.35, 103.82];
const TOKYO = [35.68, 139.69];

// Face the camera toward ~122°E so both cities and the arc sit in view
const REST_PHI = Math.PI - ((122 * Math.PI) / 180 - Math.PI / 2);
const REST_THETA = 0.28;

const PALETTES = {
  light: {
    dark: 0,
    baseColor: [1, 1, 1],
    glowColor: [1, 1, 1],
    markerColor: [0.29, 0.37, 0.75],
    arcColor: [0.29, 0.37, 0.75],
    mapBrightness: 6,
  },
  // Night: graphite globe, warm arc — the same amber as the city bokeh
  dark: {
    dark: 1,
    baseColor: [0.18, 0.19, 0.23],
    glowColor: [0.05, 0.06, 0.08],
    markerColor: [0.58, 0.65, 0.93],
    arcColor: [0.96, 0.78, 0.54],
    mapBrightness: 4,
  },
};

export default function WorkGlobe() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const size = Math.min(canvas.parentElement.clientWidth, 340);
    let globe = null;
    let phi = reducedMotion ? REST_PHI : REST_PHI + 0.55;
    let raf = null;
    let dragging = false;
    let dragStartX = 0;
    let dragStartPhi = 0;

    const isDark = () => document.documentElement.classList.contains('dark');

    const build = () => {
      globe?.destroy();
      globe = createGlobe(canvas, {
        devicePixelRatio: 2,
        width: size * 2,
        height: size * 2,
        phi,
        theta: REST_THETA,
        diffuse: 1.2,
        mapSamples: 16000,
        opacity: 0.95,
        markers: [
          { location: TOKYO, size: 0.055, id: 'tokyo' },
          { location: SINGAPORE, size: 0.055, id: 'singapore' },
        ],
        arcs: [{ from: SINGAPORE, to: TOKYO }],
        arcWidth: 0.45,
        arcHeight: 0.22,
        ...PALETTES[isDark() ? 'dark' : 'light'],
      });
    };

    const setPhi = (value) => {
      phi = value;
      globe?.update({ phi });
    };

    const animateTo = (target, ms) => {
      cancelAnimationFrame(raf);
      if (reducedMotion) { setPhi(target); return; }
      const from = phi;
      const start = performance.now();
      const step = (now) => {
        const t = Math.min((now - start) / ms, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setPhi(from + (target - from) * eased);
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    // Rotate in once when the globe first enters view
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        animateTo(REST_PHI, 1100);
        io.disconnect();
      }
    }, { threshold: 0.3 });

    const onPointerDown = (e) => {
      dragging = true;
      dragStartX = e.clientX;
      dragStartPhi = phi;
      cancelAnimationFrame(raf);
      canvas.style.cursor = 'grabbing';
    };
    const onPointerMove = (e) => {
      if (!dragging) return;
      setPhi(dragStartPhi + (e.clientX - dragStartX) * 0.005);
    };
    const onPointerUp = () => {
      if (!dragging) return;
      dragging = false;
      canvas.style.cursor = 'grab';
      animateTo(REST_PHI, 700);
    };

    build();
    io.observe(canvas);
    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Rebuild with the other palette when the theme class flips
    const mo = new MutationObserver(build);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      io.disconnect();
      mo.disconnect();
      cancelAnimationFrame(raf);
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      globe?.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full max-w-[340px] aspect-square cursor-grab"
      style={{ touchAction: 'pan-y' }}
      aria-label="Globe showing Tokyo and Singapore, connected by a flight arc"
    />
  );
}

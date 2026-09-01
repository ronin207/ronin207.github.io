import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import createGlobe from 'cobe';

/*
 * Where the work happens, stated as fact (DESIGN.md §43): Tokyo and
 * Singapore, joined by one thin flight arc. COBE v2 (~5KB WebGL).
 * Motion is input-driven only: a one-time rotate-in when the globe
 * enters view, drag to spin, a spring back on release, and flyTo() —
 * the zoom into a city that precedes navigating to its page.
 */

const CITIES = {
  tokyo: [35.68, 139.69],
  singapore: [1.35, 103.82],
};

const phiFor = (lon) => Math.PI - ((lon * Math.PI) / 180 - Math.PI / 2);
const thetaFor = (lat) => (lat * Math.PI) / 180;

// Rest view: camera toward ~122°E so both cities and the arc sit in view
const REST = { phi: phiFor(122), theta: 0.28, scale: 1 };

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

const WorkGlobe = forwardRef(function WorkGlobe(
  { size = 340, focus = null, interactive = true },
  ref,
) {
  const canvasRef = useRef(null);
  const apiRef = useRef({ flyTo: (_city, done) => done?.() });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const px = Math.min(canvas.parentElement.clientWidth, size);
    const rest = focus
      ? { phi: phiFor(CITIES[focus][1]), theta: thetaFor(CITIES[focus][0]), scale: 1 }
      : REST;

    let globe = null;
    const state = { ...rest };
    if (!focus && !reducedMotion) state.phi = rest.phi + 0.55;
    let raf = null;
    let dragging = false;
    let dragStartX = 0;
    let dragStartPhi = 0;

    const isDark = () => document.documentElement.classList.contains('dark');

    const build = () => {
      globe?.destroy();
      globe = createGlobe(canvas, {
        devicePixelRatio: 2,
        width: px * 2,
        height: px * 2,
        phi: state.phi,
        theta: state.theta,
        scale: state.scale,
        diffuse: 1.2,
        mapSamples: 16000,
        opacity: 0.95,
        markers: [
          { location: CITIES.tokyo, size: 0.055, id: 'tokyo' },
          { location: CITIES.singapore, size: 0.055, id: 'singapore' },
        ],
        arcs: [{ from: CITIES.singapore, to: CITIES.tokyo }],
        arcWidth: 0.45,
        arcHeight: 0.22,
        ...PALETTES[isDark() ? 'dark' : 'light'],
      });
    };

    const apply = (next) => {
      Object.assign(state, next);
      globe?.update({ phi: state.phi, theta: state.theta, scale: state.scale });
    };

    const animateState = (target, ms, done, onFrame) => {
      cancelAnimationFrame(raf);
      if (reducedMotion) { apply(target); done?.(); return; }
      const from = { ...state };
      const start = performance.now();
      const step = (now) => {
        const t = Math.min((now - start) / ms, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const frame = {};
        for (const k of Object.keys(target)) {
          frame[k] = from[k] + (target[k] - from[k]) * eased;
        }
        apply(frame);
        onFrame?.(eased);
        if (t < 1) raf = requestAnimationFrame(step);
        else done?.();
      };
      raf = requestAnimationFrame(step);
    };

    // The pull-in: the globe itself grows out of its box toward the
    // viewer (CSS transform) while the camera dives into the city
    // (cobe state) — unclipped, above the page, then the route changes.
    apiRef.current.flyTo = (city, done) => {
      const [lat, lon] = CITIES[city];
      canvas.classList.add('globe-flight');
      animateState(
        { phi: phiFor(lon), theta: thetaFor(lat), scale: 1.5 },
        900,
        done,
        (eased) => {
          canvas.style.transform = `scale(${1 + 1.4 * eased})`;
        },
      );
    };

    // Rotate in once when the globe first enters view
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!focus) animateState({ phi: rest.phi }, 1100);
        io.disconnect();
      }
    }, { threshold: 0.3 });

    const onPointerDown = (e) => {
      dragging = true;
      dragStartX = e.clientX;
      dragStartPhi = state.phi;
      cancelAnimationFrame(raf);
      canvas.style.cursor = 'grabbing';
    };
    const onPointerMove = (e) => {
      if (!dragging) return;
      apply({ phi: dragStartPhi + (e.clientX - dragStartX) * 0.005 });
    };
    const onPointerUp = () => {
      if (!dragging) return;
      dragging = false;
      canvas.style.cursor = 'grab';
      animateState({ phi: rest.phi }, 700);
    };

    build();
    io.observe(canvas);
    if (interactive) {
      canvas.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    }

    // Rebuild with the other palette when the theme class flips
    const mo = new MutationObserver(build);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      io.disconnect();
      mo.disconnect();
      cancelAnimationFrame(raf);
      if (interactive) {
        canvas.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
      }
      globe?.destroy();
    };
  }, [size, focus, interactive]);

  useImperativeHandle(ref, () => ({
    flyTo: (city, done) => apiRef.current.flyTo(city, done),
  }), []);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full aspect-square mx-auto ${interactive ? 'cursor-grab' : ''}`}
      style={{ maxWidth: size, touchAction: 'pan-y' }}
      aria-label="Globe showing Tokyo and Singapore, connected by a flight arc"
    />
  );
});

export default WorkGlobe;

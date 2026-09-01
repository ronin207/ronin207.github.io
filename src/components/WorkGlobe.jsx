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

// Where a city's marker sits on the canvas at the rest view, as
// fractions of the canvas box — used to place the click hotspots.
// SPHERE_R is the sphere's radius as a fraction of the canvas,
// calibrated against the rendered globe.
const SPHERE_R = 0.45;

const restHotspot = (lat, lon) => {
  const la = (lat * Math.PI) / 180;
  const lo = (lon * Math.PI) / 180;
  const c = (3 * Math.PI) / 2 - REST.phi; // longitude facing the camera
  const x = Math.cos(la) * Math.sin(lo);
  const y = Math.sin(la);
  const z = Math.cos(la) * Math.cos(lo);
  const xr = x * Math.cos(c) - z * Math.sin(c);
  const zr = x * Math.sin(c) + z * Math.cos(c);
  const yr = y * Math.cos(REST.theta) - zr * Math.sin(REST.theta);
  return { fx: 0.5 + xr * SPHERE_R, fy: 0.5 - yr * SPHERE_R };
};

const HOTSPOTS = Object.fromEntries(
  Object.entries(CITIES).map(([city, [lat, lon]]) => [city, restHotspot(lat, lon)]),
);

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
  { size = 340, focus = null, interactive = true, onCityClick = null, cityLabels = null, engaged = false },
  ref,
) {
  const canvasRef = useRef(null);
  const apiRef = useRef({
    flyTo: (_city, done) => done?.(),
    flyBack: (done) => done?.(),
  });

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

    // The pull-in: the globe grows and glides as one whole circle —
    // all on the element transform, never the internal camera, so the
    // sphere is never clipped. It centers the city in the strip left
    // visible above the sheet and grows until the sphere covers the
    // whole viewport. flyBack() reverses the journey on close.
    const el = { scale: 1, tx: 0, ty: 0 };
    const setEl = (scale, tx, ty) => {
      Object.assign(el, { scale, tx, ty });
      canvas.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    };

    // Anchor: where the city should land — centered in the region the
    // sheet leaves open (top ~38% of the viewport) — plus the element
    // translation and cover scale that put the sphere over everything.
    const flightTarget = (from) => {
      const ax = window.innerWidth / 2;
      const ay = window.innerHeight * 0.19;
      const rect = canvas.getBoundingClientRect();
      const targetTx = from.tx + (ax - (rect.left + rect.width / 2));
      const targetTy = from.ty + (ay - (rect.top + rect.height / 2));
      const maxDist = Math.max(
        Math.hypot(ax, ay),
        Math.hypot(window.innerWidth - ax, ay),
        Math.hypot(ax, window.innerHeight - ay),
        Math.hypot(window.innerWidth - ax, window.innerHeight - ay),
      );
      const cover = (maxDist * 2 * 1.05) / px;
      return { targetTx, targetTy, cover };
    };

    apiRef.current.flyTo = (city, done) => {
      const [lat, lon] = CITIES[city];
      canvas.classList.add('globe-flight');
      const from = { ...el };
      const { targetTx, targetTy, cover } = flightTarget(from);

      animateState(
        { phi: phiFor(lon), theta: thetaFor(lat) },
        900,
        done,
        (eased) => setEl(
          from.scale + (cover - from.scale) * eased,
          from.tx + (targetTx - from.tx) * eased,
          from.ty + (targetTy - from.ty) * eased,
        ),
      );
    };

    // Instant arrival — used when returning to an already-open city
    apiRef.current.jumpTo = (city) => {
      const [lat, lon] = CITIES[city];
      canvas.classList.add('globe-flight');
      cancelAnimationFrame(raf);
      apply({ phi: phiFor(lon), theta: thetaFor(lat) });
      const { targetTx, targetTy, cover } = flightTarget({ ...el });
      setEl(cover, targetTx, targetTy);
    };

    apiRef.current.flyBack = (done) => {
      const from = { ...el };
      animateState(
        { ...rest },
        800,
        () => {
          canvas.classList.remove('globe-flight');
          done?.();
        },
        (eased) => setEl(
          from.scale + (1 - from.scale) * eased,
          from.tx * (1 - eased),
          from.ty * (1 - eased),
        ),
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
      if (canvas.classList.contains('globe-flight')) return;
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
    flyBack: (done) => apiRef.current.flyBack(done),
    jumpTo: (city) => apiRef.current.jumpTo(city),
  }), []);

  return (
    <div className="relative w-full mx-auto" style={{ maxWidth: size }}>
      <canvas
        ref={canvasRef}
        className={`w-full aspect-square ${interactive ? 'cursor-grab' : ''}`}
        style={{ touchAction: 'pan-y' }}
        aria-label="Globe showing Tokyo and Singapore, connected by a flight arc"
      />
      {/* The marker dots are the controls (hidden while a city is open) */}
      {interactive && onCityClick && !engaged && Object.keys(CITIES).map((city) => {
        const { fx, fy } = HOTSPOTS[city];
        return (
          <button
            key={city}
            onClick={() => onCityClick(city)}
            aria-label={cityLabels?.[city] ?? city}
            className="group absolute w-11 h-11 -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer"
            style={{ left: `${fx * 100}%`, top: `${fy * 100}%` }}
          >
            <span className="absolute left-1/2 -translate-x-1/2 top-full text-xs text-ink-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {cityLabels?.[city] ?? city}
            </span>
          </button>
        );
      })}
    </div>
  );
});

export default WorkGlobe;

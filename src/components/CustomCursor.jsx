import React, { useState, useEffect, useMemo, useRef } from 'react';

/**
 * Build a procedural lens displacement map: a small PNG where R/G channels encode (x, y)
 * displacement vectors per pixel, used by an SVG <feDisplacementMap> to refract the page
 * beneath the cursor like a real magnifying glass.
 *
 * Profile: convex magnifier — displacement points INWARD (toward lens center) at every
 * pixel, growing from 0 at center to peak at rim. Inward sampling = surrounding pixels
 * get pulled into the lens area = magnification. The rim has an extra cubic boost for
 * a clearly visible bezel that catches the page content as the cursor moves.
 */
const generateLensMap = (size) => {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;
  const cx = (size - 1) / 2;
  const cy = (size - 1) / 2;
  const lensR = size / 2;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const r = Math.sqrt(dx * dx + dy * dy);
      const i = (y * size + x) * 4;

      let nx = 0;
      let ny = 0;
      if (r > 0 && r < lensR) {
        const nr = r / lensR;
        // Convex profile: linear ramp + cubic kicker at the rim.
        // 0 at center (clear pass-through directly under pointer) → ~0.95 at rim.
        const strength = nr * 0.5 + Math.pow(nr, 3) * 0.5;
        // Inward direction (negative radial) = magnification.
        nx = -(dx / r) * strength;
        ny = -(dy / r) * strength;
      }
      data[i]     = Math.round(128 + nx * 127);
      data[i + 1] = Math.round(128 + ny * 127);
      data[i + 2] = 0;
      data[i + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL('image/png');
};

/**
 * CustomCursor — a subtle dot + ring cursor that reacts to interactive elements.
 * Hidden on touch devices and for reduced-motion users (who keep the native cursor).
 * The ring expands when hovering links/buttons.
 *
 * The ring uses backdrop-filter to refract the page beneath it. In Chromium browsers
 * we pipe through an SVG <feDisplacementMap> for real lens-like refraction; elsewhere
 * we fall back to a simple blur+saturate (still reads as glass, just no displacement).
 */
const CURSOR_SIZE = 32;
const LENS_MAP_SIZE = 48;

// Never take over the cursor when we can't animate a replacement: touch devices
// have no cursor, and reduced-motion users keep the native one.
const cursorEnabled = () =>
  typeof window !== 'undefined' &&
  !window.matchMedia('(pointer: coarse)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CustomCursor = ({ resolvedTheme }) => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const hoveringRef = useRef(false);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const ringScale = useRef(1);
  const rafRef = useRef(null);

  const lensMapUrl = useMemo(() => generateLensMap(LENS_MAP_SIZE), []);

  // backdrop-filter: url(...) only renders correctly in Chromium. Safari and Firefox either
  // ignore it silently or mis-handle it, leaving the cursor totally see-through. UA detection
  // is more reliable here than @supports (which Safari falsely reports true for).
  const refractClass = useMemo(() => {
    if (typeof navigator === 'undefined') return 'cursor-lens-blur';
    const ua = navigator.userAgent;
    const isChromium = /Chrome\//.test(ua) && !/Edge\/\d/.test(ua);
    return isChromium ? 'cursor-lens-refract' : 'cursor-lens-blur';
  }, []);

  useEffect(() => {
    if (!cursorEnabled()) return;

    const handleMouseMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      setVisible(true);
    };

    const handleMouseEnterInteractive = () => {
      hoveringRef.current = true;
      setHovering(true);
    };
    const handleMouseLeaveInteractive = () => {
      hoveringRef.current = false;
      setHovering(false);
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    // Animate ring with lerp for smooth trailing — position AND scale interpolate per frame.
    // Reads hovering via ref so the loop survives the whole component lifetime.
    const animate = () => {
      const posLerp = 0.15;
      const scaleLerp = 0.18;
      ringPos.current.x += (pos.current.x - ringPos.current.x) * posLerp;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * posLerp;
      const targetScale = hoveringRef.current ? 1.8 : 1;
      ringScale.current += (targetScale - ringScale.current) * scaleLerp;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%) scale(${ringScale.current.toFixed(3)})`;
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
  }, []);

  // Keep the native cursor when we can't replace it — otherwise the global
  // `cursor: none` below would leave the user with no pointer at all.
  if (!cursorEnabled()) {
    return null;
  }

  const isDark = resolvedTheme === 'dark';
  const accentColor = isDark ? 'rgb(16, 185, 129)' : 'rgb(79, 70, 229)';

  // Real refraction does the heavy lifting (SVG filter below). The painted bits — thin rim,
  // faint chromatic shadows, ambient halo, and an inset highlight — sit on top of the refracted
  // backdrop to sell the "glass disc" feeling, so the cursor still reads as a lens even when
  // the underlying refraction is subtle (e.g. over flat-color regions).
  const rimColor = isDark ? 'rgba(255,255,255,0.32)' : 'rgba(0,0,0,0.26)';
  const tintColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.18)';
  const chromaCyan = isDark ? 'rgba(103,232,249,0.4)' : 'rgba(34,156,180,0.45)';
  const chromaMagenta = isDark ? 'rgba(240,171,252,0.4)' : 'rgba(180,90,200,0.45)';
  const ambientGlow = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const innerHighlight = isDark
    ? 'inset 1px 1px 2px rgba(255,255,255,0.12), inset -1px -1px 2px rgba(0,0,0,0.18)'
    : 'inset 1px 1px 2px rgba(255,255,255,0.5), inset -1px -1px 2px rgba(0,0,0,0.06)';

  return (
    <>
      <style>{`
        * { cursor: none !important; }
        @media (pointer: coarse) { * { cursor: auto !important; } }
        @media (prefers-reduced-motion: reduce) { * { cursor: auto !important; } }
      `}</style>

      {/* SVG lens filter — a procedural displacement map drives feDisplacementMap, so the cursor
          actually warps pixels behind it. Lives off-screen at z=0 dimensions. */}
      <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute', overflow: 'hidden' }}>
        <defs>
          <filter id="cursor-lens" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feImage
              href={lensMapUrl}
              preserveAspectRatio="none"
              x="0"
              y="0"
              width={CURSOR_SIZE}
              height={CURSOR_SIZE}
              result="lensMap"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="lensMap"
              scale="28"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Pinhole dot — small precise target anchor. Stays solid for crisp pointer feedback. */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          backgroundColor: accentColor,
          opacity: visible ? 0.85 : 0,
          transition: 'opacity 0.2s',
          mixBlendMode: 'difference',
        }}
      />

      {/* Lens disc — refractive (Chromium) or blurred (fallback) backdrop, with a chromatic edge. */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 z-[9998] pointer-events-none ${refractClass}`}
        style={{
          width: `${CURSOR_SIZE}px`,
          height: `${CURSOR_SIZE}px`,
          borderRadius: '50%',
          background: tintColor,
          border: `1px solid ${rimColor}`,
          boxShadow: `1px 0 0 ${chromaCyan}, -1px 0 0 ${chromaMagenta}, 0 0 14px ${ambientGlow}, ${innerHighlight}`,
          opacity: visible ? (hovering ? 1 : 0.9) : 0,
          transition: 'opacity 0.3s, width 0.3s, height 0.3s',
        }}
      />
    </>
  );
};

export default CustomCursor;

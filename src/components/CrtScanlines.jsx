import React, { useEffect, useRef } from 'react';

/**
 * CrtScanlines — full-viewport canvas of horizontal scanlines that bend toward the cursor,
 * mimicking a CRT being distorted by a magnet held near the screen. Each line within the
 * cursor's bend radius gets pulled vertically toward the cursor position; the falloff is
 * cubic so the bend localizes to a tight bubble around the pointer.
 *
 * Used on the 404 page in place of the static CSS scanlines so the broken-broadcast surface
 * actually responds to the user's presence — the page is alive but unstable.
 */
const CrtScanlines = ({ resolvedTheme }) => {
  const canvasRef = useRef(null);
  const cursor = useRef({ x: -9999, y: -9999, present: false });

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Reduced motion: render once, no warp.
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      const draw = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
        ctx.strokeStyle = resolvedTheme === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.18)';
        ctx.lineWidth = 1;
        for (let y = 0; y < h; y += 3) {
          ctx.beginPath();
          ctx.moveTo(0, y + 0.5);
          ctx.lineTo(w, y + 0.5);
          ctx.stroke();
        }
      };
      draw();
      window.addEventListener('resize', draw);
      return () => window.removeEventListener('resize', draw);
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e) => {
      cursor.current = { x: e.clientX, y: e.clientY, present: true };
    };
    const onLeave = () => { cursor.current.present = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('blur', onLeave);

    const isDark = resolvedTheme === 'dark';
    const baseStroke = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.18)';
    const SCAN_GAP = 3;          // vertical line spacing
    const SEG_STEP = 8;          // horizontal segment resolution
    const BEND_RADIUS = 200;     // pixels — radius of magnetic distortion bubble
    const MAX_PULL = 0.55;       // max vertical pull factor toward cursor

    let raf;
    const animate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const cur = cursor.current;
      const cx = cur.present ? cur.x : -9999;
      const cy = cur.present ? cur.y : -9999;

      ctx.lineWidth = 1;
      // Single base color for every line — the bending alone communicates cursor position,
      // so we don't paint a brighter stroke across the whole row when it's in the bend zone.
      ctx.strokeStyle = baseStroke;

      for (let y = 0; y < h; y += SCAN_GAP) {
        // Skip far-away lines as straight rectangles to save path work.
        const verticalDist = Math.abs(y - cy);
        if (!cur.present || verticalDist > BEND_RADIUS) {
          ctx.beginPath();
          ctx.moveTo(0, y + 0.5);
          ctx.lineTo(w, y + 0.5);
          ctx.stroke();
          continue;
        }

        // Within the bend zone — render the line as a curve pulled toward the cursor.
        // Segments at small horizontal distance from cursor get pulled vertically the most.
        ctx.beginPath();
        for (let x = 0; x <= w + SEG_STEP; x += SEG_STEP) {
          const dx = x - cx;
          const dy = y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          let yOffset = 0;
          if (dist < BEND_RADIUS) {
            const k = 1 - dist / BEND_RADIUS;
            // Cubic falloff — bend concentrates tightly under the cursor.
            yOffset = (cy - y) * k * k * k * MAX_PULL;
          }
          const drawY = y + yOffset + 0.5;
          if (x === 0) ctx.moveTo(x, drawY);
          else ctx.lineTo(x, drawY);
        }
        ctx.stroke();
      }

      // Hot dot under the cursor — the "magnet" itself, where the field is strongest.
      // This provides the local brightness focus without highlighting the whole scanline.
      if (cur.present) {
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 70);
        grad.addColorStop(0, isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.26)');
        grad.addColorStop(0.5, isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, 70, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('blur', onLeave);
    };
  }, [resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    />
  );
};

export default CrtScanlines;

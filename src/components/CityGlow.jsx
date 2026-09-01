import React, { useEffect, useRef } from 'react';

/*
 * The living environment layer (structure measured from
 * daylightcomputer.com: an ambient scene behind, glass furniture in
 * front). Two fixed layers behind the content:
 *
 *  - .cityglow: the city through the glass wall, as light only — cool
 *    haze by day, warm out-of-focus bokeh after dark (DESIGN.md §38).
 *    It parallaxes gently with scroll, so the city sits "below" the room.
 *  - .roomlight: a soft light that follows the pointer with lag, like
 *    light moving across glass. Input-driven only — nothing animates
 *    at idle (DESIGN.md §24).
 */
export default function CityGlow() {
  const glowRef = useRef(null);
  const lightRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const finePointer = window.matchMedia('(pointer: fine)').matches;

    let raf;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight * 0.35;
    let x = targetX;
    let y = targetY;

    const onMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const loop = () => {
      if (finePointer && lightRef.current) {
        x += (targetX - x) * 0.05;
        y += (targetY - y) * 0.05;
        lightRef.current.style.transform = `translate3d(${x - 420}px, ${y - 420}px, 0)`;
      }
      if (glowRef.current) {
        const shift = Math.min(window.scrollY * 0.05, 90);
        glowRef.current.style.transform = `translate3d(0, ${shift}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };

    if (finePointer) window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      if (finePointer) window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <>
      <div className="roomlight" ref={lightRef} aria-hidden="true" />
      <div className="cityglow" ref={glowRef} aria-hidden="true" />
    </>
  );
}

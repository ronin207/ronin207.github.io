import React from 'react';

/*
 * The city through the studio's glass wall, rendered as light only —
 * no literal buildings (DESIGN.md §38: atmosphere, not decoration).
 * From a high floor at night a city reads as out-of-focus bokeh and a
 * warm horizon glow; by day, as cool haze. Both live in index.css as
 * layered radial gradients per theme. Static by design.
 */
export default function CityGlow() {
  return <div className="cityglow" aria-hidden="true" />;
}

import React, { useRef, useEffect, useMemo } from 'react';

/**
 * HeroVisual — An animated rotating lattice/graph structure
 * representing the intersection of cryptography, AI, and mathematics.
 *
 * Renders as a 3D wireframe polyhedron (truncated icosahedron / "quantum lattice")
 * that slowly rotates and pulses. Sits beside the hero text.
 */
const HeroVisual = ({ resolvedTheme }) => {
  const canvasRef = useRef(null);

  const colors = useMemo(() => ({
    node: resolvedTheme === 'dark' ? 'rgba(16, 185, 129, 0.7)' : 'rgba(79, 70, 229, 0.6)',
    nodeGlow: resolvedTheme === 'dark' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(79, 70, 229, 0.1)',
    edge: resolvedTheme === 'dark' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(79, 70, 229, 0.15)',
    edgeHighlight: resolvedTheme === 'dark' ? 'rgba(16, 185, 129, 0.5)' : 'rgba(79, 70, 229, 0.4)',
    label: resolvedTheme === 'dark' ? 'rgba(150, 150, 150, 0.4)' : 'rgba(100, 100, 100, 0.35)',
  }), [resolvedTheme]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    // Generate a lattice-like 3D structure
    // Icosahedron vertices — clean geometric shape
    const phi = (1 + Math.sqrt(5)) / 2; // golden ratio
    const rawVerts = [
      [0, 1, phi], [0, -1, phi], [0, 1, -phi], [0, -1, -phi],
      [1, phi, 0], [-1, phi, 0], [1, -phi, 0], [-1, -phi, 0],
      [phi, 0, 1], [-phi, 0, 1], [phi, 0, -1], [-phi, 0, -1],
    ];

    // Normalize to unit sphere and scale
    const scale = 120;
    const vertices = rawVerts.map(([x, y, z]) => {
      const len = Math.sqrt(x * x + y * y + z * z);
      return [x / len * scale, y / len * scale, z / len * scale];
    });

    // Add midpoint vertices for a denser lattice
    const midpoints = [];
    const edges = [];
    const edgeSet = new Set();

    // Connect vertices that are close enough (icosahedron edges)
    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        const dx = vertices[i][0] - vertices[j][0];
        const dy = vertices[i][1] - vertices[j][1];
        const dz = vertices[i][2] - vertices[j][2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < scale * 1.2) {
          edges.push([i, j]);
          edgeSet.add(`${i}-${j}`);
          // Add midpoint
          midpoints.push([
            (vertices[i][0] + vertices[j][0]) / 2,
            (vertices[i][1] + vertices[j][1]) / 2,
            (vertices[i][2] + vertices[j][2]) / 2,
          ]);
        }
      }
    }

    // Add some midpoints as additional vertices
    const allVerts = [...vertices, ...midpoints.slice(0, 8)];

    // Connect midpoints to nearby main vertices
    for (let m = vertices.length; m < allVerts.length; m++) {
      for (let i = 0; i < vertices.length; i++) {
        const dx = allVerts[m][0] - allVerts[i][0];
        const dy = allVerts[m][1] - allVerts[i][1];
        const dz = allVerts[m][2] - allVerts[i][2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < scale * 0.7) {
          edges.push([m, i]);
        }
      }
    }

    // Labels that orbit near specific vertices
    const labels = ['ZKP', 'PQC', 'AI', 'ML', 'LEAN', 'λ'];

    let animId;
    let t = 0;

    const animate = () => {
      t += 0.003;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      // Rotation matrices (slow rotation on two axes)
      const cosA = Math.cos(t);
      const sinA = Math.sin(t);
      const cosB = Math.cos(t * 0.7);
      const sinB = Math.sin(t * 0.7);

      // Project 3D → 2D with rotation
      const project = ([x, y, z]) => {
        // Rotate around Y
        let x1 = x * cosA - z * sinA;
        let z1 = x * sinA + z * cosA;
        // Rotate around X
        let y1 = y * cosB - z1 * sinB;
        let z2 = y * sinB + z1 * cosB;
        // Perspective
        const fov = 400;
        const s = fov / (fov + z2);
        return {
          x: cx + x1 * s,
          y: cy + y1 * s,
          z: z2,
          s,
        };
      };

      // Project all vertices
      const projected = allVerts.map(project);

      // Pulse effect
      const pulse = 0.5 + Math.sin(t * 3) * 0.15;

      // Draw edges
      edges.forEach(([a, b]) => {
        const pa = projected[a];
        const pb = projected[b];
        if (!pa || !pb) return;
        const avgZ = (pa.z + pb.z) / 2;
        const depthAlpha = Math.max(0.1, Math.min(1, (avgZ + scale) / (scale * 2)));

        // Highlight some edges based on time
        const highlight = Math.sin(t * 2 + a * 0.5) > 0.7;

        ctx.strokeStyle = highlight ? colors.edgeHighlight : colors.edge;
        ctx.lineWidth = highlight ? 1.5 : 0.8;
        ctx.globalAlpha = depthAlpha * (highlight ? 1 : 0.7);
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      });

      ctx.globalAlpha = 1;

      // Draw nodes
      projected.forEach((p, i) => {
        const depthAlpha = Math.max(0.3, Math.min(1, (p.z + scale) / (scale * 2)));
        const isMain = i < vertices.length;
        const r = isMain ? 2.5 * p.s : 1.5 * p.s;

        // Glow
        if (isMain) {
          ctx.fillStyle = colors.nodeGlow;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r * 4 * pulse, 0, Math.PI * 2);
          ctx.fill();
        }

        // Node dot
        ctx.fillStyle = colors.node;
        ctx.globalAlpha = depthAlpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;

      // Draw labels near some vertices
      labels.forEach((label, i) => {
        if (i >= projected.length) return;
        const p = projected[i];
        const depthAlpha = Math.max(0.2, Math.min(0.8, (p.z + scale) / (scale * 2)));

        ctx.font = '9px monospace';
        ctx.fillStyle = colors.label;
        ctx.globalAlpha = depthAlpha * 0.7;
        ctx.textAlign = 'center';
        ctx.fillText(label, p.x, p.y - 12);
      });

      ctx.globalAlpha = 1;

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [colors]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ opacity: 0.85 }}
      aria-hidden="true"
    />
  );
};

export default HeroVisual;

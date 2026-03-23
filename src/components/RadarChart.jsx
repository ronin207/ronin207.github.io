import React, { useMemo } from 'react';

const RadarChart = ({ data, size = 300, theme = 'dark' }) => {
    // Configuration
    const scale = 0.8; // Scale of the chart within the SVG
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (size / 2) * scale;
    const numAxes = data.length;
    const angleSlice = (Math.PI * 2) / numAxes;

    // Colors based on theme
    const colors = useMemo(() => {
        const isDark = theme === 'dark';
        return {
            text: isDark ? '#a3a3a3' : '#525252', // neutral-400 / neutral-600
            line: isDark ? '#262626' : '#e5e5e5', // neutral-800 / neutral-200
            fill: isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(79, 70, 229, 0.2)', // emerald / indigo with opacity
            stroke: isDark ? '#10b981' : '#4f46e5', // emerald-500 / indigo-600
            point: isDark ? '#10b981' : '#4f46e5',
        };
    }, [theme]);

    // Calculate coordinates
    const getCoordinates = (value, index) => {
        const angle = index * angleSlice - Math.PI / 2; // Start from top
        const r = (value / 100) * radius;
        return {
            x: centerX + r * Math.cos(angle),
            y: centerY + r * Math.sin(angle),
        };
    };

    // Generate points for the data polygon
    const points = data.map((item, i) => {
        const coords = getCoordinates(item.value, i);
        return `${coords.x},${coords.y}`;
    }).join(' ');

    // Generate grid levels
    const levels = [25, 50, 75, 100];

    return (
        <div className="flex flex-col items-center justify-center">
            <svg
                viewBox={`0 0 ${size} ${size}`}
                className="overflow-visible w-full h-auto"
                style={{ maxWidth: size }}
            >
                {/* Grid Circles/Polygons */}
                {levels.map((level, i) => {
                    const levelPoints = data.map((_, index) => {
                        const coords = getCoordinates(level, index);
                        return `${coords.x},${coords.y}`;
                    }).join(' ');

                    return (
                        <polygon
                            key={`level-${level}`}
                            points={levelPoints}
                            fill="none"
                            stroke={colors.line}
                            strokeWidth="1"
                            strokeDasharray={i === levels.length - 1 ? "0" : "4 4"}
                        />
                    );
                })}

                {/* Axes */}
                {data.map((item, i) => {
                    const coords = getCoordinates(100, i);
                    return (
                        <line
                            key={`axis-${i}`}
                            x1={centerX}
                            y1={centerY}
                            x2={coords.x}
                            y2={coords.y}
                            stroke={colors.line}
                            strokeWidth="1"
                        />
                    );
                })}

                {/* Data Polygon */}
                <polygon
                    points={points}
                    fill={colors.fill}
                    stroke={colors.stroke}
                    strokeWidth="2"
                    className="transition-all duration-1000 ease-out"
                />

                {/* Data Points */}
                {data.map((item, i) => {
                    const coords = getCoordinates(item.value, i);
                    return (
                        <circle
                            key={`point-${i}`}
                            cx={coords.x}
                            cy={coords.y}
                            r="3"
                            fill={colors.point}
                            className="transition-all duration-1000 ease-out"
                        />
                    );
                })}

                {/* Labels */}
                {data.map((item, i) => {
                    const angle = i * angleSlice - Math.PI / 2;
                    const labelRadius = radius * 1.15; // Push labels out a bit
                    const x = centerX + labelRadius * Math.cos(angle);
                    const y = centerY + labelRadius * Math.sin(angle);

                    // Adjust text anchor based on position
                    let textAnchor = 'middle';
                    if (x < centerX - 10) textAnchor = 'end';
                    if (x > centerX + 10) textAnchor = 'start';

                    return (
                        <text
                            key={`label-${i}`}
                            x={x}
                            y={y}
                            textAnchor={textAnchor}
                            dominantBaseline="middle"
                            fill={colors.text}
                            className="text-[10px] font-mono uppercase tracking-wider"
                            style={{ fontSize: '10px' }}
                        >
                            {item.label}
                        </text>
                    );
                })}
            </svg>
        </div>
    );
};

export default RadarChart;

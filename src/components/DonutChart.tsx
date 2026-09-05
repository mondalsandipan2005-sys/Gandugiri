import React, { useState } from 'react';
import type { Severity } from '../types';
import { useApp } from '../AppContext';

interface Props {
  severities: Severity[];
  total: number;
}

const CENTER = 100;
const RADIUS = 72;
const STROKE_WIDTH = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const DonutChart: React.FC<Props> = ({ severities, total }) => {
  const { showToast } = useApp();
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  let currentOffset = 0;

  return (
    <div className="donut-container">
      <svg className="donut-svg" viewBox="0 0 200 200">
        {severities.map((item) => {
          if (item.count === 0) return null;
          const sliceLength = (item.count / total) * CIRCUMFERENCE;
          const dashoffset = -currentOffset;
          currentOffset += sliceLength;

          return (
            <circle
              key={item.key}
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="transparent"
              stroke={item.color}
              strokeWidth={hoveredKey === item.key ? STROKE_WIDTH + 4 : STROKE_WIDTH}
              strokeDasharray={`${sliceLength} ${CIRCUMFERENCE - sliceLength}`}
              strokeDashoffset={dashoffset}
              style={{
                transition: 'stroke-dashoffset 0.8s ease, stroke-dasharray 0.8s ease, stroke-width 0.15s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={() => setHoveredKey(item.key)}
              onMouseLeave={() => setHoveredKey(null)}
              onClick={() => showToast(`${item.name}: ${item.count} findings (${item.pct}%)`, 'info')}
            />
          );
        })}
      </svg>
      <div className="donut-center-info">
        <span className="donut-center-val">{total}</span>
        <span className="donut-center-label">Total</span>
      </div>
    </div>
  );
};

export default DonutChart;

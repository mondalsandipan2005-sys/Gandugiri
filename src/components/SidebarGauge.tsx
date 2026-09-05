import React from 'react';

interface Props {
  score: number;
}

function getStatus(score: number): { label: string; className: string } {
  if (score >= 90) return { label: 'Excellent', className: 'status-good' };
  if (score >= 70) return { label: 'Good', className: 'status-good' };
  if (score >= 50) return { label: 'Moderate', className: 'status-medium' };
  return { label: 'Critical', className: 'status-critical' };
}

const MAX_ARC = 235.6;

const SidebarGauge: React.FC<Props> = ({ score }) => {
  const offset = MAX_ARC - (score / 100) * MAX_ARC;
  const { label, className } = getStatus(score);

  return (
    <div className="sidebar-card score-gauge-card">
      <div className="card-label">Overall Security Score</div>
      <div className="radial-gauge-wrapper">
        <svg className="radial-gauge-svg" viewBox="0 0 200 115">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="30%" stopColor="#84cc16" />
              <stop offset="60%" stopColor="#eab308" />
              <stop offset="85%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <path
            className="gauge-bg"
            d="M 25 95 A 75 75 0 0 1 175 95"
            fill="none"
            stroke="#1c253b"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            className="gauge-progress"
            d="M 25 95 A 75 75 0 0 1 175 95"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray="235.6"
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div className="gauge-content">
          <div className="gauge-number">{score}</div>
          <div className="gauge-total">/ 100</div>
          <div className={`gauge-status ${className}`}>{label}</div>
        </div>
      </div>
    </div>
  );
};

export default SidebarGauge;

import React from 'react';
import { useApp } from '../../AppContext';
import { securityIssues, anomalies } from '../../data';
import DonutChart from '../DonutChart';

const sparkGradients: Record<string, { color: string; id: string; path: string; fillPath: string }> = {
  score: {
    color: '#22c55e',
    id: 'greenSparkGrad',
    path: 'M 0,24 Q 25,28 45,15 T 75,18 T 100,6',
    fillPath: 'M 0,24 Q 25,28 45,15 T 75,18 T 100,6 L 100,30 L 0,30 Z',
  },
  findings: {
    color: '#3b82f6',
    id: 'blueSparkGrad',
    path: 'M 0,25 Q 20,20 40,24 T 70,10 T 100,14',
    fillPath: 'M 0,25 Q 20,20 40,24 T 70,10 T 100,14 L 100,30 L 0,30 Z',
  },
  ai: {
    color: '#a855f7',
    id: 'purpleSparkGrad',
    path: 'M 0,24 Q 15,25 30,12 T 55,26 T 80,8 T 100,18',
    fillPath: 'M 0,24 Q 15,25 30,12 T 55,26 T 80,8 T 100,18 L 100,30 L 0,30 Z',
  },
  tunnels: {
    color: '#06b6d4',
    id: 'cyanSparkGrad',
    path: 'M 0,20 Q 25,12 50,22 T 80,14 T 100,16',
    fillPath: 'M 0,20 Q 25,12 50,22 T 80,14 T 100,16 L 100,30 L 0,30 Z',
  },
};

const Sparkline: React.FC<{ variant: keyof typeof sparkGradients }> = ({ variant }) => {
  const s = sparkGradients[variant];
  return (
    <svg className="sparkline" viewBox="0 0 100 30">
      <path d={s.path} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinecap="round" />
      <path d={s.fillPath} fill={`url(#${s.id})`} opacity="0.15" />
      <defs>
        <linearGradient id={s.id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={s.color} />
          <stop offset="100%" stopColor={s.color} stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const DashboardView: React.FC = () => {
  const { currentScan, severities, navigateTo, openIssueDetail, openAnomalyDetail } = useApp();

  return (
    <section className="view-section active" id="dashboardView">
      <div className="kpi-grid">
        {/* 1. Security Score */}
        <div className="kpi-card">
          <div className="kpi-card-header">
            <div className="kpi-icon-box kpi-icon-score">
              <i className="fa-solid fa-shield-halved" />
            </div>
            <div className="kpi-title-block">
              <span className="kpi-label">Security Score</span>
              <div className="kpi-main-val">
                <span className="val-big">{currentScan.securityScore}</span>
                <span className="val-sub">/ 100</span>
              </div>
              <div className="kpi-status-text text-good">{currentScan.scoreStatus}</div>
            </div>
            <div className="kpi-dots-menu">
              <button className="kpi-dots-btn" aria-label="Card options">
                <i className="fa-solid fa-ellipsis-vertical" />
              </button>
            </div>
          </div>
          <div className="kpi-footer">
            <div className="trend-indicator trend-up">
              <i className="fa-solid fa-arrow-up" />
              <span>12% from last scan</span>
            </div>
            <div className="sparkline-container">
              <Sparkline variant="score" />
            </div>
          </div>
        </div>

        {/* 2. Risk Level */}
        <div className="kpi-card">
          <div className="kpi-card-header">
            <div className="kpi-icon-box kpi-icon-risk">
              <i className="fa-solid fa-triangle-exclamation" />
            </div>
            <div className="kpi-title-block">
              <span className="kpi-label">Risk Level</span>
              <div className="kpi-main-val text-risk-high">{currentScan.riskLevel}</div>
            </div>
            <div className="kpi-dots-menu">
              <button className="kpi-dots-btn" aria-label="Card options">
                <i className="fa-solid fa-ellipsis-vertical" />
              </button>
            </div>
          </div>
          <div className="kpi-footer kpi-footer-pills">
            <div className="risk-sub-pill risk-pill-critical">
              <span className="pill-name">Critical</span>
              <span className="pill-count">{currentScan.criticalCount}</span>
            </div>
            <div className="risk-sub-pill risk-pill-high">
              <span className="pill-name">High</span>
              <span className="pill-count">{currentScan.highCount}</span>
            </div>
          </div>
        </div>

        {/* 3. Total Findings */}
        <div className="kpi-card">
          <div className="kpi-card-header">
            <div className="kpi-icon-box kpi-icon-findings">
              <i className="fa-regular fa-file-lines" />
            </div>
            <div className="kpi-title-block">
              <span className="kpi-label">Total Findings</span>
              <div className="kpi-main-val">{currentScan.totalFindings}</div>
            </div>
            <div className="kpi-dots-menu">
              <button className="kpi-dots-btn" aria-label="Card options">
                <i className="fa-solid fa-ellipsis-vertical" />
              </button>
            </div>
          </div>
          <div className="kpi-footer">
            <div className="trend-indicator trend-blue">
              <i className="fa-solid fa-arrow-up" />
              <span>8 from last scan</span>
            </div>
            <div className="sparkline-container">
              <Sparkline variant="findings" />
            </div>
          </div>
        </div>

        {/* 4. AI Anomalies */}
        <div className="kpi-card">
          <div className="kpi-card-header">
            <div className="kpi-icon-box kpi-icon-ai">
              <i className="fa-solid fa-brain" />
            </div>
            <div className="kpi-title-block">
              <span className="kpi-label">AI Anomalies</span>
              <div className="kpi-main-val">{currentScan.aiAnomaliesCount}</div>
              <div className="kpi-status-text text-anomaly-risk">{currentScan.aiRiskLevel}</div>
            </div>
            <div className="kpi-dots-menu">
              <button className="kpi-dots-btn" aria-label="Card options">
                <i className="fa-solid fa-ellipsis-vertical" />
              </button>
            </div>
          </div>
          <div className="kpi-footer">
            <div className="sparkline-container full-width">
              <Sparkline variant="ai" />
            </div>
          </div>
        </div>

        {/* 5. VPN Tunnels */}
        <div className="kpi-card">
          <div className="kpi-card-header">
            <div className="kpi-icon-box kpi-icon-tunnel">
              <i className="fa-solid fa-link" />
            </div>
            <div className="kpi-title-block">
              <span className="kpi-label">VPN Tunnels</span>
              <div className="kpi-main-val">{currentScan.vpnTunnelsCount}</div>
              <div className="kpi-status-text text-good">Active</div>
            </div>
            <div className="kpi-dots-menu">
              <button className="kpi-dots-btn" aria-label="Card options">
                <i className="fa-solid fa-ellipsis-vertical" />
              </button>
            </div>
          </div>
          <div className="kpi-footer">
            <div className="sparkline-container full-width">
              <Sparkline variant="tunnels" />
            </div>
          </div>
        </div>
      </div>

      <div className="middle-grid">
        {/* Findings donut chart */}
        <div className="dashboard-card chart-card">
          <div className="card-top-header">
            <h3 className="card-heading">Security Findings by Severity</h3>
            <button className="link-action-btn" onClick={() => navigateTo('security')}>
              View all
            </button>
          </div>
          <div className="donut-chart-layout">
            <DonutChart severities={severities} total={currentScan.totalFindings} />
            <div className="donut-legend">
              {severities.map((s) => (
                <div className="legend-row" data-severity={s.key} key={s.key}>
                  <span className={`legend-color-box bg-${s.key}`} />
                  <span className="legend-name">{s.name}</span>
                  <span className="legend-metrics">
                    {s.count} ({s.pct}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* VPN Topology preview */}
        <div className="dashboard-card topology-card">
          <div className="card-top-header">
            <h3 className="card-heading">VPN Topology</h3>
            <button className="link-action-btn" onClick={() => navigateTo('topology')}>
              View topology
            </button>
          </div>

          <div className="topology-diagram-container">
            <div className="topo-node topo-local-net" title="Click for subnet details">
              <div className="node-icon-box">
                <i className="fa-solid fa-network-wired" />
              </div>
              <div className="node-title">Local Network</div>
              <div className="node-ip">{currentScan.localNet}</div>
            </div>

            <div className="topo-connector-line green-link">
              <span className="link-pulse-dot" />
            </div>

            <div className="topo-node topo-gateway" title="Cisco ASA 5525-X Gateway">
              <div className="node-icon-box gateway-icon">
                <i className="fa-solid fa-server" />
              </div>
              <div className="node-title">VPN Gateway</div>
              <div className="node-ip">{currentScan.localGw}</div>
            </div>

            <div className="topo-tunnel-tube-wrap">
              <div className="tunnel-label-top">IPsec Tunnel</div>
              <div className="tunnel-beam">
                <div className="tunnel-particles-stream">
                  <span className="particle p1" />
                  <span className="particle p2" />
                  <span className="particle p3" />
                  <span className="particle p4" />
                </div>
                <span className="tunnel-crypto-tag">
                  {currentScan.encryption} / {currentScan.integrity}
                </span>
              </div>
            </div>

            <div className="topo-node topo-gateway" title="Fortinet FortiGate 100F Gateway">
              <div className="node-icon-box gateway-icon">
                <i className="fa-solid fa-server" />
              </div>
              <div className="node-title">VPN Gateway</div>
              <div className="node-ip">{currentScan.remoteGw}</div>
            </div>

            <div className="topo-connector-line blue-link">
              <span className="link-pulse-dot-rev" />
            </div>

            <div className="topo-node topo-remote-net" title="Click for remote subnet details">
              <div className="node-icon-box">
                <i className="fa-solid fa-network-wired" />
              </div>
              <div className="node-title">Remote Network</div>
              <div className="node-ip">{currentScan.remoteNet}</div>
            </div>
          </div>

          <div className="tunnel-meta-strip">
            <div className="meta-cell">
              <span className="meta-lbl">Tunnel Status</span>
              <span className="meta-val val-status-up">{currentScan.tunnelStatus}</span>
            </div>
            <div className="meta-cell">
              <span className="meta-lbl">IKE Version</span>
              <span className="meta-val">{currentScan.ikeVersion}</span>
            </div>
            <div className="meta-cell">
              <span className="meta-lbl">Encryption</span>
              <span className="meta-val">{currentScan.encryption}</span>
            </div>
            <div className="meta-cell">
              <span className="meta-lbl">Integrity</span>
              <span className="meta-val">{currentScan.integrity}</span>
            </div>
            <div className="meta-cell">
              <span className="meta-lbl">PFS</span>
              <span className="meta-val">{currentScan.pfs}</span>
            </div>
            <div className="meta-cell">
              <span className="meta-lbl">Uptime</span>
              <span className="meta-val">{currentScan.uptime}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bottom-tri-grid">
        {/* Top Security Issues */}
        <div className="dashboard-card issues-card">
          <div className="card-top-header">
            <h3 className="card-heading">Top Security Issues</h3>
            <button className="link-action-btn" onClick={() => navigateTo('security')}>
              View all
            </button>
          </div>
          <div className="issues-list">
            {securityIssues.map((issue) => (
              <div
                className="issue-item"
                data-issue-id={issue.id}
                tabIndex={0}
                key={issue.id}
                onClick={() => openIssueDetail(issue.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openIssueDetail(issue.id);
                  }
                }}
              >
                <div className={`issue-icon-wrap ${issue.iconClass}`}>
                  <i className="fa-solid fa-shield-halved" />
                </div>
                <div className="issue-info">
                  <h4 className="issue-title">{issue.title}</h4>
                  <p className="issue-desc">{issue.desc}</p>
                </div>
                <div className={`issue-badge ${issue.badgeClass}`}>{issue.severity}</div>
                <i className="fa-solid fa-chevron-right issue-arrow" />
              </div>
            ))}
          </div>
        </div>

        {/* AI Anomaly Detection */}
        <div className="dashboard-card anomaly-card">
          <div className="card-top-header">
            <h3 className="card-heading">AI Anomaly Detection</h3>
            <button className="link-action-btn" onClick={() => navigateTo('anomalies')}>
              View all
            </button>
          </div>
          <div className="anomaly-cards-list">
            {anomalies.map((ano) => (
              <div
                className={`anomaly-sub-card ${ano.borderClass}`}
                data-anomaly-id={ano.id}
                key={ano.id}
                onClick={() => openAnomalyDetail(ano.id)}
              >
                <div className="anomaly-sub-header">
                  <span className="anomaly-sub-title">{ano.title}</span>
                  <span className={`anomaly-pill ${ano.pillClass}`}>{ano.riskLevel}</span>
                </div>
                <p className="anomaly-sub-desc">{ano.desc}</p>
                <div className="anomaly-sub-footer">
                  <div className="anomaly-metrics-meta">
                    <span className="meta-item">
                      Confidence: <strong className="val-bold">{ano.confidence}</strong>
                    </span>
                    <span className="meta-item">
                      Time: <span className="val-mono">{ano.time}</span>
                    </span>
                  </div>
                  <div className="anomaly-spark-box">
                    <svg className="spark-red-wave" viewBox="0 0 60 22">
                      <path
                        d="M 0,16 Q 10,18 20,4 T 40,20 T 60,10"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card-footer-action">
            <button className="btn-card-bottom" onClick={() => navigateTo('anomalies')}>
              View all anomalies
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <RecentActivityCard />
      </div>
    </section>
  );
};

const RecentActivityCard: React.FC = () => {
  const { activity, navigateTo } = useApp();
  return (
    <div className="dashboard-card activity-card">
      <div className="card-top-header">
        <h3 className="card-heading">Recent Activity</h3>
      </div>
      <div className="activity-timeline">
        {activity.map((item) => (
          <div className="timeline-item" key={item.id}>
            <div className={`timeline-marker ${item.dotClass}`} />
            <div className="timeline-content">
              <div className="timeline-title">{item.title}</div>
              <div className="timeline-sub">{item.sub}</div>
            </div>
            <div className="timeline-time">{item.time}</div>
          </div>
        ))}
      </div>
      <div className="card-footer-action">
        <button className="btn-card-bottom" onClick={() => navigateTo('history')}>
          View all activity
        </button>
      </div>
    </div>
  );
};

export default DashboardView;

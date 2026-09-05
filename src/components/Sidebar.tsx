import React from 'react';
import type { ViewName } from '../types';
import { useApp } from '../AppContext';
import SidebarGauge from './SidebarGauge';

interface NavItem {
  view: ViewName;
  icon: string;
  label: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { view: 'dashboard', icon: 'fa-table-cells-large', label: 'Dashboard' },
  { view: 'traffic', icon: 'fa-chart-simple', label: 'Traffic Analysis' },
  { view: 'security', icon: 'fa-shield-check', label: 'Security Assessment' },
  { view: 'anomalies', icon: 'fa-brain', label: 'AI Anomaly Detection' },
  { view: 'topology', icon: 'fa-network-wired', label: 'VPN Topology' },
  { view: 'reports', icon: 'fa-file-lines', label: 'Reports' },
  { view: 'alerts', icon: 'fa-bell', label: 'Alerts', badge: 3 },
  { view: 'history', icon: 'fa-clock-rotate-left', label: 'History' },
  { view: 'settings', icon: 'fa-gear', label: 'Settings' },
];

const Sidebar: React.FC = () => {
  const { activeView, navigateTo, sidebarOpen, currentScan, openReportModal } = useApp();

  return (
    <aside className={`sidebar${sidebarOpen ? ' open' : ''}`} id="sidebar">
      <div className="sidebar-header">
        <a
          href="#dashboard"
          className="logo-container"
          title="Back to Dashboard"
          onClick={(e) => {
            e.preventDefault();
            navigateTo('dashboard');
          }}
        >
          <div className="logo-icon-wrap">
            <i className="fa-solid fa-shield-halved logo-icon" />
            <span className="logo-glow" />
          </div>
          <div className="logo-text">
            <h1 className="brand-title">IPsec Shield AI</h1>
            <span className="brand-subtitle">VPN Security Analyzer</span>
          </div>
        </a>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {navItems.map((item) => (
            <li className="nav-item" key={item.view}>
              <a
                href={`#${item.view}`}
                className={`nav-link${activeView === item.view ? ' active' : ''}`}
                data-view={item.view}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo(item.view);
                }}
              >
                <i className={`fa-solid ${item.icon} nav-icon`} />
                <span>{item.label}</span>
                {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-bottom-widgets">
        <SidebarGauge score={currentScan.securityScore} />

        <div className="sidebar-card active-scan-card">
          <div className="scan-header">
            <span className="scan-label">Active Scan</span>
          </div>
          <div className="scan-filename" title={currentScan.fileName}>
            {currentScan.fileName}
          </div>
          <div className="scan-status-wrap">
            <span className="status-pill status-completed">Completed</span>
          </div>
          <button className="btn btn-scan-report" onClick={openReportModal}>
            <span>View Report</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

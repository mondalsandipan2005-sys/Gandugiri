import React from 'react';

const AlertsView: React.FC = () => {
  return (
    <section className="view-section active" id="alertsView">
      <div className="section-title-wrap">
        <h3 className="section-heading">
          <i className="fa-solid fa-bell" /> Real-Time Security Incident Alerts
        </h3>
        <p className="section-desc">
          Automated alerts dispatched to SIEM / Syslog upon detection of critical security degradation.
        </p>
      </div>
      <div className="dashboard-card">
        <div className="alerts-feed-list">
          <div className="issue-item">
            <div className="issue-icon-wrap icon-critical">
              <i className="fa-solid fa-triangle-exclamation" />
            </div>
            <div className="issue-info">
              <h4 className="issue-title">
                [ALERT-CRIT] Diffie-Hellman Group 2 (1024-bit) used on SA 203.0.113.1 ➔ 198.51.100.1
              </h4>
              <p className="issue-desc">
                Automated alert generated: Deprecated modular exponentiation group violates NIST SP
                800-77.
              </p>
            </div>
            <span className="timeline-time">10 minutes ago</span>
          </div>
          <div className="issue-item mt-15">
            <div className="issue-icon-wrap icon-high">
              <i className="fa-solid fa-bolt" />
            </div>
            <div className="issue-info">
              <h4 className="issue-title">
                [ALERT-HIGH] 14 IKE_AUTH Retransmissions detected in 3.2 seconds
              </h4>
              <p className="issue-desc">
                Sequence LSTM anomaly score exceeded threshold (94% confidence).
              </p>
            </div>
            <span className="timeline-time">22 minutes ago</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AlertsView;

import React from 'react';
import { useApp } from '../../AppContext';

interface HistoryRow {
  date: string;
  file: string;
  protocol: string;
  score: string;
  critical: string;
}

const historyRows: HistoryRow[] = [
  {
    date: 'May 26, 2025 10:30 AM',
    file: 'office_vpn_capture.pcap',
    protocol: 'IKEv2 / ESP',
    score: '73 / 100',
    critical: '2 Critical',
  },
  {
    date: 'May 24, 2025 04:15 PM',
    file: 'branch_tunnel_audit.pcap',
    protocol: 'IKEv2 / ESP',
    score: '86 / 100',
    critical: '0 Critical',
  },
];

const HistoryView: React.FC = () => {
  const { openReportModal } = useApp();

  return (
    <section className="view-section active" id="historyView">
      <div className="section-title-wrap">
        <h3 className="section-heading">
          <i className="fa-solid fa-clock-rotate-left" /> PCAP Assessment Scan History
        </h3>
        <p className="section-desc">Historical scan scores and longitudinal cryptographic posture trends.</p>
      </div>
      <div className="dashboard-card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Scan Date</th>
                <th>PCAP File</th>
                <th>Protocol</th>
                <th>Score</th>
                <th>Critical Issues</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {historyRows.map((row) => (
                <tr key={row.file}>
                  <td>{row.date}</td>
                  <td>
                    <code>{row.file}</code>
                  </td>
                  <td>{row.protocol}</td>
                  <td>
                    <strong className="text-good">{row.score}</strong>
                  </td>
                  <td>{row.critical}</td>
                  <td>
                    <span className="status-pill status-completed">Completed</span>
                  </td>
                  <td>
                    <button className="text-btn" onClick={openReportModal}>
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default HistoryView;

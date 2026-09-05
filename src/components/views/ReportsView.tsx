import React from 'react';
import { useApp } from '../../AppContext';

const ReportsView: React.FC = () => {
  const { openReportModal, exportCsvReport } = useApp();

  return (
    <section className="view-section active" id="reportsView">
      <div className="section-title-wrap">
        <h3 className="section-heading">
          <i className="fa-solid fa-file-lines" /> Executive Audit &amp; Compliance Reports
        </h3>
        <p className="section-desc">
          Download NIST SP 800-77, ISO 27001, and RFC 8247 compliance certificates and technical audit
          logs.
        </p>
      </div>
      <div className="reports-grid">
        <div className="dashboard-card report-item-card">
          <div className="report-icon-box">
            <i className="fa-solid fa-file-pdf" />
          </div>
          <div className="report-meta">
            <h4>Security_report_20250526.pdf</h4>
            <p>Full executive summary with cryptographic remediation matrix.</p>
            <span className="report-size">2.4 MB • Generated Today at 10:31 AM</span>
          </div>
          <button className="btn btn-outline" onClick={openReportModal}>
            Download PDF
          </button>
        </div>
        <div className="dashboard-card report-item-card">
          <div className="report-icon-box">
            <i className="fa-solid fa-file-csv" />
          </div>
          <div className="report-meta">
            <h4>IKE_Proposal_Dissection_Log.csv</h4>
            <p>Raw cipher suites, DH groups, PRF algorithms, and auth credentials parsed.</p>
            <span className="report-size">840 KB • CSV Export</span>
          </div>
          <button className="btn btn-outline" onClick={exportCsvReport}>
            Export CSV
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReportsView;

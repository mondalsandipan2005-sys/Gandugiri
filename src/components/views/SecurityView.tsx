import React from 'react';
import { useApp } from '../../AppContext';
import { securityIssues } from '../../data';
import type { SeverityKey } from '../../types';

const filterPills: { key: 'all' | SeverityKey; label: string; count: number; pillClass: string }[] = [
  { key: 'all', label: 'All', count: 38, pillClass: '' },
  { key: 'critical', label: 'Critical', count: 2, pillClass: 'pill-crit' },
  { key: 'high', label: 'High', count: 4, pillClass: 'pill-hi' },
  { key: 'medium', label: 'Medium', count: 7, pillClass: 'pill-med' },
  { key: 'low', label: 'Low', count: 8, pillClass: 'pill-lo' },
  { key: 'info', label: 'Info', count: 17, pillClass: 'pill-inf' },
];

const SecurityView: React.FC = () => {
  const { severityFilter, setSeverityFilter, openIssueDetail, currentScan } = useApp();

  const visibleIssues = securityIssues.filter(
    (issue) => severityFilter === 'all' || issue.severity.toLowerCase() === severityFilter
  );

  return (
    <section className="view-section active" id="securityView">
      <div className="section-title-wrap">
        <h3 className="section-heading">
          <i className="fa-solid fa-shield-check" /> Comprehensive Security Assessment (
          {currentScan.totalFindings} Findings)
        </h3>
        <p className="section-desc">
          Automated cryptographic compliance checks against NIST SP 800-77 Rev. 1, RFC 8247, and BSI
          TR-02102.
        </p>
      </div>

      <div className="findings-filter-bar">
        {filterPills.map((pill) => (
          <button
            key={pill.key}
            className={`filter-pill ${pill.pillClass}${severityFilter === pill.key ? ' active' : ''}`}
            onClick={() => setSeverityFilter(pill.key)}
          >
            {pill.label} ({pill.count})
          </button>
        ))}
      </div>

      <div className="dashboard-card mt-15">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Severity</th>
                <th>Vulnerability / Policy Violation</th>
                <th>Standard Reference</th>
                <th>Impact Category</th>
                <th>Remediation Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleIssues.map((issue) => (
                <tr key={issue.id} data-sev={issue.severity.toLowerCase()}>
                  <td>
                    <strong>{issue.id}</strong>
                  </td>
                  <td>
                    <span className={`issue-badge ${issue.badgeClass}`}>{issue.severity}</span>
                  </td>
                  <td>
                    <strong>{issue.title}</strong>
                    <br />
                    <small className="text-secondary">{issue.desc}</small>
                  </td>
                  <td>
                    <code>{issue.rfc}</code>
                  </td>
                  <td>{issue.component}</td>
                  <td>
                    <button
                      className="btn btn-outline"
                      style={{ padding: '4px 10px', fontSize: '11px' }}
                      onClick={() => openIssueDetail(issue.id)}
                    >
                      Inspect Fix
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

export default SecurityView;

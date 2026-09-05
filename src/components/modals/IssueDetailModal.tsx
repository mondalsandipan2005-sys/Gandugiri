import React from 'react';
import { useApp } from '../../AppContext';
import { securityIssues } from '../../data';
import type { CliVendor } from '../../types';

const cliTabs: { key: CliVendor; label: string }[] = [
  { key: 'cisco', label: 'Cisco IOS / ASA' },
  { key: 'fortinet', label: 'Fortinet FortiOS' },
  { key: 'strongswan', label: 'Linux StrongSwan' },
];

const IssueDetailModal: React.FC = () => {
  const { activeModal, closeModal, selectedIssueId, activeCliTab, setActiveCliTab, showToast } = useApp();

  if (activeModal !== 'issue') return null;

  const issue = securityIssues.find((i) => i.id === selectedIssueId) || securityIssues[0];
  const code = issue.cli[activeCliTab] || issue.cli.cisco;

  return (
    <div
      className="modal-overlay show"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div className="modal-card modal-lg">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-title-icon">
              <i className="fa-solid fa-shield-halved" />
            </div>
            <div>
              <h3 className="modal-title">{issue.title}</h3>
              <p className="modal-sub">{issue.desc}</p>
            </div>
          </div>
          <div className="modal-header-actions">
            <span className={`issue-badge ${issue.badgeClass}`}>{issue.severity}</span>
            <button className="modal-close-btn" aria-label="Close modal" onClick={closeModal}>
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
        </div>

        <div className="modal-body">
          <div className="issue-meta-summary-grid">
            <div className="issue-meta-item">
              <span className="meta-label">Standard Reference</span>
              <span className="meta-value">{issue.rfc}</span>
            </div>
            <div className="issue-meta-item">
              <span className="meta-label">CVSS v3.1 Score</span>
              <span className="meta-value text-risk-high">{issue.cvss}</span>
            </div>
            <div className="issue-meta-item">
              <span className="meta-label">Affected SA Component</span>
              <span className="meta-value">{issue.component}</span>
            </div>
            <div className="issue-meta-item">
              <span className="meta-label">Logjam / Discrete Log Risk</span>
              <span className="meta-value">{issue.exploitRisk}</span>
            </div>
          </div>

          <div className="modal-tab-content">
            <h5 className="tab-sec-title">Technical Risk Analysis</h5>
            <p className="tab-sec-desc">{issue.details}</p>

            <h5 className="tab-sec-title mt-15">Remediation Guide &amp; CLI Commands</h5>
            <div className="cli-snippet-tabs">
              <div className="cli-tab-nav">
                {cliTabs.map((tab) => (
                  <button
                    key={tab.key}
                    className={`cli-tab-btn${activeCliTab === tab.key ? ' active' : ''}`}
                    onClick={() => setActiveCliTab(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="cli-tab-body">
                <pre>
                  <code className="code-block">{code}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-outline"
            onClick={() => {
              navigator.clipboard.writeText(code.trim()).then(() => {
                showToast('CLI configuration copied to clipboard!', 'success');
              });
            }}
          >
            <i className="fa-regular fa-copy" /> Copy CLI Config
          </button>
          <button className="btn btn-primary" onClick={closeModal}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default IssueDetailModal;

import React from 'react';
import { useApp } from '../../AppContext';

const ReportPreviewModal: React.FC = () => {
  const { activeModal, closeModal, currentScan } = useApp();

  if (activeModal !== 'report') return null;

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
              <i className="fa-solid fa-file-pdf" />
            </div>
            <div>
              <h3 className="modal-title">Executive Security Assessment Report</h3>
              <p className="modal-sub">SIH26160 Compliance Audit Summary</p>
            </div>
          </div>
          <button className="modal-close-btn" aria-label="Close modal" onClick={closeModal}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        <div className="modal-body print-area">
          <div className="report-header-banner">
            <div>
              <h2>IPsec Shield AI - Protocol Security Audit</h2>
              <p>
                Target File: <code>{currentScan.fileName}</code> | Analyzed:{' '}
                <span>{currentScan.analysisTime}</span>
              </p>
            </div>
            <div className="rep-score-badge">
              <span className="score-lg">{currentScan.securityScore}</span>
              <span className="score-status">
                {currentScan.scoreStatus.toUpperCase()} ({currentScan.riskLevel.toUpperCase()} RISK)
              </span>
            </div>
          </div>
          <hr className="report-divider" />
          <div className="report-section">
            <h4>1. Executive Summary</h4>
            <p>
              An in-depth automated packet dissection and AI security assessment was conducted on the
              captured IPsec traffic. The analyzed tunnel utilizes IKEv2 with AES-256 encryption and
              SHA-256 integrity. However, critical cryptographic weaknesses were identified in Phase 1
              negotiation proposals, notably the presence of 1024-bit Diffie-Hellman Group 2 and the
              absence of enforced Perfect Forward Secrecy across all child SA transformations.
            </p>
          </div>
          <div className="report-section mt-15">
            <h4>2. Severity Breakdown</h4>
            <ul className="report-findings-summary">
              <li>
                <strong>Critical ({currentScan.criticalCount}):</strong> Weak DH Group 2, Unauthenticated
                Aggressive Mode Proposal
              </li>
              <li>
                <strong>High ({currentScan.highCount}):</strong> SHA-1 deprecated integrity algorithm, DPD
                disabled, Key lifetime &gt; 24h, Cookie validation inactive
              </li>
              <li>
                <strong>Medium ({currentScan.mediumCount}):</strong> Missing PFS enforcement, Weak PRF
                hashing, Insecure NAT-T keepalive intervals
              </li>
              <li>
                <strong>
                  Low &amp; Info ({currentScan.lowCount + currentScan.infoCount}):
                </strong>{' '}
                Verbose vendor IDs, Non-standard SPI rotation intervals
              </li>
            </ul>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={() => window.print()}>
            <i className="fa-solid fa-print" /> Print / Save as PDF
          </button>
          <button className="btn btn-primary" onClick={closeModal}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportPreviewModal;

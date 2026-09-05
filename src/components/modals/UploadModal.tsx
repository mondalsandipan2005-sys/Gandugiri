import React, { useState } from 'react';
import { useApp } from '../../AppContext';
import type { PresetKey } from '../../types';

const presetButtons: { key: PresetKey; icon: string; title: string; sub: string }[] = [
  { key: 'office', icon: 'fa-building-shield', title: 'Office VPN Capture', sub: 'Current baseline (Score 73)' },
  { key: 'legacy', icon: 'fa-triangle-exclamation', title: 'Legacy IKEv1 Attack', sub: 'Aggressive Mode + 3DES (Score 38)' },
  { key: 'quantum', icon: 'fa-shield-virus', title: 'Quantum-Hardened IKEv2', sub: 'AES-256-GCM + DH 20 (Score 98)' },
  { key: 'ddos', icon: 'fa-bolt-lightning', title: 'Handshake DoS Flood', sub: 'Half-open SA attack (Score 51)' },
];

const stepIcon = (status: string) => {
  if (status === 'done') return <i className="fa-solid fa-check text-good" />;
  if (status === 'active') return <i className="fa-solid fa-spinner fa-spin" />;
  return <i className="fa-regular fa-circle" />;
};

const UploadModal: React.FC = () => {
  const { activeModal, closeModal, triggerScanSimulation, scanProgress, showToast } = useApp();
  const [dragOver, setDragOver] = useState(false);

  if (activeModal !== 'upload') return null;

  const handleFile = (file: File) => {
    showToast(`Analyzing capture file: ${file.name}...`, 'info');
    triggerScanSimulation('office', file.name);
  };

  return (
    <div
      className="modal-overlay show"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-title-icon">
              <i className="fa-solid fa-cloud-arrow-up" />
            </div>
            <div>
              <h3 className="modal-title">Upload &amp; Dissect IPsec PCAP</h3>
              <p className="modal-sub">Select a capture file to run automated AI security assessment</p>
            </div>
          </div>
          <button className="modal-close-btn" aria-label="Close modal" onClick={closeModal}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="modal-body">
          <div
            className={`drop-zone${dragOver ? ' drag-over' : ''}`}
            onDragEnter={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setDragOver(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const files = e.dataTransfer.files;
              if (files.length > 0) handleFile(files[0]);
            }}
          >
            <i className="fa-solid fa-file-code drop-icon" />
            <p className="drop-primary-txt">
              Drag &amp; Drop your <code>.pcap</code> or <code>.pcapng</code> capture file here
            </p>
            <p className="drop-secondary-txt">
              Supports IKEv1, IKEv2, ESP &amp; AH capture formats up to 250MB
            </p>
            <label className="btn btn-primary btn-browse-pcap">
              <span>Browse Local Files</span>
              <input
                type="file"
                accept=".pcap,.pcapng,.cap"
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFile(e.target.files[0]);
                  }
                }}
              />
            </label>
          </div>

          <div className="sample-presets-box">
            <span className="presets-title">Or load a predefined test scenario:</span>
            <div className="presets-grid">
              {presetButtons.map((p) => (
                <button
                  key={p.key}
                  className="preset-btn"
                  onClick={() => triggerScanSimulation(p.key)}
                >
                  <i className={`fa-solid ${p.icon}`} />
                  <div>
                    <strong>{p.title}</strong>
                    <span>{p.sub}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {scanProgress.visible && (
            <div className="analysis-progress-box" style={{ display: 'block' }}>
              <div className="progress-status-row">
                <span className="progress-status-txt">{scanProgress.statusText}</span>
                <span className="progress-pct">{scanProgress.pct}%</span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${scanProgress.pct}%` }} />
              </div>
              <div className="progress-steps-list">
                {scanProgress.steps.map((step) => (
                  <div className={`p-step${step.status !== 'pending' ? ` ${step.status}` : ''}`} key={step.id}>
                    {stepIcon(step.status)}{' '}
                    {step.status === 'done'
                      ? step.doneLabel
                      : step.status === 'active'
                      ? step.activeLabel
                      : step.pendingLabel}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadModal;

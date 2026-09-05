import React from 'react';
import { useApp } from '../../AppContext';
import { anomalies } from '../../data';

const AnomalyDetailModal: React.FC = () => {
  const { activeModal, closeModal, selectedAnomalyId } = useApp();

  if (activeModal !== 'anomaly') return null;

  const anomaly = anomalies.find((a) => a.id === selectedAnomalyId) || anomalies[0];

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
            <div className="modal-title-icon icon-purple">
              <i className="fa-solid fa-brain" />
            </div>
            <div>
              <h3 className="modal-title">{anomaly.title}</h3>
              <p className="modal-sub">AI Heuristic &amp; Timing Dispersion Breakdown</p>
            </div>
          </div>
          <button className="modal-close-btn" aria-label="Close modal" onClick={closeModal}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        <div className="modal-body">
          <div className="anomaly-deep-breakdown">
            <div className="ai-score-row">
              <div className="ai-confidence-pill">
                <span className="ai-pill-label">Confidence Score</span>
                <strong className="ai-pill-val">{anomaly.confidence}</strong>
              </div>
              <div className="ai-confidence-pill">
                <span className="ai-pill-label">Anomaly Model</span>
                <strong className="ai-pill-val">{anomaly.model}</strong>
              </div>
            </div>
            <div className="mt-15">
              <h5 className="tab-sec-title">Observation Details</h5>
              <p className="tab-sec-desc">{anomaly.details}</p>
            </div>
            <div className="recommendation-box mt-15">
              <i className="fa-solid fa-lightbulb" />
              <div>
                <strong>Recommended Action:</strong>
                <span> {anomaly.recommendation}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={closeModal}>
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnomalyDetailModal;

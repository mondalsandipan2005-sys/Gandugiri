import React from 'react';
import { useApp } from '../../AppContext';
import { anomalies } from '../../data';

const AnomaliesView: React.FC = () => {
  const { openAnomalyDetail } = useApp();

  return (
    <section className="view-section active" id="anomaliesView">
      <div className="section-title-wrap">
        <h3 className="section-heading">
          <i className="fa-solid fa-brain" /> Machine Learning Anomaly Detection Model
        </h3>
        <p className="section-desc">
          Unsupervised Isolation Forest &amp; LSTM Autoencoder for zero-day IPsec handshake tampering and
          DDoS detection.
        </p>
      </div>

      <div className="ai-models-overview-grid">
        <div className="dashboard-card ai-model-box">
          <div className="ai-model-hdr">
            <h5>Handshake Timing &amp; Entropy Model</h5>
            <span className="status-pill status-completed">Active</span>
          </div>
          <p>
            Monitors inter-arrival times of IKE_SA_INIT and IKE_AUTH packets for replay &amp; MITM
            injection.
          </p>
          <div className="model-stat-row">
            <span>
              Accuracy: <strong>98.7%</strong>
            </span>
            <span>
              False Positive Rate: <strong>0.3%</strong>
            </span>
          </div>
        </div>
        <div className="dashboard-card ai-model-box">
          <div className="ai-model-hdr">
            <h5>ESP Payload Bit-Flips / Replay Detector</h5>
            <span className="status-pill status-completed">Active</span>
          </div>
          <p>Sequence number window progression tracking for anti-replay window exhaustion attacks.</p>
          <div className="model-stat-row">
            <span>
              Window Size: <strong>64 Packets</strong>
            </span>
            <span>
              Anomalies flagged: <strong>2</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="dashboard-card mt-20">
        <div className="card-top-header">
          <h4 className="card-heading">Detected Anomaly Timeline &amp; Explanations</h4>
        </div>
        <div className="anomaly-detail-grid">
          {anomalies.map((ano) => (
            <div className={`anomaly-sub-card ${ano.borderClass}`} key={ano.id}>
              <div className="anomaly-sub-header">
                <span className="anomaly-sub-title">{ano.title}</span>
                <span className={`anomaly-pill ${ano.pillClass}`}>{ano.riskLevel}</span>
              </div>
              <p className="anomaly-sub-desc">{ano.details}</p>
              <div className="anomaly-sub-footer">
                <div className="anomaly-metrics-meta">
                  <span className="meta-item">
                    Confidence: <strong className="val-bold">{ano.confidence}</strong>
                  </span>
                  <span className="meta-item">
                    Model: <span className="val-mono">{ano.model}</span>
                  </span>
                  <span className="meta-item">
                    Time: <span className="val-mono">{ano.time}</span>
                  </span>
                </div>
                <button
                  className="btn btn-outline"
                  style={{ padding: '2px 8px', fontSize: '11px' }}
                  onClick={() => openAnomalyDetail(ano.id)}
                >
                  Remediate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnomaliesView;

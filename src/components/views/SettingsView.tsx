import React, { useState } from 'react';
import { useApp } from '../../AppContext';

const SettingsView: React.FC = () => {
  const { saveSettings } = useApp();
  const [nistStrict, setNistStrict] = useState(true);
  const [aiSensitivity, setAiSensitivity] = useState(85);
  const [syslogEnabled, setSyslogEnabled] = useState(false);

  return (
    <section className="view-section active" id="settingsView">
      <div className="section-title-wrap">
        <h3 className="section-heading">
          <i className="fa-solid fa-gear" /> Analyzer Engine &amp; Framework Configuration
        </h3>
        <p className="section-desc">
          Configure AI threshold sensitivities, RFC policy compliance baselines, and alerting endpoints.
        </p>
      </div>
      <div className="dashboard-card settings-box">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveSettings();
          }}
        >
          <div className="setting-row">
            <div>
              <h5 className="setting-name">Enforce NIST SP 800-77 Strict Mode</h5>
              <p className="setting-desc">
                Flag all DH groups &lt; 14 and non-AEAD ciphers as Critical severity.
              </p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={nistStrict}
                onChange={(e) => setNistStrict(e.target.checked)}
              />
              <span className="slider round" />
            </label>
          </div>

          <div className="setting-row">
            <div>
              <h5 className="setting-name">AI Anomaly Sensitivity</h5>
              <p className="setting-desc">
                Confidence threshold for triggering anomaly alerts (Default: 85%).
              </p>
            </div>
            <div className="slider-input-wrap">
              <input
                type="range"
                min={50}
                max={99}
                value={aiSensitivity}
                className="range-slider"
                onChange={(e) => setAiSensitivity(Number(e.target.value))}
              />
              <span>{aiSensitivity}%</span>
            </div>
          </div>

          <div className="setting-row">
            <div>
              <h5 className="setting-name">Automated SIEM Syslog Forwarding</h5>
              <p className="setting-desc">Stream alerts via CEF / RFC 5424 over TLS.</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={syslogEnabled}
                onChange={(e) => setSyslogEnabled(e.target.checked)}
              />
              <span className="slider round" />
            </label>
          </div>

          <div className="mt-20">
            <button type="submit" className="btn btn-primary">
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SettingsView;

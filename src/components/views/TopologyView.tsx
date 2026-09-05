import React from 'react';
import { useApp } from '../../AppContext';

const TopologyView: React.FC = () => {
  const { currentScan } = useApp();

  return (
    <section className="view-section active" id="topologyView">
      <div className="section-title-wrap">
        <h3 className="section-heading">
          <i className="fa-solid fa-network-wired" /> Interactive Multi-Tunnel Topology Explorer
        </h3>
        <p className="section-desc">
          Live status, MTU, ESP Sequence tracking, and SA lifetimes across gateways.
        </p>
      </div>
      <div className="dashboard-card topo-expanded-card">
        <div className="topology-fullscreen-render">
          <div className="topology-diagram-container">
            <div className="topo-node topo-local-net" title="Click for subnet details">
              <div className="node-icon-box">
                <i className="fa-solid fa-network-wired" />
              </div>
              <div className="node-title">Local Network</div>
              <div className="node-ip">{currentScan.localNet}</div>
            </div>

            <div className="topo-connector-line green-link">
              <span className="link-pulse-dot" />
            </div>

            <div className="topo-node topo-gateway" title="Cisco ASA 5525-X Gateway">
              <div className="node-icon-box gateway-icon">
                <i className="fa-solid fa-server" />
              </div>
              <div className="node-title">VPN Gateway</div>
              <div className="node-ip">{currentScan.localGw}</div>
            </div>

            <div className="topo-tunnel-tube-wrap">
              <div className="tunnel-label-top">IPsec Tunnel</div>
              <div className="tunnel-beam">
                <div className="tunnel-particles-stream">
                  <span className="particle p1" />
                  <span className="particle p2" />
                  <span className="particle p3" />
                  <span className="particle p4" />
                </div>
                <span className="tunnel-crypto-tag">
                  {currentScan.encryption} / {currentScan.integrity}
                </span>
              </div>
            </div>

            <div className="topo-node topo-gateway" title="Fortinet FortiGate 100F Gateway">
              <div className="node-icon-box gateway-icon">
                <i className="fa-solid fa-server" />
              </div>
              <div className="node-title">VPN Gateway</div>
              <div className="node-ip">{currentScan.remoteGw}</div>
            </div>

            <div className="topo-connector-line blue-link">
              <span className="link-pulse-dot-rev" />
            </div>

            <div className="topo-node topo-remote-net" title="Click for remote subnet details">
              <div className="node-icon-box">
                <i className="fa-solid fa-network-wired" />
              </div>
              <div className="node-title">Remote Network</div>
              <div className="node-ip">{currentScan.remoteNet}</div>
            </div>
          </div>

          <div className="tunnel-meta-strip">
            <div className="meta-cell">
              <span className="meta-lbl">Tunnel Status</span>
              <span className="meta-val val-status-up">{currentScan.tunnelStatus}</span>
            </div>
            <div className="meta-cell">
              <span className="meta-lbl">IKE Version</span>
              <span className="meta-val">{currentScan.ikeVersion}</span>
            </div>
            <div className="meta-cell">
              <span className="meta-lbl">Encryption</span>
              <span className="meta-val">{currentScan.encryption}</span>
            </div>
            <div className="meta-cell">
              <span className="meta-lbl">Integrity</span>
              <span className="meta-val">{currentScan.integrity}</span>
            </div>
            <div className="meta-cell">
              <span className="meta-lbl">PFS</span>
              <span className="meta-val">{currentScan.pfs}</span>
            </div>
            <div className="meta-cell">
              <span className="meta-lbl">Uptime</span>
              <span className="meta-val">{currentScan.uptime}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopologyView;

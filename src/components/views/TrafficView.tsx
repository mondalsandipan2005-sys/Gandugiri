import React from 'react';
import { useApp } from '../../AppContext';
import { packets } from '../../data';

const TrafficView: React.FC = () => {
  const { trafficFilter, setTrafficFilter } = useApp();
  const q = trafficFilter.toLowerCase();

  const visiblePackets = packets.filter((pkt) => {
    if (!q) return true;
    const haystack = `${pkt.no}${pkt.time}${pkt.src}${pkt.dst}${pkt.proto}${pkt.exchange}${pkt.spi}${pkt.status}`.toLowerCase();
    return haystack.includes(q);
  });

  return (
    <section className="view-section active" id="trafficView">
      <div className="section-title-wrap">
        <h3 className="section-heading">
          <i className="fa-solid fa-chart-simple" /> IPsec Packet &amp; Traffic Analysis
        </h3>
        <p className="section-desc">
          Deep packet inspection across IKE SA initiation, CHILD SA exchange, and ESP encrypted payload
          streams.
        </p>
      </div>

      <div className="traffic-stats-grid">
        <div className="dashboard-card sub-stat-card">
          <span className="sub-stat-lbl">Total Packets Parsed</span>
          <span className="sub-stat-val">48,920</span>
          <span className="sub-stat-meta">ESP: 92.4% | IKEv2: 7.6%</span>
        </div>
        <div className="dashboard-card sub-stat-card">
          <span className="sub-stat-lbl">Throughput</span>
          <span className="sub-stat-val">142.8 Mbps</span>
          <span className="sub-stat-meta">Peak: 210.4 Mbps</span>
        </div>
        <div className="dashboard-card sub-stat-card">
          <span className="sub-stat-lbl">Retransmission Rate</span>
          <span className="sub-stat-val text-risk-high">4.2%</span>
          <span className="sub-stat-meta">Threshold exceeded (&gt; 1.5%)</span>
        </div>
        <div className="dashboard-card sub-stat-card">
          <span className="sub-stat-lbl">SPI Collision Check</span>
          <span className="sub-stat-val text-good">0 Collisions</span>
          <span className="sub-stat-meta">SA Table validated</span>
        </div>
      </div>

      <div className="dashboard-card mt-20">
        <div className="card-top-header">
          <h4 className="card-heading">Captured IPsec Packets Stream</h4>
          <div className="search-filter-box">
            <input
              type="text"
              placeholder="Filter packets by SPI, IP, or Payload..."
              className="table-search-input"
              value={trafficFilter}
              onChange={(e) => setTrafficFilter(e.target.value)}
            />
          </div>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Time</th>
                <th>Source</th>
                <th>Destination</th>
                <th>Protocol</th>
                <th>Exchange Type</th>
                <th>Initiator SPI / Security Param</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {visiblePackets.map((pkt) => (
                <tr key={pkt.no}>
                  <td>
                    <strong>#{pkt.no}</strong>
                  </td>
                  <td>
                    <code>{pkt.time}</code>
                  </td>
                  <td>
                    <code>{pkt.src}</code>
                  </td>
                  <td>
                    <code>{pkt.dst}</code>
                  </td>
                  <td>
                    <span className="status-pill status-completed">{pkt.proto}</span>
                  </td>
                  <td>{pkt.exchange}</td>
                  <td>
                    <code>{pkt.spi}</code>
                  </td>
                  <td>
                    <span
                      className={`status-pill ${
                        pkt.status.includes('Warning') ? 'pill-risk-medium' : 'status-completed'
                      }`}
                    >
                      {pkt.status}
                    </span>
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

export default TrafficView;

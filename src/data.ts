import type {
  CurrentScan,
  Severity,
  SecurityIssue,
  Anomaly,
  Packet,
  Preset,
  PresetKey,
  NotificationItem,
} from './types';

export const initialCurrentScan: CurrentScan = {
  fileName: 'office_vpn_capture.pcap',
  fileSize: '18.4 MB',
  analysisTime: 'May 26, 2025 10:30:45 AM',
  securityScore: 73,
  scoreStatus: 'Good',
  riskLevel: 'High',
  criticalCount: 2,
  highCount: 4,
  mediumCount: 7,
  lowCount: 8,
  infoCount: 17,
  totalFindings: 38,
  aiAnomaliesCount: 2,
  aiRiskLevel: 'High Risk',
  vpnTunnelsCount: 2,
  tunnelStatus: 'UP',
  ikeVersion: 'IKEv2',
  encryption: 'AES-256',
  integrity: 'SHA-256',
  pfs: 'Enabled',
  uptime: '02:15:36',
  localNet: '10.0.1.0/24',
  localGw: '203.0.113.1',
  remoteGw: '198.51.100.1',
  remoteNet: '10.1.1.0/24',
};

export const initialSeverities: Severity[] = [
  { key: 'critical', name: 'Critical', count: 2, pct: 5, color: '#ef4444' },
  { key: 'high', name: 'High', count: 4, pct: 10, color: '#f97316' },
  { key: 'medium', name: 'Medium', count: 7, pct: 18, color: '#eab308' },
  { key: 'low', name: 'Low', count: 8, pct: 21, color: '#3b82f6' },
  { key: 'info', name: 'Info', count: 17, pct: 46, color: '#10b981' },
];

export const securityIssues: SecurityIssue[] = [
  {
    id: 'ISS-01',
    title: 'Weak Diffie-Hellman Group',
    desc: 'DH Group 2 (1024-bit) is considered weak',
    severity: 'Critical',
    badgeClass: 'badge-critical',
    iconClass: 'icon-critical',
    rfc: 'RFC 8247 §2.4 / NIST SP 800-77',
    cvss: '7.5 (High)',
    component: 'IKEv2 Phase 1 SA Proposal',
    exploitRisk: 'Feasible pre-computation (Logjam attack vectors)',
    details:
      'Diffie-Hellman Group 2 uses a 1024-bit prime modulus. Cryptographic advances and specialized computing clusters have made 1024-bit discrete logarithm precomputation feasible for well-funded adversaries. NIST and BSI mandate minimum Group 14 (2048-bit) or ECP Groups 19/20.',
    cli: {
      cisco: `! Cisco IOS-XE / ASA IKEv2 Configuration
crypto ikev2 proposal IKEV2_SECURE_PROP
  encryption aes-gcm-256 aes-cbc-256
  integrity sha256
  group 19 20 21 14
exit`,
      fortinet: `config vpn ipsec phase1-interface
    edit "Remote-Branch"
        set ike-version 2
        set proposal aes256-sha256
        set dhgrp 19 20 14
    next
end`,
      strongswan: `# /etc/swanctl/conf.d/ipsec.conf
connections {
  vpn-peer {
    proposals = aes256gcm16-prfsha256-ecp256-modp2048,aes256-sha256-modp2048
  }
}`,
    },
  },
  {
    id: 'ISS-02',
    title: 'Aggressive Mode Detected',
    desc: 'Aggressive mode is less secure than main mode',
    severity: 'High',
    badgeClass: 'badge-high',
    iconClass: 'icon-high',
    rfc: 'RFC 2409 / RFC 7296',
    cvss: '7.1 (High)',
    component: 'IKE Phase 1 Negotiation',
    exploitRisk: 'Cleartext identity exposure & PSK offline cracking',
    details:
      'Aggressive Mode transmits the initiator identity and pre-shared key (PSK) hash unencrypted in the 2nd/3rd packets, allowing eavesdroppers to capture hashes and execute offline dictionary attacks.',
    cli: {
      cisco: `crypto isakmp policy 10
  no mode aggressive
  ! Migrate entirely to IKEv2
crypto ikev2 enable OUTSIDE`,
      fortinet: `config vpn ipsec phase1-interface
    edit "Peer-VPN"
        set aggressive-mode disable
    next
end`,
      strongswan: `# StrongSwan disables IKEv1 aggressive mode by default
connections {
  default {
    version = 2
  }
}`,
    },
  },
  {
    id: 'ISS-03',
    title: 'Dead Peer Detection Disabled',
    desc: 'DPD is not enabled on the tunnel',
    severity: 'Medium',
    badgeClass: 'badge-medium',
    iconClass: 'icon-medium',
    rfc: 'RFC 3706 / RFC 7296 §2.4',
    cvss: '5.3 (Medium)',
    component: 'Liveness & Session Management',
    exploitRisk: 'Blackholing traffic on peer outage / ghost SAs',
    details:
      'Without Dead Peer Detection (DPD) keepalives, when a remote gateway reboots or loses connectivity, the local gateway continues routing traffic into a stale SA tunnel until SA lifetime expiry.',
    cli: {
      cisco: `crypto ikev2 dpd 10 3 periodic`,
      fortinet: `config vpn ipsec phase1-interface
    edit "Remote-Branch"
        set dpd on-idle
        set dpd-retryinterval 10
    next
end`,
      strongswan: `connections {
  vpn-peer {
    dpd_delay = 30s
    dpd_timeout = 90s
    dpd_action = restart
  }
}`,
    },
  },
  {
    id: 'ISS-04',
    title: 'SHA-1 Integrity Algorithm',
    desc: 'SHA-1 is deprecated and not recommended',
    severity: 'Medium',
    badgeClass: 'badge-medium',
    iconClass: 'icon-medium',
    rfc: 'RFC 8247 §3.2 / NIST SP 800-131A',
    cvss: '5.9 (Medium)',
    component: 'IKEv2 / ESP Hash Algorithm',
    exploitRisk: 'Collision attacks (SHAttered vector)',
    details:
      'SHA-1 (160-bit) hash functions are deprecated due to demonstrated practical collision vulnerabilities. Upgrade to SHA-256 (HMAC-SHA256-128 or AEAD GCM).',
    cli: {
      cisco: `crypto ipsec transform-set TSET_SECURE esp-aes 256 esp-sha256-hmac
  mode tunnel`,
      fortinet: `config vpn ipsec phase2-interface
    edit "Phase2-Net"
        set proposal aes256-sha256 aes256-sha512
    next
end`,
      strongswan: `connections {
  vpn-peer {
    children {
      child-sa {
        esp_proposals = aes256-sha256,aes256gcm16
      }
    }
  }
}`,
    },
  },
  {
    id: 'ISS-05',
    title: 'Perfect Forward Secrecy Not Enforced',
    desc: 'PFS is not enforced for all IKE proposals',
    severity: 'Low',
    badgeClass: 'badge-low',
    iconClass: 'icon-low',
    rfc: 'RFC 7296 §1.3.1',
    cvss: '3.7 (Low)',
    component: 'Phase 2 CHILD_SA Rekeying',
    exploitRisk: 'Compromise of long-term key decrypts past sessions',
    details:
      'When PFS is disabled for Quick Mode or CREATE_CHILD_SA exchanges, session keys are derived solely from Phase 1 master keys without a fresh Diffie-Hellman exchange.',
    cli: {
      cisco: `crypto map VPN_MAP 10 ipsec-isakmp
  set pfs group19`,
      fortinet: `config vpn ipsec phase2-interface
    edit "Phase2-Net"
        set pfs enable
        set dhgrp 19
    next
end`,
      strongswan: `connections {
  vpn-peer {
    children {
      child-sa {
        esp_proposals = aes256gcm16-ecp256,aes256-sha256-modp2048
      }
    }
  }
}`,
    },
  },
];

export const anomalies: Anomaly[] = [
  {
    id: 'ANO-01',
    title: 'Unusual IKE_AUTH Retransmissions',
    riskLevel: 'High Risk',
    pillClass: 'pill-risk-high',
    borderClass: 'anomaly-high-risk',
    desc: 'Multiple IKE_AUTH retransmissions detected',
    confidence: '94%',
    time: '10:21:15 AM',
    model: 'Temporal Sequence LSTM',
    details:
      'The analyzer recorded 14 IKE_AUTH request retransmissions within a 3.2-second window from initiator IP 203.0.113.1 without corresponding response payloads. This pattern deviates by 4.8 standard deviations from baseline traffic and signifies potential MITM packet dropping or half-open state exhaustion attack.',
    recommendation:
      'Check intermediate firewall NAT traversal UDP 4500 keepalive settings and enable IKEv2 anti-DDoS cookie validation on the responder gateway.',
  },
  {
    id: 'ANO-02',
    title: 'Multiple Failed Auth Attempts',
    riskLevel: 'Medium Risk',
    pillClass: 'pill-risk-medium',
    borderClass: 'anomaly-med-risk',
    desc: 'Multiple authentication failures from remote peer',
    confidence: '88%',
    time: '10:24:32 AM',
    model: 'Entropy & Behavior Isolation Forest',
    details:
      'Detected 6 consecutive AUTHENTICATION_FAILED notify payloads from peer 198.51.100.1 within 45 seconds with varying IDi identification payloads, characteristic of automated PSK guessing or identity enumeration.',
    recommendation:
      'Implement IP-based brute-force lockout thresholds and transition from Pre-Shared Keys to X.509 ECDSA certificate authentication.',
  },
];

export const packets: Packet[] = [
  { no: 1, time: '0.000000', src: '203.0.113.1', dst: '198.51.100.1', proto: 'IKEv2', exchange: 'IKE_SA_INIT Request', spi: '0x94fa821038b712a0', status: 'Success' },
  { no: 2, time: '0.012431', src: '198.51.100.1', dst: '203.0.113.1', proto: 'IKEv2', exchange: 'IKE_SA_INIT Response', spi: '0x94fa821038b712a0 : 0x77c419be20d', status: 'Success' },
  { no: 3, time: '0.034182', src: '203.0.113.1', dst: '198.51.100.1', proto: 'IKEv2', exchange: 'IKE_AUTH Request (Encrypted)', spi: '0x94fa821038b712a0', status: 'Warning (Retransmit)' },
  { no: 4, time: '1.042110', src: '203.0.113.1', dst: '198.51.100.1', proto: 'IKEv2', exchange: 'IKE_AUTH Request (Encrypted)', spi: '0x94fa821038b712a0', status: 'Warning (Retransmit)' },
  { no: 5, time: '1.061094', src: '198.51.100.1', dst: '203.0.113.1', proto: 'IKEv2', exchange: 'IKE_AUTH Response (Encrypted)', spi: '0x94fa821038b712a0', status: 'Success (SA Established)' },
  { no: 6, time: '1.085023', src: '203.0.113.1', dst: '198.51.100.1', proto: 'ESP', exchange: 'Encrypted Payload (Seq: 1)', spi: '0x38ca9120', status: 'Encrypted' },
  { no: 7, time: '1.085410', src: '198.51.100.1', dst: '203.0.113.1', proto: 'ESP', exchange: 'Encrypted Payload (Seq: 1)', spi: '0x49da7710', status: 'Encrypted' },
];

export const presets: Record<PresetKey, Preset> = {
  office: {
    fileName: 'office_vpn_capture.pcap',
    securityScore: 73,
    scoreStatus: 'Good',
    riskLevel: 'High',
    criticalCount: 2,
    highCount: 4,
    mediumCount: 7,
    lowCount: 8,
    infoCount: 17,
    totalFindings: 38,
    aiAnomaliesCount: 2,
    aiRiskLevel: 'High Risk',
    vpnTunnelsCount: 2,
    severities: [
      { key: 'critical', name: 'Critical', count: 2, pct: 5, color: '#ef4444' },
      { key: 'high', name: 'High', count: 4, pct: 10, color: '#f97316' },
      { key: 'medium', name: 'Medium', count: 7, pct: 18, color: '#eab308' },
      { key: 'low', name: 'Low', count: 8, pct: 21, color: '#3b82f6' },
      { key: 'info', name: 'Info', count: 17, pct: 46, color: '#10b981' },
    ],
  },
  legacy: {
    fileName: 'ikev1_legacy_attack.pcap',
    securityScore: 38,
    scoreStatus: 'Critical',
    riskLevel: 'Critical',
    criticalCount: 9,
    highCount: 14,
    mediumCount: 12,
    lowCount: 8,
    infoCount: 9,
    totalFindings: 52,
    aiAnomaliesCount: 5,
    aiRiskLevel: 'Critical Risk',
    vpnTunnelsCount: 1,
    severities: [
      { key: 'critical', name: 'Critical', count: 9, pct: 17, color: '#ef4444' },
      { key: 'high', name: 'High', count: 14, pct: 27, color: '#f97316' },
      { key: 'medium', name: 'Medium', count: 12, pct: 23, color: '#eab308' },
      { key: 'low', name: 'Low', count: 8, pct: 15, color: '#3b82f6' },
      { key: 'info', name: 'Info', count: 9, pct: 18, color: '#10b981' },
    ],
  },
  quantum: {
    fileName: 'quantum_hardened_ikev2.pcap',
    securityScore: 98,
    scoreStatus: 'Excellent',
    riskLevel: 'Low',
    criticalCount: 0,
    highCount: 0,
    mediumCount: 1,
    lowCount: 1,
    infoCount: 2,
    totalFindings: 4,
    aiAnomaliesCount: 0,
    aiRiskLevel: 'Clean',
    vpnTunnelsCount: 4,
    severities: [
      { key: 'critical', name: 'Critical', count: 0, pct: 0, color: '#ef4444' },
      { key: 'high', name: 'High', count: 0, pct: 0, color: '#f97316' },
      { key: 'medium', name: 'Medium', count: 1, pct: 25, color: '#eab308' },
      { key: 'low', name: 'Low', count: 1, pct: 25, color: '#3b82f6' },
      { key: 'info', name: 'Info', count: 2, pct: 50, color: '#10b981' },
    ],
  },
  ddos: {
    fileName: 'handshake_dos_flood.pcap',
    securityScore: 51,
    scoreStatus: 'Moderate',
    riskLevel: 'High',
    criticalCount: 4,
    highCount: 9,
    mediumCount: 10,
    lowCount: 6,
    infoCount: 12,
    totalFindings: 41,
    aiAnomaliesCount: 8,
    aiRiskLevel: 'Extreme Spike',
    vpnTunnelsCount: 1,
    severities: [
      { key: 'critical', name: 'Critical', count: 4, pct: 10, color: '#ef4444' },
      { key: 'high', name: 'High', count: 9, pct: 22, color: '#f97316' },
      { key: 'medium', name: 'Medium', count: 10, pct: 24, color: '#eab308' },
      { key: 'low', name: 'Low', count: 6, pct: 15, color: '#3b82f6' },
      { key: 'info', name: 'Info', count: 12, pct: 29, color: '#10b981' },
    ],
  },
};

export const initialNotifications: NotificationItem[] = [
  {
    id: 'N1',
    icon: 'fa-triangle-exclamation',
    iconClass: 'critical',
    title: 'Weak DH Group 2 detected in proposal',
    time: '10 minutes ago',
    unread: true,
  },
  {
    id: 'N2',
    icon: 'fa-bolt',
    iconClass: 'high',
    title: 'Unusual IKE_AUTH retransmission spike',
    time: '22 minutes ago',
    unread: true,
  },
  {
    id: 'N3',
    icon: 'fa-circle-check',
    iconClass: 'info',
    title: 'PCAP file analysis completed',
    time: '45 minutes ago',
    unread: true,
  },
];

export const titleMap: Record<string, string> = {
  dashboard: 'IPsec VPN Security Assessment Dashboard',
  traffic: 'Traffic & Deep Packet Dissection Analysis',
  security: 'Security Assessment & Compliance Matrix',
  anomalies: 'AI Machine Learning Anomaly Detection',
  topology: 'VPN Multi-Tunnel Topology & Metrics',
  reports: 'Executive Compliance & Audit Reports',
  alerts: 'Real-Time Incident Security Alerts',
  history: 'PCAP Assessment Scan History',
  settings: 'Analyzer Engine Configuration & RFC Policies',
};

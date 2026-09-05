// Domain types for IPsec Shield AI dashboard

export type SeverityKey = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface Severity {
  key: SeverityKey;
  name: string;
  count: number;
  pct: number;
  color: string;
}

export interface CliSnippets {
  cisco: string;
  fortinet: string;
  strongswan: string;
}

export type CliVendor = keyof CliSnippets;

export interface SecurityIssue {
  id: string;
  title: string;
  desc: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
  badgeClass: string;
  iconClass: string;
  rfc: string;
  cvss: string;
  component: string;
  exploitRisk: string;
  details: string;
  cli: CliSnippets;
}

export interface Anomaly {
  id: string;
  title: string;
  riskLevel: string;
  pillClass: string;
  borderClass: string;
  desc: string;
  confidence: string;
  time: string;
  model: string;
  details: string;
  recommendation: string;
}

export interface Packet {
  no: number;
  time: string;
  src: string;
  dst: string;
  proto: string;
  exchange: string;
  spi: string;
  status: string;
}

export interface CurrentScan {
  fileName: string;
  fileSize: string;
  analysisTime: string;
  securityScore: number;
  scoreStatus: string;
  riskLevel: string;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  infoCount: number;
  totalFindings: number;
  aiAnomaliesCount: number;
  aiRiskLevel: string;
  vpnTunnelsCount: number;
  tunnelStatus: string;
  ikeVersion: string;
  encryption: string;
  integrity: string;
  pfs: string;
  uptime: string;
  localNet: string;
  localGw: string;
  remoteGw: string;
  remoteNet: string;
}

export interface Preset {
  fileName: string;
  securityScore: number;
  scoreStatus: string;
  riskLevel: string;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  infoCount: number;
  totalFindings: number;
  aiAnomaliesCount: number;
  aiRiskLevel: string;
  vpnTunnelsCount: number;
  severities: Severity[];
}

export type PresetKey = 'office' | 'legacy' | 'quantum' | 'ddos';

export type ViewName =
  | 'dashboard'
  | 'traffic'
  | 'security'
  | 'anomalies'
  | 'topology'
  | 'reports'
  | 'alerts'
  | 'history'
  | 'settings';

export interface ActivityItem {
  id: string;
  title: string;
  sub: string;
  time: string;
  dotClass: string;
}

export type ToastType = 'info' | 'success' | 'error';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

export interface NotificationItem {
  id: string;
  icon: string;
  iconClass: 'critical' | 'high' | 'info';
  title: string;
  time: string;
  unread: boolean;
}

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {
  ActivityItem,
  CliVendor,
  CurrentScan,
  NotificationItem,
  PresetKey,
  Severity,
  ToastItem,
  ToastType,
  ViewName,
} from './types';
import {
  initialCurrentScan,
  initialNotifications,
  initialSeverities,
  presets,
} from './data';

export type StepStatus = 'pending' | 'active' | 'done';

export interface ProgressStep {
  id: string;
  pendingLabel: string;
  activeLabel: string;
  doneLabel: string;
  status: StepStatus;
}

const defaultSteps: ProgressStep[] = [
  {
    id: 'step1',
    pendingLabel: 'Dissecting IKE_SA_INIT & IKE_AUTH',
    activeLabel: 'Dissecting IKE_SA_INIT and IKE_AUTH packets...',
    doneLabel: 'Dissected 48,920 packets',
    status: 'pending',
  },
  {
    id: 'step2',
    pendingLabel: 'Cryptographic Policy & RFC Compliance',
    activeLabel: 'Checking RFC 8247 & NIST SP 800-77',
    doneLabel: 'Cryptographic Policy evaluated',
    status: 'pending',
  },
  {
    id: 'step3',
    pendingLabel: 'AI Machine Learning Anomaly Classifier',
    activeLabel: 'Running Machine Learning Anomaly Classifier...',
    doneLabel: 'AI Anomaly analysis complete',
    status: 'pending',
  },
  {
    id: 'step4',
    pendingLabel: 'Generating Security Score & Dashboard',
    activeLabel: 'Compiling Security Posture & Scorecards...',
    doneLabel: 'Assessment Ready',
    status: 'pending',
  },
];

interface ScanProgressState {
  visible: boolean;
  pct: number;
  statusText: string;
  steps: ProgressStep[];
}

type ModalName = 'upload' | 'issue' | 'anomaly' | 'report' | null;

interface AppContextValue {
  // Routing
  activeView: ViewName;
  navigateTo: (view: ViewName) => void;

  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Sidebar (mobile)
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;

  // Scan data
  currentScan: CurrentScan;
  severities: Severity[];

  // Notifications
  notifications: NotificationItem[];
  notifDropdownOpen: boolean;
  toggleNotifDropdown: () => void;
  closeNotifDropdown: () => void;
  markAllNotificationsRead: () => void;

  // Toasts
  toasts: ToastItem[];
  showToast: (message: string, type?: ToastType) => void;

  // Activity feed
  activity: ActivityItem[];

  // Modals
  activeModal: ModalName;
  openUploadModal: () => void;
  closeModal: () => void;
  selectedIssueId: string | null;
  openIssueDetail: (issueId: string) => void;
  selectedAnomalyId: string | null;
  openAnomalyDetail: (anomalyId: string) => void;
  openReportModal: () => void;

  // CLI tabs (issue modal)
  activeCliTab: CliVendor;
  setActiveCliTab: (vendor: CliVendor) => void;

  // Upload / scan simulation
  scanProgress: ScanProgressState;
  triggerScanSimulation: (presetKey: PresetKey, customFileName?: string) => void;

  // Security findings filter
  severityFilter: 'all' | 'critical' | 'high' | 'medium' | 'low' | 'info';
  setSeverityFilter: (
    filter: 'all' | 'critical' | 'high' | 'medium' | 'low' | 'info'
  ) => void;

  // Traffic table filter
  trafficFilter: string;
  setTrafficFilter: (v: string) => void;

  // Misc actions
  exportCsvReport: () => void;
  saveSettings: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

let toastCounter = 0;
let activityCounter = 0;

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ViewName>('dashboard');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [currentScan, setCurrentScan] = useState<CurrentScan>(initialCurrentScan);
  const [severities, setSeverities] = useState<Severity[]>(initialSeverities);

  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const [activity, setActivity] = useState<ActivityItem[]>([
    { id: 'a1', title: 'PCAP file uploaded', sub: 'office_vpn_capture.pcap', time: '10:15:42 AM', dotClass: 'dot-blue' },
    { id: 'a2', title: 'Analysis completed', sub: 'Security assessment finished', time: '10:30:45 AM', dotClass: 'dot-green' },
    { id: 'a3', title: 'AI analysis completed', sub: '2 anomalies detected', time: '10:30:40 AM', dotClass: 'dot-orange' },
    { id: 'a4', title: 'Report generated', sub: 'Security_report_20250526.pdf', time: '10:31:02 AM', dotClass: 'dot-gold' },
  ]);

  const [activeModal, setActiveModal] = useState<ModalName>(null);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [selectedAnomalyId, setSelectedAnomalyId] = useState<string | null>(null);
  const [activeCliTab, setActiveCliTab] = useState<CliVendor>('cisco');

  const [severityFilter, setSeverityFilter] = useState<
    'all' | 'critical' | 'high' | 'medium' | 'low' | 'info'
  >('all');
  const [trafficFilter, setTrafficFilter] = useState('');

  const [scanProgress, setScanProgress] = useState<ScanProgressState>({
    visible: false,
    pct: 0,
    statusText: 'Parsing IPsec Handshake Packets...',
    steps: defaultSteps,
  });

  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const navigateTo = useCallback((view: ViewName) => {
    setActiveView(view);
    setSidebarOpen(false);
    window.location.hash = view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      showToastInternal(`Switched to ${next} mode`, 'info');
      return next;
    });
  }, []);

  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  const toggleNotifDropdown = useCallback(() => setNotifDropdownOpen((v) => !v), []);
  const closeNotifDropdown = useCallback(() => setNotifDropdownOpen(false), []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    showToastInternal('All notifications marked as read', 'info');
  }, []);

  function showToastInternal(message: string, type: ToastType = 'info') {
    const id = `toast-${toastCounter++}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    showToastInternal(message, type);
  }, []);

  const addActivity = useCallback((title: string, sub: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const id = `activity-${activityCounter++}`;
    setActivity((prev) => [{ id, title, sub, time: timeStr, dotClass: 'dot-green' }, ...prev]);
  }, []);

  const openUploadModal = useCallback(() => setActiveModal('upload'), []);
  const closeModal = useCallback(() => setActiveModal(null), []);

  const openIssueDetail = useCallback((issueId: string) => {
    setSelectedIssueId(issueId);
    setActiveCliTab('cisco');
    setActiveModal('issue');
  }, []);

  const openAnomalyDetail = useCallback((anomalyId: string) => {
    setSelectedAnomalyId(anomalyId);
    setActiveModal('anomaly');
  }, []);

  const openReportModal = useCallback(() => setActiveModal('report'), []);

  const applyPresetData = useCallback(
    (presetKey: PresetKey, customFileName?: string) => {
      const preset = presets[presetKey] || presets.office;
      setCurrentScan((prev) => ({
        ...prev,
        fileName: customFileName || preset.fileName,
        securityScore: preset.securityScore,
        scoreStatus: preset.scoreStatus,
        riskLevel: preset.riskLevel,
        criticalCount: preset.criticalCount,
        highCount: preset.highCount,
        mediumCount: preset.mediumCount,
        lowCount: preset.lowCount,
        infoCount: preset.infoCount,
        totalFindings: preset.totalFindings,
        aiAnomaliesCount: preset.aiAnomaliesCount,
        aiRiskLevel: preset.aiRiskLevel,
        vpnTunnelsCount: preset.vpnTunnelsCount,
      }));
      setSeverities(preset.severities);
      addActivity(`PCAP scanned: ${customFileName || preset.fileName}`, 'Security assessment finished');
    },
    [addActivity]
  );

  const triggerScanSimulation = useCallback(
    (presetKey: PresetKey, customFileName?: string) => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }

      setScanProgress({
        visible: true,
        pct: 0,
        statusText: 'Parsing IPsec Handshake Packets...',
        steps: defaultSteps.map((s) => ({ ...s, status: 'pending' })),
      });

      let progress = 0;
      progressIntervalRef.current = setInterval(() => {
        progress += 5;

        setScanProgress((prev) => {
          const steps = prev.steps.map((s) => ({ ...s }));
          let statusText = prev.statusText;

          if (progress === 25) {
            statusText = 'Dissecting IKE_SA_INIT and IKE_AUTH packets...';
            steps[0].status = 'done';
            steps[1].status = 'active';
          } else if (progress === 60) {
            statusText = 'Running Machine Learning Anomaly Classifier...';
            steps[1].status = 'done';
            steps[2].status = 'active';
          } else if (progress === 90) {
            statusText = 'Compiling Security Posture & Scorecards...';
            steps[2].status = 'done';
            steps[3].status = 'active';
          } else if (progress >= 100) {
            steps[3].status = 'done';
          }

          return { ...prev, pct: Math.min(progress, 100), statusText, steps };
        });

        if (progress >= 100) {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
          }
          setTimeout(() => {
            applyPresetData(presetKey, customFileName);
            setActiveModal(null);
            setScanProgress((prev) => ({ ...prev, visible: false }));
            showToastInternal('Security Assessment Analysis Completed Successfully!', 'success');
          }, 600);
        }
      }, 80);
    },
    [applyPresetData]
  );

  const exportCsvReport = useCallback(() => {
    showToastInternal('Exporting IKE_Proposal_Dissection_Log.csv...', 'success');
  }, []);

  const saveSettings = useCallback(() => {
    showToastInternal('Analyzer configuration saved successfully!', 'success');
  }, []);

  // Ensure static data referenced by openIssueDetail/openAnomalyDetail is reachable
  

  const value = useMemo<AppContextValue>(
    () => ({
      activeView,
      navigateTo,
      theme,
      toggleTheme,
      sidebarOpen,
      toggleSidebar,
      closeSidebar,
      currentScan,
      severities,
      notifications,
      notifDropdownOpen,
      toggleNotifDropdown,
      closeNotifDropdown,
      markAllNotificationsRead,
      toasts,
      showToast,
      activity,
      activeModal,
      openUploadModal,
      closeModal,
      selectedIssueId,
      openIssueDetail,
      selectedAnomalyId,
      openAnomalyDetail,
      openReportModal,
      activeCliTab,
      setActiveCliTab,
      scanProgress,
      triggerScanSimulation,
      severityFilter,
      setSeverityFilter,
      trafficFilter,
      setTrafficFilter,
      exportCsvReport,
      saveSettings,
    }),
    [
      activeView,
      navigateTo,
      theme,
      toggleTheme,
      sidebarOpen,
      toggleSidebar,
      closeSidebar,
      currentScan,
      severities,
      notifications,
      notifDropdownOpen,
      toggleNotifDropdown,
      closeNotifDropdown,
      markAllNotificationsRead,
      toasts,
      showToast,
      activity,
      activeModal,
      openUploadModal,
      closeModal,
      selectedIssueId,
      openIssueDetail,
      selectedAnomalyId,
      openAnomalyDetail,
      openReportModal,
      activeCliTab,
      scanProgress,
      triggerScanSimulation,
      severityFilter,
      trafficFilter,
      exportCsvReport,
      saveSettings,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
}

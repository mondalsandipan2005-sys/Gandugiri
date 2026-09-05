import React, { useEffect } from 'react';
import { AppProvider, useApp } from './AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ToastContainer from './components/ToastContainer';
import DashboardView from './components/views/DashboardView';
import TrafficView from './components/views/TrafficView';
import SecurityView from './components/views/SecurityView';
import AnomaliesView from './components/views/AnomaliesView';
import TopologyView from './components/views/TopologyView';
import ReportsView from './components/views/ReportsView';
import AlertsView from './components/views/AlertsView';
import HistoryView from './components/views/HistoryView';
import SettingsView from './components/views/SettingsView';
import UploadModal from './components/modals/UploadModal';
import IssueDetailModal from './components/modals/IssueDetailModal';
import AnomalyDetailModal from './components/modals/AnomalyDetailModal';
import ReportPreviewModal from './components/modals/ReportPreviewModal';
import type { ViewName } from './types';

const viewComponents: Record<ViewName, React.FC> = {
  dashboard: DashboardView,
  traffic: TrafficView,
  security: SecurityView,
  anomalies: AnomaliesView,
  topology: TopologyView,
  reports: ReportsView,
  alerts: AlertsView,
  history: HistoryView,
  settings: SettingsView,
};

const validViews = new Set<string>(Object.keys(viewComponents));

const DashboardApp: React.FC = () => {
  const { activeView, navigateTo, closeNotifDropdown } = useApp();
  const ActiveView = viewComponents[activeView];

  // Sync with URL hash on load and on back/forward navigation
  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (validViews.has(hash)) {
        navigateTo(hash as ViewName);
      }
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app-container active" id="dashboardApp" onClick={closeNotifDropdown}>
      <Sidebar />
      <main className="main-wrapper">
        <Header />
        <div className="content-scrollable">
          <ActiveView />
        </div>
      </main>

      <UploadModal />
      <IssueDetailModal />
      <AnomalyDetailModal />
      <ReportPreviewModal />

      <ToastContainer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <DashboardApp />
    </AppProvider>
  );
};

export default App;

import React from 'react';
import { useApp } from '../AppContext';
import { titleMap } from '../data';

const Header: React.FC = () => {
  const {
    activeView,
    toggleSidebar,
    openUploadModal,
    theme,
    toggleTheme,
    notifications,
    notifDropdownOpen,
    toggleNotifDropdown,
    markAllNotificationsRead,
  } = useApp();

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="top-header">
      <div className="header-left">
        <button className="mobile-toggle-btn" aria-label="Toggle Sidebar" onClick={toggleSidebar}>
          <i className="fa-solid fa-bars" />
        </button>
        <div className="header-titles">
          <h2 className="page-title">{titleMap[activeView]}</h2>
          <p className="page-subtitle">
            AI-Powered IPsec Protocol Analyzer &amp; Security Assessment Framework
          </p>
        </div>
      </div>

      <div className="header-right">
        <button className="btn btn-primary btn-upload-pcap" onClick={openUploadModal}>
          <i className="fa-solid fa-arrow-up-from-bracket" />
          <span>Upload PCAP</span>
        </button>

        <button
          className="icon-btn theme-toggle-btn"
          title="Toggle Theme"
          aria-label="Toggle dark/light mode"
          onClick={toggleTheme}
        >
          <i className={`fa-solid ${theme === 'dark' ? 'fa-moon' : 'fa-sun'}`} />
        </button>

        <div className="notification-dropdown-wrap">
          <button
            className="icon-btn notification-btn"
            title="Alerts & Notifications"
            aria-label="Notifications"
            onClick={(e) => {
              e.stopPropagation();
              toggleNotifDropdown();
            }}
          >
            <i className="fa-regular fa-bell" />
            {unreadCount > 0 && <span className="badge-dot notif-count">{unreadCount}</span>}
          </button>
          <div className={`dropdown-menu notif-dropdown${notifDropdownOpen ? ' show' : ''}`}>
            <div className="dropdown-header">
              <h6>Security Notifications</h6>
              <button className="text-btn mark-all-read" onClick={markAllNotificationsRead}>
                Mark all read
              </button>
            </div>
            <div className="notif-list">
              {notifications.map((n) => (
                <div className={`notif-item${n.unread ? ' unread' : ''}`} key={n.id}>
                  <div className={`notif-icon ${n.iconClass}`}>
                    <i className={`fa-solid ${n.icon}`} />
                  </div>
                  <div className="notif-details">
                    <p className="notif-title">{n.title}</p>
                    <span className="notif-time">{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="user-profile-chip">
          <div className="avatar-circle">AD</div>
          <span className="username">Admin</span>
          <i className="fa-solid fa-chevron-down profile-chevron" />
        </div>
      </div>
    </header>
  );
};

export default Header;

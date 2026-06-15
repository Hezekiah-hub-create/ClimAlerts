import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Calendar, ChevronDown, User, Settings, LogOut, Shield, Mail, MapPin } from 'lucide-react';
import './Header.css';
import { fmtDateTime, hoursAgo } from '../../utils/dateUtils';

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  let title = 'ClimAlerts';
  let subtitle = 'Predictive Health and Climate Analytics';

  if (path.includes('/dashboard')) {
    title = 'Dashboard';
    subtitle = "Welcome back, Admin! Here's what's happening in Volta Region.";
  } else if (path.includes('/risk-map')) {
    title = 'Risk Map \u2013 Volta Region';
    subtitle = 'Real-time geographic monitoring of disease outbreak risk across districts.';
  } else if (path.includes('/predictions')) {
    title = 'Predictions';
    subtitle = 'AI-powered forecasts and outbreak probabilities.';
  } else if (path.includes('/alerts')) {
    title = 'Alerts';
    subtitle = 'Manage emergency communication and SMS delivery.';
  } else if (path.includes('/data-sources')) {
    title = 'Data Sources';
    subtitle = 'Manage CSV uploads and external API integrations.';
  } else if (path.includes('/users')) {
    title = 'Users';
    subtitle = 'Access control, role assignment, and activity logs.';
  } else if (path.includes('/settings')) {
    title = 'Settings';
    subtitle = 'System configuration and preferences';
  } else if (path.includes('/reports')) {
    title = 'Reports & Analytics';
    subtitle = 'Generate reports, view analytics, and export data.';
  } else if (path.includes('/profile')) {
    title = 'Profile';
    subtitle = 'Manage your personal details and session activity.';
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="header-left">
        <div className="header-titles">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="header-right">
        <div className="date-picker-btn">
          <span>{currentDate}</span>
          <Calendar size={16} />
        </div>

        <button className="notification-btn">
          <Bell size={18} />
          <span className="notification-badge">3</span>
        </button>

        <div className="user-profile-wrapper" ref={profileRef}>
          <div
            className={`user-profile ${profileOpen ? 'active' : ''}`}
            onClick={() => setProfileOpen(prev => !prev)}
          >
            <img 
              src="https://randomuser.me/api/portraits/men/32.jpg" 
              alt="Admin User" 
              className="user-avatar" 
            />
            <div className="user-info">
              <span className="user-name">Admin User</span>
              <span className="user-role">System Administrator</span>
            </div>
            <ChevronDown size={14} className={`chevron ${profileOpen ? 'chevron-rotated' : ''}`} />
          </div>

          {profileOpen && (
            <div className="profile-dropdown">
              <div className="profile-dropdown-header">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="Admin User"
                  className="pd-avatar"
                />
                <div className="pd-identity">
                  <span className="pd-name">Admin User</span>
                  <span className="pd-role-badge">
                    <Shield size={10} />
                    System Administrator
                  </span>
                </div>
              </div>

              <div className="pd-details">
                <div className="pd-detail-row">
                  <Mail size={14} />
                  <span>admin@climalerts.gov.gh</span>
                </div>
                <div className="pd-detail-row">
                  <MapPin size={14} />
                  <span>Volta Region, Ghana</span>
                </div>
              </div>

              <div className="pd-status-row">
                <span className="pd-status-dot" />
                <span>Online</span>
                <span className="pd-last-login">Last login: {fmtDateTime(hoursAgo(1))}</span>
              </div>

              <div className="pd-divider" />

              <nav className="pd-menu">
                <button className="pd-menu-item" onClick={() => { navigate('/profile'); setProfileOpen(false); }}>
                  <User size={15} />
                  <span>My Profile</span>
                </button>
                <button className="pd-menu-item" onClick={() => { navigate('/settings'); setProfileOpen(false); }}>
                  <Settings size={15} />
                  <span>Settings</span>
                </button>
              </nav>

              <div className="pd-divider" />

              <button className="pd-menu-item pd-logout">
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

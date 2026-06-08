import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Calendar, ChevronDown } from 'lucide-react';
import './Header.css';

export const Header = () => {
  const location = useLocation();
  const path = location.pathname;

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

        <div className="user-profile">
          <img 
            src="https://randomuser.me/api/portraits/men/32.jpg" 
            alt="Admin User" 
            className="user-avatar" 
          />
          <div className="user-info">
            <span className="user-name">Admin User</span>
            <span className="user-role">System Administrator</span>
          </div>
          <ChevronDown size={14} className="chevron" />
        </div>
      </div>
    </header>
  );
};

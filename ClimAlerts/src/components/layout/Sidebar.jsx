import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BrainCircuit, 
  Map, 
  BellRing, 
  Database, 
  BarChart2, 
  Activity, 
  Users, 
  Settings,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { fmtDateTime, minutesAgo } from '../../utils/dateUtils';
import './Sidebar.css';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Predictions', path: '/predictions', icon: BrainCircuit },
  { name: 'Risk Map', path: '/risk-map', icon: Map },
  { name: 'Alerts & Messages', path: '/alerts', icon: BellRing },
  { name: 'Data Source', path: '/data-sources', icon: Database },
  { name: 'Reports & Analytics', path: '/reports', icon: BarChart2 },
  { name: 'Users & Roles', path: '/users', icon: Users },
  { name: 'System Settings', path: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const lastPrediction = fmtDateTime(minutesAgo(35));
  const currentYear = now.getFullYear();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cloud-leaf-icon">
              <path d="M17.5 19c2.485 0 4.5-2.015 4.5-4.5S19.985 10 17.5 10c-.543 0-1.055.102-1.52.285A7.5 7.5 0 0 0 2.5 14.5C2.5 16.985 4.515 19 7 19h10.5z" />
              <path d="M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
            </svg>
          </div>
          <div className="logo-text-group">
            <h1 className="logo-text">ClimAlerts</h1>
            <span className="logo-subtext">Climate & Health Monitoring</span>
          </div>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon size={18} className="nav-icon" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="system-status-card">
          <div className="status-header">
            <span className="status-dot green"></span>
            <span className="status-title">System Status</span>
          </div>
          <div className="status-text">All Systems Operational</div>
          
          <div className="status-row">
            <span className="status-label">Model Status</span>
            <span className="status-value green">Active</span>
          </div>

          <div className="status-row">
            <span className="status-label">Last Prediction Update</span>
            <span className="status-value">{lastPrediction}</span>
          </div>

          <div className="status-row">
            <span className="status-label">SMS Gateway</span>
            <span className="status-value green">Connected</span>
          </div>
          
          <div className="status-row">
            <span className="status-label">Data Sync</span>
            <span className="status-value green">Up to date</span>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="copyright">© {currentYear} ClimAlerts<br/>All rights reserved.</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="collapse-btn" title="Logout" onClick={() => window.location.href = '/login'}>
              <LogOut size={16} />
            </button>
            <button className="collapse-btn" title="Collapse Sidebar">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

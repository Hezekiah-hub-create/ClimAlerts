import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { 
  Settings as SettingsIcon, Server, Shield, Bell, BrainCircuit, 
  Key, Sliders, Save, Database, Wifi, Lock, Cpu, Eye, 
  Smartphone, Volume2, HelpCircle, RefreshCw, CheckCircle, 
  Play, DownloadCloud, AlertTriangle, CloudLightning, Info, FileSpreadsheet,
  Send, Users, Globe, Monitor, Clock, Fingerprint, ShieldCheck,
  UserCheck, Activity, FileText, Hash
} from 'lucide-react';
import { 
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, Radar, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { Bug, Droplet, Thermometer, Waves, Siren, CloudRain, Calendar, Bot, BarChart, Puzzle, Sparkles } from 'lucide-react';
import './Settings.css';

// ---------- Mock Data ----------

const radarData = [
  { subject: 'Temperature', A: 85, fullMark: 100 },
  { subject: 'Humidity', A: 72, fullMark: 100 },
  { subject: 'Precipitation', A: 68, fullMark: 100 },
  { subject: 'Population', A: 78, fullMark: 100 },
  { subject: 'Vector Pres.', A: 91, fullMark: 100 },
  { subject: 'Hist. Patterns', A: 83, fullMark: 100 },
];



export const Settings = () => {
  const [activeTab, setActiveTab] = useState('sms');

  const [isSaving, setIsSaving] = useState(false);

  
  const [simData, setSimData] = useState([
    { name: 'May 17', historical: 35, current: 35, high: 35, low: 35 },
    { name: 'May 20', historical: 42, current: 42, high: 42, low: 42 },
    { name: 'May 23', historical: 50, current: 52, high: 62, low: 45 },
    { name: 'May 26', current: 68, high: 88, low: 52 },
    { name: 'May 29', current: 72, high: 91, low: 58 },
    { name: 'Jun 1', current: 75, high: 94, low: 62 },
    { name: 'Jun 4', current: 72, high: 92, low: 55 },
    { name: 'Jun 7', current: 69, high: 89, low: 50 },
  ]);

  const [isSimulating, setIsSimulating] = useState(false);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    toast.loading('Running AI Simulation...', { id: 'sim' });
    
    setTimeout(() => {
      const newSimData = simData.map(d => ({
        ...d,
        current: d.current + Math.floor(Math.random() * 20 - 10),
        high: d.high ? d.high + Math.floor(Math.random() * 15) : undefined,
        low: d.low ? d.low - Math.floor(Math.random() * 15) : undefined,
      }));
      setSimData(newSimData);
      setIsSimulating(false);
      toast.success('Simulation Complete!', { id: 'sim' });
    }, 2000);
  };

  const handleSave = () => {
    setIsSaving(true);
    const loadingId = toast.loading('Saving settings...');
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Settings saved successfully!', { id: loadingId });
    }, 1200);
  };


  // Sub-tabs list
  const tabs = [
    { key: 'sms', label: 'SMS & API Settings', icon: Server },
    { key: 'thresholds', label: 'Thresholds', icon: Sliders },
    { key: 'backups', label: 'Backups', icon: Database },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'ai', label: 'AI Sensitivity', icon: BrainCircuit },
    { key: 'security', label: 'Security & Access', icon: Shield },
    { key: 'preferences', label: 'System Preferences', icon: SettingsIcon },
  ];

  // Tab State Handlers
  const [showSid, setShowSid] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('Twilio');
  const [smsStatus, setSmsStatus] = useState('Connected');

  return (
    <div className="settings-page-container">
      {/* ===== TOP SUB-NAVIGATION TABS ===== */}
      <div className="settings-tabs-navbar">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`settings-nav-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <tab.icon size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ===== TAB PANEL COMPONENT ===== */}
      <div className="settings-tab-content-panel">
        
        {/* ========================================================
            TAB 1: SMS & API SETTINGS
            ======================================================== */}
        {activeTab === 'sms' && (
          <div className="tab-pane-content pane-sms-api">
            {/* SMS Gateway Configuration */}
            <div className="settings-section-card card">
              <div className="sec-header">
                <h3>SMS Gateway Configuration</h3>
                <p>Configure SMS service provider and messaging settings</p>
              </div>
              <div className="sec-body grid-four-cols">
                <div className="input-group-field">
                  <label>SMS Provider</label>
                  <select value={selectedProvider} onChange={e => setSelectedProvider(e.target.value)} className="sett-input select">
                    <option value="Twilio">Twilio</option>
                    <option value="Infobip">Infobip</option>
                    <option value="Africa\'s Talking">Africa's Talking</option>
                  </select>
                </div>
                <div className="input-group-field password-wrapper">
                  <label>Account SID</label>
                  <div className="input-with-action">
                    <input type={showSid ? 'text' : 'password'} defaultValue="AC88390b1787c88df3" className="sett-input" />
                    <button className="eye-btn" onClick={() => setShowSid(!showSid)}><Eye size={14} /></button>
                  </div>
                </div>
                <div className="input-group-field password-wrapper">
                  <label>Auth Token</label>
                  <div className="input-with-action">
                    <input type={showToken ? 'text' : 'password'} defaultValue="bf893c87e9c8a9fbc761e" className="sett-input" />
                    <button className="eye-btn" onClick={() => setShowToken(!showToken)}><Eye size={14} /></button>
                  </div>
                </div>
                <div className="input-group-field">
                  <label>From Number</label>
                  <input type="text" defaultValue="+233 20 123 4567" className="sett-input" />
                </div>
              </div>

              <div className="sec-footer-actions-row">
                <div className="sms-status-group">
                  <span className="footer-status-label">SMS Status</span>
                  <span className="badge-green-filled">Connected</span>
                  <span className="footer-last-test">Last Test: May 23, 2025 08:25 AM</span>
                </div>
                <button className="btn-sett-outline"><RefreshCw size={14} /> Test Connection</button>
              </div>
            </div>

            {/* API Configuration */}
            <div className="settings-section-card card">
              <div className="sec-header">
                <h3>API Configuration</h3>
                <p>Configure external API integrations and data sources</p>
              </div>
              <div className="sec-body grid-four-cols">
                <div className="input-group-field password-wrapper">
                  <label>Weather API Key</label>
                  <div className="input-with-action">
                    <input type="password" defaultValue="weatherkey88939c" className="sett-input" />
                    <button className="eye-btn"><Eye size={14} /></button>
                  </div>
                </div>
                <div className="input-group-field password-wrapper">
                  <label>Disease Data API Key</label>
                  <div className="input-with-action">
                    <input type="password" defaultValue="diseasekey773cbb" className="sett-input" />
                    <button className="eye-btn"><Eye size={14} /></button>
                  </div>
                </div>
                <div className="input-group-field span-two-cols">
                  <label>Base API URL</label>
                  <input type="text" defaultValue="https://api.climalerts.org/v1" className="sett-input" />
                </div>
              </div>
              <div className="sec-footer-actions-row">
                <div className="sms-status-group">
                  <span className="footer-status-label">API Status</span>
                  <span className="badge-green-filled">Active</span>
                </div>
              </div>
            </div>

            {/* Data & System Settings */}
            <div className="settings-section-card card">
              <div className="sec-header">
                <h3>Data & System Settings</h3>
                <p>Configure system behavior and data management</p>
              </div>
              <div className="sec-body grid-three-cols">
                <div className="input-group-field">
                  <label>Data Retention Period</label>
                  <select className="sett-input select">
                    <option>2 Years</option>
                    <option>5 Years</option>
                    <option>Indefinite</option>
                  </select>
                </div>
                <div className="input-group-field">
                  <label>Default Time Range</label>
                  <select className="sett-input select">
                    <option>7 Days</option>
                    <option>30 Days</option>
                    <option>90 Days</option>
                  </select>
                </div>
                <div className="input-group-field toggle-control-row">
                  <div className="toggle-lbls">
                    <label>Data Compression</label>
                    <span>Compress database logs to save storage</span>
                  </div>
                  <label className="sett-toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="sett-slider"></span>
                  </label>
                </div>
                <div className="input-group-field toggle-control-row">
                  <div className="toggle-lbls">
                    <label>Auto Data Sync</label>
                    <span>Automatically pull details from active nodes</span>
                  </div>
                  <label className="sett-toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="sett-slider"></span>
                  </label>
                </div>
                <div className="input-group-field">
                  <label>Backup Frequency</label>
                  <select className="sett-input select">
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
                <div className="input-group-field">
                  <label>System Language</label>
                  <select className="sett-input select">
                    <option>English</option>
                    <option>French</option>
                    <option>Spanish</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Other Settings */}
            <div className="settings-section-card card">
              <div className="sec-header">
                <h3>Other Settings</h3>
                <p>Additional system preferences</p>
              </div>
              <div className="sec-body grid-three-cols">
                <div className="input-group-field">
                  <label>Default Risk Level</label>
                  <select className="sett-input select">
                    <option>Moderate</option>
                    <option>Low</option>
                    <option>High</option>
                  </select>
                </div>
                <div className="input-group-field">
                  <label>Max Alert Recipients</label>
                  <input type="number" defaultValue={1000} className="sett-input" />
                </div>
                <div className="input-group-field">
                  <label>Session Timeout</label>
                  <select className="sett-input select">
                    <option>30 Minutes</option>
                    <option>1 Hour</option>
                    <option>4 Hours</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Save Button Row */}
            <div className="bottom-save-sticky-bar">
              <button className="btn-primary-save" onClick={handleSave} disabled={isSaving}><Save size={14} /> {isSaving ? "Saving..." : "Save All Settings"}</button>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: THRESHOLDS
            ======================================================== */}
        {activeTab === 'thresholds' && (
          <div className="tab-pane-content pane-thresholds two-cols-layout">
            {/* Left Column: Sliders & Config */}
            <div className="pane-left-col">
              {/* Disease Risk Thresholds */}
              <div className="settings-section-card card">
                <div className="sec-header">
                  <h3>Disease Risk Thresholds <span className="info-dot"><Info size={16} /></span></h3>
                  <p>Set risk score thresholds for different diseases</p>
                </div>
                <div className="sec-body vertical-sliders-stack">
                  <div className="range-slider-row">
                    <div className="slider-label-row">
                      <span className="disease-lbl-tag font-bold"><Bug size={16} /> Malaria</span>
                      <span className="slider-pct-tag text-green">65% High Risk</span>
                    </div>
                    <div className="slider-track-wrap">
                      <input type="range" min="0" max="100" defaultValue="65" className="range-slider-input range-green" />
                    </div>
                  </div>

                  <div className="range-slider-row">
                    <div className="slider-label-row">
                      <span className="disease-lbl-tag font-bold"><Droplet size={16} /> Cholera</span>
                      <span className="slider-pct-tag text-blue">60% High Risk</span>
                    </div>
                    <div className="slider-track-wrap">
                      <input type="range" min="0" max="100" defaultValue="60" className="range-slider-input range-blue" />
                    </div>
                  </div>

                  <div className="range-slider-row">
                    <div className="slider-label-row">
                      <span className="disease-lbl-tag font-bold"><Bug size={16} /> Dengue Fever</span>
                      <span className="slider-pct-tag text-purple">55% Moderate Risk</span>
                    </div>
                    <div className="slider-track-wrap">
                      <input type="range" min="0" max="100" defaultValue="55" className="range-slider-input range-purple" />
                    </div>
                  </div>

                  <div className="range-slider-row">
                    <div className="slider-label-row">
                      <span className="disease-lbl-tag font-bold"><Thermometer size={16} /> Typhoid Fever</span>
                      <span className="slider-pct-tag text-red">45% Moderate Risk</span>
                    </div>
                    <div className="slider-track-wrap">
                      <input type="range" min="0" max="100" defaultValue="45" className="range-slider-input range-red" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Environmental Thresholds */}
              <div className="settings-section-card card">
                <div className="sec-header">
                  <h3>Environmental Thresholds <span className="info-dot"><Info size={16} /></span></h3>
                  <p>Set environmental trigger levels</p>
                </div>
                <div className="sec-body vertical-sliders-stack">
                  <div className="range-slider-row">
                    <div className="slider-label-row">
                      <span className="disease-lbl-tag font-bold"><CloudRain size={16} /> Rainfall Trigger Level</span>
                      <span className="slider-pct-tag text-blue">120 mm High Risk</span>
                    </div>
                    <div className="slider-track-wrap">
                      <input type="range" min="0" max="200" defaultValue="120" className="range-slider-input range-blue" />
                    </div>
                  </div>

                  <div className="range-slider-row">
                    <div className="slider-label-row">
                      <span className="disease-lbl-tag font-bold"><Droplet size={16} /> Humidity Threshold</span>
                      <span className="slider-pct-tag text-blue">80% High Risk</span>
                    </div>
                    <div className="slider-track-wrap">
                      <input type="range" min="0" max="100" defaultValue="80" className="range-slider-input range-blue" />
                    </div>
                  </div>

                  <div className="range-slider-row">
                    <div className="slider-label-row">
                      <span className="disease-lbl-tag font-bold"><Thermometer size={16} /> Temperature Threshold</span>
                      <span className="slider-pct-tag text-red">30°C High Risk</span>
                    </div>
                    <div className="slider-track-wrap">
                      <input type="range" min="0" max="50" defaultValue="30" className="range-slider-input range-red" />
                    </div>
                  </div>

                  <div className="range-slider-row">
                    <div className="slider-label-row">
                      <span className="disease-lbl-tag font-bold"><Waves size={16} /> Flood Risk Level</span>
                      <span className="slider-pct-tag text-purple">70% High Risk</span>
                    </div>
                    <div className="slider-track-wrap">
                      <input type="range" min="0" max="100" defaultValue="70" className="range-slider-input range-purple" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Alert Severity Configuration */}
              <div className="settings-section-card card">
                <div className="sec-header">
                  <h3>Alert Severity Configuration</h3>
                  <p>Configure alert levels and their score ranges</p>
                </div>
                <div className="sec-body grid-four-cols alert-severity-boxes">
                  <div className="severity-info-box low">
                    <span className="badge-green-filled">Low Risk</span>
                    <span className="range-score">0 - 25%</span>
                    <p>Minimal risk to communities. Routine monitoring. No immediate action required.</p>
                  </div>
                  <div className="severity-info-box moderate">
                    <span className="badge-yellow-filled">Moderate Risk</span>
                    <span className="range-score">26 - 50%</span>
                    <p>Potential risk to communities. Increase surveillance. Preventive actions.</p>
                  </div>
                  <div className="severity-info-box high">
                    <span className="badge-orange-filled">High Risk</span>
                    <span className="range-score">51 - 75%</span>
                    <p>High risk to communities. Immediate action required. Enhanced response.</p>
                  </div>
                  <div className="severity-info-box critical">
                    <span className="badge-red-filled">Critical Risk</span>
                    <span className="range-score">76 - 100%</span>
                    <p>Very high risk to communities. Urgent response needed. Emergency measures.</p>
                  </div>
                </div>
                <div className="alert-severity-progress-bar">
                  <div className="color-strip"></div>
                  <div className="color-strip-labels">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Previews & Actions */}
            <div className="pane-right-col">
              <div className="settings-section-card card live-risk-card">
                <div className="sec-header">
                  <h3>Live Risk Level Preview</h3>
                  <p>Real-time preview based on current data</p>
                </div>
                <div className="sec-body live-preview-body">
                  {/* Gauge Arc Graphic */}
                  <div className="gauge-dial-container">
                    <svg className="gauge-svg-arc" viewBox="0 0 100 50">
                      <path d="M 10,50 A 40,40 0 0,1 90,50" fill="none" stroke="#E5E7EB" strokeWidth="8" strokeLinecap="round" />
                      {/* High risk highlights 72% of semi-circle arc */}
                      <path d="M 10,50 A 40,40 0 0,1 78,22" fill="none" stroke="#F59E0B" strokeWidth="8" strokeLinecap="round" />
                    </svg>
                    <div className="gauge-overlay-text">
                      <span className="text-orange-dark font-extrabold text-2xl">High Risk</span>
                      <span className="gauge-score-value">Risk Score: <strong>72%</strong></span>
                    </div>
                  </div>

                  <span className="gauge-sub-lbl">Volta Region Overall Risk Level</span>

                  <div className="risk-level-breakdown-list">
                    <div className="risk-breakdown-item">
                      <span className="br-name"><Bug size={16} /> Malaria Risk</span>
                      <span className="br-val text-red">High ↑</span>
                    </div>
                    <div className="risk-breakdown-item">
                      <span className="br-name"><Droplet size={16} /> Cholera Risk</span>
                      <span className="br-val text-red">High ↑</span>
                    </div>
                    <div className="risk-breakdown-item">
                      <span className="br-name"><Bug size={16} /> Dengue Risk</span>
                      <span className="br-val text-orange">Moderate →</span>
                    </div>
                    <div className="risk-breakdown-item">
                      <span className="br-name"><Thermometer size={16} /> Typhoid Risk</span>
                      <span className="br-val text-orange">Moderate →</span>
                    </div>
                  </div>

                  <span className="last-updated-tag">Last updated: May 23, 2025 08:30 AM ↻</span>
                </div>
              </div>

              {/* Threshold Actions */}
              <div className="settings-section-card card">
                <div className="sec-header">
                  <h3>Threshold Actions</h3>
                  <p>Manage threshold settings</p>
                </div>
                <div className="sec-body vertical-buttons-stack">
                  <button className="btn-wide-outline"><RefreshCw size={14} /> Reset to Default</button>
                  <button className="btn-wide-outline"><DownloadCloud size={14} /> Import Thresholds</button>
                  <button className="btn-wide-outline"><FileSpreadsheet size={14} /> Export Thresholds</button>
                </div>
                <div className="footer-save-box">
                  <button className="btn-primary-save w-full" onClick={handleSave} disabled={isSaving}><Save size={14} /> {isSaving ? "Saving..." : "Save All Thresholds"}</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: BACKUPS
            ======================================================== */}
        {activeTab === 'backups' && (
          <div className="tab-pane-content pane-backups">
            <div className="settings-section-card card">
              <div className="sec-header">
                <h3>System Backup & Restoration</h3>
                <p>Manage database backups and restore configurations</p>
              </div>
              <div className="sec-body backups-grid">
                <div className="backup-left-actions">
                  <button className="btn-solid-blue"><Database size={16} /> Create Manual Backup</button>
                  <div className="backup-meta-list">
                    <div className="meta-row">
                      <span>Last Backup Created:</span>
                      <strong>May 23, 2025 06:15 AM</strong>
                    </div>
                    <div className="meta-row">
                      <span>Automatic Backup status:</span>
                      <strong className="text-green">Active (Daily at 02:00 AM)</strong>
                    </div>
                    <div className="meta-row">
                      <span>Cloud Sync Status:</span>
                      <strong className="text-green">Linked with AWS S3</strong>
                    </div>
                  </div>
                </div>

                <div className="backup-history-list">
                  <h4>Backup History Logs</h4>
                  <div className="backup-log-item">
                    <span>backup_full_20250523_020000.sql</span>
                    <span className="log-sz">142.5 MB</span>
                    <button className="btn-sett-outline sm">Restore</button>
                  </div>
                  <div className="backup-log-item">
                    <span>backup_full_20250522_020000.sql</span>
                    <span className="log-sz">141.9 MB</span>
                    <button className="btn-sett-outline sm">Restore</button>
                  </div>
                  <div className="backup-log-item">
                    <span>backup_full_20250521_020000.sql</span>
                    <span className="log-sz">141.2 MB</span>
                    <button className="btn-sett-outline sm">Restore</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: NOTIFICATIONS
            ======================================================== */}
        {activeTab === 'notifications' && (
          <div className="tab-pane-content pane-notifications two-cols-layout">
            <div className="pane-left-col">
              {/* Notification Preferences */}
              <div className="settings-section-card card">
                <div className="sec-header">
                  <h3>Notification Preferences</h3>
                  <p>Choose your preferred notification channels</p>
                </div>
                <div className="sec-body toggle-list-stack">
                  <div className="pref-toggle-row">
                    <div className="toggle-info-lbl">
                      <span className="pref-icon-wrap"><Smartphone size={16} /></span>
                      <div className="lbl-texts">
                        <span className="font-bold">SMS Notifications</span>
                        <span>Receive alerts via SMS text messages</span>
                      </div>
                    </div>
                    <label className="sett-toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="sett-slider"></span>
                    </label>
                  </div>

                  <div className="pref-toggle-row">
                    <div className="toggle-info-lbl">
                      <span className="pref-icon-wrap"><Server size={16} /></span>
                      <div className="lbl-texts">
                        <span className="font-bold">Email Notifications</span>
                        <span>Receive alerts via email</span>
                      </div>
                    </div>
                    <label className="sett-toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="sett-slider"></span>
                    </label>
                  </div>

                  <div className="pref-toggle-row">
                    <div className="toggle-info-lbl">
                      <span className="pref-icon-wrap"><Bell size={16} /></span>
                      <div className="lbl-texts">
                        <span className="font-bold">Push Notifications</span>
                        <span>Receive push notifications in app</span>
                      </div>
                    </div>
                    <label className="sett-toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="sett-slider"></span>
                    </label>
                  </div>

                  <div className="pref-toggle-row">
                    <div className="toggle-info-lbl">
                      <span className="pref-icon-wrap"><AlertTriangle size={16} /></span>
                      <div className="lbl-texts">
                        <span className="font-bold">Emergency Broadcasts</span>
                        <span>Receive critical emergency broadcasts</span>
                      </div>
                    </div>
                    <label className="sett-toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="sett-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Recipient Controls */}
              <div className="settings-section-card card">
                <div className="sec-header">
                  <h3>Recipient Controls</h3>
                  <p>Select who receives which types of notifications</p>
                </div>
                <div className="sec-body recipient-list-controls">
                  <div className="recipient-row">
                    <span className="rec-icon blue"><Users size={14} /></span>
                    <div className="rec-info-texts">
                      <span className="font-bold">Health Officers</span>
                      <span>Medical and health department staff</span>
                    </div>
                    <span className="badge-green-filled">24 Recipients</span>
                  </div>

                  <div className="recipient-row">
                    <span className="rec-icon purple"><Shield size={14} /></span>
                    <div className="rec-info-texts">
                      <span className="font-bold">Regional Admins</span>
                      <span>Regional administrators and managers</span>
                    </div>
                    <span className="badge-green-filled">12 Recipients</span>
                  </div>

                  <div className="recipient-row">
                    <span className="rec-icon orange"><Users size={14} /></span>
                    <div className="rec-info-texts">
                      <span className="font-bold">Public Alerts</span>
                      <span>General public and community members</span>
                    </div>
                    <span className="badge-green-filled">Public Enabled</span>
                  </div>

                  <div className="recipient-row">
                    <span className="rec-icon red"><Users size={14} /></span>
                    <div className="rec-info-texts">
                      <span className="font-bold">Custom Groups</span>
                      <span>Special groups and organizations</span>
                    </div>
                    <span className="badge-green-filled">5 Groups</span>
                  </div>
                </div>
              </div>

              {/* Notification Behavior & Nice Features split */}
              <div className="grid-two-cols-split">
                <div className="settings-section-card card">
                  <div className="sec-header">
                    <h3>Notification Behavior</h3>
                    <p>Configure how notifications are delivered</p>
                  </div>
                  <div className="sec-body behavior-fields-stack">
                    <div className="input-group-field">
                      <label>Alert Frequency</label>
                      <select className="sett-input select">
                        <option>Immediate</option>
                        <option>Hourly</option>
                        <option>Daily Summary</option>
                      </select>
                    </div>
                    <div className="input-group-field">
                      <label>Quiet Hours</label>
                      <select className="sett-input select">
                        <option>10:00 PM - 6:00 AM</option>
                        <option>Disabled</option>
                      </select>
                    </div>
                    <div className="input-group-field">
                      <label>Escalation Timing</label>
                      <select className="sett-input select">
                        <option>30 Minutes</option>
                        <option>1 Hour</option>
                      </select>
                    </div>
                    <div className="input-group-field toggle-control-row">
                      <label>Repeat Alerts</label>
                      <label className="sett-toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="sett-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="settings-section-card card">
                  <div className="sec-header">
                    <h3>Nice Features</h3>
                    <p>Additional notification preferences</p>
                  </div>
                  <div className="sec-body behavior-fields-stack">
                    <div className="input-group-field toggle-control-row">
                      <div className="lbl-stacked">
                        <label>Sound</label>
                        <span>Play sound for notifications</span>
                      </div>
                      <label className="sett-toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="sett-slider"></span>
                      </label>
                    </div>
                    <div className="input-group-field toggle-control-row">
                      <div className="lbl-stacked">
                        <label>Vibration</label>
                        <span>Vibrate for push notifications</span>
                      </div>
                      <label className="sett-toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="sett-slider"></span>
                      </label>
                    </div>
                    <div className="input-group-field toggle-control-row">
                      <div className="lbl-stacked">
                        <label>Badge Count</label>
                        <span>Show unread count on app icon</span>
                      </div>
                      <label className="sett-toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="sett-slider"></span>
                      </label>
                    </div>
                    <div className="input-group-field toggle-control-row">
                      <div className="lbl-stacked">
                        <label>Critical Alerts Override</label>
                        <span>Override quiet hours for critical alerts</span>
                      </div>
                      <label className="sett-toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="sett-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pane-right-col">
              {/* Notification Preview */}
              <div className="settings-section-card card phone-mockup-card">
                <div className="sec-header">
                  <h3>Notification Preview</h3>
                  <p>See how your notifications will appear</p>
                </div>
                <div className="sec-body phone-preview-body">
                  <div className="smartphone-frame">
                    <div className="phone-screen">
                      <div className="phone-header-notch">
                        <span>Messages</span>
                        <span className="phone-time">now</span>
                      </div>
                      <div className="phone-notification-bubble">
                        <div className="notif-bubble-title">
                          <span className="notif-icon-marker"><Siren size={16} /></span>
                          <span className="font-bold text-xs">ClimAlerts</span>
                        </div>
                        <h4 className="text-red font-bold text-xs mt-1">High Risk Alert</h4>
                        <p className="text-xxs mt-1 text-gray-800 leading-normal">
                          Malaria risk is HIGH in your area. Take precautionary measures and stay safe.
                        </p>
                        <div className="notif-detail-meta mt-2">
                          <span>Risk Level: High</span>
                          <span>Location: Volta Region</span>
                          <span>Time: May 23, 2025 08:30 AM</span>
                        </div>
                        <span className="notif-signature text-xxs mt-2 block text-gray-500">Stay informed. Stay protected. <br/>- ClimAlerts System</span>
                      </div>
                    </div>
                  </div>
                  <button className="btn-solid-blue w-full mt-4"><Send size={14} /> Send Test Notification</button>
                  <span className="test-notif-footnote">Test your notification settings</span>
                </div>
              </div>

              {/* Recent Notification Activity */}
              <div className="settings-section-card card">
                <div className="sec-header">
                  <h3>Recent Notification Activity</h3>
                  <p>Latest notification system activities</p>
                </div>
                <div className="sec-body recent-notification-activity-list">
                  <div className="act-row">
                    <div className="act-icon-dot green"></div>
                    <div className="act-texts">
                      <span className="font-bold">High Risk Alert Sent</span>
                      <span>May 23, 2025 08:30 AM</span>
                    </div>
                    <span className="text-green text-xs font-bold">Success</span>
                  </div>

                  <div className="act-row">
                    <div className="act-icon-dot green"></div>
                    <div className="act-texts">
                      <span className="font-bold">System Notification</span>
                      <span>May 23, 2025 07:45 AM</span>
                    </div>
                    <span className="text-green text-xs font-bold">Success</span>
                  </div>

                  <div className="act-row">
                    <div className="act-icon-dot green"></div>
                    <div className="act-texts">
                      <span className="font-bold">Weekly Summary</span>
                      <span>May 23, 2025 06:00 AM</span>
                    </div>
                    <span className="text-green text-xs font-bold">Success</span>
                  </div>

                  <div className="act-row">
                    <div className="act-icon-dot green"></div>
                    <div className="act-texts">
                      <span className="font-bold">Test Notification</span>
                      <span>May 22, 2025 03:15 PM</span>
                    </div>
                    <span className="text-green text-xs font-bold">Success</span>
                  </div>
                </div>
                <div className="sec-footer-actions-row center">
                  <a href="#" className="perm-footer-action">View All Activity</a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: AI SENSITIVITY
            ======================================================== */}
        {activeTab === 'ai' && (
          <div className="tab-pane-content pane-ai-sensitivity two-cols-layout">
            <div className="pane-left-col">
              {/* AI Detection Sensitivity */}
              <div className="settings-section-card card">
                <div className="sec-header">
                  <h3>AI Detection Sensitivity</h3>
                  <p>Adjust how sensitive the AI is in detecting risks</p>
                </div>
                <div className="sec-body sensitivity-level-selectors">
                  <div className="sensitivity-level-card">
                    <span className="sens-icon blue"><Cpu size={14} /></span>
                    <div className="sens-meta">
                      <span className="font-bold">Low</span>
                      <span>Less sensitive, fewer alerts</span>
                    </div>
                    <input type="radio" name="ai-sens-level" />
                  </div>

                  <div className="sensitivity-level-card active">
                    <span className="sens-icon blue"><Cpu size={14} /></span>
                    <div className="sens-meta">
                      <span className="font-bold">Balanced</span>
                      <span>Balanced detection and accuracy</span>
                    </div>
                    <input type="radio" name="ai-sens-level" defaultChecked />
                  </div>

                  <div className="sensitivity-level-card">
                    <span className="sens-icon orange"><Cpu size={14} /></span>
                    <div className="sens-meta">
                      <span className="font-bold">High</span>
                      <span>More sensitive, more alerts</span>
                    </div>
                    <input type="radio" name="ai-sens-level" />
                  </div>

                  <div className="sensitivity-level-card">
                    <span className="sens-icon red"><Cpu size={14} /></span>
                    <div className="sens-meta">
                      <span className="font-bold">Aggressive Detection</span>
                      <span>Maximum sensitivity, catch all risks</span>
                    </div>
                    <input type="radio" name="ai-sens-level" />
                  </div>

                  <div className="sensitivity-tip-banner">
                    <Info size={14} />
                    <span>Balanced mode is optimal for most monitoring scenarios.</span>
                  </div>
                </div>
              </div>

              {/* Prediction Settings split with AI Explainability */}
              <div className="grid-two-cols-split">
                {/* Prediction Settings */}
                <div className="settings-section-card card">
                  <div className="sec-header">
                    <h3>Prediction Settings</h3>
                    <p>Configure how AI generates and evaluates predictions</p>
                  </div>
                  <div className="sec-body prediction-settings-stack">
                    <div className="input-group-field">
                      <label>Forecast Window</label>
                      <select className="sett-input select">
                        <option>14 Days</option>
                        <option>30 Days</option>
                      </select>
                    </div>

                    <div className="input-group-field">
                      <label>Confidence Threshold</label>
                      <div className="slider-threshold-inline">
                        <input type="range" min="0" max="100" defaultValue="70" className="range-slider-input range-green" />
                        <span className="lbl-val font-bold">70%</span>
                      </div>
                    </div>

                    <div className="input-group-field">
                      <label>Minimum Data Requirement</label>
                      <select className="sett-input select">
                        <option>2 Years</option>
                        <option>5 Years</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* AI Explainability */}
                <div className="settings-section-card card">
                  <div className="sec-header">
                    <h3>AI Explainability</h3>
                    <p>Understand how AI makes predictions</p>
                  </div>
                  <div className="sec-body prediction-settings-stack">
                    <div className="input-group-field toggle-control-row">
                      <div className="lbl-stacked">
                        <label>Show Contributing Factors</label>
                        <span>Display factors influencing predictions</span>
                      </div>
                      <label className="sett-toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="sett-slider"></span>
                      </label>
                    </div>

                    <div className="input-group-field toggle-control-row">
                      <div className="lbl-stacked">
                        <label>Enable AI Recommendations</label>
                        <span>Get AI-powered action recommendations</span>
                      </div>
                      <label className="sett-toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="sett-slider"></span>
                      </label>
                    </div>

                    <div className="input-group-field toggle-control-row">
                      <div className="lbl-stacked">
                        <label>Enable Anomaly Detection</label>
                        <span>Detect unusual patterns and anomalies</span>
                      </div>
                      <label className="sett-toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="sett-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Factor Radar */}
              <div className="settings-section-card card">
                <div className="sec-header">
                  <h3>Risk Factor Radar</h3>
                  <p>AI analysis of key contributing factors</p>
                </div>
                <div className="sec-body radar-factors-body">
                  <div className="radar-graphic-wrap" style={{ width: '280px', height: '240px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid stroke="#E5E7EB" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B7280', fontSize: 10 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#6B7280', fontSize: 8 }} />
                        <Radar name="Factors Weight" dataKey="A" stroke="#10B981" fill="#10B981" fillOpacity={0.4} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="radar-legend-column">
                    <div className="radar-leg-item">
                      <span className="lbl font-bold"><Thermometer size={16} /> Temperature</span>
                      <span className="val text-green">85% Very High</span>
                    </div>
                    <div className="radar-leg-item">
                      <span className="lbl font-bold"><Droplet size={16} /> Humidity</span>
                      <span className="val text-green">72% High</span>
                    </div>
                    <div className="radar-leg-item">
                      <span className="lbl font-bold"><CloudRain size={16} /> Precipitation</span>
                      <span className="val text-orange">68% Medium</span>
                    </div>
                    <div className="radar-leg-item">
                      <span className="lbl font-bold"><Users size={16} /> Population Density</span>
                      <span className="val text-green">78% High</span>
                    </div>
                    <div className="radar-leg-item">
                      <span className="lbl font-bold"><Bug size={16} /> Vector Presence</span>
                      <span className="val text-green">91% Very High</span>
                    </div>
                    <div className="radar-leg-item">
                      <span className="lbl font-bold"><Calendar size={16} /> Historical Patterns</span>
                      <span className="val text-green">83% Very High</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pane-right-col">
              {/* AI Confidence Meter */}
              <div className="settings-section-card card">
                <div className="sec-header">
                  <h3>AI Confidence Meter</h3>
                  <p>Current model confidence overview</p>
                </div>
                <div className="sec-body live-preview-body">
                  <div className="premium-gauge-container">
                    <div className="premium-ring-wrapper">
                      <svg className="premium-ring-svg" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="#ECFDF5" strokeWidth="8" />
                        <filter id="glowGreen">
                          <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                          <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                        <circle cx="50" cy="50" r="42" fill="none" stroke="#10B981" strokeWidth="8" strokeLinecap="round" 
                                strokeDasharray="263.89" strokeDashoffset={263.89 * (1 - 0.82)} 
                                filter="url(#glowGreen)" transform="rotate(-90 50 50)" className="premium-ring-anim" />
                      </svg>
                      <div className="premium-gauge-center">
                        <span className="premium-gauge-value text-green">82%</span>
                        <span className="premium-gauge-label">Confidence</span>
                      </div>
                    </div>
                    <div className="premium-gauge-footer">
                      <span className="premium-gauge-status bg-green-light text-green">High Confidence Mode</span>
                    </div>
                  </div>

                  <div className="premium-breakdown-list">
                    <div className="premium-breakdown-item">
                      <div className="br-info">
                        <span className="br-name"><Bot size={14} /> Model Accuracy</span>
                        <span className="br-val text-green">87%</span>
                      </div>
                      <div className="br-bar-track"><div className="br-bar-fill bg-green" style={{width: '87%'}}></div></div>
                    </div>
                    <div className="premium-breakdown-item">
                      <div className="br-info">
                        <span className="br-name"><BarChart size={14} /> Data Reliability</span>
                        <span className="br-val text-green">81%</span>
                      </div>
                      <div className="br-bar-track"><div className="br-bar-fill bg-green" style={{width: '81%'}}></div></div>
                    </div>
                    <div className="premium-breakdown-item">
                      <div className="br-info">
                        <span className="br-name"><Puzzle size={14} /> Pattern Strength</span>
                        <span className="br-val text-green">79%</span>
                      </div>
                      <div className="br-bar-track"><div className="br-bar-fill bg-green" style={{width: '79%'}}></div></div>
                    </div>
                    <div className="premium-breakdown-item">
                      <div className="br-info">
                        <span className="br-name"><Sparkles size={14} /> Prediction Stability</span>
                        <span className="br-val text-green">85%</span>
                      </div>
                      <div className="br-bar-track"><div className="br-bar-fill bg-green" style={{width: '85%'}}></div></div>
                    </div>
                  </div>

                  <div className="sensitivity-tip-banner" style={{ marginTop: '1rem', background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1E40AF' }}>
                    <Info size={14} />
                    <span>High confidence indicates reliable predictions and strong data quality.</span>
                  </div>
                </div>
              </div>

              {/* Model Learning */}
              <div className="settings-section-card card">
                <div className="sec-header">
                  <h3>Model Learning</h3>
                  <p>Manage AI model training and learning behavior</p>
                </div>
                <div className="sec-body behavior-fields-stack">
                  <div className="input-group-field toggle-control-row">
                    <div className="lbl-stacked">
                      <label>Auto Retrain</label>
                      <span>Automatically retrain model with new data</span>
                    </div>
                    <label className="sett-toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="sett-slider"></span>
                    </label>
                  </div>

                  <div className="input-group-field">
                    <label>Retraining Frequency</label>
                    <select className="sett-input select">
                      <option>Weekly</option>
                      <option>Monthly</option>
                    </select>
                  </div>

                  <div className="backup-meta-list" style={{ marginTop: '0.5rem' }}>
                    <div className="meta-row">
                      <span>Dataset Size:</span>
                      <strong>128,540 Records</strong>
                    </div>
                    <div className="meta-row">
                      <span>Last Training Date:</span>
                      <strong>May 22, 2025 02:30 AM</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sensitivity Sliders */}
              <div className="settings-section-card card">
                <div className="sec-header">
                  <h3>Sensitivity Sliders</h3>
                  <p>Fine-tune individual detection parameters</p>
                </div>
                <div className="sec-body vertical-sliders-stack">
                  <div className="range-slider-row">
                    <div className="slider-label-row">
                      <span className="disease-lbl-tag">Disease Pattern Sensitivity</span>
                      <span className="slider-pct-tag text-green">75% High</span>
                    </div>
                    <div className="slider-track-wrap">
                      <input type="range" min="0" max="100" defaultValue="75" className="range-slider-input range-green" />
                    </div>
                  </div>

                  <div className="range-slider-row">
                    <div className="slider-label-row">
                      <span className="disease-lbl-tag">Environmental Sensitivity</span>
                      <span className="slider-pct-tag text-orange">65% Medium</span>
                    </div>
                    <div className="slider-track-wrap">
                      <input type="range" min="0" max="100" defaultValue="65" className="range-slider-input range-orange" />
                    </div>
                  </div>

                  <div className="range-slider-row">
                    <div className="slider-label-row">
                      <span className="disease-lbl-tag">Population Impact Weight</span>
                      <span className="slider-pct-tag text-green">80% High</span>
                    </div>
                    <div className="slider-track-wrap">
                      <input type="range" min="0" max="100" defaultValue="80" className="range-slider-input range-green" />
                    </div>
                  </div>

                  <div className="range-slider-row">
                    <div className="slider-label-row">
                      <span className="disease-lbl-tag">Temporal Sensitivity</span>
                      <span className="slider-pct-tag text-orange">60% Medium</span>
                    </div>
                    <div className="slider-track-wrap">
                      <input type="range" min="0" max="100" defaultValue="60" className="range-slider-input range-orange" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Prediction Simulation Preview */}
              <div className="settings-section-card card">
                <div className="sec-header">
                  <h3>Prediction Simulation Preview</h3>
                  <p>See how different sensitivity settings affect predictions</p>
                </div>
                <div className="sec-body sim-preview-body">
                  <div className="sim-stats-row">
                    <div className="sim-stat">
                      <span className="sim-lbl">Current Setting (Balanced)</span>
                      <span className="sim-val">72%</span>
                      <span className="sim-status text-orange">Risk Score (Moderate Risk)</span>
                    </div>
                  </div>
                  <div className="sim-chart-wrap" style={{ height: '140px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={simData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 9 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 9 }} />
                        <Tooltip />
                        <Line type="monotone" name="Historical Data" dataKey="historical" stroke="#9CA3AF" strokeWidth={2} dot={false} />
                        <Line type="monotone" name="Current Prediction" dataKey="current" stroke="#10B981" strokeWidth={2} dot={false} />
                        <Line type="dashed" name="High Sensitivity" dataKey="high" stroke="#EF4444" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                        <Line type="dashed" name="Low Sensitivity" dataKey="low" stroke="#3B82F6" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <button className="btn-sett-outline w-full mt-2" onClick={handleRunSimulation} disabled={isSimulating}><Play size={12} /> {isSimulating ? "Running..." : "Run Simulation"}</button>
                </div>
              </div>
            </div>

            <div className="bottom-save-sticky-bar w-full span-two-cols">
              <div className="sensitivity-tip-banner" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1E40AF', flex: 1, margin: 0 }}>
                <Info size={14} />
                <span>AI sensitivity settings directly impact alert frequency and prediction accuracy. Monitor performance and adjust settings based on your operational needs.</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 6: SECURITY & ACCESS
            ======================================================== */}
        {activeTab === 'security' && (
          <div className="tab-pane-content pane-security two-cols-layout">
            <div className="pane-left-col">
              {/* Authentication Settings */}
              <div className="settings-section-card card">
                <div className="sec-header">
                  <h3>Authentication Settings</h3>
                  <p>Configure password policies, sessions, and multi-factor authentication</p>
                </div>
                <div className="sec-body behavior-fields-stack">
                  <div className="input-group-field toggle-control-row">
                    <div className="toggle-info-lbl">
                      <span className="pref-icon-wrap" style={{ background: '#EFF6FF', color: '#2563EB' }}><Fingerprint size={16} /></span>
                      <div className="lbl-texts">
                        <span className="font-bold">Two-Factor Authentication (2FA)</span>
                        <span>Require a verification code in addition to password</span>
                      </div>
                    </div>
                    <label className="sett-toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="sett-slider"></span>
                    </label>
                  </div>

                  <div className="input-group-field toggle-control-row">
                    <div className="toggle-info-lbl">
                      <span className="pref-icon-wrap" style={{ background: '#F5F3FF', color: '#8B5CF6' }}><Lock size={16} /></span>
                      <div className="lbl-texts">
                        <span className="font-bold">Enforce Strong Passwords</span>
                        <span>Require minimum 8 characters, 1 uppercase, 1 symbol</span>
                      </div>
                    </div>
                    <label className="sett-toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="sett-slider"></span>
                    </label>
                  </div>

                  <div className="input-group-field toggle-control-row">
                    <div className="toggle-info-lbl">
                      <span className="pref-icon-wrap" style={{ background: '#FFF7ED', color: '#F97316' }}><Clock size={16} /></span>
                      <div className="lbl-texts">
                        <span className="font-bold">Auto Session Timeout</span>
                        <span>Automatically log out idle sessions</span>
                      </div>
                    </div>
                    <label className="sett-toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="sett-slider"></span>
                    </label>
                  </div>

                  <div className="input-group-field toggle-control-row">
                    <div className="toggle-info-lbl">
                      <span className="pref-icon-wrap" style={{ background: '#ECFDF5', color: '#10B981' }}><ShieldCheck size={16} /></span>
                      <div className="lbl-texts">
                        <span className="font-bold">Login Notifications</span>
                        <span>Notify admins of new login attempts</span>
                      </div>
                    </div>
                    <label className="sett-toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="sett-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Session Management */}
              <div className="grid-two-cols-split">
                <div className="settings-section-card card">
                  <div className="sec-header">
                    <h3>Session Management</h3>
                    <p>Configure session behavior</p>
                  </div>
                  <div className="sec-body behavior-fields-stack">
                    <div className="input-group-field">
                      <label>Session Timeout</label>
                      <select className="sett-input select">
                        <option>30 Minutes</option>
                        <option>1 Hour</option>
                        <option>4 Hours</option>
                      </select>
                    </div>
                    <div className="input-group-field">
                      <label>Max Concurrent Sessions</label>
                      <select className="sett-input select">
                        <option>3 Sessions</option>
                        <option>5 Sessions</option>
                        <option>Unlimited</option>
                      </select>
                    </div>
                    <div className="input-group-field">
                      <label>Password Expiry</label>
                      <select className="sett-input select">
                        <option>90 Days</option>
                        <option>180 Days</option>
                        <option>Never</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="settings-section-card card">
                  <div className="sec-header">
                    <h3>IP Restrictions</h3>
                    <p>Restrict access by IP address</p>
                  </div>
                  <div className="sec-body behavior-fields-stack">
                    <div className="input-group-field toggle-control-row">
                      <div className="lbl-stacked">
                        <label>Enable IP Whitelist</label>
                        <span>Only allow listed IP addresses</span>
                      </div>
                      <label className="sett-toggle-switch">
                        <input type="checkbox" />
                        <span className="sett-slider"></span>
                      </label>
                    </div>
                    <div className="input-group-field">
                      <label>Allowed IP Ranges</label>
                      <input type="text" defaultValue="192.168.1.0/24" className="sett-input" />
                    </div>
                    <div className="input-group-field">
                      <label>Max Failed Login Attempts</label>
                      <select className="sett-input select">
                        <option>5 Attempts</option>
                        <option>10 Attempts</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Audit Log */}
              <div className="settings-section-card card">
                <div className="sec-header">
                  <h3>Recent Security Activity</h3>
                  <p>Latest security events and login attempts</p>
                </div>
                <div className="sec-body recent-notification-activity-list">
                  <div className="act-row">
                    <div className="act-icon-dot green"></div>
                    <div className="act-texts">
                      <span className="font-bold">Admin Login Successful</span>
                      <span>May 23, 2025 08:30 AM · IP: 192.168.1.45</span>
                    </div>
                    <span className="text-green text-xs font-bold">Success</span>
                  </div>
                  <div className="act-row">
                    <div className="act-icon-dot green"></div>
                    <div className="act-texts">
                      <span className="font-bold">Password Policy Updated</span>
                      <span>May 22, 2025 03:15 PM · By: Admin User</span>
                    </div>
                    <span className="text-green text-xs font-bold">Success</span>
                  </div>
                  <div className="act-row">
                    <div className="act-icon-dot" style={{background: '#EF4444'}}></div>
                    <div className="act-texts">
                      <span className="font-bold">Failed Login Attempt</span>
                      <span>May 22, 2025 11:42 AM · IP: 10.0.0.231</span>
                    </div>
                    <span className="text-red text-xs font-bold">Failed</span>
                  </div>
                  <div className="act-row">
                    <div className="act-icon-dot green"></div>
                    <div className="act-texts">
                      <span className="font-bold">2FA Enabled for User</span>
                      <span>May 21, 2025 09:00 AM · User: Dr. Mensah</span>
                    </div>
                    <span className="text-green text-xs font-bold">Success</span>
                  </div>
                </div>
                <div className="sec-footer-actions-row center">
                  <a href="#" className="perm-footer-action">View Full Audit Log</a>
                </div>
              </div>
            </div>

            <div className="pane-right-col">
              {/* Security Overview */}
              <div className="settings-section-card card">
                <div className="sec-header">
                  <h3>Security Overview</h3>
                  <p>Current security posture</p>
                </div>
                <div className="sec-body live-preview-body">
                  <div className="premium-gauge-container">
                    <div className="premium-ring-wrapper">
                      <svg className="premium-ring-svg" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="#EFF6FF" strokeWidth="8" />
                        <filter id="glowBlue">
                          <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                          <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                        <circle cx="50" cy="50" r="42" fill="none" stroke="#3B82F6" strokeWidth="8" strokeLinecap="round" 
                                strokeDasharray="263.89" strokeDashoffset={263.89 * (1 - 0.92)} 
                                filter="url(#glowBlue)" transform="rotate(-90 50 50)" className="premium-ring-anim" />
                      </svg>
                      <div className="premium-gauge-center">
                        <span className="premium-gauge-value text-blue">92%</span>
                        <span className="premium-gauge-label">Secured</span>
                      </div>
                    </div>
                    <div className="premium-gauge-footer">
                      <span className="premium-gauge-status bg-blue-light text-blue">Strong Posture</span>
                    </div>
                  </div>

                  <div className="premium-breakdown-list">
                    <div className="premium-breakdown-item">
                      <div className="br-info">
                        <span className="br-name"><Lock size={14} /> 2FA Status</span>
                        <span className="br-val text-blue">Enabled</span>
                      </div>
                      <div className="br-bar-track"><div className="br-bar-fill bg-blue" style={{width: '100%'}}></div></div>
                    </div>
                    <div className="premium-breakdown-item">
                      <div className="br-info">
                        <span className="br-name"><Key size={14} /> Password Strength</span>
                        <span className="br-val text-blue">Strong</span>
                      </div>
                      <div className="br-bar-track"><div className="br-bar-fill bg-blue" style={{width: '90%'}}></div></div>
                    </div>
                    <div className="premium-breakdown-item">
                      <div className="br-info">
                        <span className="br-name"><Globe size={14} /> SSL Certificate</span>
                        <span className="br-val text-blue">Valid</span>
                      </div>
                      <div className="br-bar-track"><div className="br-bar-fill bg-blue" style={{width: '100%'}}></div></div>
                    </div>
                    <div className="premium-breakdown-item">
                      <div className="br-info">
                        <span className="br-name"><Shield size={14} /> Firewall</span>
                        <span className="br-val text-blue">Active</span>
                      </div>
                      <div className="br-bar-track"><div className="br-bar-fill bg-blue" style={{width: '100%'}}></div></div>
                    </div>
                  </div>

                  <span className="last-updated-tag">Last security audit: May 22, 2025 09:30 AM ↻</span>
                </div>
              </div>

              {/* Active Sessions */}
              <div className="settings-section-card card">
                <div className="sec-header">
                  <h3>Active Sessions</h3>
                  <p>Currently logged in users</p>
                </div>
                <div className="sec-body recipient-list-controls">
                  <div className="recipient-row">
                    <span className="rec-icon blue"><Monitor size={14} /></span>
                    <div className="rec-info-texts">
                      <span className="font-bold">Admin User · Chrome on Windows</span>
                      <span>192.168.1.45 · Current session</span>
                    </div>
                    <span className="badge-green-filled">Active</span>
                  </div>
                  <div className="recipient-row">
                    <span className="rec-icon purple"><Smartphone size={14} /></span>
                    <div className="rec-info-texts">
                      <span className="font-bold">Dr. Mensah · Mobile App</span>
                      <span>10.0.0.82 · Last active 15 min ago</span>
                    </div>
                    <span className="badge-green-filled">Active</span>
                  </div>
                  <div className="recipient-row">
                    <span className="rec-icon orange"><Globe size={14} /></span>
                    <div className="rec-info-texts">
                      <span className="font-bold">Health Officer · Firefox on Mac</span>
                      <span>10.0.0.144 · Last active 2 hrs ago</span>
                    </div>
                    <span className="badge-yellow-filled">Idle</span>
                  </div>
                </div>
                <div className="footer-save-box" style={{padding: '1rem 1.5rem'}}>
                  <button className="btn-wide-outline" style={{width: '100%'}}><Lock size={14} /> Revoke All Other Sessions</button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="settings-section-card card">
                <div className="sec-header">
                  <h3>Security Actions</h3>
                  <p>Quick security management</p>
                </div>
                <div className="sec-body vertical-buttons-stack">
                  <button className="btn-wide-outline"><RefreshCw size={14} /> Force Password Reset (All Users)</button>
                  <button className="btn-wide-outline"><Activity size={14} /> Run Security Audit</button>
                  <button className="btn-wide-outline"><FileText size={14} /> Export Security Report</button>
                </div>
                <div className="footer-save-box" style={{padding: '1rem 1.5rem'}}>
                  <button className="btn-primary-save w-full"><Save size={14} /> Save Security Settings</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 7: SYSTEM PREFERENCES
            ======================================================== */}
        {activeTab === 'preferences' && (
          <div className="tab-pane-content pane-system-preferences grid-three-cols-stretch">
            {/* 1. General Settings */}
            <div className="settings-section-card card">
              <div className="sec-header">
                <h3>General Settings</h3>
                <p>Configure general system preferences</p>
              </div>
              <div className="sec-body behavior-fields-stack">
                <div className="input-group-field">
                  <label>System Language</label>
                  <select className="sett-input select">
                    <option>English (US)</option>
                    <option>French (FR)</option>
                  </select>
                </div>

                <div className="input-group-field">
                  <label>Time Zone</label>
                  <select className="sett-input select">
                    <option>(UTC+01:00) West Africa Time</option>
                    <option>(UTC+00:00) Greenwich Mean Time</option>
                  </select>
                </div>

                <div className="input-group-field">
                  <label>Date Format</label>
                  <select className="sett-input select">
                    <option>May 23, 2025 (MMM DD, YYYY)</option>
                    <option>23/05/2025 (DD/MM/YYYY)</option>
                  </select>
                </div>

                <div className="input-group-field">
                  <label>Time Format</label>
                  <div className="format-pills-row">
                    <button className="format-pill active">12 Hour</button>
                    <button className="format-pill">24 Hour</button>
                  </div>
                </div>

                <div className="input-group-field">
                  <label>Theme Mode</label>
                  <div className="format-pills-row">
                    <button className="format-pill active">Light</button>
                    <button className="format-pill">Dark</button>
                    <button className="format-pill">Auto</button>
                  </div>
                </div>

                <div className="input-group-field">
                  <label>System Currency</label>
                  <select className="sett-input select">
                    <option>USD - US Dollar</option>
                    <option>GHS - Ghana Cedi</option>
                  </select>
                </div>

                <div className="input-group-field">
                  <label>Units System</label>
                  <select className="sett-input select">
                    <option>Metric (°C, mm, km)</option>
                    <option>Imperial (°F, inches, miles)</option>
                  </select>
                </div>
              </div>
              <div className="sec-footer-actions-row">
                <span className="text-xxs text-gray-500">Changes to general settings are applied immediately across the system.</span>
              </div>
            </div>

            {/* 2. Dashboard Preferences */}
            <div className="settings-section-card card">
              <div className="sec-header">
                <h3>Dashboard Preferences</h3>
                <p>Customize your dashboard experience</p>
              </div>
              <div className="sec-body behavior-fields-stack">
                <div className="input-group-field">
                  <label>Default Landing Page</label>
                  <select className="sett-input select">
                    <option>Dashboard Overview</option>
                    <option>AI Predictions</option>
                    <option>Risk Map</option>
                  </select>
                </div>

                <div className="input-group-field">
                  <label>Refresh Interval</label>
                  <select className="sett-input select">
                    <option>5 Minutes</option>
                    <option>15 Minutes</option>
                  </select>
                </div>

                <div className="input-group-field">
                  <label>Default Map Region</label>
                  <select className="sett-input select">
                    <option>Volta Region</option>
                    <option>Ashanti Region</option>
                  </select>
                </div>

                <div className="input-group-field">
                  <label>Widgets Layout</label>
                  <div className="layout-widgets-options">
                    <button className="layout-opt active" title="Grid View">Grid</button>
                    <button className="layout-opt" title="List View">List</button>
                    <button className="layout-opt" title="Compact View">Compact</button>
                  </div>
                </div>

                <div className="input-group-field toggle-control-row">
                  <div className="lbl-stacked">
                    <label>Show System Status</label>
                    <span>Display system status in dashboard</span>
                  </div>
                  <label className="sett-toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="sett-slider"></span>
                  </label>
                </div>

                <div className="input-group-field toggle-control-row">
                  <div className="lbl-stacked">
                    <label>Show Announcements</label>
                    <span>Display system announcements</span>
                  </div>
                  <label className="sett-toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="sett-slider"></span>
                  </label>
                </div>

                <div className="input-group-field toggle-control-row">
                  <div className="lbl-stacked">
                    <label>Compact Mode</label>
                    <span>Use compact layout for more content</span>
                  </div>
                  <label className="sett-toggle-switch">
                    <input type="checkbox" />
                    <span className="sett-slider"></span>
                  </label>
                </div>
              </div>
              <div className="sec-footer-actions-row">
                <span className="text-xxs text-gray-500">Dashboard preference changes are saved automatically.</span>
              </div>
            </div>

            {/* 3. Storage & Performance */}
            <div className="settings-section-card card">
              <div className="sec-header">
                <h3>Storage & Performance</h3>
                <p>Optimize system performance and storage</p>
              </div>
              <div className="sec-body behavior-fields-stack">
                <div className="input-group-field">
                  <label>Cache Size</label>
                  <select className="sett-input select">
                    <option>512 MB</option>
                    <option>1 GB</option>
                  </select>
                </div>

                <div className="input-group-field toggle-control-row">
                  <div className="lbl-stacked">
                    <label>Enable Compression</label>
                    <span>Compress data for storage efficiency</span>
                  </div>
                  <label className="sett-toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="sett-slider"></span>
                  </label>
                </div>

                <div className="input-group-field">
                  <label>Performance Mode</label>
                  <div className="format-pills-row">
                    <button className="format-pill active">Balanced</button>
                    <button className="format-pill">Performance</button>
                    <button className="format-pill">Efficiency</button>
                  </div>
                </div>

                <div className="input-group-field">
                  <label>Data Retention</label>
                  <select className="sett-input select">
                    <option>5 Years</option>
                    <option>10 Years</option>
                  </select>
                </div>

                <div className="input-group-field">
                  <label>Log Retention</label>
                  <select className="sett-input select">
                    <option>1 Year</option>
                    <option>2 Years</option>
                  </select>
                </div>

                <div className="input-group-field">
                  <label>Cleanup Frequency</label>
                  <select className="sett-input select">
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>

                <div className="input-group-field toggle-control-row">
                  <div className="lbl-stacked">
                    <label>Database Optimization</label>
                    <span>Optimize database performance</span>
                  </div>
                  <button className="btn-sett-outline sm">Optimize Now</button>
                </div>
              </div>
              <div className="sec-footer-actions-row">
                <span className="text-xxs text-gray-500">Performance changes may require system restart to take effect.</span>
              </div>
            </div>

            {/* Bottom System Information */}
            <div className="system-info-full-bar card span-three-cols">
              <h4 className="info-bar-title">System Information</h4>
              <div className="info-meta-chips-grid">
                <div className="chip">
                  <span className="chip-lbl">System Version</span>
                  <strong>v2.4.1</strong>
                </div>
                <div className="chip">
                  <span className="chip-lbl">Environment</span>
                  <strong>Production</strong>
                </div>
                <div className="chip">
                  <span className="chip-lbl">Server Region</span>
                  <strong>West Africa</strong>
                </div>
                <div className="chip">
                  <span className="chip-lbl">Database</span>
                  <strong>PostgreSQL 14</strong>
                </div>
                <div className="chip">
                  <span className="chip-lbl">Last Updated</span>
                  <strong>May 23, 2025 08:30 AM</strong>
                </div>
                <button className="btn-sett-outline"><DownloadCloud size={14} /> Export Configuration</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

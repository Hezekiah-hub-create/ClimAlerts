import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Database, CloudUpload, RefreshCw, Clock, Upload,
  Link2, CalendarClock, CheckCircle2, AlertTriangle,
  XCircle, FileSpreadsheet, Maximize2, ChevronRight,
  Server, FileText, Wifi
} from 'lucide-react';
import './DataSources.css';

// ---------- MOCK DATA ----------

const syncLogs = [
  { file: 'malaria_cases_volta_region.csv', type: 'CSV Upload', records: '12,456 records', date: 'May 23, 2025 08:30 AM', status: 'success' },
  { file: 'weather_data_ghana.csv', type: 'CSV Upload', records: '45,782 records', date: 'May 23, 2025 07:45 AM', status: 'success' },
  { file: 'health_facilities.json', type: 'API Sync', records: '1,247 records', date: 'May 23, 2025 06:30 AM', status: 'success' },
  { file: 'population_data.csv', type: 'CSV Upload', records: '8,684 records', date: 'May 23, 2025 05:15 AM', status: 'partial' },
  { file: 'invalid_data_upload.csv', type: 'CSV Upload', records: '0 records', date: 'May 23, 2025 11:20 PM', status: 'failed' },
];

const previewData = [
  { date: 'May 23, 2025', region: 'Volta', district: 'Ho Municipal', cases: 124, deaths: 2, rainfall: 45.6, temp: 28.3, humidity: 82 },
  { date: 'May 23, 2025', region: 'Volta', district: 'Keta', cases: 98, deaths: 1, rainfall: 32.1, temp: 27.8, humidity: 79 },
  { date: 'May 23, 2025', region: 'Volta', district: 'Sogakope', cases: 76, deaths: 0, rainfall: 28.9, temp: 29.1, humidity: 85 },
  { date: 'May 23, 2025', region: 'Volta', district: 'Afadzato South', cases: 64, deaths: 1, rainfall: 67.3, temp: 26.7, humidity: 88 },
  { date: 'May 23, 2025', region: 'Volta', district: 'North Tongu', cases: 112, deaths: 2, rainfall: 52.4, temp: 27.2, humidity: 83 },
];

const anomalies = [
  { title: 'Abnormally high cases detected in Keta District', source: 'malaria_cases_volta_region.csv', date: 'May 23, 2025 08:15 AM', severity: 'high' },
  { title: 'Missing rainfall data in 3 districts', source: 'weather_data_ghana.csv', date: 'May 23, 2025 07:30 AM', severity: 'medium' },
  { title: 'Temperature spike detected in Afadzato South', source: 'weather_data_ghana.csv', date: 'May 23, 2025 06:45 AM', severity: 'low' },
];

const dataSources = [
  { name: 'malaria_cases_volta_region.csv', type: 'CSV Upload', records: '12,456', lastSync: 'May 23, 2025', icon: FileSpreadsheet, color: '#10B981', bg: '#ECFDF5' },
  { name: 'weather_data_ghana.csv', type: 'CSV Upload', records: '45,782', lastSync: 'May 23, 2025', icon: FileSpreadsheet, color: '#3B82F6', bg: '#EFF6FF' },
  { name: 'health_facilities.json', type: 'API Sync', records: '1,247', lastSync: 'May 23, 2025', icon: Server, color: '#8B5CF6', bg: '#F5F3FF' },
  { name: 'population_data.csv', type: 'CSV Upload', records: '8,684', lastSync: 'May 23, 2025', icon: FileText, color: '#F59E0B', bg: '#FFFBEB' },
];

// ---------- COMPONENT ----------

export const DataSources = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = () => {
    setIsUploading(true);
    const loadingId = toast.loading('Uploading and validating data...');
    setTimeout(() => {
      setIsUploading(false);
      toast.success('Data uploaded successfully!', { id: loadingId });
    }, 2000);
  };

  const tabs = [
    { key: 'upload', label: 'Upload Data' },
    { key: 'api', label: 'API Connections' },
    { key: 'sources', label: 'Data Sources' },
  ];

  return (
    <div className="datasources-container">

      {/* ===== TOP METRICS ===== */}
      <div className="ds-metrics-grid">
        <div className="ds-metric-card">
          <div className="ds-metric-icon" style={{ color: '#3B82F6', backgroundColor: '#EFF6FF' }}>
            <Database size={22} />
          </div>
          <div className="ds-metric-body">
            <span className="ds-metric-label">Total Data Sources</span>
            <span className="ds-metric-value">8</span>
            <span className="ds-metric-sub success">2 Active</span>
          </div>
        </div>

        <div className="ds-metric-card">
          <div className="ds-metric-icon" style={{ color: '#8B5CF6', backgroundColor: '#F5F3FF' }}>
            <RefreshCw size={22} />
          </div>
          <div className="ds-metric-body">
            <span className="ds-metric-label">Last Sync</span>
            <span className="ds-metric-value" style={{ fontSize: '0.95rem' }}>May 23, 2025</span>
            <span className="ds-metric-sub success">
              <CheckCircle2 size={11} /> Completed successfully
            </span>
          </div>
        </div>

        <div className="ds-metric-card">
          <div className="ds-metric-icon" style={{ color: '#10B981', backgroundColor: '#ECFDF5' }}>
            <FileSpreadsheet size={22} />
          </div>
          <div className="ds-metric-body">
            <span className="ds-metric-label">Total Records</span>
            <span className="ds-metric-value">1,248,580</span>
            <span className="ds-metric-sub neutral">Across all sources</span>
          </div>
        </div>

        <div className="ds-metric-card">
          <div className="ds-metric-icon" style={{ color: '#F59E0B', backgroundColor: '#FFFBEB' }}>
            <AlertTriangle size={22} />
          </div>
          <div className="ds-metric-body">
            <span className="ds-metric-label">Anomalies Detected</span>
            <span className="ds-metric-value">23</span>
            <span className="ds-metric-sub warning">Across 4 datasets</span>
          </div>
        </div>

        <div className="ds-metric-card">
          <div className="ds-metric-icon" style={{ color: '#10B981', backgroundColor: '#ECFDF5' }}>
            <CheckCircle2 size={22} />
          </div>
          <div className="ds-metric-body">
            <span className="ds-metric-label">Data Quality Score</span>
            <span className="ds-metric-value">98.2%</span>
            <span className="ds-metric-sub excellent">Excellent</span>
          </div>
        </div>
      </div>

      {/* ===== MAIN TWO-COL GRID ===== */}
      <div className="ds-main-grid">

        {/* ===== LEFT COLUMN ===== */}
        <div className="ds-left-column">

          {/* --- Tabs --- */}
          <div>
            <div className="ds-tabs">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  className={`ds-tab ${activeTab === tab.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Panel */}
            <div className="ds-tab-panel">
              {activeTab === 'upload' && (
                <div className="ds-upload-options">
                  <div className="ds-upload-card">
                    <div className="ds-upload-icon">
                      <Upload size={28} />
                    </div>
                    <h4>Upload CSV File</h4>
                    <p>Drag & drop your CSV file here or</p>
                    <button className="ds-btn-outline" onClick={handleUpload} disabled={isUploading}>
                      {isUploading ? 'Uploading...' : 'Browse Files'}
                    </button>
                    <span className="ds-upload-note">Max file size: 50MB</span>
                  </div>

                  <div className="ds-upload-card">
                    <div className="ds-upload-icon">
                      <Link2 size={28} />
                    </div>
                    <h4>API Data Sync</h4>
                    <p>Connect and fetch data from API</p>
                    <button className="ds-btn-outline">Configure API</button>
                  </div>

                  <div className="ds-upload-card">
                    <div className="ds-upload-icon">
                      <CalendarClock size={28} />
                    </div>
                    <h4>Scheduled Sync</h4>
                    <p>Automate data sync at regular intervals</p>
                    <button className="ds-btn-outline">Setup Schedule</button>
                  </div>
                </div>
              )}

              {activeTab === 'api' && (
                <div className="ds-api-empty">
                  <div className="ds-api-empty-icon">
                    <Wifi size={24} />
                  </div>
                  <h4>No API Connections Configured</h4>
                  <p>Connect external APIs to automatically sync climate and health data from trusted sources.</p>
                  <button className="ds-btn-outline">+ Add API Connection</button>
                </div>
              )}

              {activeTab === 'sources' && (
                <div className="ds-sources-list">
                  {dataSources.map((src, i) => (
                    <div className="ds-source-item" key={i}>
                      <div className="ds-source-icon" style={{ color: src.color, background: src.bg }}>
                        <src.icon size={18} />
                      </div>
                      <div className="ds-source-info">
                        <div className="ds-source-name">{src.name}</div>
                        <div className="ds-source-type">{src.type}</div>
                      </div>
                      <div className="ds-source-stats">
                        <div className="ds-source-stat">
                          <span className="ds-source-stat-value">{src.records}</span>
                          <span className="ds-source-stat-label">Records</span>
                        </div>
                        <div className="ds-source-stat">
                          <span className="ds-source-stat-value">{src.lastSync}</span>
                          <span className="ds-source-stat-label">Last Sync</span>
                        </div>
                        <ChevronRight size={16} color="#9CA3AF" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* --- Data Preview --- */}
          <div className="ds-data-preview">
            <div className="ds-preview-header">
              <div className="ds-preview-header-left">
                <div className="ds-preview-file-icon">
                  <FileSpreadsheet size={18} />
                  <span className="ds-preview-filename">malaria_cases_volta_region.csv</span>
                </div>
                <span className="ds-preview-badge">Validated</span>
              </div>
              <div className="ds-preview-header-right">
                <span className="ds-preview-info">Previewing first 100 of 12,456 rows</span>
                <div className="ds-preview-actions">
                  <span className="ds-preview-link">View Full Data</span>
                  <button className="ds-icon-btn" title="Fullscreen">
                    <Maximize2 size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Preview subtitle */}
            <div style={{ padding: '0.85rem 1.5rem 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Data Preview</h3>
            </div>

            <div className="ds-table-container">
              <table className="ds-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Region</th>
                    <th>District</th>
                    <th>Cases</th>
                    <th>Deaths</th>
                    <th>Rainfall (mm)</th>
                    <th>Temperature (°C)</th>
                    <th>Humidity (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, i) => (
                    <tr key={i}>
                      <td>{row.date}</td>
                      <td>{row.region}</td>
                      <td>{row.district}</td>
                      <td>{row.cases}</td>
                      <td>{row.deaths}</td>
                      <td>{row.rainfall}</td>
                      <td>{row.temp}</td>
                      <td>{row.humidity}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="ellipsis">···</td>
                    <td className="ellipsis">···</td>
                    <td className="ellipsis">···</td>
                    <td className="ellipsis">···</td>
                    <td className="ellipsis">···</td>
                    <td className="ellipsis">···</td>
                    <td className="ellipsis">···</td>
                    <td className="ellipsis">···</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Validation Summary */}
            <div className="ds-validation-section">
              <h3 className="ds-validation-title">Validation Summary</h3>
              <div className="ds-validation-grid">
                <div className="ds-val-stat">
                  <span className="ds-val-stat-label">Total Rows</span>
                  <div className="ds-val-stat-row">
                    <span className="ds-val-stat-value">12,456</span>
                    <span className="ds-val-stat-pct muted">100%</span>
                  </div>
                </div>
                <div className="ds-val-stat">
                  <span className="ds-val-stat-label">Valid Rows</span>
                  <div className="ds-val-stat-row">
                    <span className="ds-val-stat-value">12,233</span>
                    <span className="ds-val-stat-pct green">98.2%</span>
                  </div>
                </div>
                <div className="ds-val-stat">
                  <span className="ds-val-stat-label">Invalid Rows</span>
                  <div className="ds-val-stat-row">
                    <span className="ds-val-stat-value">223</span>
                    <span className="ds-val-stat-pct red">1.8%</span>
                  </div>
                </div>
                <div className="ds-val-stat">
                  <span className="ds-val-stat-label">Missing Values</span>
                  <div className="ds-val-stat-row">
                    <span className="ds-val-stat-value">456</span>
                    <span className="ds-val-stat-pct yellow">3.7%</span>
                  </div>
                </div>
                <div className="ds-val-stat">
                  <span className="ds-val-stat-label">Duplicates</span>
                  <div className="ds-val-stat-row">
                    <span className="ds-val-stat-value">34</span>
                    <span className="ds-val-stat-pct muted">0.3%</span>
                  </div>
                </div>
              </div>

              <div className="ds-validation-banner">
                <div className="ds-validation-banner-left">
                  <div className="ds-validation-banner-icon">
                    <CheckCircle2 size={20} />
                  </div>
                  <div className="ds-validation-banner-text">
                    <h5>Validation completed successfully</h5>
                    <p>All critical issues have been resolved. Your data is ready for use.</p>
                  </div>
                </div>
                <button className="ds-validation-details-link">View Validation Details</button>
              </div>
            </div>
          </div>
        </div>

        {/* ===== RIGHT COLUMN ===== */}
        <div className="ds-right-column">

          {/* --- Sync Logs --- */}
          <div className="ds-sync-card">
            <div className="ds-sync-header">
              <h3>Sync Logs</h3>
              <a href="#">View All Logs →</a>
            </div>
            <div className="ds-sync-list">
              {syncLogs.map((log, i) => (
                <div className="ds-sync-item" key={i}>
                  <div className={`ds-sync-status-icon ${log.status}`}>
                    {log.status === 'success' && <CheckCircle2 size={18} />}
                    {log.status === 'partial' && <AlertTriangle size={18} />}
                    {log.status === 'failed' && <XCircle size={18} />}
                  </div>
                  <div className="ds-sync-info">
                    <div className="ds-sync-filename">{log.file}</div>
                    <div className="ds-sync-meta">{log.type} • {log.records}</div>
                  </div>
                  <div className="ds-sync-right">
                    <span className="ds-sync-date">{log.date}</span>
                    <span className={`ds-sync-badge ${log.status}`}>
                      {log.status === 'success' && 'Success'}
                      {log.status === 'partial' && 'Partial'}
                      {log.status === 'failed' && 'Failed'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="ds-sync-footer">
              <a href="#">View All Sync Logs</a>
            </div>
          </div>

          {/* --- Anomaly Detection --- */}
          <div className="ds-anomaly-card">
            <div className="ds-anomaly-header">
              <h3>Anomaly Detection</h3>
              <a href="#">View All Anomalies →</a>
            </div>
            <div className="ds-anomaly-body">
              <div className="ds-anomaly-summary">
                <div className="ds-anomaly-count">
                  <span className="ds-anomaly-count-value">23</span>
                  <span className="ds-anomaly-count-label">Total Anomalies Detected</span>
                </div>
                <div className="ds-donut-container">
                  {/* SVG Donut Chart */}
                  <svg className="ds-donut-chart" viewBox="0 0 36 36">
                    {/* High severity: 34.8% = 34.8 stroke */}
                    <circle
                      cx="18" cy="18" r="14"
                      fill="none"
                      stroke="#EF4444"
                      strokeWidth="5"
                      strokeDasharray="34.8 65.2"
                      strokeDashoffset="25"
                    />
                    {/* Medium severity: 39.1% */}
                    <circle
                      cx="18" cy="18" r="14"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="5"
                      strokeDasharray="39.1 60.9"
                      strokeDashoffset={25 - 34.8}
                    />
                    {/* Low severity: 26.1% */}
                    <circle
                      cx="18" cy="18" r="14"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="5"
                      strokeDasharray="26.1 73.9"
                      strokeDashoffset={25 - 34.8 - 39.1}
                    />
                  </svg>
                  <div className="ds-donut-legend">
                    <div className="ds-donut-legend-item">
                      <span className="ds-legend-dot" style={{ background: '#EF4444' }}></span>
                      High Severity&nbsp;&nbsp;<strong>8</strong>&nbsp;(34.8%)
                    </div>
                    <div className="ds-donut-legend-item">
                      <span className="ds-legend-dot" style={{ background: '#F59E0B' }}></span>
                      Medium Severity&nbsp;&nbsp;<strong>9</strong>&nbsp;(39.1%)
                    </div>
                    <div className="ds-donut-legend-item">
                      <span className="ds-legend-dot" style={{ background: '#10B981' }}></span>
                      Low Severity&nbsp;&nbsp;<strong>6</strong>&nbsp;(26.1%)
                    </div>
                  </div>
                </div>
              </div>

              <div className="ds-recent-anomalies">
                <h4>Recent Anomalies</h4>
                {anomalies.map((a, i) => (
                  <div className="ds-anomaly-item" key={i}>
                    <span className={`ds-anomaly-dot ${a.severity}`}></span>
                    <div className="ds-anomaly-item-info">
                      <div className="ds-anomaly-item-title">{a.title}</div>
                      <div className="ds-anomaly-item-source">{a.source}</div>
                    </div>
                    <div className="ds-anomaly-item-right">
                      <span className="ds-anomaly-item-date">{a.date}</span>
                      <span className={`ds-anomaly-item-badge ${a.severity}`}>
                        {a.severity.charAt(0).toUpperCase() + a.severity.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="ds-anomaly-footer">
              <a href="#">View All Anomalies</a>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

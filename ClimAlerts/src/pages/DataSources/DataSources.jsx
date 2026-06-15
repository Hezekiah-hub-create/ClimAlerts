import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Database, CloudUpload, RefreshCw, Clock, Upload,
  Link2, CalendarClock, CheckCircle2, AlertTriangle,
  XCircle, FileSpreadsheet, Maximize2, ChevronRight,
  Server, FileText, Wifi
} from 'lucide-react';
import './DataSources.css';
import { fmtDateTime, fmtDate, hoursAgo, nowDate } from '../../utils/dateUtils';

// ---------- MOCK DATA ----------

const syncLogs = [];

const previewData = [];

const anomalies = [];

const dataSources = [];

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
            <span className="ds-metric-value">0</span>
            <span className="ds-metric-sub neutral">0 Active</span>
          </div>
        </div>

        <div className="ds-metric-card">
          <div className="ds-metric-icon" style={{ color: '#8B5CF6', backgroundColor: '#F5F3FF' }}>
            <RefreshCw size={22} />
          </div>
          <div className="ds-metric-body">
            <span className="ds-metric-label">Last Sync</span>
            <span className="ds-metric-value" style={{ fontSize: '0.95rem' }}>—</span>
            <span className="ds-metric-sub neutral">
              No recent sync
            </span>
          </div>
        </div>

        <div className="ds-metric-card">
          <div className="ds-metric-icon" style={{ color: '#10B981', backgroundColor: '#ECFDF5' }}>
            <FileSpreadsheet size={22} />
          </div>
          <div className="ds-metric-body">
            <span className="ds-metric-label">Total Records</span>
            <span className="ds-metric-value">0</span>
            <span className="ds-metric-sub neutral">Across all sources</span>
          </div>
        </div>

        <div className="ds-metric-card">
          <div className="ds-metric-icon" style={{ color: '#F59E0B', backgroundColor: '#FFFBEB' }}>
            <AlertTriangle size={22} />
          </div>
          <div className="ds-metric-body">
            <span className="ds-metric-label">Anomalies Detected</span>
            <span className="ds-metric-value">0</span>
            <span className="ds-metric-sub neutral">Across 0 datasets</span>
          </div>
        </div>

        <div className="ds-metric-card">
          <div className="ds-metric-icon" style={{ color: '#10B981', backgroundColor: '#ECFDF5' }}>
            <CheckCircle2 size={22} />
          </div>
          <div className="ds-metric-body">
            <span className="ds-metric-label">Data Quality Score</span>
            <span className="ds-metric-value">0%</span>
            <span className="ds-metric-sub neutral">—</span>
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
                  {dataSources.length > 0 ? dataSources.map((src, i) => (
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
                  )) : (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                      No data sources found.
                    </div>
                  )}
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
                  {previewData.length > 0 ? previewData.map((row, i) => (
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
                  )) : (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                        No data available to preview.
                      </td>
                    </tr>
                  )}
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
                    <span className="ds-val-stat-value">0</span>
                    <span className="ds-val-stat-pct muted">0%</span>
                  </div>
                </div>
                <div className="ds-val-stat">
                  <span className="ds-val-stat-label">Valid Rows</span>
                  <div className="ds-val-stat-row">
                    <span className="ds-val-stat-value">0</span>
                    <span className="ds-val-stat-pct neutral">0%</span>
                  </div>
                </div>
                <div className="ds-val-stat">
                  <span className="ds-val-stat-label">Invalid Rows</span>
                  <div className="ds-val-stat-row">
                    <span className="ds-val-stat-value">0</span>
                    <span className="ds-val-stat-pct neutral">0%</span>
                  </div>
                </div>
                <div className="ds-val-stat">
                  <span className="ds-val-stat-label">Missing Values</span>
                  <div className="ds-val-stat-row">
                    <span className="ds-val-stat-value">0</span>
                    <span className="ds-val-stat-pct neutral">0%</span>
                  </div>
                </div>
                <div className="ds-val-stat">
                  <span className="ds-val-stat-label">Duplicates</span>
                  <div className="ds-val-stat-row">
                    <span className="ds-val-stat-value">0</span>
                    <span className="ds-val-stat-pct neutral">0%</span>
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
              {syncLogs.length > 0 ? syncLogs.map((log, i) => (
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
              )) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  No recent sync logs.
                </div>
              )}
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
                  <span className="ds-anomaly-count-value">0</span>
                  <span className="ds-anomaly-count-label">Total Anomalies Detected</span>
                </div>
                <div className="ds-donut-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>No data to display</span>
                </div>
              </div>

              <div className="ds-recent-anomalies">
                <h4>Recent Anomalies</h4>
                {anomalies.length > 0 ? anomalies.map((a, i) => (
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
                )) : (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    No recent anomalies found.
                  </div>
                )}
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

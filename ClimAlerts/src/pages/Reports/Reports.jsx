import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { 
  FileText, Download, BarChart2, Bell, ShieldCheck, 
  TrendingUp, Calendar, AlertTriangle, Filter, 
  ChevronLeft, ChevronRight, Eye, Sparkles, Droplets, 
  Thermometer, CloudRain, Users2, Layers, DownloadCloud, FileSpreadsheet, Info
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, BarChart, Bar 
} from 'recharts';
import './Reports.css';
import { CustomDropdown } from '../../components/common/CustomDropdown';
import { fmtDateTime, hoursAgo, daysAgo, dateRange, lastNDayLabels } from '../../utils/dateUtils';

// ---------- Mock Data ----------

const _rLabels = lastNDayLabels(7);
const correlationData = [];

const outbreakTrendsData = [];

const accuracyOverTimeData = [];

const regionalRisk = [];

const reportsList = [];

const contributingFactors = [];

export const Reports = () => {
  const [selectedDisease, setSelectedDisease] = useState('Malaria');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedReportType, setSelectedReportType] = useState('All Reports');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    const loadingId = toast.loading('Generating report...');
    setTimeout(() => {
      setIsGenerating(false);
      toast.success('Report generated successfully!', { id: loadingId });
    }, 1500);
  };

  const filteredReports = reportsList.filter(r => {
    const matchType = selectedReportType === 'All Reports' || r.type === selectedReportType;
    return matchType;
  });

  return (
    <div className="reports-container">
      {/* Top Header Controls Bar */}
      <div className="reports-top-bar">
        <div className="reports-filters-group">
          {/* Date Range Filter */}
          <div className="filter-item">
            <span className="filter-label">Date Range</span>
            <div className="filter-selector-box">
              <Calendar size={14} className="filter-icon" />
              <span>{dateRange(30)}</span>
            </div>
          </div>

          {/* Disease Type Filter */}
          <div className="filter-item">
            <span className="filter-label">Disease Type</span>
            <CustomDropdown 
              value={selectedDisease} 
              onChange={setSelectedDisease}
              className="filter-select custom-dropdown"
              options={[
                { value: 'Malaria', label: 'Malaria' },
                { value: 'Dengue Fever', label: 'Dengue Fever' },
                { value: 'Cholera', label: 'Cholera' },
                { value: 'All', label: 'All Diseases' }
              ]}
            />
          </div>

          {/* Region Filter */}
          <div className="filter-item">
            <span className="filter-label">Region</span>
            <CustomDropdown 
              value={selectedRegion} 
              onChange={setSelectedRegion}
              className="filter-select custom-dropdown"
              options={[
                { value: 'All Regions', label: 'All Regions' },
                { value: 'Volta Region', label: 'Volta Region' },
                { value: 'Ashanti Region', label: 'Ashanti Region' },
                { value: 'Greater Accra', label: 'Greater Accra' }
              ]}
            />
          </div>

          {/* Report Type Filter */}
          <div className="filter-item">
            <span className="filter-label">Report Type</span>
            <CustomDropdown 
              value={selectedReportType} 
              onChange={setSelectedReportType}
              className="filter-select custom-dropdown"
              options={[
                { value: 'All Reports', label: 'All Reports' },
                { value: 'PDF', label: 'PDF Reports' },
                { value: 'CSV', label: 'CSV Data Sheets' }
              ]}
            />
          </div>

          {/* Filter Action Button */}
          <button className="btn-filter-icon" title="More Filters">
            <Filter size={16} /> Filters
          </button>
        </div>

        <div className="reports-action-buttons">
          <button className="btn-action-outline">
            <FileText size={14} style={{ color: '#EF4444' }} /> Export PDF
          </button>
          <button className="btn-action-outline">
            <FileSpreadsheet size={14} style={{ color: '#10B981' }} /> Download CSV
          </button>
          <button className="btn-primary-gradient" onClick={handleGenerateReport} disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'Generate Report'} <span className="arrow-down">▼</span>
          </button>
        </div>
      </div>

      {/* ===== METRICS ROW ===== */}
      <div className="reports-metrics-grid">
        <div className="rep-metric-card">
          <div className="rep-metric-icon-wrap blue">
            <FileText size={20} />
          </div>
          <div className="rep-metric-details">
            <span className="rep-metric-label">Total Reports Generated</span>
            <span className="rep-metric-value">0</span>
            <span className="rep-metric-trend neutral">
              —
            </span>
          </div>
        </div>

        <div className="rep-metric-card">
          <div className="rep-metric-icon-wrap orange">
            <Bell size={20} />
          </div>
          <div className="rep-metric-details">
            <span className="rep-metric-label">Alerts Sent</span>
            <span className="rep-metric-value">0</span>
            <span className="rep-metric-trend neutral">
              —
            </span>
          </div>
        </div>

        <div className="rep-metric-card">
          <div className="rep-metric-icon-wrap green">
            <ShieldCheck size={20} />
          </div>
          <div className="rep-metric-details">
            <span className="rep-metric-label">Prediction Accuracy</span>
            <span className="rep-metric-value">0%</span>
            <span className="rep-metric-trend neutral">
              —
            </span>
          </div>
        </div>

        <div className="rep-metric-card">
          <div className="rep-metric-icon-wrap purple">
            <Layers size={20} />
          </div>
          <div className="rep-metric-details">
            <span className="rep-metric-label">Active Regions Monitored</span>
            <span className="rep-metric-value">0</span>
            <span className="rep-metric-trend neutral">
              —
            </span>
          </div>
        </div>
      </div>

      {/* ===== CHARTS ROW (4 Grid Items) ===== */}
      <div className="reports-charts-grid">
        {/* 1. Rainfall vs Disease Correlation */}
        <div className="report-chart-card">
          <div className="report-chart-header">
            <h4>1. Rainfall vs Disease Correlation <Info size={16} className="info-trigger" /></h4>
            <div className="report-chart-legend">
              <span className="legend-dot-item blue"><span className="legend-dot"></span> Rainfall (mm)</span>
              <span className="legend-dot-item green"><span className="legend-dot"></span> Malaria Cases</span>
              <span className="legend-badge-green">✓ Correlation: 0.78</span>
            </div>
          </div>
          <div className="report-chart-body" style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={correlationData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="rainfall" stroke="#2563EB" strokeWidth={2} dot={{ r: 3 }} />
                <Line yAxisId="right" type="monotone" dataKey="cases" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Monthly Outbreak Trends */}
        <div className="report-chart-card">
          <div className="report-chart-header">
            <h4>2. Monthly Outbreak Trends <Info size={16} className="info-trigger" /></h4>
            <div className="report-chart-legend">
              <span className="legend-dot-item blue"><span className="legend-dot"></span> Malaria Cases</span>
              <span className="legend-dot-item green"><span className="legend-dot"></span> Alerts Sent</span>
            </div>
          </div>
          <div className="report-chart-body" style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={outbreakTrendsData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} />
                <Tooltip />
                <Bar yAxisId="left" dataKey="cases" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={30} />
                <Line yAxisId="right" type="monotone" dataKey="alerts" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Regional Risk Comparison */}
        <div className="report-chart-card">
          <div className="report-chart-header">
            <h4>3. Regional Risk Comparison <Info size={16} className="info-trigger" /></h4>
          </div>
          <div className="report-chart-body progress-bars-body">
            {regionalRisk.length > 0 ? (
              <>
                <div className="progress-bars-container">
                  {regionalRisk.map((item, idx) => (
                    <div className="region-risk-bar-row" key={idx}>
                      <span className="region-name-lbl">{item.region}</span>
                      <div className="risk-progress-track">
                        <div 
                          className="risk-progress-fill" 
                          style={{ width: `${item.score}%`, backgroundColor: item.color }}
                        ></div>
                      </div>
                      <span className="region-risk-score-val">{item.score}%</span>
                    </div>
                  ))}
                </div>
                <div className="progress-axis-labels">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <span style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>No regional data available</span>
              </div>
            )}
          </div>
        </div>

        {/* 4. Prediction Accuracy Over Time */}
        <div className="report-chart-card">
          <div className="report-chart-header">
            <h4>4. Prediction Accuracy Over Time <Info size={16} className="info-trigger" /></h4>
            <div className="report-chart-legend">
              <span className="legend-dot-item blue"><span className="legend-dot"></span> Accuracy (%)</span>
            </div>
          </div>
          <div className="report-chart-body" style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={accuracyOverTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="accuracy" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4, fill: '#3B82F6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM TWO COLUMNS ===== */}
      <div className="reports-bottom-grid">
        {/* Left Column: Recent Reports Table */}
        <div className="reports-table-card card">
          <div className="reports-table-card-header">
            <h3>Recent Reports</h3>
          </div>
          <div className="reports-table-wrap">
            <table className="reports-data-table">
              <thead>
                <tr>
                  <th>Report Name</th>
                  <th>Type</th>
                  <th>Generated By</th>
                  <th>Date Generated</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.length > 0 ? filteredReports.map((item, idx) => (
                  <tr key={idx}>
                    <td className="report-name-cell">{item.name}</td>
                    <td className="report-type-cell"><span className={`type-badge ${item.type.toLowerCase()}`}>{item.type}</span></td>
                    <td className="report-user-cell">{item.user}</td>
                    <td className="report-date-cell">{item.date}</td>
                    <td className="report-status-cell"><span className="status-completed-badge">{item.status}</span></td>
                    <td className="report-actions-cell">
                      <button className="tbl-action-btn" title="View Report"><Eye size={14} /></button>
                      <button className="tbl-action-btn" title="Download"><Download size={14} /></button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No reports match the selected filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="reports-table-pagination-footer">
            <span className="pagination-info">Showing {filteredReports.length > 0 ? 1 : 0} to {filteredReports.length} of {reportsList.length} reports</span>
            <div className="pagination-controls">
              <button className="pag-btn" disabled><ChevronLeft size={16} /></button>
              <button className="pag-btn"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>

        {/* Right Column: Contributing Factors & AI Insight */}
        <div className="reports-insights-sidebar">
          {/* Top Contributing Factors Card */}
          <div className="sidebar-factor-card card">
            <div className="factor-header">
              <h3>Top Contributing Factors</h3>
            </div>
            <div className="factor-body">
              {contributingFactors.length > 0 ? contributingFactors.map((factor, idx) => (
                <div className="factor-row" key={idx}>
                  <div className="factor-label-row">
                    <span className="factor-name">{factor.name}</span>
                    <span className="factor-percentage">{factor.pct}%</span>
                  </div>
                  <div className="factor-bar-track">
                    <div 
                      className="factor-bar-fill" 
                      style={{ width: `${factor.pct}%` }}
                    ></div>
                  </div>
                </div>
              )) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  No factors to display.
                </div>
              )}
            </div>
          </div>

          {/* AI Insight Card */}
          <div className="sidebar-insight-card card">
            <div className="insight-header">
              <h3><Sparkles size={16} className="insight-icon" /> AI Insight</h3>
              <a href="#" className="insight-details-link">View Details →</a>
            </div>
            <div className="insight-body" style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', fontStyle: 'italic', padding: '2rem 0' }}>
                No active insights available at this time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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

// ---------- Mock Data ----------

const correlationData = [
  { day: 'Apr 23', rainfall: 45, cases: 35 },
  { day: 'Apr 28', rainfall: 85, cases: 42 },
  { day: 'May 3', rainfall: 120, cases: 65 },
  { day: 'May 8', rainfall: 95, cases: 55 },
  { day: 'May 13', rainfall: 190, cases: 98 },
  { day: 'May 18', rainfall: 140, cases: 88 },
  { day: 'May 23', rainfall: 165, cases: 110 },
];

const outbreakTrendsData = [
  { month: 'Dec \'24', cases: 80, alerts: 120 },
  { month: 'Jan \'25', cases: 240, alerts: 320 },
  { month: 'Feb \'25', cases: 190, alerts: 260 },
  { month: 'Mar \'25', cases: 280, alerts: 410 },
  { month: 'Apr \'25', cases: 420, alerts: 580 },
  { month: 'May \'25', cases: 310, alerts: 440 },
];

const accuracyOverTimeData = [
  { month: 'Dec \'24', accuracy: 68 },
  { month: 'Jan \'25', accuracy: 74 },
  { month: 'Feb \'25', accuracy: 78 },
  { month: 'Mar \'25', accuracy: 83 },
  { month: 'Apr \'25', accuracy: 85 },
  { month: 'May \'25', accuracy: 87.4 },
];

const regionalRisk = [
  { region: 'Volta Region', score: 92.3, color: '#EF4444' },
  { region: 'Ashanti Region', score: 78.6, color: '#F97316' },
  { region: 'Northern Region', score: 65.4, color: '#F59E0B' },
  { region: 'Greater Accra', score: 45.2, color: '#10B981' },
  { region: 'Western Region', score: 32.8, color: '#10B981' },
];

const reportsList = [
  { name: 'Malaria Outbreak Summary - Volta Region', type: 'PDF', user: 'Admin User', date: 'May 23, 2025 10:30 AM', status: 'Completed' },
  { name: 'Monthly Climate & Health Report - April 2025', type: 'PDF', user: 'Admin User', date: 'May 1, 2025 08:15 AM', status: 'Completed' },
  { name: 'Regional Risk Comparison Report', type: 'CSV', user: 'Admin User', date: 'Apr 30, 2025 05:45 PM', status: 'Completed' },
  { name: 'Prediction Performance Report', type: 'PDF', user: 'Admin User', date: 'Apr 28, 2025 11:20 AM', status: 'Completed' },
  { name: 'Alert Response Summary - April 2025', type: 'CSV', user: 'Admin User', date: 'Apr 27, 2025 04:10 PM', status: 'Completed' },
  { name: 'SMS Delivery Report - April 2025', type: 'PDF', user: 'Admin User', date: 'Apr 25, 2025 02:35 PM', status: 'Completed' },
  { name: 'Environmental Factors Analysis', type: 'PDF', user: 'Admin User', date: 'Apr 23, 2025 09:00 AM', status: 'Completed' },
];

const contributingFactors = [
  { name: 'High Rainfall', pct: 82 },
  { name: 'High Humidity', pct: 76 },
  { name: 'Warm Temperature', pct: 61 },
  { name: 'Stagnant Water Index', pct: 55 },
  { name: 'Population Density', pct: 38 },
];

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
              <span>Apr 23 - May 23, 2025</span>
            </div>
          </div>

          {/* Disease Type Filter */}
          <div className="filter-item">
            <span className="filter-label">Disease Type</span>
            <select 
              value={selectedDisease} 
              onChange={(e) => setSelectedDisease(e.target.value)}
              className="filter-select"
            >
              <option value="Malaria">Malaria</option>
              <option value="Dengue Fever">Dengue Fever</option>
              <option value="Cholera">Cholera</option>
              <option value="All">All Diseases</option>
            </select>
          </div>

          {/* Region Filter */}
          <div className="filter-item">
            <span className="filter-label">Region</span>
            <select 
              value={selectedRegion} 
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="filter-select"
            >
              <option value="All Regions">All Regions</option>
              <option value="Volta Region">Volta Region</option>
              <option value="Ashanti Region">Ashanti Region</option>
              <option value="Greater Accra">Greater Accra</option>
            </select>
          </div>

          {/* Report Type Filter */}
          <div className="filter-item">
            <span className="filter-label">Report Type</span>
            <select 
              value={selectedReportType} 
              onChange={(e) => setSelectedReportType(e.target.value)}
              className="filter-select"
            >
              <option value="All Reports">All Reports</option>
              <option value="PDF">PDF Reports</option>
              <option value="CSV">CSV Data Sheets</option>
            </select>
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
            <span className="rep-metric-value">24</span>
            <span className="rep-metric-trend positive">
              <TrendingUp size={12} /> 20% vs last 30 days
            </span>
          </div>
        </div>

        <div className="rep-metric-card">
          <div className="rep-metric-icon-wrap orange">
            <Bell size={20} />
          </div>
          <div className="rep-metric-details">
            <span className="rep-metric-label">Alerts Sent</span>
            <span className="rep-metric-value">982</span>
            <span className="rep-metric-trend positive">
              <TrendingUp size={12} /> 22% vs last 30 days
            </span>
          </div>
        </div>

        <div className="rep-metric-card">
          <div className="rep-metric-icon-wrap green">
            <ShieldCheck size={20} />
          </div>
          <div className="rep-metric-details">
            <span className="rep-metric-label">Prediction Accuracy</span>
            <span className="rep-metric-value">87.4%</span>
            <span className="rep-metric-trend positive">
              <TrendingUp size={12} /> 6.2% vs last 30 days
            </span>
          </div>
        </div>

        <div className="rep-metric-card">
          <div className="rep-metric-icon-wrap purple">
            <Layers size={20} />
          </div>
          <div className="rep-metric-details">
            <span className="rep-metric-label">Active Regions Monitored</span>
            <span className="rep-metric-value">16</span>
            <span className="rep-metric-trend positive">
              <TrendingUp size={12} /> 2 vs last 30 days
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
              <button className="pag-btn active">1</button>
              <button className="pag-btn">2</button>
              <button className="pag-btn">3</button>
              <button className="pag-btn">4</button>
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
              {contributingFactors.map((factor, idx) => (
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
              ))}
            </div>
          </div>

          {/* AI Insight Card */}
          <div className="sidebar-insight-card card">
            <div className="insight-header">
              <h3><Sparkles size={16} className="insight-icon" /> AI Insight</h3>
              <a href="#" className="insight-details-link">View Details →</a>
            </div>
            <div className="insight-body">
              <h4 className="insight-title">High malaria outbreak risk detected in Volta Region.</h4>
              <p className="insight-subtitle">Recommended actions:</p>
              <ul className="insight-actions-list">
                <li>✓ Increase distribution of mosquito nets</li>
                <li>✓ Community awareness and sensitization</li>
                <li>✓ Indoor residual spraying in high-risk districts</li>
                <li>✓ Strengthen rapid diagnostic capacity</li>
              </ul>
              <div className="insight-footer">
                <span className="insight-confidence-badge">Confidence: 87%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

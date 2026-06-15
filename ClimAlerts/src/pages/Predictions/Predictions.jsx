import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, ArrowUpRight, ShieldCheck, 
  BrainCircuit, AlertTriangle, Eye, Calendar, Sparkles, 
  CloudRain, Droplets, Thermometer, Info, Filter, ArrowRight 
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend 
} from 'recharts';
import './Predictions.css';
import { lastNDayLabels, dateRange, fmtDateShort, daysAgo } from '../../utils/dateUtils';

// ---------- Mock Data ----------

const _pLabels = lastNDayLabels(15);
const trendData = [];

const diseaseForecasts = [];

const timelineEvents = [
  { day: fmtDateShort(new Date()), label: 'Today' },
  { day: fmtDateShort(daysAgo(-5)), label: '5 Days' },
  { day: fmtDateShort(daysAgo(-10)), label: '10 Days' },
  { day: fmtDateShort(daysAgo(-15)), label: '15 Days' },
  { day: fmtDateShort(daysAgo(-20)), label: '20 Days' },
];

export const Predictions = () => {
  const [selectedDiseaseTab, setSelectedDiseaseTab] = useState('All Diseases');
  const [selectedTimeframe, setSelectedTimeframe] = useState('7 Days');

  const diseaseTabs = [
    'All Diseases', 'Malaria', 'Dengue Fever', 
    'Cholera', 'Heatwave Related', 'Respiratory'
  ];

  const timeframeTabs = ['7 Days', '30 Days', '90 Days'];

  const filteredForecasts = selectedDiseaseTab === 'All Diseases'
    ? diseaseForecasts
    : diseaseForecasts.filter(d => {
        if (selectedDiseaseTab === 'Heatwave Related') return d.disease === 'Heat Exhaustion';
        if (selectedDiseaseTab === 'Respiratory') return d.disease === 'Respiratory Infections';
        return d.disease === selectedDiseaseTab;
      });

  return (
    <div className="predictions-page-container">
      {/* ===== HEADER METRICS ===== */}
      <div className="predictions-metrics-grid">
        <div className="pred-metric-card">
          <div className="pred-metric-icon-wrap" style={{ color: '#8B5CF6', backgroundColor: '#F5F3FF' }}>
            <BrainCircuit size={22} />
          </div>
          <div className="pred-metric-body">
            <span className="pred-metric-label">Active Predictions</span>
            <div className="pred-metric-row">
              <span className="pred-metric-value">0</span>
              <span className="pred-metric-trend neutral">—</span>
            </div>
          </div>
        </div>

        <div className="pred-metric-card">
          <div className="pred-metric-icon-wrap" style={{ color: '#EF4444', backgroundColor: '#FEF2F2' }}>
            <AlertTriangle size={22} />
          </div>
          <div className="pred-metric-body">
            <span className="pred-metric-label">High Risk Predictions</span>
            <div className="pred-metric-row">
              <span className="pred-metric-value">0</span>
              <span className="pred-metric-trend neutral">—</span>
            </div>
          </div>
        </div>

        <div className="pred-metric-card">
          <div className="pred-metric-icon-wrap" style={{ color: '#10B981', backgroundColor: '#ECFDF5' }}>
            <ShieldCheck size={22} />
          </div>
          <div className="pred-metric-body">
            <span className="pred-metric-label">Avg. Confidence Score</span>
            <div className="pred-metric-row">
              <span className="pred-metric-value">0%</span>
              <span className="pred-metric-trend neutral">—</span>
            </div>
          </div>
        </div>

        <div className="pred-metric-card">
          <div className="pred-metric-icon-wrap" style={{ color: '#3B82F6', backgroundColor: '#EFF6FF' }}>
            <TrendingUp size={22} />
          </div>
          <div className="pred-metric-body">
            <span className="pred-metric-label">Total Forecasts</span>
            <div className="pred-metric-row">
              <span className="pred-metric-value">0</span>
              <span className="pred-metric-trend neutral">—</span>
            </div>
          </div>
        </div>

        <div className="pred-metric-card">
          <div className="pred-metric-icon-wrap" style={{ color: '#10B981', backgroundColor: '#ECFDF5' }}>
            <ShieldCheck size={22} />
          </div>
          <div className="pred-metric-body">
            <span className="pred-metric-label">Model Accuracy</span>
            <div className="pred-metric-row">
              <span className="pred-metric-value">0%</span>
              <span className="pred-metric-trend neutral">—</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== CONTROL PILLS ROW ===== */}
      <div className="predictions-controls-bar">
        <div className="disease-pills-group">
          {diseaseTabs.map(tab => (
            <button 
              key={tab}
              className={`disease-pill ${selectedDiseaseTab === tab ? 'active' : ''}`}
              onClick={() => setSelectedDiseaseTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="timeframe-group">
          {timeframeTabs.map(t => (
            <button 
              key={t}
              className={`timeframe-tab-btn ${selectedTimeframe === t ? 'active' : ''}`}
              onClick={() => setSelectedTimeframe(t)}
            >
              {t}
            </button>
          ))}
          <button className="filter-icon-btn" title="Detailed Filters">
            <Filter size={14} />
          </button>
        </div>
      </div>

      {/* ===== MAIN PAGE GRID ===== */}
      <div className="predictions-main-grid">
        {/* LEFT COLUMN */}
        <div className="pred-left-column">
          {/* Disease Forecasts Table Card */}
          <div className="pred-forecasts-card card">
            <div className="pred-card-header">
              <h3>Disease Forecasts</h3>
            </div>
            <div className="pred-table-wrap">
              <table className="pred-data-table">
                <thead>
                  <tr>
                    <th>Disease</th>
                    <th>Risk Level</th>
                    <th>Confidence</th>
                    <th>Peak Risk Period</th>
                    <th>Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredForecasts.length > 0 ? filteredForecasts.map((row, idx) => (
                    <tr key={idx}>
                      <td className="pred-disease-cell">
                        <span className="disease-bold">{row.disease}</span>
                        <span className="disease-sub">{row.region}</span>
                      </td>
                      <td>
                        <span className={`pred-risk-badge ${row.risk.toLowerCase()}`}>
                          {row.risk}
                        </span>
                      </td>
                      <td className="pred-progress-cell">
                        <div className="score-label-row">
                          <span className="score-val">{row.score}%</span>
                        </div>
                        <div className="pred-progress-track">
                          <div 
                            className="pred-progress-fill" 
                            style={{ width: `${row.score}%`, backgroundColor: row.color }}
                          ></div>
                        </div>
                      </td>
                      <td className="pred-date-cell">{row.date}</td>
                      <td>
                        {row.trend === 'up' ? (
                          <TrendingUp size={16} className="trend-arrow up" title="Increasing Risk" />
                        ) : (
                          <span className="trend-arrow stable" title="Stable Risk">→</span>
                        )}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No predictions found for this filter.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="pred-card-footer">
              <a href="#" className="footer-action-link">
                View All Predictions <ArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* Prediction Trends Chart Card */}
          <div className="pred-trends-card card">
            <div className="pred-card-header">
              <h3>Prediction Trends</h3>
            </div>
            <div className="pred-chart-container" style={{ height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} />
                  <Tooltip />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                  {(selectedDiseaseTab === 'All Diseases' || selectedDiseaseTab === 'Malaria') && <Line name="Malaria" type="monotone" dataKey="malaria" stroke="#8B5CF6" strokeWidth={2} dot={false} />}
                  {(selectedDiseaseTab === 'All Diseases' || selectedDiseaseTab === 'Dengue Fever') && <Line name="Dengue Fever" type="monotone" dataKey="dengue" stroke="#F97316" strokeWidth={2} dot={false} />}
                  {(selectedDiseaseTab === 'All Diseases' || selectedDiseaseTab === 'Cholera') && <Line name="Cholera" type="monotone" dataKey="cholera" stroke="#10B981" strokeWidth={2} dot={false} />}
                  {(selectedDiseaseTab === 'All Diseases' || selectedDiseaseTab === 'Heatwave Related') && <Line name="Heat Exhaustion" type="monotone" dataKey="heat" stroke="#EF4444" strokeWidth={2} dot={false} />}
                  {(selectedDiseaseTab === 'All Diseases' || selectedDiseaseTab === 'Respiratory') && <Line name="Respiratory" type="monotone" dataKey="resp" stroke="#3B82F6" strokeWidth={2} dot={false} />}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="pred-right-column">
          {/* Prediction Explanation Card */}
          <div className="pred-explanation-card card">
            <div className="pred-card-header explanation-header">
              <div className="header-labels">
                <h3>Forecast Explanation</h3>
              </div>
            </div>
            <div className="pred-explanation-body" style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', fontStyle: 'italic', padding: '2rem 0' }}>
                Select a prediction from the table to view its explanation.
              </p>
            </div>
          </div>

          {/* Forecast Timeline Card */}
          <div className="pred-timeline-card card">
            <div className="pred-card-header">
              <h3>Forecast Timeline</h3>
            </div>
            <div className="pred-timeline-body">
              {/* Horizontal Dot Timeline Row */}
              <div className="timeline-graphic-row">
                <div className="timeline-line"></div>
                {timelineEvents.map((ev, i) => (
                  <div className="timeline-node-item" key={i}>
                    <div className="timeline-dot-indicator"></div>
                    <span className="timeline-date">{ev.day}</span>
                    <span className="timeline-lbl">{ev.label}</span>
                  </div>
                ))}
              </div>

              {/* Highlights below */}
              <div className="timeline-term-ranges">
                <div className="term-box green">
                  <span className="term-title">Short Term</span>
                  <span className="term-days">1-7 days</span>
                </div>
                <div className="term-box blue">
                  <span className="term-title">Medium Term</span>
                  <span className="term-days">8-14 days</span>
                </div>
                <div className="term-box purple">
                  <span className="term-title">Long Term</span>
                  <span className="term-days">15-30 days</span>
                </div>
              </div>

              {/* Footer info message */}
              <div className="timeline-footer-info">
                <Info size={12} className="info-icon" />
                <span>Predictions are updated daily with new data</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

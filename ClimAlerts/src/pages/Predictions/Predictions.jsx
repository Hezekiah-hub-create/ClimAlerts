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

// ---------- Mock Data ----------

const trendData = [
  { date: 'May 23', malaria: 72, dengue: 45, cholera: 25, heat: 60, resp: 35 },
  { date: 'May 24', malaria: 75, dengue: 48, cholera: 24, heat: 64, resp: 36 },
  { date: 'May 25', malaria: 78, dengue: 52, cholera: 26, heat: 68, resp: 38 },
  { date: 'May 26', malaria: 82, dengue: 55, cholera: 28, heat: 75, resp: 40 },
  { date: 'May 27', malaria: 85, dengue: 58, cholera: 27, heat: 80, resp: 42 },
  { date: 'May 28', malaria: 89, dengue: 62, cholera: 30, heat: 85, resp: 45 },
  { date: 'May 29', malaria: 92.3, dengue: 65, cholera: 32, heat: 89.1, resp: 47 },
  { date: 'May 30', malaria: 91, dengue: 68, cholera: 35, heat: 87, resp: 50 },
  { date: 'May 31', malaria: 88, dengue: 72, cholera: 38, heat: 82, resp: 52 },
  { date: 'Jun 1', malaria: 85, dengue: 78.6, cholera: 42, heat: 78, resp: 55 },
  { date: 'Jun 2', malaria: 82, dengue: 76, cholera: 45, heat: 74, resp: 58 },
  { date: 'Jun 3', malaria: 79, dengue: 73, cholera: 52, heat: 70, resp: 62 },
  { date: 'Jun 4', malaria: 76, dengue: 70, cholera: 58, heat: 65, resp: 66 },
  { date: 'Jun 5', malaria: 73, dengue: 68, cholera: 65.4, heat: 60, resp: 70 },
  { date: 'Jun 6', malaria: 70, dengue: 65, cholera: 62, heat: 55, resp: 72.8 },
];

const diseaseForecasts = [
  { disease: 'Malaria', region: 'Volta Region', risk: 'High', score: 92.3, date: 'May 28 - Jun 4, 2025', trend: 'up', color: '#EF4444' },
  { disease: 'Dengue Fever', region: 'Greater Accra', risk: 'Moderate', score: 78.6, date: 'Jun 1 - Jun 8, 2025', trend: 'up', color: '#F97316' },
  { disease: 'Cholera', region: 'Central Region', risk: 'Low', score: 65.4, date: 'Jun 5 - Jun 12, 2025', trend: 'stable', color: '#10B981' },
  { disease: 'Heat Exhaustion', region: 'Northern Region', risk: 'High', score: 89.1, date: 'May 26 - Jun 2, 2025', trend: 'up', color: '#EF4444' },
  { disease: 'Respiratory Infections', region: 'Ashanti Region', risk: 'Moderate', score: 72.8, date: 'May 30 - Jun 6, 2025', trend: 'stable', color: '#F97316' },
];

const timelineEvents = [
  { day: 'May 23', label: 'Today' },
  { day: 'May 28', label: '5 Days' },
  { day: 'Jun 2', label: '10 Days' },
  { day: 'Jun 7', label: '15 Days' },
  { day: 'Jun 12', label: '20 Days' },
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
              <span className="pred-metric-value">8</span>
              <span className="pred-metric-trend positive">↑ 14.3% vs last 7 days</span>
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
              <span className="pred-metric-value">3</span>
              <span className="pred-metric-trend negative">↑ 2 vs last 7 days</span>
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
              <span className="pred-metric-value">87.4%</span>
              <span className="pred-metric-trend positive">↑ 6.2% vs last 7 days</span>
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
              <span className="pred-metric-value">156</span>
              <span className="pred-metric-trend positive">↑ 18.7% vs last 7 days</span>
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
              <span className="pred-metric-value">91.2%</span>
              <span className="pred-metric-trend positive">↑ 7.1% vs last 30 days</span>
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
                <h3>Malaria Forecast - Volta Region</h3>
                <span className="badge-danger-outline">High Risk Prediction</span>
              </div>
              <a href="#" className="explanation-tech-details">View Technical Details →</a>
            </div>
            <div className="pred-explanation-body">
              <h4 className="body-heading">Key Contributing Factors:</h4>
              <div className="factors-list">
                <div className="factor-item-row">
                  <div className="factor-icon-wrap rain">
                    <CloudRain size={16} />
                  </div>
                  <div className="factor-content">
                    <span className="factor-title">High rainfall expected in the next 7 days</span>
                    <span className="factor-subtitle">+35% above normal</span>
                  </div>
                </div>

                <div className="factor-item-row">
                  <div className="factor-icon-wrap humidity">
                    <Droplets size={16} />
                  </div>
                  <div className="factor-content">
                    <span className="factor-title">High humidity levels</span>
                    <span className="factor-subtitle">82% average humidity</span>
                  </div>
                </div>

                <div className="factor-item-row">
                  <div className="factor-icon-wrap temp">
                    <Thermometer size={16} />
                  </div>
                  <div className="factor-content">
                    <span className="factor-title">Temperature conditions favorable</span>
                    <span className="factor-subtitle">28.6°C average temperature</span>
                  </div>
                </div>

                <div className="factor-item-row">
                  <div className="factor-icon-wrap pattern">
                    <Calendar size={16} />
                  </div>
                  <div className="factor-content">
                    <span className="factor-title">Historical pattern similarity</span>
                    <span className="factor-subtitle">Similar to outbreaks in 2023, 2022</span>
                  </div>
                </div>
              </div>

              {/* AI Model Insight Box */}
              <div className="ai-insight-box">
                <div className="insight-title-row">
                  <Sparkles size={16} className="spark-gold" />
                  <h5>AI Model Insight</h5>
                </div>
                <p className="insight-text">
                  Our AI model has identified optimal conditions for malaria vector breeding and transmission based on environmental and historical data patterns.
                </p>
              </div>
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

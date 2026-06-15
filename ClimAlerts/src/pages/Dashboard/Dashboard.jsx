import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, AlertTriangle, Bell, Users, ShieldCheck, 
  Map, Eye, ChevronRight, Download, Settings, RefreshCw, Upload,
  Plus, Bug, CheckCircle2, Info, Sparkles
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';
import { CustomDropdown } from '../../components/common/CustomDropdown';
import { VoltaRiskMap } from '../../components/VoltaRiskMap/VoltaRiskMap';
import { lastNDayLabels, fmtDateTime, hoursAgo, nowDateTime } from '../../utils/dateUtils';

const dayLabels = lastNDayLabels(7);
const outbreakData = [];

export const Dashboard = () => {
  const navigate = useNavigate();
  const [lastUpdated, setLastUpdated] = useState('');
  
  const [layers, setLayers] = useState({
    heatmap: true,
    boundaries: true,
    facilities: true,
    roads: false,
    lake: true,
  });

  const toggleLayer = (key) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const now = new Date();
    setLastUpdated(now.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }));
  }, []);

  return (
    <div className="dashboard-container">


      {/* Top Metrics Row */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-box" style={{ color: '#10B981', backgroundColor: '#ECFDF5' }}>
            <TrendingUp size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Total Predictions</span>
            <div className="metric-value-row">
              <span className="metric-value">0</span>
              <span className="metric-trend neutral">—</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ color: '#EF4444', backgroundColor: '#FEF2F2' }}>
            <AlertTriangle size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-label">High Risk Areas</span>
            <div className="metric-value-row">
              <span className="metric-value">0</span>
              <span className="metric-trend neutral">—</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ color: '#F59E0B', backgroundColor: '#FFFBEB' }}>
            <Bell size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Alerts Sent</span>
            <div className="metric-value-row">
              <span className="metric-value">0</span>
              <span className="metric-trend neutral">—</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ color: '#3B82F6', backgroundColor: '#EFF6FF' }}>
            <Users size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Recipients Reached</span>
            <div className="metric-value-row">
              <span className="metric-value">0</span>
              <span className="metric-trend neutral">—</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ color: '#8B5CF6', backgroundColor: '#F5F3FF' }}>
            <Bug size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Active Outbreaks</span>
            <div className="metric-value-row">
              <span className="metric-value">0</span>
              <span className="metric-trend neutral">—</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ color: '#10B981', backgroundColor: '#ECFDF5' }}>
            <ShieldCheck size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Prediction Accuracy</span>
            <div className="metric-value-row">
              <span className="metric-value">0%</span>
              <span className="metric-trend neutral">—</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid (Middle Row) */}
      <div className="dashboard-grid-middle">
        
        {/* Risk Map */}
        <div className="card risk-map-card">
          <div className="card-header">
            <h3>Volta Region Risk Map (By District) <Info size={16} className="info-icon" /></h3>
            <button className="btn-icon-text" onClick={() => navigate('/risk-map')}>
              <Map size={16} /> View Fullscreen
            </button>
          </div>
          <div className="risk-map-content">
            <div className="map-sidebar">
              <div className="map-legend">
                <h4>Risk Level</h4>
                <ul>
                  <li><span className="dot" style={{background: '#EF4444'}}></span> Very High</li>
                  <li><span className="dot" style={{background: '#F97316'}}></span> High</li>
                  <li><span className="dot" style={{background: '#FCD34D'}}></span> Moderate</li>
                  <li><span className="dot" style={{background: '#84CC16'}}></span> Low</li>
                  <li><span className="dot" style={{background: '#D1D5DB'}}></span> Very Low</li>
                </ul>
              </div>
              <div className="map-layers">
                <h4>Map Layers</h4>
                <ul>
                  <li>
                    Risk Heatmap 
                    <label className="toggle-switch">
                      <input type="checkbox" checked={layers.heatmap} onChange={() => toggleLayer('heatmap')} />
                      <span className="slider"></span>
                    </label>
                  </li>
                  <li>
                    District Boundaries 
                    <label className="toggle-switch">
                      <input type="checkbox" checked={layers.boundaries} onChange={() => toggleLayer('boundaries')} />
                      <span className="slider"></span>
                    </label>
                  </li>
                  <li>
                    Health Facilities 
                    <label className="toggle-switch">
                      <input type="checkbox" checked={layers.facilities} onChange={() => toggleLayer('facilities')} />
                      <span className="slider"></span>
                    </label>
                  </li>
                  <li>
                    Major Roads 
                    <label className="toggle-switch">
                      <input type="checkbox" checked={layers.roads} onChange={() => toggleLayer('roads')} />
                      <span className="slider"></span>
                    </label>
                  </li>
                  <li>
                    Volta Lake 
                    <label className="toggle-switch">
                      <input type="checkbox" checked={layers.lake} onChange={() => toggleLayer('lake')} />
                      <span className="slider"></span>
                    </label>
                  </li>
                </ul>
              </div>
            </div>
            <div className="map-view">
              <VoltaRiskMap layers={layers} />
            </div>
          </div>
          <div className="card-footer map-footer">
            <span>Source: ClimAlerts AI Model</span>
            <span style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
              Last updated: {lastUpdated} <RefreshCw size={12}/>
            </span>
          </div>
        </div>

        {/* Right Sidebar containing AI Recommendations & Recent Alerts */}
        <div className="dashboard-sidebar-widgets">
          {/* AI Recommendations */}
          <div className="card">
            <div className="card-header">
              <h3><Sparkles size={18} className="ai-stars" /> AI Recommendations</h3>
              <a href="#" className="link">View all →</a>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', fontStyle: 'italic', padding: '2rem 0' }}>
                No active recommendations.
              </p>
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="card">
            <div className="card-header">
              <h3>Recent Alerts</h3>
              <a href="#" className="link">View all →</a>
            </div>
            <div className="alert-list" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '150px' }}>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                No recent alerts.
              </p>
            </div>
            <div className="card-footer center" style={{borderTop: 'none', paddingBottom: '1.5rem'}}>
              <button className="btn-text" style={{color: '#2563EB'}} onClick={() => navigate('/alerts')}>Go to Alerts & Messages →</button>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Grid */}
      <div className="dashboard-grid-bottom">
        
        {/* Outbreak Chart */}
        <div className="card">
          <div className="card-header">
            <h3>Live Outbreak Activity (Last 7 Days)</h3>
            <CustomDropdown
                    value={'All Diseases'}
                    onChange={() => {}}
                    className="sett-input custom-dropdown"
                    options={[
                    { value: 'All Diseases', label: 'All Diseases' },
                  ]}
                  />
          </div>
          <div className="card-body" style={{ height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={outbreakData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <Tooltip />
                <Line type="monotone" dataKey="cases" stroke="#10B981" strokeWidth={2} dot={{r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Disease Summary */}
        <div className="card">
          <div className="card-header">
            <h3>Disease Summary (This Week)</h3>
          </div>
          <div className="disease-summary-list">
            <div className="disease-item">
              <div className="d-icon" style={{color: '#10B981'}}><Bug size={18} /></div>
              <span className="d-name">Malaria</span>
              <div className="d-stats">
                <span className="d-cases">156 <span>Cases</span></span>
                <span className="metric-trend up" style={{color: '#10B981'}}>↑ 12.4%</span>
              </div>
            </div>
            <div className="disease-item">
              <div className="d-icon" style={{color: '#8B5CF6'}}><Bug size={18} /></div>
              <span className="d-name">Dengue Fever</span>
              <div className="d-stats">
                <span className="d-cases">48 <span>Cases</span></span>
                <span className="metric-trend up" style={{color: '#10B981'}}>↑ 8.6%</span>
              </div>
            </div>
            <div className="disease-item">
              <div className="d-icon" style={{color: '#3B82F6'}}><Bug size={18} /></div>
              <span className="d-name">Cholera</span>
              <div className="d-stats">
                <span className="d-cases">12 <span>Cases</span></span>
                <span className="metric-trend down" style={{color: '#EF4444'}}>↓ 5.3%</span>
              </div>
            </div>
            <div className="disease-item">
              <div className="d-icon" style={{color: '#EF4444'}}><Bug size={18} /></div>
              <span className="d-name">Typhoid Fever</span>
              <div className="d-stats">
                <span className="d-cases">8 <span>Cases</span></span>
                <span className="metric-trend up" style={{color: '#10B981'}}>↑ 2.1%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card quick-actions-card">
          <div className="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="quick-actions-grid">
            <button className="qa-btn" style={{color: '#10B981', background: '#ECFDF5'}} onClick={() => navigate('/alerts')}>
              <div className="qa-icon-wrap"><Plus size={20} /></div>
              <span>Create New Alert</span>
            </button>
            <button className="qa-btn" style={{color: '#3B82F6', background: '#EFF6FF'}} onClick={() => navigate('/predictions')}>
              <div className="qa-icon-wrap"><TrendingUp size={20} /></div>
              <span>View Predictions</span>
            </button>
            <button className="qa-btn" style={{color: '#10B981', background: '#ECFDF5'}} onClick={() => navigate('/risk-map')}>
              <div className="qa-icon-wrap"><Map size={20} /></div>
              <span>View Risk Map</span>
            </button>
            <button className="qa-btn" style={{color: '#8B5CF6', background: '#F5F3FF'}} onClick={() => navigate('/data-sources')}>
              <div className="qa-icon-wrap"><Upload size={20} /></div>
              <span>Upload Data</span>
            </button>
            <button className="qa-btn" style={{color: '#F97316', background: '#FFF7ED'}} onClick={() => navigate('/reports')}>
              <div className="qa-icon-wrap"><Download size={20} /></div>
              <span>Generate Report</span>
            </button>
            <button className="qa-btn" style={{color: '#1F2937', background: '#F3F4F6'}} onClick={() => navigate('/settings')}>
              <div className="qa-icon-wrap"><Settings size={20} /></div>
              <span>System Settings</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

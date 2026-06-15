import React, { useRef, useState, useCallback } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import {
  Map, RefreshCw, Calendar, AlertTriangle,
  Thermometer, Droplets, Wind, Users, Activity, ChevronRight,
  Target, ShieldCheck, Bell, TrendingUp, TrendingDown, Minus, Play, Stethoscope, CloudRain, Share2, X, Maximize, Plus, Info, ChevronDown
} from 'lucide-react';
import './RiskMap.css';
import { CustomDropdown } from '../../components/common/CustomDropdown';
import { VoltaRiskMap } from '../../components/VoltaRiskMap/VoltaRiskMap';
import { nowDateTime, dateRange, lastNDayLabels } from '../../utils/dateUtils';

/* ── Constants ────────────────────────────────────────────── */
const RISK_COLORS = {
  'Very High': '#EF4444',
  High:        '#F97316',
  Moderate:    '#FCD34D',
  Low:         '#84CC16',
  'Very Low':  '#D1D5DB',
};
const RISK_STROKE = {
  'Very High': '#B91C1C',
  High:        '#C2410C',
  Moderate:    '#92400E',
  Low:         '#3F6212',
  'Very Low':  '#6B7280',
};
const RISK_BG = {
  'Very High': '#FEF2F2',
  High:        '#FFF7ED',
  Moderate:    '#FFFBEB',
  Low:         '#F0FDF4',
  'Very Low':  '#F9FAFB',
};


/* ── Helpers ─────────────────────────────────────────────── */
const fmt = (n) => n?.toLocaleString() ?? '—';

/* ─────────────────────────────────────────────────────────── */

export const RiskMap = () => {
  const mapZoneRef = useRef(null);

  const [selected, setSelected] = useState(null);
  const [disease,  setDisease]  = useState('all');
  const [layers,   setLayers]   = useState({
    heatmap:    true,
    boundaries: true,
    facilities: true,
    roads:      false,
    lake:       true,
  });

  const toggleLayer = useCallback((layerKey) => {
    setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  }, []);

  return (
    <div className="riskmap-page">
      {/* ── Stats Row ── */}
      <div className="riskmap-stats">
        <div className="rm-stat-card">
          <div className="rm-stat-icon" style={{ background: '#FEF2F2', color: '#EF4444' }}>
            <AlertTriangle size={20} />
          </div>
          <div className="rm-stat-body">
            <span className="rm-stat-label">Overall Risk Level</span>
            <span className="rm-stat-value">—</span>
            <span className="rm-stat-sub"><Minus size={12} color="#9CA3AF"/> No data</span>
          </div>
        </div>

        <div className="rm-stat-card">
          <div className="rm-stat-icon" style={{ background: '#FEF2F2', color: '#EF4444' }}>
            <Target size={20} />
          </div>
          <div className="rm-stat-body">
            <span className="rm-stat-label">High Risk Districts</span>
            <span className="rm-stat-value">—</span>
            <span className="rm-stat-sub"><Minus size={12} color="#9CA3AF"/> No data</span>
          </div>
        </div>

        <div className="rm-stat-card">
          <div className="rm-stat-icon" style={{ background: '#FFFBEB', color: '#F59E0B' }}>
            <Activity size={20} />
          </div>
          <div className="rm-stat-body">
            <span className="rm-stat-label">Moderate Risk</span>
            <span className="rm-stat-value">—</span>
            <span className="rm-stat-sub"><Minus size={12} color="#9CA3AF"/> No data</span>
          </div>
        </div>

        <div className="rm-stat-card">
          <div className="rm-stat-icon" style={{ background: '#F0FDF4', color: '#16A34A' }}>
            <ShieldCheck size={20} />
          </div>
          <div className="rm-stat-body">
            <span className="rm-stat-label">Low Risk</span>
            <span className="rm-stat-value">—</span>
            <span className="rm-stat-sub"><Minus size={12} color="#9CA3AF"/> No data</span>
          </div>
        </div>

        <div className="rm-stat-card">
          <div className="rm-stat-icon" style={{ background: '#F3E8FF', color: '#9333EA' }}>
            <Bell size={20} />
          </div>
          <div className="rm-stat-body">
            <span className="rm-stat-label">Active Alerts</span>
            <span className="rm-stat-value">7</span>
            <span className="rm-stat-sub">Across the region</span>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="riskmap-body">

        {/* ── Map Card (sidebar + map combined) ── */}
        <div className="rm-map-card">
          <div className="rm-map-card-header">
            <h3><Map size={18} color="#16A34A" /> Volta Region Risk Map (By District)</h3>
            <div className="rm-map-card-actions">
              <CustomDropdown 
                className="custom-dropdown" 
                value={disease} 
                onChange={setDisease}
                options={[
                  { value: 'all', label: 'All Diseases' },
                  { value: 'malaria', label: 'Malaria' },
                  { value: 'dengue', label: 'Dengue Fever' },
                  { value: 'cholera', label: 'Cholera' },
                  { value: 'typhoid', label: 'Typhoid Fever' }
                ]}
              />
            </div>
          </div>

          <div className="rm-map-card-body">
            {/* Map Sidebar */}
            <div className="rm-sidebar">
              <div className="rm-sidebar-section">
                <h4>Risk Level</h4>
                <div className="rm-legend-list">
                  {Object.entries(RISK_COLORS).map(([level, color]) => (
                    <div className="rm-legend-item" key={level}>
                      <span className="rm-legend-dot" style={{ background: color }} />
                      <span>{level}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rm-sidebar-section">
                <h4>Map Layers</h4>
                <div className="rm-layer-list">
                  {[
                    { key: 'heatmap',    label: 'Risk Heatmap', icon: <Map size={14}/> },
                    { key: 'boundaries', label: 'Boundaries', icon: <ShieldCheck size={14}/> },
                    { key: 'facilities', label: 'Facilities', icon: <Activity size={14}/> },
                    { key: 'roads',      label: 'Roads', icon: <Wind size={14}/> },
                    { key: 'lake',       label: 'Volta Lake', icon: <Droplets size={14}/> },
                  ].map(({ key, label, icon }) => (
                    <div className="rm-layer-item" key={key}>
                      <div className="rm-layer-item-left">
                        {icon}
                        <span>{label}</span>
                      </div>
                      <label className="mini-toggle">
                        <input type="checkbox" checked={layers[key]} onChange={() => toggleLayer(key)} />
                        <span className="mt-slider" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rm-sidebar-section">
                <h4>Summary</h4>
                <div className="rm-sidebar-summary">
                  {[
                    { label: 'Very High', count: 0, color: RISK_COLORS['Very High'] },
                    { label: 'High', count: 0, color: RISK_COLORS.High },
                    { label: 'Moderate', count: 0, color: RISK_COLORS.Moderate },
                    { label: 'Low', count: 0, color: RISK_COLORS.Low },
                    { label: 'Very Low', count: 0, color: RISK_COLORS['Very Low'] },
                  ].map(({ label, count, color }) => (
                    <div className="rm-sidebar-summary-item" key={label}>
                      <span className="rm-sidebar-summary-count" style={{ color }}>{count}</span>
                      <span className="rm-sidebar-summary-label">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Map View */}
            <div className="rm-map-view" ref={mapZoneRef}>
              <VoltaRiskMap layers={layers} onDistrictClick={(props) => {
                let trend = []; // Enforce empty trend data instead of using mock geojson properties
                setSelected({ ...props, trend });
              }} />
              <div className="rm-map-controls-right">
                <button className="maximize-btn" onClick={() => {
                  if (!document.fullscreenElement) {
                    mapZoneRef.current?.requestFullscreen?.().catch(err => console.warn(err));
                  } else {
                    document.exitFullscreen?.();
                  }
                }}><Maximize size={16}/></button>
              </div>
            </div>
          </div>

          <div className="rm-map-card-footer">
            <span>Source: ClimAlerts AI Model</span>
            <span>Data Sources: Ghana Health Service, GMet, DHIMS2, Community Reports</span>
            <span style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
              Last updated: {nowDateTime()} <RefreshCw size={12}/>
            </span>
          </div>
        </div>

        {/* ── Details Panel ── */}
        <div className="rm-details">
          {!selected ? (
            <div className="rm-details-empty">
              <Map size={40} />
              <p>Click any district on the map to view detailed risk metrics and trend data.</p>
            </div>
          ) : (
            <>
              <div className="rm-details-header-top">
                <h3>District Details</h3>
                <div className="rm-details-actions">
                  <Share2 size={16} />
                  <X size={16} onClick={() => setSelected(null)} style={{cursor: 'pointer'}} />
                </div>
              </div>

              <div className="rm-details-title-section">
                <h2>{selected.name}</h2>
                <span className="rm-risk-badge" style={{ color: RISK_STROKE[selected.risk_level], backgroundColor: RISK_BG[selected.risk_level] }}>
                  {selected.risk_level} Risk
                </span>
              </div>

            <div className="rm-details-body">
              <div className="rm-metrics-list">
                <div className="rm-metric-list-item">
                  <div className="rm-metric-left">
                    <Stethoscope size={16} className="icon-blue" />
                    <span>Predicted Cases (7d)</span>
                  </div>
                  <div className="rm-metric-right">
                    <span className="val">0</span>
                    <span className="trend neutral">—</span>
                  </div>
                </div>

                <div className="rm-metric-list-item">
                  <div className="rm-metric-left">
                    <ShieldCheck size={16} className="icon-green" />
                    <span>Confidence Score</span>
                  </div>
                  <div className="rm-metric-right">
                    <span className="val">0%</span>
                    <div className="progress-bar-mini"><div className="progress-fill" style={{width: `0%`}}></div></div>
                  </div>
                </div>

                <div className="rm-metric-list-item">
                  <div className="rm-metric-left">
                    <CloudRain size={16} className="icon-blue" />
                    <span>Rainfall (7d)</span>
                  </div>
                  <div className="rm-metric-right">
                    <span className="val">0 mm</span>
                    <span className="trend neutral">—</span>
                  </div>
                </div>

                <div className="rm-metric-list-item">
                  <div className="rm-metric-left">
                    <Thermometer size={16} className="icon-orange" />
                    <span>Temperature</span>
                  </div>
                  <div className="rm-metric-right">
                    <span className="val">0 °C</span>
                    <span className="trend neutral">—</span>
                  </div>
                </div>

                <div className="rm-metric-list-item">
                  <div className="rm-metric-left">
                    <Droplets size={16} className="icon-blue" />
                    <span>Humidity</span>
                  </div>
                  <div className="rm-metric-right">
                    <span className="val">0%</span>
                    <span className="trend neutral">—</span>
                  </div>
                </div>

                <div className="rm-metric-list-item">
                  <div className="rm-metric-left">
                    <Users size={16} className="icon-gray" />
                    <span>Population at Risk</span>
                  </div>
                  <div className="rm-metric-right">
                    <span className="val">0</span>
                  </div>
                </div>

                <div className="rm-metric-list-item">
                  <div className="rm-metric-left">
                    <RefreshCw size={16} className="icon-gray" />
                    <span>Last Updated</span>
                  </div>
                  <div className="rm-metric-right">
                    <span className="val">{nowDateTime()}</span>
                  </div>
                </div>
              </div>

              <div className="rm-chart-section">
                <div className="rm-chart-header">
                  <h4>Risk Trend</h4>
                  <div className="rm-chart-filter">Last 7 Days <ChevronDown size={14}/></div>
                </div>
                {selected?.trend?.length > 0 ? (
                    <ResponsiveContainer width="100%" height={120}>
                      <AreaChart data={selected.trend} margin={{ top: 10, right: 10, bottom: 0, left: -25 }}>
                        <defs>
                          <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor={RISK_COLORS[selected.risk_level]} stopOpacity={0.25} />
                            <stop offset="95%" stopColor={RISK_COLORS[selected.risk_level]} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                        <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 9, fill: '#9ca3af' }} axisLine={false} tickLine={false} ticks={[0, 20, 40, 60, 80, 100]} tickFormatter={(v) => v === 100 ? 'Very High' : v === 80 ? 'High' : v === 60 ? 'Moderate' : v === 40 ? 'Low' : 'Very Low'} />
                        <Tooltip
                          contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e5e7eb' }}
                          labelStyle={{ fontWeight: 700 }}
                        />
                        <Area
                          type="monotone"
                          dataKey="cases"
                          stroke={RISK_COLORS[selected.risk_level]}
                          strokeWidth={2}
                          fill="url(#riskGrad)"
                          dot={{ r: 3, fill: RISK_COLORS[selected.risk_level], strokeWidth: 1.5, stroke: '#fff' }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                ) : (
                  <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: '0.8rem' }}>
                    No trend data available
                  </div>
                )}
              </div>

              <div className="rm-replay-section">
                <div className="rm-replay-header">
                  <h4>Outbreak Replay</h4>
                  <div className="rm-date-range">
                    <Calendar size={14} /> {dateRange(7)} <ChevronDown size={14}/>
                  </div>
                </div>
                <div className="rm-replay-controls">
                  <button className="play-btn"><Play size={18} fill="white" /></button>
                  <div className="timeline-track">
                    <div className="timeline-labels">
                      {lastNDayLabels(8).map((label, i) => <span key={i}>{label}</span>)}
                    </div>
                    <div className="timeline-line">
                      <div className="timeline-progress" style={{width: '100%'}}></div>
                      <div className="timeline-thumb"></div>
                    </div>
                  </div>
                </div>
                <div className="rm-replay-footer">
                  <span>Watch how risk levels changed over time</span>
                  <div className="speed-control">Speed: Normal <ChevronDown size={14}/></div>
                </div>
              </div>
            </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

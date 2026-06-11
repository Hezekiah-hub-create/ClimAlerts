import React, { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import {
  Map, RefreshCw, Calendar, AlertTriangle, ShieldAlert,
  Thermometer, Droplets, Wind, Users, Activity, ChevronRight,
  Target, ShieldCheck, Bell, TrendingUp, TrendingDown, Minus, Play, Stethoscope, CloudRain, Share2, X, Maximize, Plus, Info, ChevronDown
} from 'lucide-react';
import './RiskMap.css';
import { CustomDropdown } from '../../components/common/CustomDropdown';

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

const FILL_EXPR = [
  'match', ['get', 'risk_level'],
  'Very High', RISK_COLORS['Very High'],
  'High',      RISK_COLORS.High,
  'Moderate',  RISK_COLORS.Moderate,
  'Low',       RISK_COLORS.Low,
  RISK_COLORS['Very Low'],
];
const STROKE_EXPR = [
  'match', ['get', 'risk_level'],
  'Very High', RISK_STROKE['Very High'],
  'High',      RISK_STROKE.High,
  'Moderate',  RISK_STROKE.Moderate,
  'Low',       RISK_STROKE.Low,
  RISK_STROKE['Very Low'],
];

/* ── Helpers ─────────────────────────────────────────────── */
const fmt = (n) => n?.toLocaleString() ?? '—';

/* ─────────────────────────────────────────────────────────── */

export const RiskMap = () => {
  const mapZoneRef   = useRef(null);
  const mapContainer = useRef(null);
  const mapRef       = useRef(null);
  const popupRef     = useRef(null);

  const [geoData,  setGeoData]  = useState(null);
  const [selected, setSelected] = useState(null);
  const [disease,  setDisease]  = useState('all');
  const [layers,   setLayers]   = useState({
    heatmap:    true,
    boundaries: true,
    facilities: true,
    roads:      false,
    lake:       true,
  });

  // Compute stats from geoData
  const stats = React.useMemo(() => {
    if (!geoData) return null;
    const counts = { 'Very High': 0, High: 0, Moderate: 0, Low: 0, 'Very Low': 0 };
    geoData.features.forEach(f => {
      const r = f.properties.risk_level;
      if (counts[r] !== undefined) counts[r]++;
    });
    const alerts = counts['Very High'] * 2 + counts['High'];
    const overall = counts['Very High'] > 0 ? 'Very High'
                  : counts['High'] > 0 ? 'High'
                  : counts['Moderate'] > 0 ? 'Moderate' : 'Low';
    return { counts, alerts, overall, total: geoData.features.length };
  }, [geoData]);

  // Load GeoJSON for stats cards and component mount
  useEffect(() => {
    fetch('/maps/volta-region-districts.json')
      .then(r => r.json())
      .then(setGeoData)
      .catch(console.error);
  }, []);

  // Init map once geoData is available
  useEffect(() => {
    if (!geoData || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
        sources: {},
        layers: [
          {
            id: 'background',
            type: 'background',
            paint: { 'background-color': '#f8fafc' },
          }
        ]
      },
      center: [0.55, 6.6],
      zoom: 7.0,
      minZoom: 8.1,
      maxZoom: 12,
      dragRotate: false,
      pitchWithRotate: false,
    });
    mapRef.current = map;

    popupRef.current = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 14,
      className: 'volta-risk-popup',
    });

    map.on('load', () => {
      Promise.all([
        fetch('/maps/volta-lake.json').then(r => r.json()).catch(() => null),
        fetch('/maps/volta-roads.json').then(r => r.json()).catch(() => null),
        fetch('/maps/volta-facilities.json').then(r => r.json()).catch(() => null),
        fetch('/maps/volta-region-border.json').then(r => r.json()).catch(() => null),
        fetch('/maps/volta-towns.json').then(r => r.json()).catch(() => null)
      ])
      .then(([lakeData, roadsData, facilitiesData, regionBorderData, townsData]) => {
        // Add Sources
        map.addSource('volta', { type: 'geojson', data: geoData, promoteId: 'id' });
        if (lakeData) {
          map.addSource('volta-lake', { type: 'geojson', data: lakeData });
        }
        if (roadsData) {
          map.addSource('volta-roads', { type: 'geojson', data: roadsData });
        }
        if (facilitiesData) {
          map.addSource('volta-facilities', { type: 'geojson', data: facilitiesData });
        }
        if (regionBorderData) {
          map.addSource('volta-region', { type: 'geojson', data: regionBorderData });
        }
        if (townsData) {
          map.addSource('volta-towns', { type: 'geojson', data: townsData });
        }

        // 1. Lake Fill (bottom layer)
        if (lakeData) {
          map.addLayer({
            id: 'lake-fill',
            type: 'fill',
            source: 'volta-lake',
            paint: {
              'fill-color': '#3B82F6',
              'fill-opacity': 0.65,
            },
          });
        }

        // Volta Region Overall Outline
        if (regionBorderData) {
          map.addLayer({
            id: 'region-outline',
            type: 'line',
            source: 'volta-region',
            paint: {
              'line-color': '#111827', // Gray 900
              'line-width': 3,
              'line-opacity': 0.8,
              'line-dasharray': [2, 2],
            },
          });
        }

        // 2. Districts Shadow
        map.addLayer({
          id: 'districts-shadow',
          type: 'fill',
          source: 'volta',
          paint: {
            'fill-color': FILL_EXPR,
            'fill-opacity': 0.12,
            'fill-translate': [3, 3],
          },
        });

        // 3. Districts Fill (Transparent hover transition)
        map.addLayer({
          id: 'districts-fill',
          type: 'fill',
          source: 'volta',
          paint: {
            'fill-color': FILL_EXPR,
            'fill-opacity': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              0.15, 0.0,
            ],
          },
        });

        // 4. Districts Border
        map.addLayer({
          id: 'districts-border',
          type: 'line',
          source: 'volta',
          paint: {
            'line-color': STROKE_EXPR,
            'line-width': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              5, 3,
            ],
            'line-opacity': 1.0,
          },
        });

        // 5. Districts Hairline
        map.addLayer({
          id: 'districts-hairline',
          type: 'line',
          source: 'volta',
          paint: {
            'line-color': '#ffffff',
            'line-width': 0.7,
            'line-opacity': 0.6,
          },
        });

        // 6. Selected Outline
        map.addLayer({
          id: 'districts-selected',
          type: 'line',
          source: 'volta',
          paint: {
            'line-color': '#1D4ED8',
            'line-width': [
              'case',
              ['boolean', ['feature-state', 'selected'], false],
              3.5, 0.0,
            ],
          },
        });

        // Roads Layer
        if (roadsData) {
          map.addLayer({
            id: 'roads-casing',
            type: 'line',
            source: 'volta-roads',
            layout: {
              'line-cap': 'round',
              'line-join': 'round',
              'visibility': 'none'
            },
            paint: {
              'line-color': '#ffffff',
              'line-width': [
                'interpolate', ['linear'], ['zoom'],
                6, ['match', ['get', 'highway'], ['primary', 'trunk', 'primary_link', 'trunk_link'], 4, ['secondary', 'secondary_link'], 2.8, 2.2],
                12, ['match', ['get', 'highway'], ['primary', 'trunk', 'primary_link', 'trunk_link'], 8, ['secondary', 'secondary_link'], 6, 4.5]
              ],
              'line-opacity': 0.9,
            },
          });

          map.addLayer({
            id: 'roads-line',
            type: 'line',
            source: 'volta-roads',
            layout: {
              'line-cap': 'round',
              'line-join': 'round',
              'visibility': 'none'
            },
            paint: {
              'line-color': [
                'match', ['get', 'highway'],
                ['primary', 'trunk', 'primary_link', 'trunk_link'], '#0f172a',
                ['secondary', 'secondary_link'], '#334155',
                '#64748b'
              ],
              'line-width': [
                'interpolate', ['linear'], ['zoom'],
                6, ['match', ['get', 'highway'], ['primary', 'trunk', 'primary_link', 'trunk_link'], 2.5, ['secondary', 'secondary_link'], 1.8, 1.2],
                12, ['match', ['get', 'highway'], ['primary', 'trunk', 'primary_link', 'trunk_link'], 5.5, ['secondary', 'secondary_link'], 4, 2.5]
              ],
              'line-opacity': 0.9,
            },
          });
        }

        // Facilities Layer
        if (facilitiesData) {
          map.addLayer({
            id: 'facilities-points',
            type: 'circle',
            source: 'volta-facilities',
            paint: {
              'circle-color': '#EF4444',
              'circle-radius': 6,
              'circle-stroke-color': '#ffffff',
              'circle-stroke-width': 2,
              'circle-opacity': 0.9,
            },
          });
          
          map.addLayer({
            id: 'facilities-labels',
            type: 'symbol',
            source: 'volta-facilities',
            layout: {
              'text-field': ['get', 'name'],
              'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
              'text-size': 11,
              'text-anchor': 'left',
              'text-offset': [1, 0],
            },
            paint: {
              'text-color': '#991B1B',
              'text-halo-color': '#ffffff',
              'text-halo-width': 2,
            },
          });
        }

        // 7. District Name Labels
        map.addLayer({
          id: 'districts-labels',
          type: 'symbol',
          source: 'volta',
          layout: {
            'text-field': ['get', 'name'],
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Regular'],
            'text-size': [
              'interpolate', ['linear'], ['zoom'],
              7, 8,
              10, 12,
            ],
            'text-anchor': 'center',
            'text-max-width': 7,
          },
          paint: {
            'text-color': '#1a1d20',
            'text-halo-color': 'rgba(255,255,255,0.95)',
            'text-halo-width': 1.8,
          },
        });

        // 8. Towns Labels (Major: cities & towns)
        if (map.getSource('volta-towns')) {
          map.addLayer({
            id: 'towns-labels-major',
            type: 'symbol',
            source: 'volta-towns',
            filter: ['match', ['get', 'place'], ['city', 'town'], true, false],
            minzoom: 5.5,
            layout: {
              'text-field': ['get', 'name'],
              'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
              'text-size': [
                'interpolate', ['linear'], ['zoom'],
                7, 9.5,
                11, 12.5
              ],
              'text-anchor': 'center',
              'text-max-width': 8,
            },
            paint: {
              'text-color': '#334155', // slate 700
              'text-halo-color': 'rgba(255, 255, 255, 0.95)',
              'text-halo-width': 1.8,
            }
          });

          // Towns Labels (Minor: villages)
          map.addLayer({
            id: 'towns-labels-minor',
            type: 'symbol',
            source: 'volta-towns',
            filter: ['==', ['get', 'place'], 'village'],
            minzoom: 6.5,
            layout: {
              'text-field': ['get', 'name'],
              'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
              'text-size': [
                'interpolate', ['linear'], ['zoom'],
                9, 8.5,
                12, 10.5
              ],
              'text-anchor': 'center',
              'text-max-width': 8,
            },
            paint: {
              'text-color': '#64748b', // slate 500
              'text-halo-color': 'rgba(255, 255, 255, 0.95)',
              'text-halo-width': 1.4,
            }
          });
        }

        // Hover interactions
        let hoveredId = null;
        map.on('mousemove', 'districts-fill', (e) => {
          map.getCanvas().style.cursor = 'pointer';
          if (!e.features.length) return;
          const fid = e.features[0].properties.id;
          if (hoveredId !== null && hoveredId !== fid) {
            map.setFeatureState({ source: 'volta', id: hoveredId }, { hover: false });
          }
          hoveredId = fid;
          map.setFeatureState({ source: 'volta', id: hoveredId }, { hover: true });

          const p = e.features[0].properties;
          const c = RISK_COLORS[p.risk_level] || '#ccc';
          const s = RISK_STROKE[p.risk_level] || '#999';
          popupRef.current.setLngLat(e.lngLat).setHTML(`
            <div style="font-family:'Inter',sans-serif;min-width:145px;">
              <div style="font-weight:700;font-size:13px;color:#1a202c;margin-bottom:5px;border-bottom:2px solid ${c};padding-bottom:4px;">${p.name}</div>
              <div style="display:flex;align-items:center;gap:5px;font-size:11px;">
                <span style="width:8px;height:8px;border-radius:2px;background:${c};border:1px solid ${s};flex-shrink:0;display:inline-block;"></span>
                <strong style="color:${s}">${p.risk_level} Risk</strong>
              </div>
              <div style="font-size:11px;color:#6b7280;margin-top:3px;">Cases: <b style="color:#1a202c">${p.cases}</b> · Pop: <b style="color:#1a202c">${fmt(p.population)}</b></div>
            </div>
          `).addTo(map);
        });

        map.on('mouseleave', 'districts-fill', () => {
          map.getCanvas().style.cursor = '';
          if (hoveredId !== null) {
            map.setFeatureState({ source: 'volta', id: hoveredId }, { hover: false });
          }
          hoveredId = null;
          popupRef.current.remove();
        });

        // Click → select district
        map.on('click', 'districts-fill', (e) => {
          if (!e.features.length) return;
          const f = e.features[0];
          // Clear previous selected state
          geoData.features.forEach(feat => {
            map.setFeatureState({ source: 'volta', id: feat.properties.id }, { selected: false });
          });
          map.setFeatureState({ source: 'volta', id: f.properties.id }, { selected: true });
          const p = f.properties;
          let trend = p.trend;
          if (typeof trend === 'string') { try { trend = JSON.parse(trend); } catch { trend = []; } }
          setSelected({ ...p, trend });
        });
      })
      .catch(err => console.error('Map assets load error:', err));
    });

    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, [geoData]);

  // Layer toggles
  const toggleLayer = useCallback((layerKey) => {
    setLayers(prev => {
      const next = { ...prev, [layerKey]: !prev[layerKey] };
      const map = mapRef.current;
      if (!map) return next;
      const vis = (id, on) => { if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', on ? 'visible' : 'none'); };
      if (layerKey === 'heatmap') {
        vis('districts-fill', next.heatmap);
        vis('districts-shadow', next.heatmap);
      }
      if (layerKey === 'boundaries') {
        vis('districts-border', next.boundaries);
        vis('districts-hairline', next.boundaries);
        vis('districts-selected', next.boundaries);
        vis('districts-labels', next.boundaries);
        vis('towns-labels-major', next.boundaries);
        vis('towns-labels-minor', next.boundaries);
      }
      if (layerKey === 'lake') {
        vis('lake-fill', next.lake);
      }
      if (layerKey === 'roads') {
        vis('roads-line', next.roads);
        vis('roads-casing', next.roads);
      }
      if (layerKey === 'facilities') {
        vis('facilities-points', next.facilities);
        vis('facilities-labels', next.facilities);
      }
      return next;
    });
  }, []);

  return (
    <div className="riskmap-page">
      {/* ── Page Header ── */}
      <div className="riskmap-page-header">
        <h1>Risk Map – Volta Region</h1>
        <p>Interactive epidemiological risk analysis and vulnerability mapping</p>
      </div>

      {/* ── Stats Row ── */}
      <div className="riskmap-stats">
        <div className="rm-stat-card">
          <div className="rm-stat-icon" style={{ background: '#FEF2F2', color: '#EF4444' }}>
            <AlertTriangle size={20} />
          </div>
          <div className="rm-stat-body">
            <span className="rm-stat-label">Overall Risk Level</span>
            <span className="rm-stat-value">High</span>
            <span className="rm-stat-sub"><TrendingUp size={12} color="#EF4444"/> Increased from yesterday</span>
          </div>
        </div>

        <div className="rm-stat-card">
          <div className="rm-stat-icon" style={{ background: '#FEF2F2', color: '#EF4444' }}>
            <Target size={20} />
          </div>
          <div className="rm-stat-body">
            <span className="rm-stat-label">High Risk Districts</span>
            <span className="rm-stat-value">3</span>
            <span className="rm-stat-sub"><TrendingUp size={12} color="#EF4444"/> 1 from yesterday</span>
          </div>
        </div>

        <div className="rm-stat-card">
          <div className="rm-stat-icon" style={{ background: '#FFFBEB', color: '#F59E0B' }}>
            <Activity size={20} />
          </div>
          <div className="rm-stat-body">
            <span className="rm-stat-label">Moderate Risk Districts</span>
            <span className="rm-stat-value">7</span>
            <span className="rm-stat-sub"><Minus size={12} color="#9CA3AF"/> No change</span>
          </div>
        </div>

        <div className="rm-stat-card">
          <div className="rm-stat-icon" style={{ background: '#F0FDF4', color: '#16A34A' }}>
            <ShieldCheck size={20} />
          </div>
          <div className="rm-stat-body">
            <span className="rm-stat-label">Low Risk Districts</span>
            <span className="rm-stat-value">6</span>
            <span className="rm-stat-sub"><TrendingDown size={12} color="#16A34A"/> 1 from yesterday</span>
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

      {/* ── 3-Zone Body ── */}
      <div className="riskmap-body">

        {/* Controls Panel */}
        <div className="rm-controls">
          <div className="rm-controls-section">
            <h4>Disease</h4>
            <div className="rm-select-wrapper">
              <Activity size={16} color="#16A34A" />
              <CustomDropdown 
                className="rm-select custom-dropdown" 
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

          <div className="rm-controls-section">
            <h4>Layers</h4>
            <div className="rm-layer-list">
              {[
                { key: 'heatmap',    label: 'Risk Heatmap', icon: <Map size={14}/> },
                { key: 'boundaries', label: 'District Boundaries', icon: <ShieldCheck size={14}/> },
                { key: 'facilities', label: 'Health Facilities', icon: <Activity size={14}/> },
                { key: 'roads',      label: 'Major Roads', icon: <Wind size={14}/> },
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

          <div className="rm-controls-section">
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
        </div>

        {/* Map */}
        <div className="rm-map-col">
          <div className="rm-map-header">
            <h3>Volta Region – District Risk Map <Info size={14} color="#6b7280" style={{marginLeft: 4, verticalAlign: 'middle'}}/></h3>
          </div>
          <div className="rm-map-zone" ref={mapZoneRef}>
            {!geoData && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5, background: '#f0f4f0', borderRadius: 12, flexDirection: 'column', gap: 8, color: '#6b7280', fontSize: '0.88rem' }}>
                <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite' }} color="#16A34A" />
                Loading map data…
              </div>
            )}
            <div ref={mapContainer} style={{ width: '100%', height: '100%', borderRadius: 12 }} />
            
            <div className="rm-map-controls-right">
              <button onClick={() => mapRef.current?.zoomIn()}><Plus size={16}/></button>
              <button onClick={() => mapRef.current?.zoomOut()}><Minus size={16}/></button>
              <button className="maximize-btn" onClick={() => {
                if (!document.fullscreenElement) {
                  mapZoneRef.current?.requestFullscreen?.().catch(err => console.warn(err));
                } else {
                  document.exitFullscreen?.();
                }
              }}><Maximize size={16}/></button>
            </div>
          </div>

          {/* Outbreak Risk Summary row */}
          <div className="rm-risk-summary">
            <h4>Outbreak Risk Summary</h4>
            <div className="rm-risk-summary-cards">
               <div className="rm-summary-card">
                 <span className="rm-summary-large" style={{color: RISK_COLORS['Very High']}}>3</span>
                 <div className="rm-summary-text">
                   <span className="rm-summary-count">3</span>
                   <span className="rm-summary-label">Very High<br/>Districts</span>
                 </div>
               </div>
               <div className="rm-summary-card">
                 <span className="rm-summary-large" style={{color: RISK_COLORS['High']}}>?</span>
                 <div className="rm-summary-text">
                   <span className="rm-summary-count">7</span>
                   <span className="rm-summary-label">High<br/>Districts</span>
                 </div>
               </div>
               <div className="rm-summary-card">
                 <span className="rm-summary-large" style={{color: RISK_COLORS['Moderate']}}>1</span>
                 <div className="rm-summary-text">
                   <span className="rm-summary-count">6</span>
                   <span className="rm-summary-label">Moderate<br/>Districts</span>
                 </div>
               </div>
               <div className="rm-summary-card">
                 <span className="rm-summary-large" style={{color: RISK_COLORS['Low']}}>3</span>
                 <div className="rm-summary-text">
                   <span className="rm-summary-count">3</span>
                   <span className="rm-summary-label">Low<br/>Districts</span>
                 </div>
               </div>
               <div className="rm-summary-card">
                 <span className="rm-summary-large" style={{color: RISK_COLORS['Very Low']}}>0</span>
                 <div className="rm-summary-text">
                   <span className="rm-summary-count">3</span>
                   <span className="rm-summary-label">Very Low<br/>Districts</span>
                 </div>
               </div>
            </div>
          </div>

          <div className="rm-footer">
            <span>Source: ClimAlerts AI Model</span>
            <span>Data Sources: Ghana Health Service, GMet, DHIMS2, Community Reports</span>
            <span>Last updated: May 23, 2025 08:30 AM</span>
          </div>
        </div>

        {/* Details Panel */}
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
                    <span>Predicted Cases (Next 7 Days)</span>
                  </div>
                  <div className="rm-metric-right">
                    <span className="val">{selected.cases}</span>
                    <span className="trend red">↑ 20%</span>
                  </div>
                </div>

                <div className="rm-metric-list-item">
                  <div className="rm-metric-left">
                    <ShieldCheck size={16} className="icon-green" />
                    <span>Confidence Score</span>
                  </div>
                  <div className="rm-metric-right">
                    <span className="val">{selected.confidence}%</span>
                    <div className="progress-bar-mini"><div className="progress-fill" style={{width: `${selected.confidence}%`}}></div></div>
                  </div>
                </div>

                <div className="rm-metric-list-item">
                  <div className="rm-metric-left">
                    <CloudRain size={16} className="icon-blue" />
                    <span>Rainfall (7 Days)</span>
                  </div>
                  <div className="rm-metric-right">
                    <span className="val">{selected.rainfall} mm</span>
                    <span className="trend green">↑ 35%</span>
                  </div>
                </div>

                <div className="rm-metric-list-item">
                  <div className="rm-metric-left">
                    <Thermometer size={16} className="icon-orange" />
                    <span>Temperature</span>
                  </div>
                  <div className="rm-metric-right">
                    <span className="val">{selected.temperature} °C</span>
                    <span className="trend green">↑ 1.5°C</span>
                  </div>
                </div>

                <div className="rm-metric-list-item">
                  <div className="rm-metric-left">
                    <Droplets size={16} className="icon-blue" />
                    <span>Humidity</span>
                  </div>
                  <div className="rm-metric-right">
                    <span className="val">{selected.humidity}%</span>
                    <span className="trend green">↑ 4%</span>
                  </div>
                </div>

                <div className="rm-metric-list-item">
                  <div className="rm-metric-left">
                    <Users size={16} className="icon-gray" />
                    <span>Population at Risk</span>
                  </div>
                  <div className="rm-metric-right">
                    <span className="val">{fmt(selected.population)}</span>
                  </div>
                </div>

                <div className="rm-metric-list-item">
                  <div className="rm-metric-left">
                    <RefreshCw size={16} className="icon-gray" />
                    <span>Last Updated</span>
                  </div>
                  <div className="rm-metric-right">
                    <span className="val">May 23, 2025 08:30 AM</span>
                  </div>
                </div>
              </div>

              <div className="rm-chart-section">
                <div className="rm-chart-header">
                  <h4>Risk Trend (Ho Municipal)</h4>
                  <div className="rm-chart-filter">Last 7 Days <ChevronDown size={14}/></div>
                </div>
                {selected?.trend?.length > 0 && (
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
                )}
              </div>

              <div className="rm-replay-section">
                <div className="rm-replay-header">
                  <h4>Outbreak Replay</h4>
                  <div className="rm-date-range">
                    <Calendar size={14} /> May 16 - May 23, 2025 <ChevronDown size={14}/>
                  </div>
                </div>
                <div className="rm-replay-controls">
                  <button className="play-btn"><Play size={18} fill="white" /></button>
                  <div className="timeline-track">
                    <div className="timeline-labels">
                      <span>May 16</span><span>May 17</span><span>May 18</span><span>May 19</span><span>May 20</span><span>May 21</span><span>May 22</span><span>May 23</span>
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

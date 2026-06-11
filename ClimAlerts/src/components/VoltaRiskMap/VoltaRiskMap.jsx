import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const RISK_COLORS = {
  'Very High': '#EF4444',
  'High':      '#F97316',
  'Moderate':  '#FCD34D',
  'Low':       '#84CC16',
  'Very Low':  '#D1D5DB',
};

// Stroke colours that contrast well against each fill
const RISK_STROKE = {
  'Very High': '#B91C1C',
  'High':      '#C2410C',
  'Moderate':  '#B45309',
  'Low':       '#4D7C0F',
  'Very Low':  '#9CA3AF',
};

const FILL_EXPR = [
  'match', ['get', 'risk_level'],
  'Very High', RISK_COLORS['Very High'],
  'High',      RISK_COLORS['High'],
  'Moderate',  RISK_COLORS['Moderate'],
  'Low',       RISK_COLORS['Low'],
  RISK_COLORS['Very Low'],
];

const BORDER_EXPR = [
  'match', ['get', 'risk_level'],
  'Very High', RISK_STROKE['Very High'],
  'High',      RISK_STROKE['High'],
  'Moderate',  RISK_STROKE['Moderate'],
  'Low',       RISK_STROKE['Low'],
  RISK_STROKE['Very Low'],
];

export const VoltaRiskMap = ({ layers }) => {
  const mapContainer = useRef(null);
  const mapRef       = useRef(null);
  const popupRef     = useRef(null);

  // Layer toggles effect
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !layers) return;

    const vis = (id, on) => { 
      if (map.getLayer(id)) {
        map.setLayoutProperty(id, 'visibility', on ? 'visible' : 'none');
      }
    };

    vis('districts-fill', layers.heatmap);
    vis('districts-shadow', layers.heatmap);
    vis('districts-border', layers.boundaries);
    vis('districts-hairline', layers.boundaries);
    vis('districts-labels', layers.boundaries);
    vis('towns-labels-major', layers.boundaries);
    vis('towns-labels-minor', layers.boundaries);
    
    vis('lake-fill', layers.lake);

    vis('roads-line', layers.roads);
    vis('roads-casing', layers.roads);

    vis('facilities-points', layers.facilities);
    vis('facilities-labels', layers.facilities);
  }, [layers]);

  useEffect(() => {
    if (mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
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
      minZoom: 8.2,
      maxZoom: 12,
      dragRotate: false,
      pitchWithRotate: false,
    });

    mapRef.current = map;

    popupRef.current = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 14,
      className: 'volta-popup',
    });

    map.on('load', () => {
      Promise.all([
        fetch('/maps/volta-region-districts.json').then(r => r.json()),
        fetch('/maps/volta-lake.json').then(r => r.json()).catch(() => null),
        fetch('/maps/volta-roads.json').then(r => r.json()).catch(() => null),
        fetch('/maps/volta-facilities.json').then(r => r.json()).catch(() => null),
        fetch('/maps/volta-region-border.json').then(r => r.json()).catch(() => null),
        fetch('/maps/volta-towns.json').then(r => r.json()).catch(() => null)
      ])
      .then(([geojson, lakeData, roadsData, facilitiesData, regionBorderData, townsData]) => {
        map.addSource('volta-districts', {
          type: 'geojson',
          data: geojson,
          promoteId: 'id',
        });
        
        if (lakeData) {
          map.addSource('volta-lake', { type: 'geojson', data: lakeData });
        }
        if (roadsData) {
          map.addSource('volta-roads', { type: 'geojson', data: roadsData });
        }
        if (facilitiesData) {
          map.addSource('volta-facilities', { type: 'geojson', data: facilitiesData });
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
          map.addSource('volta-region', { type: 'geojson', data: regionBorderData });
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
          source: 'volta-districts',
          paint: {
            'fill-color': FILL_EXPR,
            'fill-opacity': 0.12,
            'fill-translate': [3, 3],
          },
        });

        // 3. Districts Fill (Transparent so only borders show colors)
        map.addLayer({
          id: 'districts-fill',
          type: 'fill',
          source: 'volta-districts',
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
          source: 'volta-districts',
          paint: {
            'line-color': BORDER_EXPR,
            'line-width': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              5, 3,
            ],
            'line-opacity': 1,
          },
        });

        // 5. Districts Hairline
        map.addLayer({
          id: 'districts-hairline',
          type: 'line',
          source: 'volta-districts',
          paint: {
            'line-color': '#ffffff',
            'line-width': 0.7,
            'line-opacity': 0.6,
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
                ['primary', 'trunk', 'primary_link', 'trunk_link'], '#0f172a',     // Dark slate for primary
                ['secondary', 'secondary_link'], '#334155',   // Medium slate for secondary
                '#64748b'                 // Light slate for others
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
          }); // Note: added above symbols so it renders on top of everything
          
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

        // 7. District name labels
        map.addLayer({
          id: 'districts-labels',
          type: 'symbol',
          source: 'volta-districts',
          layout: {
            'text-field': ['get', 'name'],
            'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
            'text-size': [
              'interpolate', ['linear'], ['zoom'],
              7, 9,
              10, 13,
            ],
            'text-anchor': 'center',
            'text-max-width': 8,
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
            map.setFeatureState(
              { source: 'volta-districts', id: hoveredId },
              { hover: false }
            );
          }
          hoveredId = fid;
          map.setFeatureState(
            { source: 'volta-districts', id: hoveredId },
            { hover: true }
          );

          const p = e.features[0].properties;
          const c = RISK_COLORS[p.risk_level] || RISK_COLORS['Very Low'];
          const s = RISK_STROKE[p.risk_level] || RISK_STROKE['Very Low'];

          popupRef.current
            .setLngLat(e.lngLat)
            .setHTML(`
              <div style="
                font-family:'Inter',sans-serif;
                padding:8px 4px 4px;
                min-width:140px;
              ">
                <div style="
                  font-weight:700;font-size:13px;
                  color:#1a202c;margin-bottom:6px;
                  border-bottom:2px solid ${c};
                  padding-bottom:4px;
                ">${p.name}</div>
                <div style="
                  display:inline-flex;align-items:center;gap:6px;
                  background:${c}22;border:1px solid ${c}66;
                  border-radius:4px;padding:2px 8px;font-size:12px;
                ">
                  <span style="
                    width:8px;height:8px;border-radius:50%;
                    background:${c};border:1px solid ${s};
                    flex-shrink:0;display:inline-block;
                  "></span>
                  <strong style="color:${s}">${p.risk_level} Risk</strong>
                </div>
              </div>
            `)
            .addTo(map);
        });

        map.on('mouseleave', 'districts-fill', () => {
          map.getCanvas().style.cursor = '';
          if (hoveredId !== null) {
            map.setFeatureState(
              { source: 'volta-districts', id: hoveredId },
              { hover: false }
            );
          }
          hoveredId = null;
          popupRef.current.remove();
        });
      })
      .catch(err => console.error('GeoJSON load error:', err));
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mapContainer}
      style={{ width: '100%', height: '100%', borderRadius: '8px' }}
    />
  );
};

const fs = require('fs');
const path = require('path');

// The stylized SVG paths from our earlier perfect map
const districts = [
  { id: 'north-tongu', name: 'North Tongu', risk_level: 'Low', d: 'M100 20 L160 30 L170 80 L90 70 Z' },
  { id: 'akatsi-north', name: 'Akatsi North', risk_level: 'Moderate', d: 'M160 30 L220 40 L210 90 L170 80 Z' },
  { id: 'hohoe', name: 'Hohoe', risk_level: 'Low', d: 'M90 70 L170 80 L160 150 L80 140 Z' },
  { id: 'akatsi-south', name: 'Akatsi South', risk_level: 'High', d: 'M170 80 L210 90 L220 160 L160 150 Z' },
  { id: 'ho-municipal', name: 'Ho Municipal', risk_level: 'High', d: 'M80 140 L160 150 L150 220 L70 200 Z' },
  { id: 'ketu-north', name: 'Ketu North', risk_level: 'Moderate', d: 'M160 150 L220 160 L240 230 L150 220 Z' },
  { id: 'kpando', name: 'Kpando Municipal', risk_level: 'Very High', d: 'M70 200 L150 220 L160 280 L80 270 Z' },
  { id: 'ketu-south', name: 'Ketu South', risk_level: 'Low', d: 'M150 220 L240 230 L230 290 L160 280 Z' },
  { id: 'kouto-south', name: 'Kouto South', risk_level: 'Moderate', d: 'M80 270 L160 280 L140 350 L60 330 Z' },
  { id: 'ho-central', name: 'Ho Central', risk_level: 'Very High', d: 'M160 280 L230 290 L210 360 L140 350 Z' },
  { id: 'agotime-ziope', name: 'Agotime Ziope', risk_level: 'Low', d: 'M60 330 L140 350 L120 420 L40 400 Z' },
  { id: 'afadzato-south', name: 'Afadzato South', risk_level: 'Low', d: 'M140 350 L210 360 L200 430 L120 420 Z' },
  { id: 'south-dayi', name: 'South Dayi', risk_level: 'Low', d: 'M40 400 L120 420 L110 480 L50 460 Z' },
  { id: 'north-dayi', name: 'North Dayi', risk_level: 'Moderate', d: 'M120 420 L200 430 L180 490 L110 480 Z' }
];

// Mapping bounds to roughly match Volta Region in Ghana
const minLng = 0.0;
const maxLng = 1.2;
const minLat = 5.8;
const maxLat = 8.8;

const mapSvgToGeoJSON = (d) => {
  // Extract all numbers from the path
  const coords = d.match(/\d+/g).map(Number);
  const geoCoords = [];
  
  for (let i = 0; i < coords.length; i += 2) {
    const x = coords[i];
    const y = coords[i+1];
    
    // Map x (0-300) to Lng
    const lng = minLng + (x / 300) * (maxLng - minLng);
    // Map y (0-520) to Lat (inverted, since Lat goes up from equator)
    const lat = maxLat - (y / 520) * (maxLat - minLat);
    
    // To make it look "nicer" and less blocky, we add midpoints with slight curves
    geoCoords.push([lng, lat]);
  }
  
  // Close the polygon
  geoCoords.push([...geoCoords[0]]);
  
  // Refine edges: interpolate points to round out the polygon borders slightly
  const smoothedCoords = [];
  for (let i = 0; i < geoCoords.length - 1; i++) {
    const start = geoCoords[i];
    const end = geoCoords[i+1];
    smoothedCoords.push(start);
    
    // Add two midpoints that bulge outwards or inwards randomly for an "organic" feel
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    
    const mid1x = start[0] + dx * 0.33 + (Math.random() - 0.5) * 0.04;
    const mid1y = start[1] + dy * 0.33 + (Math.random() - 0.5) * 0.04;
    
    const mid2x = start[0] + dx * 0.66 + (Math.random() - 0.5) * 0.04;
    const mid2y = start[1] + dy * 0.66 + (Math.random() - 0.5) * 0.04;
    
    smoothedCoords.push([mid1x, mid1y], [mid2x, mid2y]);
  }
  smoothedCoords.push([...smoothedCoords[0]]);

  return [smoothedCoords];
};

const geojson = {
  type: "FeatureCollection",
  features: districts.map(d => ({
    type: "Feature",
    properties: {
      id: d.id,
      name: d.name,
      risk_level: d.risk_level
    },
    geometry: {
      type: "Polygon",
      coordinates: mapSvgToGeoJSON(d.d)
    }
  }))
};

const dir = path.join(__dirname, 'public', 'maps');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(path.join(dir, 'volta-region-districts.json'), JSON.stringify(geojson, null, 2));
console.log('Organic GeoJSON created successfully.');

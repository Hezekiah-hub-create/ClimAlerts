const fs = require('fs');
const path = require('path');

const districts = [
  { id: 'north-tongu', name: 'North Tongu', risk_level: 'Low', coordinates: [[[0.1, 6.1], [0.3, 6.1], [0.3, 6.3], [0.1, 6.3], [0.1, 6.1]]] },
  { id: 'akatsi-north', name: 'Akatsi North', risk_level: 'Moderate', coordinates: [[[0.3, 6.1], [0.5, 6.1], [0.5, 6.3], [0.3, 6.3], [0.3, 6.1]]] },
  { id: 'hohoe', name: 'Hohoe', risk_level: 'Low', coordinates: [[[0.1, 6.3], [0.3, 6.3], [0.3, 6.5], [0.1, 6.5], [0.1, 6.3]]] },
  { id: 'akatsi-south', name: 'Akatsi South', risk_level: 'High', coordinates: [[[0.3, 6.3], [0.5, 6.3], [0.5, 6.5], [0.3, 6.5], [0.3, 6.3]]] },
  { id: 'ho-municipal', name: 'Ho Municipal', risk_level: 'High', coordinates: [[[0.1, 6.5], [0.3, 6.5], [0.3, 6.7], [0.1, 6.7], [0.1, 6.5]]] },
  { id: 'ketu-north', name: 'Ketu North', risk_level: 'Moderate', coordinates: [[[0.3, 6.5], [0.5, 6.5], [0.5, 6.7], [0.3, 6.7], [0.3, 6.5]]] },
  { id: 'kpando', name: 'Kpando Municipal', risk_level: 'Very High', coordinates: [[[0.1, 6.7], [0.3, 6.7], [0.3, 6.9], [0.1, 6.9], [0.1, 6.7]]] },
  { id: 'ketu-south', name: 'Ketu South', risk_level: 'Low', coordinates: [[[0.3, 6.7], [0.5, 6.7], [0.5, 6.9], [0.3, 6.9], [0.3, 6.7]]] },
  { id: 'kouto-south', name: 'Kouto South', risk_level: 'Moderate', coordinates: [[[0.1, 6.9], [0.3, 6.9], [0.3, 7.1], [0.1, 7.1], [0.1, 6.9]]] },
  { id: 'ho-central', name: 'Ho Central', risk_level: 'Very High', coordinates: [[[0.3, 6.9], [0.5, 6.9], [0.5, 7.1], [0.3, 7.1], [0.3, 6.9]]] },
  { id: 'agotime-ziope', name: 'Agotime Ziope', risk_level: 'Low', coordinates: [[[0.1, 7.1], [0.3, 7.1], [0.3, 7.3], [0.1, 7.3], [0.1, 7.1]]] },
  { id: 'south-dayi', name: 'South Dayi', risk_level: 'Low', coordinates: [[[0.3, 7.1], [0.5, 7.1], [0.5, 7.3], [0.3, 7.3], [0.3, 7.1]]] }
];

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
      coordinates: d.coordinates
    }
  }))
};

const dir = path.join(__dirname, 'public', 'maps');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(path.join(dir, 'volta-region-districts.json'), JSON.stringify(geojson, null, 2));
console.log('GeoJSON created successfully.');

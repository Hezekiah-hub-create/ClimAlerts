const fs = require('fs');
const path = require('path');

const features = [
  {
    type: 'Feature',
    properties: { name: 'Ho Teaching Hospital', type: 'Regional Hospital', capacity: 'High' },
    geometry: { type: 'Point', coordinates: [0.47, 6.6] }
  },
  {
    type: 'Feature',
    properties: { name: 'Hohoe Municipal Hospital', type: 'Municipal Hospital', capacity: 'Medium' },
    geometry: { type: 'Point', coordinates: [0.47, 7.15] }
  },
  {
    type: 'Feature',
    properties: { name: 'Margaret Marquart Catholic Hospital (Kpando)', type: 'District Hospital', capacity: 'Medium' },
    geometry: { type: 'Point', coordinates: [0.29, 6.99] }
  },
  {
    type: 'Feature',
    properties: { name: 'Ketu South Municipal Hospital (Aflao)', type: 'Municipal Hospital', capacity: 'Medium' },
    geometry: { type: 'Point', coordinates: [1.14, 6.11] }
  },
  {
    type: 'Feature',
    properties: { name: 'Keta Municipal Hospital', type: 'Municipal Hospital', capacity: 'Medium' },
    geometry: { type: 'Point', coordinates: [0.98, 5.91] }
  },
  {
    type: 'Feature',
    properties: { name: 'Sogakope District Hospital', type: 'District Hospital', capacity: 'Low' },
    geometry: { type: 'Point', coordinates: [0.6, 5.9] }
  }
];

const geojson = {
  type: 'FeatureCollection',
  features
};

const outPath = path.join(__dirname, 'public', 'maps', 'volta-facilities.json');
fs.writeFileSync(outPath, JSON.stringify(geojson, null, 2));
console.log(`Generated mock facilities at ${outPath}`);

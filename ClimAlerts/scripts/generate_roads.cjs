const fs = require('fs');
const path = require('path');

const features = [
  {
    type: 'Feature',
    properties: { name: 'N2 Highway (Eastern Corridor)', type: 'primary' },
    geometry: {
      type: 'LineString',
      coordinates: [
        [0.08, 6.0],
        [0.3, 6.4],
        [0.47, 6.6], // Ho
        [0.42, 6.9],
        [0.47, 7.15], // Hohoe
        [0.35, 7.5],
        [0.45, 7.8],
        [0.55, 8.2]
      ]
    }
  },
  {
    type: 'Feature',
    properties: { name: 'R10 (Ho to Denu)', type: 'secondary' },
    geometry: {
      type: 'LineString',
      coordinates: [
        [0.47, 6.6], // Ho
        [0.6, 6.4],
        [0.8, 6.2],
        [1.0, 6.1] // Denu / Aflao
      ]
    }
  },
  {
    type: 'Feature',
    properties: { name: 'Sogakope-Adidome Road', type: 'secondary' },
    geometry: {
      type: 'LineString',
      coordinates: [
        [0.6, 5.9], // Sogakope
        [0.55, 6.05],
        [0.52, 6.2] // Adidome
      ]
    }
  }
];

const geojson = {
  type: 'FeatureCollection',
  features
};

const outPath = path.join(__dirname, 'public', 'maps', 'volta-roads.json');
fs.writeFileSync(outPath, JSON.stringify(geojson, null, 2));
console.log(`Generated mock roads at ${outPath}`);

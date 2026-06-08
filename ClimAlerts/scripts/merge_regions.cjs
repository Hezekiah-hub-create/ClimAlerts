const fs = require('fs');
const path = require('path');
const turf = require('@turf/turf');

const inPath = path.join(__dirname, 'public', 'maps', 'volta-region-border.json');
const geojson = JSON.parse(fs.readFileSync(inPath, 'utf8'));

if (geojson.features.length >= 2) {
  // Merge Volta and Oti into a single polygon
  let merged = geojson.features[0];
  for (let i = 1; i < geojson.features.length; i++) {
    merged = turf.union(turf.featureCollection([merged, geojson.features[i]]));
  }
  
  merged.properties = { name: 'Volta & Oti Regions Combined' };
  
  const mergedGeojson = {
    type: 'FeatureCollection',
    features: [merged]
  };
  
  fs.writeFileSync(inPath, JSON.stringify(mergedGeojson));
  console.log('Successfully merged Volta and Oti regions into a single continuous outline.');
} else {
  console.log('Not enough features to merge.');
}

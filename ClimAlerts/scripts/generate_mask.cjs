const fs = require('fs');
const path = require('path');
const turf = require('@turf/turf');

const inPath = path.join(__dirname, 'public', 'maps', 'volta-region-border.json');
const geojson = JSON.parse(fs.readFileSync(inPath, 'utf8'));

// The merged feature could be a Polygon or MultiPolygon
const region = geojson.features[0];

// turf.mask creates an inverted polygon (a world polygon with a hole where the region is)
try {
  const maskedPolygon = turf.mask(region);
  const outPath = path.join(__dirname, 'public', 'maps', 'volta-mask.json');
  fs.writeFileSync(outPath, JSON.stringify(maskedPolygon, null, 2));
  console.log('Successfully created inverted mask polygon for Volta Region.');
} catch (e) {
  console.error('Error generating mask:', e);
}

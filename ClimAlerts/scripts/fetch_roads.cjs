const fs = require('fs');
const https = require('https');
const path = require('path');
const turf = require('@turf/turf');

const query = `
[out:json][timeout:60];
(
  way["highway"~"trunk|primary|secondary"](5.5, -0.5, 9.0, 1.2);
);
out body;
>;
out skel qt;
`;

const url = 'https://overpass-api.de/api/interpreter';

console.log('Fetching major roads from Overpass API...');

const req = https.request(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('Received data from Overpass. Converting to GeoJSON...');
      
      // Basic conversion of ways and nodes to LineStrings
      const nodes = {};
      json.elements.forEach(el => {
        if (el.type === 'node') nodes[el.id] = [el.lon, el.lat];
      });

      const features = [];
      json.elements.forEach(el => {
        if (el.type === 'way' && el.nodes) {
          const coords = el.nodes.map(nId => nodes[nId]).filter(Boolean);
          if (coords.length > 1) {
            features.push({
              type: 'Feature',
              properties: {
                highway: el.tags.highway,
                name: el.tags.name || ''
              },
              geometry: {
                type: 'LineString',
                coordinates: coords
              }
            });
          }
        }
      });

      // Filter roads: keep only those that intersect at least one Volta district to exclude Oti Region
      const districtsPath = path.join(__dirname, 'public', 'maps', 'volta-region-districts.json');
      let filteredFeatures = features;
      if (fs.existsSync(districtsPath)) {
        const districts = JSON.parse(fs.readFileSync(districtsPath, 'utf8'));
        filteredFeatures = features.filter(road => {
          try {
            for (const district of districts.features) {
              if (turf.booleanIntersects(road, district)) {
                return true;
              }
            }
          } catch (err) {}
          return false;
        });
      }

      const geojson = {
        type: 'FeatureCollection',
        features: filteredFeatures
      };

      const outPath = path.join(__dirname, 'public', 'maps', 'volta-roads.json');
      fs.writeFileSync(outPath, JSON.stringify(geojson, null, 2));
      console.log(`Saved ${filteredFeatures.length} (filtered from ${features.length}) road features to ${outPath}`);
    } catch (e) {
      console.error('Error parsing or converting:', e);
    }
  });
});

req.on('error', (e) => console.error(e));
req.write('data=' + encodeURIComponent(query));
req.end();

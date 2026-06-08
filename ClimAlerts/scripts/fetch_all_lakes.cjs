const fs = require('fs');
const https = require('https');
const path = require('path');
const osmtogeojson = require('osmtogeojson');

// Bounding box for Volta & Oti regions: [minY, minX, maxY, maxX]
// minY: 5.7, minX: -0.4, maxY: 8.8, maxX: 1.2
const query = `
  [out:json][timeout:120];
  (
    relation["natural"="water"]["water"~"lake|lagoon|reservoir|pond"](5.7, -0.4, 8.8, 1.2);
    way["natural"="water"]["water"~"lake|lagoon|reservoir|pond"](5.7, -0.4, 8.8, 1.2);
    relation["natural"="water"]["name"~"Lake|Lagoon|Volta|Keta|Avu|pond"](5.7, -0.4, 8.8, 1.2);
    way["natural"="water"]["name"~"Lake|Lagoon|Volta|Keta|Avu|pond"](5.7, -0.4, 8.8, 1.2);
    relation["natural"="water"]["name"~"Volta"](5.7, -0.4, 8.8, 1.2);
    way["natural"="water"]["name"~"Volta"](5.7, -0.4, 8.8, 1.2);
  );
  out geom;
`;

const postData = 'data=' + encodeURIComponent(query);

const options = {
  hostname: 'overpass-api.de',
  path: '/api/interpreter',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData),
    'User-Agent': 'ClimAlerts/1.0 (water-fetcher)'
  }
};

console.log('📡 Requesting all lakes and lagoons from Overpass API...');

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    if (res.statusCode !== 200) {
      console.error(`❌ HTTP Error: ${res.statusCode}`);
      return;
    }
    
    try {
      console.log('Parsing OSM JSON...');
      const osmData = JSON.parse(data);
      console.log('Converting to GeoJSON...');
      const geojson = osmtogeojson(osmData);
      
      console.log(`✅ Converted to GeoJSON with ${geojson.features.length} features.`);
      
      // Filter to keep only significant lakes, reservoirs, and named lagoons
      const filteredFeatures = geojson.features.filter(f => {
        const props = f.properties || {};
        const name = props.name || props.tags?.name || '';
        
        // If it has a recognized name, keep it!
        if (name) {
          console.log(`  - Found named water body: "${name}"`);
          return true;
        }
        
        // Otherwise, if it has geometry, filter out tiny ponds to keep performance snappy
        if (f.geometry.type === 'Polygon') {
          return f.geometry.coordinates[0].length > 15;
        } else if (f.geometry.type === 'MultiPolygon') {
          return true;
        }
        return false;
      });
      
      const resultGeojson = {
        type: 'FeatureCollection',
        features: filteredFeatures
      };
      
      console.log(`\n🎉 Filtered to ${filteredFeatures.length} significant water bodies.`);
      
      const outFile = path.join(__dirname, 'public', 'maps', 'volta-lake.json');
      fs.writeFileSync(outFile, JSON.stringify(resultGeojson, null, 2), 'utf8');
      console.log(`💾 Saved to ${outFile} (${(fs.statSync(outFile).size / 1024 / 1024).toFixed(2)} MB)`);
    } catch (e) {
      console.error('❌ Failed to process OSM data:', e);
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Network Error:', e);
});

req.write(postData);
req.end();

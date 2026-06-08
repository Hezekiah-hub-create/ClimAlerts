const fs = require('fs');
const https = require('https');
const path = require('path');
const turf = require('@turf/turf');
const osmtogeojson = require('osmtogeojson');

// Bounding box for Volta Region
const bbox = '5.7, -0.4, 8.8, 1.2';

// 1. Load the Volta Region districts
const districtsPath = path.join(__dirname, 'public', 'maps', 'volta-region-districts.json');
const districts = JSON.parse(fs.readFileSync(districtsPath, 'utf8'));

function queryOverpass(query) {
  const postData = 'data=' + encodeURIComponent(query);
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'overpass-api.de',
      path: '/api/interpreter',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'ClimAlerts/1.0 (details-fetcher)'
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}`));
        } else {
          resolve(JSON.parse(data));
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function run() {
  try {
    // A. FETCH TOWNS
    console.log('📡 Fetching towns and villages in Volta Region from Overpass...');
    const townsQuery = `
      [out:json][timeout:90];
      (
        node["place"~"city|town|village"](${bbox});
      );
      out body;
    `;
    const townsOsm = await queryOverpass(townsQuery);
    const townsGeojson = osmtogeojson(townsOsm);
    
    // Filter towns: keep only those inside the 18 Volta Region districts
    const filteredTowns = townsGeojson.features.filter(f => {
      try {
        for (const dist of districts.features) {
          if (turf.booleanPointInPolygon(f, dist)) {
            f.properties.district_name = dist.properties.name;
            return true;
          }
        }
      } catch (err) {}
      return false;
    });
    
    const townsResult = {
      type: 'FeatureCollection',
      features: filteredTowns.map(f => ({
        type: 'Feature',
        properties: {
          name: f.properties.name || f.properties.tags?.name || 'Unnamed place',
          place: f.properties.place || f.properties.tags?.place || 'village',
          district: f.properties.district_name
        },
        geometry: f.geometry
      }))
    };
    
    const townsFile = path.join(__dirname, 'public', 'maps', 'volta-towns.json');
    fs.writeFileSync(townsFile, JSON.stringify(townsResult, null, 2), 'utf8');
    console.log(`✅ Saved ${townsResult.features.length} towns and villages to ${townsFile}`);

    // B. FETCH ROADS
    console.log('\n📡 Fetching roads in Volta Region from Overpass...');
    const roadsQuery = `
      [out:json][timeout:120];
      (
        way["highway"~"motorway|trunk|primary|secondary|tertiary|unclassified"](${bbox});
      );
      out geom;
    `;
    const roadsOsm = await queryOverpass(roadsQuery);
    const roadsGeojson = osmtogeojson(roadsOsm);
    
    // Filter roads: keep only those that intersect Volta Region districts
    const filteredRoads = roadsGeojson.features.filter(f => {
      try {
        for (const dist of districts.features) {
          if (turf.booleanIntersects(f, dist)) {
            return true;
          }
        }
      } catch (err) {}
      return false;
    });
    
    const roadsResult = {
      type: 'FeatureCollection',
      features: filteredRoads.map(f => ({
        type: 'Feature',
        properties: {
          highway: f.properties.highway || f.properties.tags?.highway || 'primary',
          name: f.properties.name || f.properties.tags?.name || ''
        },
        geometry: f.geometry
      }))
    };
    
    const roadsFile = path.join(__dirname, 'public', 'maps', 'volta-roads.json');
    fs.writeFileSync(roadsFile, JSON.stringify(roadsResult, null, 2), 'utf8');
    console.log(`✅ Saved ${roadsResult.features.length} major road segments to ${roadsFile}`);

  } catch (err) {
    console.error('❌ Error during fetch:', err);
  }
}

run();

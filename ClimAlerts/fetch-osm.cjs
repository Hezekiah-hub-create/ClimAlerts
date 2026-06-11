const https = require('https');
const fs = require('fs');

function fetchOverpass(query, outputFile, type) {
  return new Promise((resolve, reject) => {
    const data = "data=" + encodeURIComponent(query);
    const options = {
      hostname: 'overpass-api.de',
      port: 443,
      path: '/api/interpreter',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(data)
      }
    };
    const req = https.request(options, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (type === 'towns') {
            const geojson = { type: "FeatureCollection", features: [] };
            for (const el of json.elements) {
              if (el.type === 'node' && el.tags && el.tags.name) {
                geojson.features.push({
                  type: "Feature",
                  properties: {
                    place: el.tags.place || 'village',
                    name: el.tags.name
                  },
                  geometry: {
                    type: "Point",
                    coordinates: [el.lon, el.lat]
                  }
                });
              }
            }
            fs.writeFileSync(outputFile, JSON.stringify(geojson));
            console.log(`Saved ${geojson.features.length} towns to ${outputFile}`);
          } else if (type === 'roads') {
            const nodes = {};
            for (const el of json.elements) {
              if (el.type === 'node') {
                nodes[el.id] = [el.lon, el.lat];
              }
            }
            const geojson = { type: "FeatureCollection", features: [] };
            for (const el of json.elements) {
              if (el.type === 'way' && el.tags && el.tags.highway) {
                const coords = [];
                if (!el.nodes) continue;
                for (const nd of el.nodes) {
                  if (nodes[nd]) coords.push(nodes[nd]);
                }
                if (coords.length > 1) {
                  geojson.features.push({
                    type: "Feature",
                    properties: {
                      highway: el.tags.highway,
                      name: el.tags.name || ""
                    },
                    geometry: {
                      type: "LineString",
                      coordinates: coords
                    }
                  });
                }
              }
            }
            fs.writeFileSync(outputFile, JSON.stringify(geojson));
            console.log(`Saved ${geojson.features.length} roads to ${outputFile}`);
          }
          resolve();
        } catch (e) {
          console.error("Error parsing response:", e);
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

const townsQuery = `
[out:json][timeout:60];
area["name"="Volta Region"]["admin_level"="4"]->.searchArea;
(
  node["place"~"city|town|village|hamlet|suburb|neighborhood"](area.searchArea);
);
out body;
`;

const roadsQuery = `
[out:json][timeout:120];
area["name"="Volta Region"]["admin_level"="4"]->.searchArea;
(
  way["highway"~"trunk|primary|secondary|tertiary|unclassified|residential|living_street"](area.searchArea);
);
out body;
>;
out skel qt;
`;

async function main() {
  console.log("Fetching towns...");
  await fetchOverpass(townsQuery, "public/maps/volta-towns.json", "towns");
  console.log("Fetching roads...");
  await fetchOverpass(roadsQuery, "public/maps/volta-roads.json", "roads");
}

main().catch(console.error);

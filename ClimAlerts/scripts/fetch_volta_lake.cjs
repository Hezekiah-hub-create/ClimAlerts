/**
 * fetch_volta_lake.cjs
 * Fetches Lake Volta (Volta Reservoir) from Natural Earth dataset
 * and saves it to public/maps/volta-lake.json
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'ClimAlerts/1.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchJson(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('📡 Fetching Natural Earth lakes dataset…');

  // Natural Earth 10m lakes — includes Volta Reservoir
  const url = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_lakes.geojson';
  const all = await fetchJson(url);

  // Find Lake Volta / Volta Reservoir
  const voltaLake = {
    type: 'FeatureCollection',
    features: all.features.filter(f => {
      const name = (f.properties.name || f.properties.NAME || '').toLowerCase();
      return name.includes('volta');
    }),
  };

  console.log(`✅ Found ${voltaLake.features.length} Volta lake feature(s):`);
  voltaLake.features.forEach(f => console.log(`  - "${f.properties.name}"`));

  const outDir  = path.join(__dirname, 'public', 'maps');
  const outFile = path.join(outDir, 'volta-lake.json');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(outFile, JSON.stringify(voltaLake, null, 2));
  const sizeKb = (fs.statSync(outFile).size / 1024).toFixed(1);
  console.log(`\n🎉 Saved → ${outFile} (${sizeKb} KB)`);
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});

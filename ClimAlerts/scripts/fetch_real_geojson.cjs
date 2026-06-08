/**
 * fetch_real_geojson.cjs
 * Fetches real Volta Region district boundaries from the GeoBoundaries public API,
 * attaches mock risk/health data, and writes to public/maps/volta-region-districts.json
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

// ── Mock health data keyed by district name fragments ────────────────────────
const RISK_DATA = {
  'Ho Municipal':       { risk_level: 'Very High', cases: 156, confidence: 87, rainfall: 142, temperature: 29.8, humidity: 82, population: 177281 },
  'Kpando Municipal':   { risk_level: 'Very High', cases: 112, confidence: 83, rainfall: 138, temperature: 30.1, humidity: 80, population: 109206 },
  'Hohoe Municipal':    { risk_level: 'High',      cases: 89,  confidence: 79, rainfall: 121, temperature: 28.9, humidity: 78, population: 173064 },
  'Ketu South':         { risk_level: 'High',      cases: 74,  confidence: 76, rainfall: 115, temperature: 29.4, humidity: 76, population: 197041 },
  'Ketu North':         { risk_level: 'High',      cases: 61,  confidence: 74, rainfall: 109, temperature: 28.7, humidity: 74, population: 84915  },
  'Akatsi South':       { risk_level: 'Moderate',  cases: 47,  confidence: 70, rainfall: 98,  temperature: 28.3, humidity: 71, population: 76415  },
  'Akatsi North':       { risk_level: 'Moderate',  cases: 39,  confidence: 68, rainfall: 93,  temperature: 27.9, humidity: 69, population: 79120  },
  'North Tongu':        { risk_level: 'Moderate',  cases: 34,  confidence: 65, rainfall: 87,  temperature: 27.6, humidity: 68, population: 91401  },
  'South Tongu':        { risk_level: 'Moderate',  cases: 28,  confidence: 63, rainfall: 82,  temperature: 27.4, humidity: 67, population: 80767  },
  'Afadzato South':     { risk_level: 'Low',       cases: 18,  confidence: 58, rainfall: 71,  temperature: 26.9, humidity: 64, population: 62011  },
  'Biakoye':            { risk_level: 'Low',       cases: 14,  confidence: 55, rainfall: 66,  temperature: 26.6, humidity: 62, population: 63847  },
  'Kadjebi':            { risk_level: 'Low',       cases: 11,  confidence: 53, rainfall: 61,  temperature: 26.3, humidity: 60, population: 79016  },
  'Jasikan':            { risk_level: 'Low',       cases: 9,   confidence: 51, rainfall: 58,  temperature: 26.1, humidity: 59, population: 69823  },
  'Nkwanta South':      { risk_level: 'Low',       cases: 8,   confidence: 50, rainfall: 55,  temperature: 25.9, humidity: 57, population: 153134 },
  'Nkwanta North':      { risk_level: 'Very Low',  cases: 4,   confidence: 46, rainfall: 48,  temperature: 25.5, humidity: 54, population: 68342  },
  'Krachi East':        { risk_level: 'Very Low',  cases: 3,   confidence: 44, rainfall: 44,  temperature: 25.2, humidity: 52, population: 74280  },
  'Krachi West':        { risk_level: 'Very Low',  cases: 2,   confidence: 42, rainfall: 41,  temperature: 25.0, humidity: 51, population: 60117  },
  'Krachi Nchumuru':    { risk_level: 'Very Low',  cases: 2,   confidence: 41, rainfall: 39,  temperature: 24.8, humidity: 50, population: 44820  },
  'North Dayi':         { risk_level: 'Moderate',  cases: 31,  confidence: 64, rainfall: 89,  temperature: 27.7, humidity: 68, population: 51726  },
  'South Dayi':         { risk_level: 'Moderate',  cases: 27,  confidence: 62, rainfall: 85,  temperature: 27.5, humidity: 67, population: 48231  },
  'Agotime-Ziope':      { risk_level: 'Low',       cases: 16,  confidence: 57, rainfall: 69,  temperature: 26.8, humidity: 63, population: 42567  },
  'Agotime Ziope':      { risk_level: 'Low',       cases: 16,  confidence: 57, rainfall: 69,  temperature: 26.8, humidity: 63, population: 42567  },
  'Ho West':            { risk_level: 'High',      cases: 68,  confidence: 75, rainfall: 118, temperature: 29.1, humidity: 77, population: 63914  },
  'Keta Municipal':     { risk_level: 'High',      cases: 55,  confidence: 72, rainfall: 105, temperature: 29.0, humidity: 80, population: 70123  },
  'Anloga':             { risk_level: 'Moderate',  cases: 42,  confidence: 68, rainfall: 95,  temperature: 28.5, humidity: 78, population: 65112  },
  'Central Tongu':      { risk_level: 'Moderate',  cases: 38,  confidence: 65, rainfall: 88,  temperature: 28.0, humidity: 75, population: 59411  },
  'default':            { risk_level: 'Low',       cases: 10,  confidence: 50, rainfall: 60,  temperature: 27.0, humidity: 65, population: 50000  },
};

// Known Volta Region + Oti Region district names (from Ghana 2019 districts)
const VOLTA_DISTRICTS = new Set([
  // Volta Region ONLY (Oti Region excluded)
  'Ho Municipal', 'Ho West', 'Kpando Municipal', 'Hohoe Municipal',
  'Afadzato South', 'South Dayi', 'North Dayi',
  'Agortime-Ziope', 'Agotime Ziope',
  'Ketu North', 'Ketu South', 'Akatsi North', 'Akatsi South',
  'North Tongu', 'South Tongu', 'Central Tongu', 'Adaklu', 'Agotime Kpetoe',
  'Keta Municipal', 'Anloga',
]);

// 7-day trend data generator (mock)
const makeTrend = (baseCases) => {
  return Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    cases: Math.max(0, Math.round(baseCases * (0.7 + Math.random() * 0.6))),
  }));
};

function getRiskData(districtName) {
  // Try exact match first
  if (RISK_DATA[districtName]) return RISK_DATA[districtName];
  // Try partial match
  for (const key of Object.keys(RISK_DATA)) {
    if (key === 'default') continue;
    if (districtName.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(districtName.toLowerCase())) {
      return RISK_DATA[key];
    }
  }
  return RISK_DATA['default'];
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'ClimAlerts/1.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchJson(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('📡 Fetching Volta Region metadata from GeoBoundaries…');

  // Step 1: get the download URL for Ghana ADM2
  const meta = await fetchJson('https://www.geoboundaries.org/api/current/gbOpen/GHA/ADM2/');
  const downloadUrl = meta.gjDownloadURL;
  if (!downloadUrl) throw new Error('No gjDownloadURL in response');

  console.log(`📥 Downloading GeoJSON from: ${downloadUrl}`);
  const fullGhana = await fetchJson(downloadUrl);

  // Step 2: filter to Volta + Oti regions only
  const voltaFeatures = fullGhana.features.filter(f => {
    const name = f.properties.shapeName || '';
    // Exact match
    if (VOLTA_DISTRICTS.has(name)) return true;
    // Partial match (e.g. "Agotime-Ziope" vs "Agotime Ziope")
    for (const d of VOLTA_DISTRICTS) {
      if (name.toLowerCase().replace(/[-\s]/g,'').includes(d.toLowerCase().replace(/[-\s]/g,''))) return true;
    }
    return false;
  });

  console.log(`✅ Found ${voltaFeatures.length} Volta/Oti Region districts`);

  // If filter found nothing fall back to using all features and log them
  const features = voltaFeatures.length > 0 ? voltaFeatures : fullGhana.features;
  if (voltaFeatures.length === 0) {
    console.warn('⚠ Region filter returned 0 — using all Ghana districts as fallback');
    console.log('Available shape names:', fullGhana.features.slice(0, 5).map(f => JSON.stringify(f.properties)));
  }

  // Step 3: attach risk/health data to each feature
  const enriched = {
    type: 'FeatureCollection',
    features: features.map((f, idx) => {
      const name = f.properties.shapeName || f.properties.NAME_2 || f.properties.DISTRICT || `District ${idx + 1}`;
      const data = getRiskData(name);
      return {
        ...f,
        properties: {
          id: f.properties.shapeID || `district-${idx}`,
          name,
          adm1: f.properties.ADM1 || f.properties.REGION || 'Volta',
          risk_level: data.risk_level,
          cases: data.cases,
          confidence: data.confidence,
          rainfall: data.rainfall,
          temperature: data.temperature,
          humidity: data.humidity,
          population: data.population,
          trend: makeTrend(data.cases),
        },
      };
    }),
  };

  const outDir  = path.join(__dirname, 'public', 'maps');
  const outFile = path.join(outDir, 'volta-region-districts.json');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(outFile, JSON.stringify(enriched, null, 2));
  const sizeKb = (fs.statSync(outFile).size / 1024).toFixed(1);
  console.log(`\n🎉 Saved ${enriched.features.length} districts → ${outFile} (${sizeKb} KB)`);

  // Print risk breakdown
  const counts = {};
  enriched.features.forEach(f => {
    counts[f.properties.risk_level] = (counts[f.properties.risk_level] || 0) + 1;
  });
  console.log('Risk breakdown:', counts);
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});

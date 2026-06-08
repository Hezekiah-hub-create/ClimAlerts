const https = require('https');
const fs = require('fs');
const path = require('path');

const districts = [
  'Ho Municipal District, Ghana',
  'Hohoe Municipal District, Ghana',
  'Kpando Municipal District, Ghana',
  'Ketu South Municipal District, Ghana',
  'Ketu North Municipal District, Ghana',
  'Akatsi South District, Ghana',
  'Akatsi North District, Ghana',
  'Adaklu District, Ghana',
  'Agotime Ziope District, Ghana',
  'Central Tongu District, Ghana',
  'North Tongu District, Ghana',
  'South Tongu District, Ghana',
  'South Dayi District, Ghana',
  'North Dayi District, Ghana',
  'Afadzato South District, Ghana',
  'Ho West District, Ghana'
];

const riskLevels = ['Low', 'Moderate', 'High', 'Very High'];
const features = [];
let currentIndex = 0;

function fetchNext() {
  if (currentIndex >= districts.length) {
    const geojson = { type: 'FeatureCollection', features };
    const dir = path.join(__dirname, 'public', 'maps');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    fs.writeFileSync(path.join(dir, 'volta-region-districts.json'), JSON.stringify(geojson, null, 2));
    console.log('Successfully fetched all districts from Nominatim!');
    return;
  }
  
  const query = encodeURIComponent(districts[currentIndex]);
  const url = `https://nominatim.openstreetmap.org/search.php?q=${query}&polygon_geojson=1&format=json`;
  
  const options = {
    headers: {
      'User-Agent': 'ClimAlerts-GeoJSON-Fetcher/1.0 (test@example.com)'
    }
  };
  
  console.log(`Fetching: ${districts[currentIndex]}`);
  https.get(url, options, (res) => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
      try {
        const results = JSON.parse(data);
        if (results && results.length > 0 && results[0].geojson) {
          const rawName = districts[currentIndex].split(',')[0];
          const cleanName = rawName.replace(' District', '').replace(' Municipal', '');
          
          features.push({
            type: 'Feature',
            properties: {
              name: cleanName,
              // Randomly assign a risk level
              risk_level: riskLevels[Math.floor(Math.random() * riskLevels.length)]
            },
            geometry: results[0].geojson
          });
          console.log(`Success: ${cleanName}`);
        } else {
          console.log(`No GeoJSON found for ${districts[currentIndex]}`);
        }
      } catch (err) {
        console.error(`Error parsing ${districts[currentIndex]}:`, err.message);
      }
      currentIndex++;
      setTimeout(fetchNext, 1200); // Respect 1 second rate limit
    });
  }).on('error', err => {
    console.error(`Error fetching ${districts[currentIndex]}:`, err.message);
    currentIndex++;
    setTimeout(fetchNext, 1200);
  });
}

fetchNext();

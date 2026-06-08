const https = require('https');
const fs = require('fs');
const path = require('path');

const adm0Url = 'https://www.geoboundaries.org/api/current/gbOpen/GHA/ADM0/';

https.get(adm0Url, (res) => {
  let metadata = '';
  res.on('data', chunk => metadata += chunk);
  res.on('end', () => {
    try {
      const metaObj = JSON.parse(metadata);
      const downloadUrl = metaObj.gjDownloadURL;
      console.log('Downloading Ghana ADM0 boundary from:', downloadUrl);
      
      https.get(downloadUrl, (geojsonRes) => {
        let geojson = '';
        geojsonRes.on('data', chunk => geojson += chunk);
        geojsonRes.on('end', () => {
          const outPath = path.join(__dirname, 'public', 'maps', 'ghana-border.json');
          fs.writeFileSync(outPath, geojson);
          console.log('Saved ghana border to:', outPath);
        });
      });
    } catch (e) {
      console.error(e);
    }
  });
});

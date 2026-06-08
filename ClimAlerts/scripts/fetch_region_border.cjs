const https = require('https');
const fs = require('fs');
const path = require('path');

const adm1Url = 'https://www.geoboundaries.org/api/current/gbOpen/GHA/ADM1/';

https.get(adm1Url, (res) => {
  let metadata = '';
  res.on('data', chunk => metadata += chunk);
  res.on('end', () => {
    try {
      const metaObj = JSON.parse(metadata);
      const downloadUrl = metaObj.gjDownloadURL;
      console.log('Downloading Ghana ADM1 from:', downloadUrl);
      
      const curlCmd = `curl.exe -L -s "${downloadUrl}"`;
      const { exec } = require('child_process');
      exec(curlCmd, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        const geojson = JSON.parse(stdout);
        
        // Filter for Volta region only (exclude Oti)
        const regionFeatures = geojson.features.filter(f => {
          const name = f.properties.shapeName.toLowerCase();
          return name.includes('volta') && !name.includes('oti');
        });

        const regionGeojson = {
          type: 'FeatureCollection',
          features: regionFeatures
        };

        const outPath = path.join(__dirname, 'public', 'maps', 'volta-region-border.json');
        fs.writeFileSync(outPath, JSON.stringify(regionGeojson, null, 2));
        console.log(`Saved ${regionFeatures.length} region borders to: ${outPath}`);
      });

    } catch (e) {
      console.error(e);
    }
  });
});

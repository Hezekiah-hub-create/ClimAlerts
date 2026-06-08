const fs = require('fs');
const https = require('https');

const query = `
  [out:json][timeout:25];
  relation["natural"="water"]["name"~"Lake Volta"];
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
    'User-Agent': 'ClimAlerts/1.0 (test)'
  }
};

console.log('Fetching Lake Volta...');
const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      if (res.statusCode !== 200) {
        console.error('Error:', res.statusCode, data);
        return;
      }
      fs.writeFileSync('osm_lake.json', data);
      console.log('Done downloading lake data. Size:', data.length);
    } catch (e) {
      console.error('JSON parse error', e);
    }
  });
});
req.write(postData);
req.end();

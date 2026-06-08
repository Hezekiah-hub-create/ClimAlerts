const fs = require('fs');

function processFile(path) {
  let content = fs.readFileSync(path, 'utf8');

  if (!content.includes('CustomDropdown')) {
    content = content.replace(/import \'\.\/[a-zA-Z0-9]+\.css\';/, match => match + '\nimport { CustomDropdown } from \'../../components/common/CustomDropdown\';');
  }

  // Handle select with value and onChange (allow optional parenthesis around 'e')
  content = content.replace(/<select\s+value=\{([^}]+)\}\s+onChange=\{\s*\(?e\)?\s*=>\s*([^(]+)\(e\.target\.value\)\}(?:[^>]*)>\s*([\s\S]*?)<\/select>/g, (match, value, onChangeFn, optionsBlock) => {
    const optionsMatch = [...optionsBlock.matchAll(/<option(?: value=\"([^\"]*)\")?>([^<]*)<\/option>/g)];
    let optionsStr = '[\n';
    optionsMatch.forEach((m) => {
      const val = m[1] !== undefined ? m[1] : m[2];
      optionsStr += `                    { value: '${val}', label: '${m[2]}' },\n`;
    });
    optionsStr += '                  ]';
    return `<CustomDropdown\n                    value={${value}}\n                    onChange={${onChangeFn}}\n                    className="filter-select custom-dropdown"\n                    options={${optionsStr}}\n                  />`;
  });

  // Handle select with only className and no onChange
  content = content.replace(/<select(?: className=\"[^\"]*\")?(?: id=\"[^\"]*\")?(?: name=\"[^\"]*\")?>\s*([\s\S]*?)<\/select>/g, (match, optionsBlock) => {
    const optionsMatch = [...optionsBlock.matchAll(/<option(?: value=\"([^\"]*)\")?>([^<]*)<\/option>/g)];
    let optionsStr = '[\n';
    let firstVal = '';
    optionsMatch.forEach((m, idx) => {
      const val = m[1] !== undefined ? m[1] : m[2];
      if (idx === 0) firstVal = val;
      optionsStr += `                    { value: '${val}', label: '${m[2]}' },\n`;
    });
    optionsStr += '                  ]';
    
    return `<CustomDropdown\n                    value={'${firstVal}'}\n                    onChange={() => {}}\n                    className="filter-select custom-dropdown"\n                    options={${optionsStr}}\n                  />`;
  });

  fs.writeFileSync(path, content, 'utf8');
  console.log('Processed', path);
}

processFile('c:/Users/Hezekiah Tounou/Desktop/ClimAlerts/ClimAlerts/src/pages/Reports/Reports.jsx');
processFile('c:/Users/Hezekiah Tounou/Desktop/ClimAlerts/ClimAlerts/src/pages/RiskMap/RiskMap.jsx');
processFile('c:/Users/Hezekiah Tounou/Desktop/ClimAlerts/ClimAlerts/src/pages/Dashboard/Dashboard.jsx');
processFile('c:/Users/Hezekiah Tounou/Desktop/ClimAlerts/ClimAlerts/src/pages/Alerts/Alerts.jsx');


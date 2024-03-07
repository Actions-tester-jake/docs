const fs = require('fs');
const { runTests } = require("doc-detective-core");

const configPath = 'test-configs/cloud/config.json'

try {
  const rawData = fs.readFileSync(configPath);
  const config = JSON.parse(rawData);

  runTests(config)
    .then(report => console.log('Test Report:', JSON.stringify(report.specs, null, 2)))
    .catch(error => console.error('Error running tests:', error));
} catch (error) {
  console.error('Failed to read config or run tests:', error);
}

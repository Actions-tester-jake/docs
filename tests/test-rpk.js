const fs = require('fs');
const path = require('path');
const { runTests } = require("doc-detective-core");

const configPath = 'test-configs/rpk/config.json';
const outputPath = path.join(process.cwd(), 'test_output.json');
const envFilePath = path.join(process.cwd(), 'setup-tests/docker/.env');

function checkEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error('.env file is required and must be located at setup-tests/rpk/.env');
    console.error('The .env file must contain REDPANDA_VERSION and REDPANDA_CONSOLE_VERSION');
    process.exit(1);
  }

  const envContents = fs.readFileSync(filePath, 'utf8');
  if (!envContents.includes('REDPANDA_VERSION') || !envContents.includes('REDPANDA_CONSOLE_VERSION')) {
    console.error('.env file must contain REDPANDA_VERSION and REDPANDA_CONSOLE_VERSION');
    process.exit(1);
  }
}

try {
  checkEnvFile(envFilePath);
  const rawData = fs.readFileSync(configPath);
  const config = JSON.parse(rawData);

  runTests(config)
    .then((report) => {
      console.log(report)
      const failedSteps = report.specs.flatMap((spec) =>
        spec.tests.flatMap((test) =>
          test.contexts
            .filter(context => context.result === "FAIL")
            .map(context => ({
              ...context,
              file: spec.file, // Include file info for each context
              steps: context.steps.map(step => ({
                ...step,
                ...(step.action === 'typeKeys' && { keys: ['***'] }) // Mask keys if action is typeKeys
              }))
            }))
        )
      );

    if (failedSteps.length > 0) {
      fs.writeFileSync(outputPath, JSON.stringify(failedSteps, null, 2));
      console.log('Failed tests have been written to test_output.json');
    } else {
      console.log('All tests passed.');
    }
  })
  .catch((error) => {
    console.error('Error running tests:', error);
    fs.writeFileSync(outputPath, `Error running tests: ${error}`);
  });
} catch (error) {
  console.error('Failed to read config or run tests:', error);
  fs.writeFileSync(outputPath, `Failed to read config or run tests: ${error}`);
}
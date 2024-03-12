const fs = require('fs');
const path = require('path');
const { runTests } = require("doc-detective-core");

const configPath = 'test-configs/cloud/config.json';
const outputPath = path.join(process.cwd(), 'test_output.json');

try {
  const rawData = fs.readFileSync(configPath);
  const config = JSON.parse(rawData);

  runTests(config)
    .then((report) => {
      const failedSteps = report.specs.flatMap(spec =>
        spec.tests.flatMap(test =>
          test.contexts.flatMap(context =>
            context.steps.filter(step => step.result === "FAIL")
          )
        )
      );

      if (failedSteps.length > 0) {
        const output = JSON.stringify(failedSteps, null, 2);
        fs.writeFileSync(outputPath, output);
        console.log('Failed tests have been written to test_output.json');
      } else {
        console.log('All tests passed.');
        fs.writeFileSync(outputPath, 'All tests passed.');
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

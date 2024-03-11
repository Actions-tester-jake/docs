const fs = require('fs');
const { runTests } = require("doc-detective-core");

const configPath = 'test-configs/cloud/config.json';

try {
  const rawData = fs.readFileSync(configPath);
  const config = JSON.parse(rawData);

  runTests(config)
    .then((report) => {
      const failedTests = report.specs.flatMap((spec) =>
        spec.tests.flatMap((test) =>
          test.contexts.filter(context => context.result === "FAIL")
        )
      );

      if (failedTests.length > 0) {
        console.log('::FAILED_TESTS::' + JSON.stringify(failedTests, null, 2));
      } else {
        console.log('::PASSED::');
      }
    })
    .catch((error) => {
        console.error('Error running tests:', error);
        console.log('::FAILED_TESTS::' + error.message);
    });
} catch (error) {
  console.error('Failed to read config or run tests:', error);
  console.log('::FAILED_TESTS::' + error.message);
}

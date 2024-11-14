const { pathsToModuleNameMapper } = require('ts-jest');
/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  moduleNameMapper: pathsToModuleNameMapper({
    'src/*': ['src/*'],
    'app/*': ['*'],
    'components/*': ['src/components/*'],
    'layouts/*': ['src/layouts/*'],
    'pages/*': ['src/pages/*'],
    'assets/*': ['src/assets/*'],
    'boot/*': ['src/boot/*'],
    'stores/*': ['src/stores/*']
  }, { prefix: '<rootDir>' }),
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testEnvironmentOptions: {

  },
  setupFiles: ['./setupJest.js']
};

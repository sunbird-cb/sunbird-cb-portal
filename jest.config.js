module.exports = {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!.*\\.mjs$)',
  ],
  moduleNameMapper: {
    '^@ws/(.*)$': '<rootDir>/project/ws/$1',
    '@ws-widget/(.*)$': '<rootDir>/library/ws-widget/$1',
    '@ws/author/(.*)$': '<rootDir>/project/ws/author/$1',
    '@ws/app/(.*)$': '<rootDir>/project/ws/app/$1',
    '@ws/viewer/(.*)$': '<rootDir>/project/ws/viewer/$1',
    'worker-loader!.*': '<rootDir>/test/mocks/workerMock.js',
    'pdfjs-dist/build/pdf.worker': '<rootDir>/test/mocks/workerMock.js',
    "^src/environments/environment$": "<rootDir>/src/environments/environment.ts",
    '^@sunbird-cb/collection/src/lib/_common/confirm-dialog/confirm-dialog.component$': '<rootDir>/__mocks__/confirm-dialog.component.js',
  },
  coverageReporters: ["clover", "json", "lcov", "text", "text-summary"],
  collectCoverage: true,
  testResultsProcessor: "jest-sonar-reporter",
  setupFiles: ['zone.js', ]
};
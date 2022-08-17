export default {
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    collectCoverageFrom: [
        "src/**/*.ts",
        "!**/node_modules/**"
    ],
    rootDir: './',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    }
};
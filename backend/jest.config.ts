export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
      '^.+\\.ts$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'js'],
    setupFiles: ['<rootDir>/jest.setup.ts'],
    testTimeout: 80000, 
};

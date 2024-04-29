import type {Config} from 'jest'

export default {
    testPathIgnorePatterns: ["<rootDir>/node_modules/"],
    setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts'],
    setupFiles: ['<rootDir>/tests/jest.polyfills.ts'],
    preset: 'ts-jest',
    moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "identity-obj-proxy"
    },
    transform: {
        '^.+\\.tsx?$': '@swc/jest',
    },
    testEnvironmentOptions: {
        customExportConditions: [''],
    },
} satisfies Config
module.exports = {
    // collectCoverage: true,
    // collectCoverageFrom: ["**/*.{js,vue}", "!**/node_modules/**"],
    moduleFileExtensions: ["js", "vue"],

    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1"
    },

    transform: {
        ".*\\.(vue)$": "vue-jest",
        "^.+\\.js$": "<rootDir>/node_modules/babel-jest",
        ".+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$":
            "jest-transform-stub"
    },
    testMatch: ["**/tests/**/*.test.(js|jsx|ts|tsx)"],
    errorOnDeprecated: true,
    resetMocks: true,
    resetModules: true,
    preset: "@vue/cli-plugin-unit-jest"
};

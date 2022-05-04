module.exports = {
    webpack: {
        configure: {
            ignoreWarnings: [/Failed to parse source map.*node_modules\/@carbon\//],
        },
    },
};
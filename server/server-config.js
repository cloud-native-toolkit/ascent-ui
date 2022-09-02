
class ServerConfig {
    loadOcpOAuthConfig() {
        return this.loadJsonConfig('OCP_OAUTH_CONFIG')
    }

    loadAppIdConfig() {
        return this.loadJsonConfig('APPID_CONFIG')
    }

    loadJsonConfig(envVariableName) {
        const config = process.env[envVariableName]

        if (!config) {
            throw new Error(`Unable to load config from ${envVariableName} environment variable`)
        }

        try {
            return JSON.parse(config)
        } catch (err) {
            throw new Error(`Error parsing ${envVariableName} as json`)
        }
    }
}

module.exports = new ServerConfig()


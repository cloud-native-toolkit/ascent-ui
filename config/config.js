const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();
const cmPath = `${process.cwd()}/config/configmap/.env`;
const secretPath = `${process.cwd()}/config/secret/.env`;
if (fs.existsSync(cmPath))
  dotenv.config({ path: cmPath });
if (fs.existsSync(secretPath))
  dotenv.config({ path: secretPath });

const {
  // Environment Variables
  NODE_ENV,

  // Config Map
  PORT,
  HOSTNAME,
  PROTOCOL,
  EXTERNAL_PORT,
  EXTERNAL_HOSTNAME,
  EXTERNAL_PROTOCOL,
  APP_ENV,
  API_HOST,
  REGION,

  // Secret
  APPID_CONFIG,
  OCP_OAUTH_CONFIG,
} = process.env;

console.log('NODE_ENV: ', NODE_ENV)

// Generated configuration
const isTest = NODE_ENV === 'test';
const isDev = NODE_ENV !== 'production';
const isProd = NODE_ENV === 'production';
const internalUri =
  (PROTOCOL === 'https' && PORT === '443' && `${PROTOCOL}://${HOSTNAME}`) ||
  `${PROTOCOL}://${HOSTNAME}:${PORT}`;
const externalUri =
  (EXTERNAL_PROTOCOL === 'https' &&
    EXTERNAL_PORT === '443' &&
    `${EXTERNAL_PROTOCOL}://${EXTERNAL_HOSTNAME}`) ||
  `${EXTERNAL_PROTOCOL}://${EXTERNAL_HOSTNAME}:${EXTERNAL_PORT}`;

let authConfig = {};
try {
  authConfig = OCP_OAUTH_CONFIG ? JSON.parse(OCP_OAUTH_CONFIG) : JSON.parse(APPID_CONFIG);
} catch (error) {
  if (isProd) throw new Error(`Error parsing auth config ${OCP_OAUTH_CONFIG ? 'OCP_OAUTH_CONFIG' : 'APPID_CONFIG'} as json`)
}

module.exports = {
  isTest,
  isDev,
  internalUri,
  externalUri,
  servicePort: PORT ?? 3000,
  appEnv: APP_ENV,
  apiHost: API_HOST ?? 'http://localhost:3001',
  region: REGION ?? 'unknown',
  authProvider: OCP_OAUTH_CONFIG ? "openshift" : "appid",
  authConfig: authConfig
};

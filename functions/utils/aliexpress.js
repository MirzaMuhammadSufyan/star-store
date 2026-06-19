import crypto from 'node:crypto';

const APP_KEY = '537400';
const BASE_URL = 'https://api.aliexpress.com/sync';

/**
 * Generates the AliExpress API signature.
 * @param {Object} params - The request parameters.
 * @param {string} appSecret - The application secret.
 * @returns {string} The generated signature in uppercase.
 */
export function generateSignature(params, appSecret) {
  const sortedKeys = Object.keys(params).sort();
  let basestring = appSecret;
  for (const key of sortedKeys) {
    basestring += key + params[key];
  }
  basestring += appSecret;

  return crypto.createHash('md5').update(basestring, 'utf8').digest('hex').toUpperCase();
}

/**
 * Calls the AliExpress API.
 * @param {string} method - The API method name.
 * @param {Object} apiParams - The method-specific parameters.
 * @param {Object} env - The Cloudflare Worker environment.
 * @returns {Promise<Object>} The API response.
 */
export async function callAliExpressApi(method, apiParams, env) {
  const appSecret = env.ALIEXPRESS_APP_SECRET;
  if (!appSecret) {
    throw new Error('ALIEXPRESS_APP_SECRET is not configured');
  }

  // Format: YYYY-MM-DD HH:mm:ss
  const now = new Date();
  const timestamp = now.toISOString().replace(/T/, ' ').substring(0, 19);

  const allParams = {
    method,
    app_key: APP_KEY,
    sign_method: 'md5',
    timestamp,
    format: 'json',
    v: '2.0',
    ...apiParams
  };

  const sign = generateSignature(allParams, appSecret);

  const bodyParams = new URLSearchParams();
  for (const [key, value] of Object.entries(allParams)) {
    bodyParams.append(key, value);
  }
  bodyParams.append('sign', sign);

  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    body: bodyParams.toString()
  });

  const contentType = response.headers.get('content-type') || '';

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AliExpress API error (${response.status}): ${errorText.substring(0, 100)}${errorText.length > 100 ? '...' : ''}`);
  }

  if (!contentType.includes('application/json')) {
    const text = await response.text();
    throw new Error(`Expected JSON response from AliExpress, but got ${contentType}. Response: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`);
  }

  return await response.json();
}

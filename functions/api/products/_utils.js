import crypto from 'node:crypto';

export const APP_KEY = "537400";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

/**
 * Helper to generate AliExpress format UTC Timestamp (YYYY-MM-DD HH:mm:ss)
 */
export const getAliExpressTimestamp = () => {
  const now = new Date();
  const pad = (num) => String(num).padStart(2, '0');
  return `${now.getUTCFullYear()}-${pad(now.getUTCMonth()+1)}-${pad(now.getUTCDate())} ${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())}`;
};

/**
 * Helper to compute MD5 Signature. Web Crypto's digest() does not support MD5,
 * so this uses node:crypto (available via the nodejs_compat flag).
 */
export const generateAliExpressSign = (params, secret) => {
  const sortedKeys = Object.keys(params).sort();
  let signString = secret;
  for (const key of sortedKeys) {
    signString += key + params[key];
  }
  signString += secret;

  return crypto.createHash('md5').update(signString, 'utf8').digest('hex').toUpperCase();
};

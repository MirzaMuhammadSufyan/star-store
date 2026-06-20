export const APP_KEY = "537400";
export const APP_SECRET = "2Fvp5xp40Nl0Hg0vZWlHsulkm2VMcwfs";

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
 * Helper to compute MD5 Signature using Web Crypto API
 */
export const generateAliExpressSign = async (params, secret) => {
  const sortedKeys = Object.keys(params).sort();
  let signString = secret;
  for (const key of sortedKeys) {
    signString += key + params[key];
  }
  signString += secret;

  const encoder = new TextEncoder();
  const data = encoder.encode(signString);
  const hashBuffer = await crypto.subtle.digest("MD5", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
};

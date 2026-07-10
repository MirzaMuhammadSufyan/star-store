/**
 * Publish every seed article in one run.
 * Usage: npm run publish:all-articles
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnvFile() {
  const envPath = resolve(__dirname, '../.env');
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvFile();

const { SEED_ARTICLES } = await import('../src/content/seedArticles.js');

for (const article of SEED_ARTICLES) {
  console.log(`\n→ ${article.seedKey}`);
  const result = spawnSync('node', [resolve(__dirname, 'publish-article.mjs'), article.seedKey], {
    stdio: 'inherit',
    env: process.env,
  });
  if (result.status !== 0) {
    console.error(`Failed: ${article.seedKey}`);
    process.exit(result.status || 1);
  }
}

console.log(`\nDone — ${SEED_ARTICLES.length} articles processed.`);

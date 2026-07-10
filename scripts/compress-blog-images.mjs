/**
 * Compress blog cover images: resize to max 1200px wide and convert to WebP.
 * Requires ImageMagick (`magick` on PATH).
 *
 * Usage: node scripts/compress-blog-images.mjs
 */
import { readdirSync, unlinkSync } from 'node:fs';
import { resolve, dirname, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const blogDir = resolve(__dirname, '../public/images/blog');
const MAX_WIDTH = 1200;
const QUALITY = 82;

const images = readdirSync(blogDir).filter((f) => /\.(png|jpe?g)$/i.test(f));

if (images.length === 0) {
  console.log('No images to compress.');
  process.exit(0);
}

let totalBefore = 0;
let totalAfter = 0;

for (const file of images) {
  const input = resolve(blogDir, file);
  const output = resolve(blogDir, `${basename(file, extname(file))}.webp`);

  const before = Number(execFileSync('stat', ['-c', '%s', input], { encoding: 'utf8' }).trim());
  totalBefore += before;

  execFileSync('magick', [
    input,
    '-resize',
    `${MAX_WIDTH}x>`,
    '-strip',
    '-quality',
    String(QUALITY),
    output,
  ]);

  const after = Number(execFileSync('stat', ['-c', '%s', output], { encoding: 'utf8' }).trim());
  totalAfter += after;

  if (file !== basename(output)) {
    unlinkSync(input);
  }

  const saved = ((1 - after / before) * 100).toFixed(1);
  console.log(`${file} → ${basename(output)} (${formatBytes(before)} → ${formatBytes(after)}, -${saved}%)`);
}

console.log(`\nTotal: ${formatBytes(totalBefore)} → ${formatBytes(totalAfter)} (-${((1 - totalAfter / totalBefore) * 100).toFixed(1)}%)`);

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

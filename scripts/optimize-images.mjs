import { mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SOURCE_DIR = path.resolve(process.cwd(), 'src/assets/screenshots-src');
const OUTPUT_DIR = path.resolve(process.cwd(), 'public/screenshots');

// largura do source original: só reduzimos pra baixo, nunca ampliamos.
const MOBILE_WIDTH = {
  'kanban.png': 640,
  'funil.png': 640,
  'dashboard.png': 640,
  'whatsapp.png': 480
};

async function optimize(file) {
  const name = path.basename(file, '.png');
  const srcPath = path.join(SOURCE_DIR, file);
  const mobileWidth = MOBILE_WIDTH[file];

  const image = sharp(srcPath);

  await image
    .clone()
    .webp({ quality: 78 })
    .toFile(path.join(OUTPUT_DIR, `${name}.webp`));

  await image
    .clone()
    .resize({ width: mobileWidth })
    .webp({ quality: 78 })
    .toFile(path.join(OUTPUT_DIR, `${name}-mobile.webp`));

  await image
    .clone()
    .png({ quality: 80, compressionLevel: 9, palette: true })
    .toFile(path.join(OUTPUT_DIR, `${name}-optimized.png`));

  console.log(`[optimize-images] ${file} -> ${name}.webp, ${name}-mobile.webp, ${name}-optimized.png`);
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const entries = await readdir(SOURCE_DIR);
  const sources = entries.filter((entry) => entry.endsWith('.png'));

  if (!sources.length) {
    console.warn('[optimize-images] nenhum PNG-fonte encontrado em src/assets/screenshots-src');
    return;
  }

  for (const file of sources) {
    await optimize(file);
  }
}

main().catch((error) => {
  console.error('[optimize-images] falhou:', error);
  process.exit(1);
});

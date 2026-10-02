import {mkdir, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {rasterizeMosaic} from './mosaic.mjs';

export const compileMosaic = async ({scenes: sources, directory, width = 1800, height = 1080, tileSize = 4.8, seed = 42}) => {
  if (!Number.isFinite(tileSize) || tileSize < 3 || tileSize > 24) throw new Error('Tile size must be between 3 and 24.');
  if (!Number.isFinite(seed)) throw new Error('Seed must be finite.');
  await mkdir(directory, {recursive: true});
  const scenes = [];
  for (const scene of sources) {
    const rendered = [];
    for (const state of ['before', 'after']) {
      const result = await rasterizeMosaic({source: scene[state], width, height, tileSize, seed});
      await writeFile(resolve(directory, `${scene.id}-${state}.png`), result.png);
      rendered.push(result);
    }
    const changed = [];
    const [before, after] = rendered;
    for (let i = 0; i < before.columns * before.rows; i++) {
      const j = i * 3;
      const delta = Math.abs(before.colors[j] - after.colors[j]) + Math.abs(before.colors[j + 1] - after.colors[j + 1]) + Math.abs(before.colors[j + 2] - after.colors[j + 2]);
      if (delta > 10) changed.push(i);
    }
    scenes.push({id: scene.id, columns: before.columns, rows: before.rows, changed});
    process.stdout.write(`${scene.id}: ${before.columns * before.rows} tesserae, ${changed.length} animated tiles\n`);
  }
  const manifest = {width, height, tileSize, seed, scenes};
  await writeFile(resolve(directory, 'manifest.json'), JSON.stringify(manifest));
  return manifest;
};

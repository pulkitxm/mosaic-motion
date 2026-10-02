import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {compileMosaic} from './compile-mosaic.mjs';

const option = (name, fallback) => process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3) ?? fallback;
const beforePath = option('before');
const afterPath = option('after');
const name = option('name', 'custom');
if (!beforePath || !afterPath) throw new Error('Use --before=/path/image.svg --after=/path/image.svg. PNG and JPEG also work.');
if (!/^[a-z0-9-]+$/.test(name)) throw new Error('Name must contain lowercase letters, numbers, or hyphens.');
const [before, after] = await Promise.all([readFile(resolve(beforePath)), readFile(resolve(afterPath))]);
await compileMosaic({
  scenes: [{id: 'portrait', before, after}],
  directory: resolve('public', 'pairs', name),
  tileSize: Number(option('tile-size', 4.8)),
  seed: Number(option('seed', 42)),
});
process.stdout.write(`Use MosaicLab with assetFolder set to pairs/${name} and scene set to portrait.\n`);

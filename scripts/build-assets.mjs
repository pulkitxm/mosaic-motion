import {mkdir, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {artwork, WIDTH, HEIGHT} from './artwork.mjs';
import {noise} from './mosaic.mjs';
import {compileMosaic} from './compile-mosaic.mjs';

const option = (name, fallback) => Number(process.argv.find((a) => a.startsWith(`--${name}=`))?.split('=')[1] ?? fallback);
const tileSize = option('tile-size', 4.8);
const seed = option('seed', 42);
if (!Number.isFinite(tileSize) || tileSize < 3 || tileSize > 24) throw new Error('Tile size must be between 3 and 24.');
if (!Number.isFinite(seed)) throw new Error('Seed must be finite.');
const root = resolve('public');
await mkdir(resolve(root, 'art'), {recursive: true});
await mkdir(resolve(root, 'mosaics'), {recursive: true});
for (const scene of artwork) {
  for (const state of ['before', 'after']) {
    await writeFile(resolve(root, 'art', `${scene.id}-${state}.svg`), scene[state]);
  }
}
await compileMosaic({scenes: artwork, directory: resolve(root, 'mosaics'), width: WIDTH, height: HEIGHT, tileSize, seed});

const seconds = 30;
const rate = 48000;
const count = rate * seconds;
const pcm = Buffer.alloc(count * 4);
const notes = [146.832, 174.614, 220, 261.626, 293.665, 349.228, 440, 523.251];
const events = [0.4, 1.05, 1.85, 3.1, 4.7, 5.65, 6.25, 7.1, 8.1, 9.3, 10.3, 11.1, 12.05, 13.1, 14.4, 15.2, 16.0, 17.2, 18.3, 19.6, 20.4, 21.25, 22.1, 23.4, 24.2, 25.1, 26.4, 27.5];
for (let i = 0; i < count; i++) {
  const t = i / rate;
  const fade = Math.min(1, t / 1.5, (seconds - t) / 2.8);
  let left = 0;
  let right = 0;
  for (let n = 0; n < 4; n++) {
    const f = notes[n * 2] / 2;
    const swell = .06 * (1 + Math.sin(t * .29 + n)) * fade;
    left += Math.sin(t * Math.PI * 2 * f + .9 * Math.sin(t * .14)) * swell;
    right += Math.sin(t * Math.PI * 2 * (f + .12) + .9 * Math.sin(t * .14)) * swell;
  }
  events.forEach((start, j) => {
    const age = t - start;
    if (age < 0 || age > 3.5) return;
    const f = notes[3 + (j % 5)];
    const bell = (Math.sin(age * 2 * Math.PI * f) + .35 * Math.sin(age * 2 * Math.PI * f * 2.008) + .16 * Math.sin(age * 2 * Math.PI * f * 3.97)) * Math.exp(-age * 2) * Math.min(1, age * 70) * .13;
    const tick = (noise(i + j * count, seed) - .5) * Math.exp(-age * 70) * .19;
    left += (bell + tick) * (j % 2 ? .85 : 1) * fade;
    right += (bell + tick) * (j % 2 ? 1 : .85) * fade;
  });
  const pulse = Math.exp(-(t % .625) * 18) * Math.sin(t * 2 * Math.PI * 73.416) * .09 * fade;
  pcm.writeInt16LE(Math.round(Math.tanh(left + pulse) * 25000), i * 4);
  pcm.writeInt16LE(Math.round(Math.tanh(right + pulse) * 25000), i * 4 + 2);
}
const header = Buffer.alloc(44);
header.write('RIFF', 0); header.writeUInt32LE(36 + pcm.length, 4); header.write('WAVEfmt ', 8);
header.writeUInt32LE(16, 16); header.writeUInt16LE(1, 20); header.writeUInt16LE(2, 22);
header.writeUInt32LE(rate, 24); header.writeUInt32LE(rate * 4, 28); header.writeUInt16LE(4, 32);
header.writeUInt16LE(16, 34); header.write('data', 36); header.writeUInt32LE(pcm.length, 40);
await writeFile(resolve(root, 'journey.wav'), Buffer.concat([header, pcm]));
process.stdout.write('Generated original artwork, mosaics, transition manifest, and soundtrack.\n');

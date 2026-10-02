import {clamp, noise} from './math';
import {tileArrival, tileProgress} from './reveal';
import {cameraAt, progressAt, scenes, type SceneTiming} from './timeline';
import type {Assets, EngineSettings, LoadedScene, Manifest} from './types';

type PreparedTile = {x: number; y: number; arrival: number; spin: number; distance: number};
const tileCache = new Map<string, PreparedTile[]>();

const prepareTiles = (scene: LoadedScene, timing: SceneTiming, manifest: Manifest, seed: number) => {
  const key = `${scene.id}:${manifest.tileSize}:${seed}`;
  const existing = tileCache.get(key);
  if (existing) return existing;
  const tiles = scene.changed.map((id) => {
    const x = (id % scene.columns) * manifest.tileSize;
    const y = Math.floor(id / scene.columns) * manifest.tileSize;
    return {
      x, y,
      arrival: tileArrival(x, y, timing, seed),
      spin: (noise(id * 23, seed) - .5) * 2.8,
      distance: 6 + noise(id * 47, seed) * 35,
    };
  });
  tileCache.set(key, tiles);
  return tiles;
};

export const drawPanel = (ctx: CanvasRenderingContext2D, scene: LoadedScene, timing: SceneTiming, manifest: Manifest, progress: number, settings: EngineSettings) => {
  const {width, height, tileSize} = manifest;
  ctx.drawImage(progress >= 1 ? scene.after : scene.before, 0, 0, width, height);
  if (progress <= 0 || progress >= 1) return;
  const tiles = prepareTiles(scene, timing, manifest, settings.seed);
  for (const tile of tiles) {
    const p = tileProgress(progress, tile.arrival, settings.revealSoftness);
    if (p <= 0) continue;
    const w = Math.min(tileSize + .15, width - tile.x);
    const h = Math.min(tileSize + .15, height - tile.y);
    if (p >= 1) {
      ctx.drawImage(scene.after, tile.x, tile.y, w, h, tile.x, tile.y, w, h);
      continue;
    }
    const swell = Math.sin(p * Math.PI);
    const distance = tile.distance * swell * settings.tileMotion;
    const angle = Math.atan2(tile.y - timing.origin[1], tile.x - timing.origin[0]) + 1.65;
    const x = tile.x + Math.cos(angle) * distance;
    const y = tile.y + Math.sin(angle) * distance;
    ctx.fillStyle = `rgba(57,48,34,${swell * .76})`;
    ctx.fillRect(tile.x, tile.y, w, h);
    ctx.save();
    ctx.translate(x + w / 2, y + h / 2);
    ctx.rotate(tile.spin * swell * settings.tileMotion);
    ctx.globalAlpha = clamp(p * 1.5);
    const scale = 1 - swell * .26;
    ctx.scale(scale, scale);
    ctx.drawImage(scene.after, tile.x, tile.y, w, h, -w / 2, -h / 2, w, h);
    ctx.restore();
    if (swell > .65 && noise(Math.floor(tile.x + tile.y * 37), settings.seed) > .73) {
      ctx.fillStyle = `rgba(245,217,144,${swell * .46})`;
      ctx.fillRect(x + w * .2, y - h * .9, w * .24, h * .24);
    }
  }
};

const grainCache = new Map<number, HTMLCanvasElement>();

const grainTile = (seed: number) => {
  const existing = grainCache.get(seed);
  if (existing) return existing;
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const pixels = ctx.createImageData(256, 256);
  for (let i = 0; i < 256 * 256; i++) {
    const value = Math.floor(noise(i, seed) * 255);
    pixels.data.set([value, value, value, 105], i * 4);
  }
  ctx.putImageData(pixels, 0, 0);
  grainCache.set(seed, canvas);
  return canvas;
};

export const drawFinish = (ctx: CanvasRenderingContext2D, width: number, height: number, seconds: number, settings: EngineSettings, cameraSpeed = 0) => {
  if (settings.lighting > 0) {
    const light = ctx.createLinearGradient(-width * .4 + seconds * 50, 0, width * .75 + seconds * 50, height);
    light.addColorStop(0, 'rgba(0,0,0,0)');
    light.addColorStop(.47, `rgba(255,238,187,${settings.lighting * .13})`);
    light.addColorStop(.58, 'rgba(255,248,214,0)');
    light.addColorStop(1, `rgba(37,29,20,${settings.lighting * .10})`);
    ctx.fillStyle = light;
    ctx.fillRect(0, 0, width, height);
  }
  const vignette = ctx.createRadialGradient(width * .51, height * .47, height * .25, width * .5, height * .5, width * .65);
  vignette.addColorStop(0, 'rgba(14,17,16,0)');
  vignette.addColorStop(.65, 'rgba(14,17,16,.04)');
  vignette.addColorStop(1, 'rgba(14,17,16,.38)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
  if (settings.grain > 0) {
    ctx.save();
    ctx.globalAlpha = settings.grain;
    ctx.translate((Math.floor(seconds * 12) * 17) % 256, (Math.floor(seconds * 12) * 29) % 256);
    const grain = ctx.createPattern(grainTile(settings.seed), 'repeat')!;
    ctx.fillStyle = grain;
    ctx.fillRect(-256, -256, width + 512, height + 512);
    ctx.restore();
  }
  if (cameraSpeed > 100) {
    const edge = ctx.createLinearGradient(0, 0, width, 0);
    edge.addColorStop(0, 'rgba(15,18,15,.16)');
    edge.addColorStop(.18, 'rgba(15,18,15,0)');
    edge.addColorStop(.82, 'rgba(15,18,15,0)');
    edge.addColorStop(1, 'rgba(15,18,15,.16)');
    ctx.fillStyle = edge;
    ctx.fillRect(0, 0, width, height);
  }
};

export const drawJourney = (ctx: CanvasRenderingContext2D, assets: Assets, seconds: number, width: number, height: number, settings: EngineSettings) => {
  const {manifest} = assets;
  const camera = cameraAt(seconds, manifest.width);
  const speed = (cameraAt(seconds + 1 / 60, manifest.width).x - camera.x) * 60;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#25251f';
  ctx.fillRect(0, 0, width, height);
  ctx.save();
  const scale = camera.zoom * width / 1920;
  ctx.translate(width / 2, height / 2);
  ctx.scale(scale, scale);
  ctx.translate(-camera.x, -camera.y);
  const halfView = width / scale / 2;
  for (const timing of scenes) {
    if (timing.id === 'card') continue;
    const left = timing.panel * manifest.width;
    if (left > camera.x + halfView || left + manifest.width < camera.x - halfView) continue;
    ctx.save();
    ctx.translate(left, 0);
    if (timing.id === 'dinner' && seconds >= scenes[5].start) {
      drawPanel(ctx, assets.scenes.card, scenes[5], manifest, progressAt(seconds, scenes[5]), settings);
    } else {
      drawPanel(ctx, assets.scenes[timing.id], timing, manifest, progressAt(seconds, timing), settings);
    }
    ctx.restore();
  }
  ctx.restore();
  drawFinish(ctx, width, height, seconds, settings, speed);
  const opening = clamp(seconds / .36);
  if (opening < 1) {
    ctx.fillStyle = `rgba(21,20,16,${1 - opening})`;
    ctx.fillRect(0, 0, width, height);
  }
};

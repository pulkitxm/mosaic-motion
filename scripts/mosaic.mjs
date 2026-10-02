import {createCanvas} from '@napi-rs/canvas';
import sharp from 'sharp';

export const noise = (n, seed = 42) => {
  let h = Math.imul(n ^ seed, 0x45d9f3b);
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
};

const bounded = (n) => Math.max(0, Math.min(255, Math.round(n)));

export const rasterizeMosaic = async ({svg, width, height, tileSize, seed}) => {
  const {data, info} = await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer({resolveWithObject: true});
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#4b4331';
  ctx.fillRect(0, 0, width, height);
  const columns = Math.ceil(width / tileSize);
  const rows = Math.ceil(height / tileSize);
  const colors = new Uint8Array(columns * rows * 3);
  const sample = (x, y) => {
    const pixel = (Math.max(0, Math.min(height - 1, Math.floor(y))) * info.width + Math.max(0, Math.min(width - 1, Math.floor(x)))) * 4;
    return [data[pixel], data[pixel + 1], data[pixel + 2]];
  };
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const id = row * columns + col;
      const jx = (noise(id * 17, seed) - .5) * tileSize * .2;
      const jy = (noise(id * 19, seed) - .5) * tileSize * .15;
      const x = col * tileSize + tileSize / 2 + jx;
      const y = row * tileSize + tileSize / 2 + jy;
      const rgb = sample(x, y);
      colors.set(rgb, id * 3);
      const a = sample(x - 2, y);
      const b = sample(x + 2, y);
      const edge = Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
      const turn = (noise(id * 23, seed) - .5) * .3 + (edge > 95 ? .08 : 0);
      const half = tileSize * (.40 + noise(id * 29, seed) * .045);
      const light = .77 + noise(id * 31, seed) * .47;
      const metal = rgb[0] > rgb[2] * 1.35 && rgb[0] > rgb[1] * 1.05 && rgb[0] > 135;
      const glint = metal && noise(id * 47, seed) > .84 ? 25 : 0;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(turn);
      ctx.beginPath();
      ctx.moveTo(-half, -half + noise(id * 37, seed) * .7);
      ctx.lineTo(half - .25, -half);
      ctx.lineTo(half, half - noise(id * 41, seed) * .7);
      ctx.lineTo(-half + .1, half);
      ctx.closePath();
      ctx.fillStyle = `rgb(${bounded(rgb[0] * light + glint)},${bounded(rgb[1] * light + glint)},${bounded(rgb[2] * light + glint)})`;
      ctx.fill();
      ctx.strokeStyle = metal ? 'rgba(255,240,161,.45)' : 'rgba(255,250,224,.23)';
      ctx.lineWidth = .72;
      ctx.beginPath();
      ctx.moveTo(-half + .5, half - .4);
      ctx.lineTo(-half + .5, -half + .5);
      ctx.lineTo(half - .6, -half + .5);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(17,19,19,.32)';
      ctx.beginPath();
      ctx.moveTo(half - .2, -half + 1);
      ctx.lineTo(half - .2, half - .1);
      ctx.lineTo(-half + .8, half - .1);
      ctx.stroke();
      ctx.restore();
    }
  }
  return {png: canvas.toBuffer('image/png'), colors, columns, rows};
};

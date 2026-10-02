import {createCanvas} from '@napi-rs/canvas';
import sharp from 'sharp';
import {noise, tessera} from '../src/engine/math.ts';
export {noise};

const bounded = (n) => Math.max(0, Math.min(255, Math.round(n)));

export const rasterizeMosaic = async ({source, width, height, tileSize, seed}) => {
  const {data, info} = await sharp(Buffer.from(source)).resize(width, height, {fit: 'cover'}).flatten({background: '#d4ad50'}).ensureAlpha().raw().toBuffer({resolveWithObject: true});
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#5a4c33';
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
      const {x, y, points} = tessera(col, row, tileSize, columns, width, height, seed);
      const rgb = sample(x, y);
      colors.set(rgb, id * 3);
      const light = .84 + noise(id * 31, seed) * .40;
      const metal = rgb[0] > rgb[2] * 1.35 && rgb[0] > rgb[1] * 1.05 && rgb[0] > 135;
      const glint = metal && noise(id * 47, seed) > .84 ? 25 : 0;
      ctx.beginPath();
      ctx.moveTo(...points[0]);
      ctx.lineTo(...points[1]);
      ctx.lineTo(...points[2]);
      ctx.lineTo(...points[3]);
      ctx.closePath();
      ctx.fillStyle = `rgb(${bounded(rgb[0] * light + glint)},${bounded(rgb[1] * light + glint)},${bounded(rgb[2] * light + glint)})`;
      ctx.fill();
      ctx.strokeStyle = metal ? 'rgba(255,240,161,.45)' : 'rgba(255,250,224,.23)';
      ctx.lineWidth = .52;
      ctx.beginPath();
      ctx.moveTo(...points[3]);
      ctx.lineTo(...points[0]);
      ctx.lineTo(...points[1]);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(17,19,19,.32)';
      ctx.beginPath();
      ctx.moveTo(...points[1]);
      ctx.lineTo(...points[2]);
      ctx.lineTo(...points[3]);
      ctx.stroke();
    }
  }
  return {png: canvas.toBuffer('image/png'), colors, columns, rows};
};

export const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));

export const smooth = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

export const ease = (value: number) => {
  const t = clamp(value);
  return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const noise = (n: number, seed = 42) => {
  let h = Math.imul(n ^ seed, 0x45d9f3b);
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
};

export type Point = [number, number];

export const tessera = (column: number, row: number, size: number, columns: number, width: number, height: number, seed: number) => {
  const vertex = (col: number, r: number): Point => {
    const id = r * (columns + 1) + col;
    return [
      clamp(col * size + Math.sin(r * .75) * size * .18 + (noise(id * 17, seed) - .5) * size * .26, 0, width),
      clamp(r * size + (noise(id * 19, seed) - .5) * size * .26, 0, height),
    ];
  };
  const corners = [vertex(column, row), vertex(column + 1, row), vertex(column + 1, row + 1), vertex(column, row + 1)];
  const x = corners.reduce((sum, point) => sum + point[0], 0) / 4;
  const y = corners.reduce((sum, point) => sum + point[1], 0) / 4;
  const inset = .33;
  const points = corners.map(([px, py]): Point => {
    const length = Math.hypot(px - x, py - y);
    const factor = Math.max(0, 1 - inset / Math.max(.01, length));
    return [x + (px - x) * factor, y + (py - y) * factor];
  });
  return {x, y, points};
};

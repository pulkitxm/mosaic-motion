import {clamp, noise, smooth} from './math';
import type {SceneTiming} from './timeline';

export const tileArrival = (x: number, y: number, scene: SceneTiming, seed: number) => {
  const dx = x - scene.origin[0];
  const dy = y - scene.origin[1];
  const radius = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx);
  const tileNoise = noise(Math.floor(x * 13 + y * 73), seed);
  let distance: number;
  if (scene.mode === 'wave') {
    distance = (x - 320) / 1150 + Math.sin(y * .017 + x * .006) * .10;
  } else if (scene.mode === 'curtain') {
    distance = Math.abs(dx) / 680 + (y - 100) / 2400 + Math.sin(x * .018) * .05;
  } else {
    distance = radius / (scene.id === 'portrait' ? 710 : 920) + Math.sin(angle * 3 + radius * .012) * .065;
  }
  return clamp(.04 + distance * .67 + (tileNoise - .5) * .10, .015, .83);
};

export const tileProgress = (progress: number, arrival: number, softness: number) => {
  if (progress <= 0) return 0;
  if (progress >= 1) return 1;
  return smooth((progress - arrival) / (.08 + softness * .12));
};

import {clamp, ease, lerp, smooth} from './math';

export const sceneIds = ['portrait', 'lounge', 'flight', 'suite', 'dinner', 'card'] as const;
export type SceneId = typeof sceneIds[number];
export type RevealMode = 'spiral' | 'wave' | 'curtain';

export type SceneTiming = {
  id: SceneId;
  panel: number;
  start: number;
  duration: number;
  origin: [number, number];
  mode: RevealMode;
};

export const scenes: SceneTiming[] = [
  {id: 'portrait', panel: 0, start: .32, duration: 2.36, origin: [910, 390], mode: 'spiral'},
  {id: 'lounge', panel: 1, start: 5.2, duration: 2.75, origin: [995, 490], mode: 'spiral'},
  {id: 'flight', panel: 2, start: 10.0, duration: 2.9, origin: [600, 475], mode: 'wave'},
  {id: 'suite', panel: 3, start: 14.7, duration: 2.65, origin: [900, 420], mode: 'curtain'},
  {id: 'dinner', panel: 4, start: 20.0, duration: 2.2, origin: [910, 410], mode: 'wave'},
  {id: 'card', panel: 4, start: 23.4, duration: 2.4, origin: [1000, 590], mode: 'spiral'},
];

const panStops = [
  {start: 3.92, end: 5.08, from: 0, to: 1},
  {start: 8.60, end: 9.80, from: 1, to: 2},
  {start: 13.30, end: 14.54, from: 2, to: 3},
  {start: 18.38, end: 19.70, from: 3, to: 4},
];

export const cameraAt = (seconds: number, panelWidth = 1800) => {
  let panel = 0;
  for (const stop of panStops) {
    if (seconds >= stop.start) panel = lerp(stop.from, stop.to, ease((seconds - stop.start) / (stop.end - stop.start)));
  }
  const opening = ease((seconds - .75) / 2.85);
  const final = smooth((seconds - 25.8) / 3.9);
  const breathing = seconds > 4 && seconds < 25.8 ? Math.sin(seconds * .24) * .008 : 0;
  return {
    x: 900 + panel * panelWidth + lerp(26, 0, opening),
    y: lerp(407, 530, opening),
    zoom: lerp(2.72, 1.04, opening) + final * .035 + breathing,
  };
};

export const progressAt = (seconds: number, scene: SceneTiming) => clamp((seconds - scene.start) / scene.duration);

export const timeAt = (frame: number, fps: number, durationSeconds: number) => frame / fps * 30 / durationSeconds;

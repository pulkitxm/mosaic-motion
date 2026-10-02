import type {SceneId} from './timeline';

export type SceneManifest = {
  id: SceneId;
  columns: number;
  rows: number;
  changed: number[];
};

export type Manifest = {
  width: number;
  height: number;
  tileSize: number;
  seed: number;
  scenes: SceneManifest[];
};

export type LoadedScene = SceneManifest & {
  before: HTMLImageElement;
  after: HTMLImageElement;
};

export type Assets = {
  manifest: Manifest;
  scenes: Record<SceneId, LoadedScene>;
};

export type EngineSettings = {
  tileMotion: number;
  revealSoftness: number;
  lighting: number;
  grain: number;
  seed: number;
};

import {useEffect, useState} from 'react';
import {staticFile, useDelayRender} from 'remotion';
import type {Assets, LoadedScene, Manifest} from './types';
import type {SceneId} from './timeline';

const imagePromises = new Map<string, Promise<HTMLImageElement>>();

const imageAt = (path: string) => {
  const url = staticFile(path);
  const existing = imagePromises.get(url);
  if (existing) return existing;
  const pending = new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Cannot load ${path}. Run npm run assets first.`));
    image.src = url;
  });
  imagePromises.set(url, pending);
  return pending;
};

let assetsPromise: Promise<Assets> | undefined;

const loadAssets = () => {
  if (assetsPromise) return assetsPromise;
  assetsPromise = (async () => {
    const response = await fetch(staticFile('mosaics/manifest.json'));
    if (!response.ok) throw new Error('Mosaic assets are missing. Run npm run assets first.');
    const manifest: Manifest = await response.json();
    const loaded = await Promise.all(manifest.scenes.map(async (scene) => {
      const [before, after] = await Promise.all([
        imageAt(`mosaics/${scene.id}-before.png`),
        imageAt(`mosaics/${scene.id}-after.png`),
      ]);
      return {...scene, before, after};
    }));
    return {manifest, scenes: Object.fromEntries(loaded.map((scene) => [scene.id, scene])) as Record<SceneId, LoadedScene>};
  })();
  return assetsPromise;
};

export const useAssets = () => {
  const [assets, setAssets] = useState<Assets | null>(null);
  const {delayRender, continueRender, cancelRender} = useDelayRender();
  const [handle] = useState(() => delayRender('Loading mosaic artwork'));
  useEffect(() => {
    let mounted = true;
    loadAssets().then((loaded) => {
      if (mounted) setAssets(loaded);
      continueRender(handle);
    }).catch(cancelRender);
    return () => {mounted = false;};
  }, [handle, continueRender, cancelRender]);
  return assets;
};

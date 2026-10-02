import {useLayoutEffect, useRef} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {drawFinish, drawPanel} from './engine/draw';
import {clamp} from './engine/math';
import {scenes} from './engine/timeline';
import {useAssets} from './engine/useAssets';
import type {LabProps} from './settings';

export const MosaicLab = (props: LabProps) => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();
  const canvas = useRef<HTMLCanvasElement>(null);
  const assets = useAssets(props.assetFolder);
  useLayoutEffect(() => {
    const ctx = canvas.current?.getContext('2d');
    if (!ctx || !assets) return;
    const base = scenes.find((scene) => scene.id === props.scene)!;
    const timing = props.revealMode === 'automatic' ? base : {...base, mode: props.revealMode, origin: [props.originX, props.originY] as [number, number]};
    const scene = assets.scenes[props.scene];
    if (!scene) throw new Error(`Scene ${props.scene} does not exist in ${props.assetFolder}.`);
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#25251f';
    ctx.fillRect(0, 0, width, height);
    ctx.save();
    const scale = width / 1920;
    ctx.translate(width / 2, height / 2);
    ctx.scale(scale, scale);
    ctx.translate(-900, -540);
    drawPanel(ctx, scene, timing, assets.manifest, clamp((frame / fps - 1) / 4), props);
    ctx.restore();
    drawFinish(ctx, width, height, frame / fps, props);
  }, [assets, frame, fps, width, height, props]);
  return <AbsoluteFill style={{backgroundColor: '#25251f'}}><canvas ref={canvas} width={width} height={height} style={{width: '100%', height: '100%'}} /></AbsoluteFill>;
};

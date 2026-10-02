import {useLayoutEffect, useRef} from 'react';
import {AbsoluteFill, Html5Audio, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {drawJourney} from './engine/draw';
import {timeAt} from './engine/timeline';
import {useAssets} from './engine/useAssets';
import type {JourneyProps} from './settings';

export const MosaicJourney = (props: JourneyProps) => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();
  const canvas = useRef<HTMLCanvasElement>(null);
  const assets = useAssets();
  const seconds = timeAt(frame, fps, props.durationSeconds);
  useLayoutEffect(() => {
    const ctx = canvas.current?.getContext('2d');
    if (ctx && assets) drawJourney(ctx, assets, seconds, width, height, props);
  }, [assets, seconds, width, height, props]);
  return (
    <AbsoluteFill style={{backgroundColor: '#25251f'}}>
      <canvas ref={canvas} width={width} height={height} style={{width: '100%', height: '100%'}} />
      {props.soundtrack ? <Html5Audio src={staticFile('journey.wav')} playbackRate={30 / props.durationSeconds} volume={.8} /> : null}
    </AbsoluteFill>
  );
};

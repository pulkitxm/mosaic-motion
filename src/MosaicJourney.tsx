import {AbsoluteFill, useCurrentFrame} from 'remotion';

export const MosaicJourney = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#191813', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{width: 800, height: 800, borderRadius: '50%', background: '#b89946', transform: `scale(${Math.min(1, frame / 60)})`}} />
    </AbsoluteFill>
  );
};

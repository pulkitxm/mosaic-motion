import {Composition} from 'remotion';
import {MosaicJourney} from './MosaicJourney';
import {MosaicLab} from './MosaicLab';
import {journeySchema, labSchema} from './settings';

export const Root = () => <>
  <Composition
    id="MosaicJourney"
    component={MosaicJourney}
    width={1920}
    height={1080}
    fps={30}
    durationInFrames={900}
    defaultProps={{
      tileMotion: .85,
      revealSoftness: .36,
      lighting: .55,
      grain: .075,
      seed: 42,
      durationSeconds: 30,
      soundtrack: true,
    }}
    schema={journeySchema}
    calculateMetadata={({props}) => ({durationInFrames: Math.round(props.durationSeconds * 30)})}
  />
  <Composition
    id="MosaicLab"
    component={MosaicLab}
    width={1920}
    height={1080}
    fps={30}
    durationInFrames={240}
    defaultProps={{
      tileMotion: .85,
      revealSoftness: .36,
      lighting: .55,
      grain: .075,
      seed: 42,
      scene: 'portrait',
      assetFolder: 'mosaics',
      revealMode: 'automatic',
      originX: 900,
      originY: 440,
    }}
    schema={labSchema}
  />
</>;

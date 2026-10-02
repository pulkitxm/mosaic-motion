import {Composition} from 'remotion';
import {MosaicJourney} from './MosaicJourney';
import {MosaicLab} from './MosaicLab';
import {journeyDefaults, journeySchema, labDefaults, labSchema} from './settings';

export const Root = () => <>
  <Composition
    id="MosaicJourney"
    component={MosaicJourney}
    width={1920}
    height={1080}
    fps={30}
    durationInFrames={900}
    defaultProps={journeyDefaults}
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
    defaultProps={labDefaults}
    schema={labSchema}
  />
</>;

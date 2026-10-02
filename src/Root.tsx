import {Composition} from 'remotion';
import {MosaicJourney} from './MosaicJourney';

export const Root = () => (
  <Composition
    id="MosaicJourney"
    component={MosaicJourney}
    width={1920}
    height={1080}
    fps={30}
    durationInFrames={900}
  />
);

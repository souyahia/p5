import { SketchDetails } from '../sketch';
import { BouncingBallsSketch } from './sketch';
import { BouncingBallsSketchControlPanel } from './panel';

export const BouncingBallsSketchDetails: SketchDetails<BouncingBallsSketch> = {
  name: 'Bouncing Balls',
  create: () => new BouncingBallsSketch(),
  controlPanel: BouncingBallsSketchControlPanel,
};

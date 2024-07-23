import { SketchDetails } from '../sketch';
import { AStarSketch } from './sketch';
import { AStarSketchControlPanel } from './panel';

export const AStarSketchDetails: SketchDetails<AStarSketch> = {
  name: 'A Star',
  create: () => new AStarSketch(),
  controlPanel: AStarSketchControlPanel,
};

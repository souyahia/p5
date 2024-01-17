import { SketchDetails } from '../sketch';
import { DoublePendulumChaosSketch } from './sketch';
import { DoublePendulumChoasSketchControlPanel } from './panel';

export const DoublePendulumChaosSketchDetails: SketchDetails<DoublePendulumChaosSketch> = {
  name: 'Double Pendulum Chaos',
  create: () => new DoublePendulumChaosSketch(),
  controlPanel: DoublePendulumChoasSketchControlPanel,
};

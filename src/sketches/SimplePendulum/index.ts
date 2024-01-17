import { SketchDetails } from '../sketch';
import { SimplePendulumSketch } from './sketch';

export const SimplePendulumSketchDetails: SketchDetails<SimplePendulumSketch> = {
  name: 'Simple Pendulum',
  create: () => new SimplePendulumSketch(),
};

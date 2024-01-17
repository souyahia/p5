import { SketchDetails } from '../sketch';
import { ExampleSketch } from './sketch';
import { ExampleSketchControlPanel } from './panel';

export const ExampleSketchDetails: SketchDetails<ExampleSketch> = {
  name: 'Example',
  create: () => new ExampleSketch(),
  controlPanel: ExampleSketchControlPanel,
};

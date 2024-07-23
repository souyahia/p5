import { Sketch, SketchDetails } from './sketch';
import { ExampleSketchDetails } from './Example';
import { BouncingBallsSketchDetails } from './BouncingBalls';
import { SimplePendulumSketchDetails } from './SimplePendulum';
import { DoublePendulumChaosSketchDetails } from './DoublePendulumChaos';
import { AStarSketchDetails } from './AStar';

export const sketches: SketchDetails<any>[] = [
  ExampleSketchDetails,
  BouncingBallsSketchDetails,
  SimplePendulumSketchDetails,
  DoublePendulumChaosSketchDetails,
  AStarSketchDetails,
];

export function getSketchDetails<T extends Sketch = Sketch>(id: string): SketchDetails<T> {
  const name = id.split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  const sketch = sketches.find((s) => s.name === name);
  if (!sketch) {
    throw new Error(`Sketch not found : ${id}`);
  }
  return sketch;
}

export * from './sketch';
export * from './Example';
export * from './BouncingBalls';
export * from './SimplePendulum';
export * from './DoublePendulumChaos';
export * from './AStar';

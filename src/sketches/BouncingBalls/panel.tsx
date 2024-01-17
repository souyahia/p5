import { SketchControlPanelProps } from '../sketch';
import { BouncingBallsSketch } from './sketch';

export function BouncingBallsSketchControlPanel({ sketch }: SketchControlPanelProps<BouncingBallsSketch>) {
  return <button onClick={() => sketch.resetBalls()}>Reset Balls</button>;
}

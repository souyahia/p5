import { SketchControlPanelProps } from '../sketch';
import { ExampleSketch } from './sketch';

export function ExampleSketchControlPanel({ sketch }: SketchControlPanelProps<ExampleSketch>) {
  return (
    <>
      <button onClick={() => sketch.randomColor()}>Random Color</button>
      <button onClick={() => sketch.changeDirection()}>Change Direction</button>
    </>
  );
}

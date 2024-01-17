import { SketchControlPanelProps } from '../sketch';
import { DoublePendulumChaosSketch } from './sketch';
import { useState } from 'react';

export function DoublePendulumChoasSketchControlPanel({ sketch }: SketchControlPanelProps<DoublePendulumChaosSketch>) {
  const [startAvailable, setStartAvailable] = useState(true);

  const handleStart = () => {
    sketch.start();
    setStartAvailable(false);
  };

  const handleReset = () => {
    sketch.reset();
    setStartAvailable(true);
  };

  return (
    <>
      <button
        onClick={handleStart}
        disabled={!startAvailable}
      >
        Start
      </button>
      <button className="red" onClick={handleReset}>Reset</button>
    </>
  );
}

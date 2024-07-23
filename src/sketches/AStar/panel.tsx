import { useCallback, useEffect, useState } from 'react';
import { SketchControlPanelProps } from '../sketch';
import { AStarSketch, AStarSketchMode, AStarSketchPencilSize } from './sketch';
import styles from './panel.module.css';
import { BinaryHeap, diagonalDistance, euclideanDistance, manhattanDistance } from '../../universe';

const availableHeuristics = [
  { name: 'Manhattan Distance', value: manhattanDistance },
  { name: 'Diagonal Distance', value: diagonalDistance },
  { name: 'Euclidean Distance', value: euclideanDistance },
];

export function AStarSketchControlPanel({ sketch }: SketchControlPanelProps<AStarSketch>) {
  const [isComputingPath, setIsComputingPath] = useState(sketch.isComputingPath);
  const [isFindAvailable, setIsFindAvailable] = useState(sketch.isComputePathAvailable());
  const [mode, setMode] = useState(sketch.mode);
  const [pencilSize, setPencilSize] = useState(sketch.pencilSize);
  const [sizeInput, setSizeInput] = useState(20);
  const [heuristic, setHeuristic] = useState(() => sketch.heuristic);
  const [allowDiagonal, setAllowDiagonal] = useState(sketch.allowDiagonal);
  const [computeTime, setComputeTime] = useState<number | null>(null);

  const handleToggleMode = useCallback((toggle: AStarSketchMode) => {
    const newMode = mode === toggle ? AStarSketchMode.DEFAULT : toggle;
    setMode(newMode);
    sketch.setMode(newMode);
  }, [sketch, mode]);

  const handleClickPencilSize = (value: AStarSketchPencilSize) => {
    setPencilSize(value);
    sketch.setPencilSize(value);
  };

  const handleSelectHeuristic = (selectedName: string) => {
    const heuristic = availableHeuristics.find(({ name }) => name === selectedName);
    if (heuristic) {
      setHeuristic(() => heuristic.value);
      sketch.setHeuristic(heuristic.value);
    }
  };

  const handleToggleAllowDiagonal = (value: boolean) => {
    setAllowDiagonal(value);
    sketch.setAllowDiagonal(value);
  };

  const handleClickFind = () => {
    const startTs = Date.now();
    sketch.computePath().then(() => {
      setComputeTime(Date.now() - startTs);
    });
  };

  useEffect(() => {
    const refreshState = () => {
      setIsComputingPath(sketch.isComputingPath);
      setIsFindAvailable(sketch.isComputePathAvailable());
      setHeuristic(() => sketch.heuristic);
      setAllowDiagonal(sketch.allowDiagonal);
    };

    window.addEventListener('click', refreshState);

    return () => {
      window.removeEventListener('click', refreshState);
    };
  }, [sketch]);

  return (
    <>
      <div className={`${styles['sub-container']} ${styles['create-grid-container']}`}>
        <input
          type="number"
          step={1}
          value={sizeInput}
          onChange={(e) => setSizeInput(Number(e.target.value))}
        />
        <button onClick={() => sketch.createNewGrid(sizeInput, sizeInput)}>Create Grid</button>
      </div>
      <div className={`${styles['sub-container']} ${styles['tools-container']}`}>
        <button
          disabled={isComputingPath}
          className={mode === AStarSketchMode.ADDING_OBSTACLES ? 'red' : 'blue'}
          onClick={() => handleToggleMode(AStarSketchMode.ADDING_OBSTACLES)}
        >
          + Create
        </button>
        <button
          disabled={isComputingPath}
          className={mode === AStarSketchMode.REMOVING_OBSTACLES ? 'red' : 'blue'}
          onClick={() => handleToggleMode(AStarSketchMode.REMOVING_OBSTACLES)}
        >
          - Remove
        </button>
      </div>
      <div className={`${styles['sub-container']} ${styles['pencil-size-container']}`}>
        <button
          disabled={isComputingPath}
          className={pencilSize === AStarSketchPencilSize.SMALL ? 'red' : 'blue'}
          onClick={() => handleClickPencilSize(AStarSketchPencilSize.SMALL)}
        >
          Small
        </button>
        <button
          disabled={isComputingPath}
          className={pencilSize === AStarSketchPencilSize.MEDIUM ? 'red' : 'blue'}
          onClick={() => handleClickPencilSize(AStarSketchPencilSize.MEDIUM)}
        >
          Medium
        </button>
        <button
          disabled={isComputingPath}
          className={pencilSize === AStarSketchPencilSize.BIG ? 'red' : 'blue'}
          onClick={() => handleClickPencilSize(AStarSketchPencilSize.BIG)}
        >
          Big
        </button>
      </div>
      <div className={`${styles['sub-container']} ${styles['config-container']}`}>
        <div className={styles['checkbox-container']}>
          <input
            type='checkbox'
            checked={allowDiagonal}
            onChange={(e) => handleToggleAllowDiagonal(e.target.checked)}
          />
          Allow Diagonal Movements
        </div>
        <select
          value={availableHeuristics.find(({ value }) => value === heuristic)?.name}
          onChange={(e) => handleSelectHeuristic(e.target.value)}
        >
          {availableHeuristics.map(({ name }) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>
      <div className={`${styles['sub-container']} ${styles['pencil-size-container']}`}>
        <button
          disabled={isComputingPath}
          className={mode === AStarSketchMode.PLACING_START ? 'red' : 'blue'}
          onClick={() => handleToggleMode(AStarSketchMode.PLACING_START)}
        >
          Place Start
        </button>
        <button
          disabled={isComputingPath}
          className={mode === AStarSketchMode.PLACING_DESTINATION ? 'red' : 'blue'}
          onClick={() => handleToggleMode(AStarSketchMode.PLACING_DESTINATION)}
        >
          Place Destination
        </button>
      </div>
      <button
        disabled={isComputingPath || !isFindAvailable}
        onClick={handleClickFind}
      >
        Find
      </button>
      <div className={`${styles['sub-container']} ${styles['compute-time-container']}`}>
        Compute time : {computeTime ? `${computeTime}ms` : 'no computation yet'}
      </div>
    </>
  );
}

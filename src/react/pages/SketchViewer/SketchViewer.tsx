/* eslint-disable react-hooks/exhaustive-deps */
import { useParams } from 'react-router-dom';
import styles from './SketchViewer.module.css';
import { getSketchDetails } from '../../../sketches';
import { SketchNavbar } from '../../components/SketchNavbar';
import { palette } from '../../../universe';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';

export function SketchViewer() {
  const [ready, setReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { id } = useParams<{ id: string }>();
  const sketchDetails = getSketchDetails(id ?? '');
  const ControlPanel = sketchDetails.controlPanel;

  useLayoutEffect(() => setReady(true), []);

  const sketch = useMemo(() => {
    const s = sketchDetails.create();
    s.runSketch(containerRef.current);
    return s;
  }, [id, ready]);

  return (
    <div className={styles.container}>
      <SketchNavbar name={sketchDetails.name} />
      <div className={styles.content}>
        <div
          ref={containerRef}
          className={styles.canvasContainer}
          style={{
            backgroundColor: palette.backgroundDark,
          }}
        >
        </div>
        <div className={styles.panelContainer}>
          {ControlPanel && (
            <ControlPanel sketch={sketch} />
          )}
        </div>
      </div>
    </div>
  );
}

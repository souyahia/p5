import { Vector } from 'p5';

export interface Coords {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export function getPoint(event: MouseEvent, canvasOrigin = new Vector(0, 0)): Vector {
  return Vector.add(canvasOrigin, new Vector(event.offsetX, event.offsetY));
}

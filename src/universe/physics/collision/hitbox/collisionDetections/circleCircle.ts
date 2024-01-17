import { Vector } from 'p5';
import { CircleHitbox } from '../circleHitbox';

export function cdCircleCircle(c1: CircleHitbox, c2: CircleHitbox): boolean {
  return c1.pos.dist(c1.pos) <= c1.r + c1.r;
}

export function cnCircleCircle(c1: CircleHitbox, c2: CircleHitbox): Vector | null {
  const normal = Vector.sub(c1.pos, c2.pos);
  const clipDistance = c1.r + c2.r - normal.mag();
  if (clipDistance < 0) {
    return null;
  }
  return normal.normalize().mult(clipDistance);
}

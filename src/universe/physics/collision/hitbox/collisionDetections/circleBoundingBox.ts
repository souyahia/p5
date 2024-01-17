import { Vector } from 'p5';
import { CircleHitbox } from '../circleHitbox';
import { BoundingBox } from '../boundingBox';

export function cdCircleBoundingBox(ch: CircleHitbox, bb: BoundingBox): boolean {
  const bbCorner = bb.corner;
  return (
    ch.pos.x - ch.r <= bb.pos.x
    || ch.pos.x + ch.r >= bbCorner.x
    || ch.pos.y - ch.r <= bb.pos.y
    || ch.pos.y + ch.r >= bbCorner.y
  );
}

export function cnCircleBoundingBox(ch: CircleHitbox, bb: BoundingBox): Vector | null {
  const bbCorner = bb.corner;
  let x = bb.pos.x - (ch.pos.x - ch.r);
  if (x < 0) {
    x = bbCorner.x - (ch.pos.x + ch.r);
    if (x > 0) {
      x = 0;
    }
  }
  let y = bb.pos.y - (ch.pos.y - ch.r);
  if (y < 0) {
    y = bbCorner.y - (ch.pos.y + ch.r);
    if (y > 0) {
      y = 0;
    }
  }
  return (x === 0 && y === 0) ? null : new Vector(x, y);
}

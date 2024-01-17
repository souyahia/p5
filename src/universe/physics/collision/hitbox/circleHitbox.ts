import { Vector } from 'p5';
import { Hitbox } from './hitbox';
import { BoundingBox } from './boundingBox';
import { cdCircleBoundingBox, cdCircleCircle, cnCircleBoundingBox, cnCircleCircle } from './collisionDetections';

export class CircleHitbox extends Hitbox {
  public r = 1;

  constructor(initialState?: Partial<CircleHitbox>) {
    super(initialState);
    if (initialState?.r) {
      this.r = initialState.r;
    }
  }

  isCollidingWith(hitbox: Hitbox): boolean {
    if (hitbox instanceof CircleHitbox) {
      return cdCircleCircle(this, hitbox);
    }
    if (hitbox instanceof BoundingBox) {
      return cdCircleBoundingBox(this, hitbox);
    }
    throw new Error(this.notImplementedMsg(hitbox));
  }

  getCollisionNormalWith(hitbox: Hitbox): Vector | null {
    if (hitbox instanceof CircleHitbox) {
      return cnCircleCircle(this, hitbox);
    }
    if (hitbox instanceof BoundingBox) {
      return cnCircleBoundingBox(this, hitbox);
    }
    throw new Error(this.notImplementedMsg(hitbox));
  }
}

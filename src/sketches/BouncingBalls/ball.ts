import { BoundingBox, changeScale, CircleHitbox, Entity, randomInt, randomNum } from '../../universe';
import { InteractiveCircle } from '../../universe/interactions';
import { Vector } from 'p5';

const MIN_MASS = 1;
const MAX_MASS = 10;
const MIN_RADIUS = 10;
const MAX_RADIUS = 40;
const MIN_VEL = 1;
const MAX_VEL = 10;
const MIN_BUMP = 100;
const MAX_BUMP = 100;

export class Ball extends Entity {
  public color = [
    randomInt(0, 255),
    randomInt(0, 255),
    randomInt(0, 255),
  ];
  public r = 0;

  constructor(bbox: BoundingBox) {
    super();
    this.m = randomInt(MIN_MASS, MAX_MASS);
    this.r = changeScale(
      this.m,
      { min: MIN_MASS, max: MAX_MASS },
      { min: MIN_RADIUS, max: MAX_RADIUS },
    );
    this.pos.set(
      randomInt(bbox.pos.x + this.r, bbox.size.x - this.r),
      randomInt(bbox.pos.y + this.r, bbox.size.y - this.r),
    );
    this.vel.set(1, 1)
      .rotate(randomNum(0, 2 * Math.PI))
      .mult(randomInt(MIN_VEL, MAX_VEL));
    this.hitbox = new CircleHitbox({
      r: this.r,
      pos: this.pos,
    });
    this.interactiveShape = new InteractiveCircle({
      r: this.r,
      pos: this.pos,
    });
    this.interactiveShape.onClick = () => {
      this.bump();
    };
  }

  public bump(): void {
    const bumpForce = new Vector(0, -1)
      .rotate(randomNum(-Math.PI / 4, Math.PI / 4))
      .mult(randomInt(MIN_BUMP, MAX_BUMP));
    this.addForce(bumpForce);
  }
}

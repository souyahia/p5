import { Vector } from 'p5';
import { Hitbox } from './hitbox';

export class BoundingBox extends Hitbox {
  public size = new Vector(1, 1);

  constructor(initialState?: Partial<BoundingBox>) {
    super(initialState);
    if (initialState?.size) {
      this.size.set(initialState.size);
    }
  }

  public get corner(): Vector {
    return Vector.add(this.pos, this.size);
  }

  public isCollidingWith(hitbox: Hitbox): boolean {
    throw new Error(this.notImplementedMsg(hitbox));
  }

  public getCollisionNormalWith(hitbox: Hitbox): Vector | null {
    throw new Error(this.notImplementedMsg(hitbox));
  }

  public set(bbox: BoundingBox): void {
    this.pos.set(bbox.pos);
    this.size.set(bbox.size);
  }
}

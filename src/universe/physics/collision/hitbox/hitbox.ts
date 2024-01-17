import { Vector } from 'p5';

export abstract class Hitbox {
  public readonly pos = new Vector(0, 0);

  protected constructor(initialState?: Partial<Hitbox>) {
    if (initialState?.pos) {
      this.pos.set(initialState.pos);
    }
  }

  public abstract isCollidingWith(hitbox: Hitbox): boolean;
  public abstract getCollisionNormalWith(hitbox: Hitbox): Vector | null;

  protected notImplementedMsg(hitbox: Hitbox): string {
    return `Collision detection between ${this.constructor.name} and ${hitbox.constructor.name} is not implemented.`;
  }
}

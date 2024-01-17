import { Vector } from 'p5';
import { Hitbox } from './collision';
import { InteractiveShape } from '../interactions';

export class Entity {
  public readonly pos = new Vector(0, 0);
  public readonly vel = new Vector(0, 0);
  public readonly acc = new Vector(0, 0);
  public hitbox: Hitbox | null = null;
  public interactiveShape: InteractiveShape | null = null;
  public m = 1;
  public enableCollision = true;
  public enableBBoxCollision = true;
  public enableInteraction = true;

  private forces: Vector[] = [];

  constructor(initialState?: Partial<Entity>) {
    if (initialState?.pos) {
      this.pos.set(initialState.pos);
    }
    if (initialState?.vel) {
      this.vel.set(initialState.vel);
    }
    if (initialState?.acc) {
      this.acc.set(initialState.acc);
    }
    if (initialState?.m) {
      this.m = initialState.m;
    }
    if (initialState?.hitbox) {
      this.hitbox = initialState.hitbox;
    }
    if (initialState?.interactiveShape) {
      this.interactiveShape = initialState.interactiveShape;
    }
    if (initialState?.enableCollision) {
      this.enableCollision = initialState.enableCollision;
    }
    if (initialState?.enableBBoxCollision) {
      this.enableBBoxCollision = initialState.enableBBoxCollision;
    }
    if (initialState?.enableInteraction) {
      this.enableInteraction = initialState.enableInteraction;
    }
    this.moveTo(this.pos);
  }

  public addForce(force: Vector): void {
    this.forces.push(force);
  }

  public update(): void {
    this.acc.set(0, 0);
    this.forces.forEach((force) => this.acc.add(force));
    this.acc.mult(1 / this.m);

    this.vel.add(this.acc);
    this.moveTo(Vector.add(this.pos, this.vel));

    this.forces.length = 0;
  }

  public stop(): void {
    this.forces.length = 0;
    this.acc.set(0, 0);
    this.vel.set(0, 0);
  }

  public moveTo(pos: Vector): void {
    this.pos.set(pos);
    this.hitbox?.pos.set(pos);
    this.interactiveShape?.moveTo(pos);
  }
}

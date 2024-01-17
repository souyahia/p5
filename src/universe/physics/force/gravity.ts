import { Force } from './force';
import { Entity } from '../entity';
import { Vector } from 'p5';

export class GravityForce extends Force {
  public g = new Vector(0, 1);

  constructor(initialState?: Partial<GravityForce>) {
    super();
    if (initialState?.g) {
      this.g.set(initialState.g);
    }
  }

  calculate(entity: Entity): Vector {
    return this.g.copy().mult(entity.m);
  }
}

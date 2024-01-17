import { Force } from './force';
import { Entity } from '../entity';
import { Vector } from 'p5';

export class FrictionForce extends Force {
  public coeff = 1;

  constructor(initialState?: Partial<FrictionForce>) {
    super();
    if (initialState?.coeff) {
      this.coeff = initialState.coeff;
    }
  }

  calculate(entity: Entity): Vector {
    return entity.vel.copy().normalize().mult(-this.coeff * entity.m);
  }
}

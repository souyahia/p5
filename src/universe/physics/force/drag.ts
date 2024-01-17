import { Force } from './force';
import { Entity } from '../entity';
import { Vector } from 'p5';

export class DragForce extends Force {
  public coeff = 0.001;

  constructor(initialState?: Partial<DragForce>) {
    super();
    if (initialState?.coeff) {
      this.coeff = initialState.coeff;
    }
  }

  calculate(entity: Entity): Vector {
    const v = entity.vel.mag();
    return entity.vel.copy().normalize().mult(-this.coeff * v * v);
  }
}

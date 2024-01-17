import { Vector } from 'p5';
import { Entity } from '../entity';

export abstract class Force {
  public abstract calculate(entity: Entity): Vector;

  public applyTo(entity: Entity): void {
    entity.addForce(this.calculate(entity));
  }
}

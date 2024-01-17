import { Entity } from '../entity';
import { BoundingBox } from './hitbox';
import { FrictionForce } from '../force';
import { Vector } from 'p5';

export class CollisionSystem {
  public readonly entities: Entity[] = [];
  public readonly boundingBox?: BoundingBox;
  public readonly friction?: FrictionForce;
  public coeff = 1;
  public useMass = true;

  constructor(initialState?: Partial<CollisionSystem>) {
    if (initialState?.entities) {
      this.entities = initialState.entities;
    }
    if (initialState?.boundingBox) {
      this.boundingBox = initialState.boundingBox;
    }
    if (initialState?.coeff) {
      this.coeff = initialState.coeff;
    }
    if (initialState?.useMass) {
      this.useMass = initialState.useMass;
    }
  }

  public update(): void {
    this.entities.forEach((entity) => {
      this.updateBoundingBoxCollision(entity, this.boundingBox);
      this.entities.forEach((otherEntity) => {
        this.updateEntityCollision(entity, otherEntity);
      });
    });
  }

  private updateBoundingBoxCollision(e: Entity, bb?: BoundingBox): void {
    if (bb && e.enableBBoxCollision && e.hitbox) {
      const normal = e.hitbox.getCollisionNormalWith(bb);
      if (normal) {
        e.moveTo(Vector.add(e.pos, normal));
        const x = normal.x !== 0 ? -e.vel.x : e.vel.x;
        const y = normal.y !== 0 ? -e.vel.y : e.vel.y;
        e.vel.set(x, y);
        this.friction?.applyTo(e);
      }
    }
  }

  private updateEntityCollision(e1: Entity, e2: Entity): void {
    if (e1 !== e2 && e1.enableCollision && e2.enableCollision && e1.hitbox && e2.hitbox) {
      const normal = e1.hitbox.getCollisionNormalWith(e2.hitbox);
      if (normal) {
        const displacement = normal.copy().mult(0.5);
        e1.moveTo(Vector.add(e1.pos, displacement));
        e2.moveTo(Vector.add(e2.pos, displacement.mult(-1)));

        const e1ForceFactor = this.useMass ? e2.m * this.coeff : this.coeff;
        const e2ForceFactor = this.useMass ? -e1.m * this.coeff : -this.coeff;
        normal.normalize();
        e1.addForce(normal.copy().mult(e1ForceFactor));
        e2.addForce(normal.copy().mult(e2ForceFactor));
      }
    }
  }
}

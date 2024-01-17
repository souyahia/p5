import p5, { Vector } from 'p5';
import { Sketch } from '../sketch';
import { BoundingBox, CollisionSystem, DragForce, FrictionForce, GravityForce } from '../../universe';
import { Ball } from './ball';
import { InteractionSystem, InteractiveShape } from '../../universe/interactions';

const G = new Vector(0, 3);
const DRAG_COEFF = 0.001;
const FRICTION_COEFF = 1;
const COLLISION_COEFF = 0.5;
const USE_MASS = true;
const BALL_COUNT = 10;

export class BouncingBallsSketch extends Sketch {
  public balls: Ball[] = [];
  public collisionSystem = new CollisionSystem();
  public interactionSystem = new InteractionSystem();
  public boundingBox: BoundingBox | null = null;
  private gravity = new GravityForce({ g: G });
  private drag = new DragForce({ coeff: DRAG_COEFF });
  private friction = new FrictionForce({ coeff: FRICTION_COEFF });

  protected setup(p: p5): void {
    super.setup(p);
    this.updateBoundingBox();
    this.resetBalls();
  }

  protected draw(p: p5): void {
    super.draw(p);

    p.background(0);
    p.noStroke();
    this.balls.forEach((ball) => {
      p.fill(p.color(ball.color));
      p.circle(ball.pos.x, ball.pos.y, 2 * ball.r);
    });
    this.update();
  }

  public resetBalls(): void {
    if (this.boundingBox) {
      this.balls.length = 0;
      for (let i = 0; i < BALL_COUNT; i++) {
        const ball = new Ball(this.boundingBox);
        this.balls.push(ball);
        this.collisionSystem.entities.push(ball);
        this.interactionSystem?.shapes.push(ball.interactiveShape as InteractiveShape);
      }
    }
  }

  private updateBoundingBox(): void {
    this.boundingBox = new BoundingBox({
      pos: new Vector(0, 0),
      size: new Vector(this.width, this.height),
    });
    this.collisionSystem = new CollisionSystem({
      boundingBox: this.boundingBox,
      friction: this.friction,
      coeff: COLLISION_COEFF,
      useMass: USE_MASS,
    });
  }

  private update(): void {
    this.balls.forEach((ball) => {
      this.gravity.applyTo(ball);
      this.drag.applyTo(ball);
      ball.update();
    });
    this.collisionSystem.update();
    this.interactionSystem.update();
  }
}

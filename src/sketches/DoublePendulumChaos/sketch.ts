import p5, { Vector } from 'p5';
import { Sketch } from '../sketch';
import { DoublePendulum, linearGradient, PolarCoords, randomNum } from '../../universe';

const MIN_A1 = Math.PI / 2;
const MAX_A1 = 3 * Math.PI / 2;
const MIN_A2 = Math.PI / 2;
const MAX_A2 = 3 * Math.PI / 2;
const M1 = 1;
const M2 = 1;
const G = 1;
const DRAG = null;
const PENDULUM_COUNT = 500;
const PENDULUM_ANGLE_INCREMENT = 0.0001;
const COLOR_1 = [104, 0, 184];
const COLOR_2 = [243, 124, 12];

const BOB_D = 0;
const LINE_WIDTH = 2;

const gradient = linearGradient(COLOR_1, COLOR_2, PENDULUM_COUNT);

function createPendulums(width: number, height: number): DoublePendulum[] {
  const r = Math.min(width, height) / 4 - BOB_D / 2;
  let a1 = randomNum(MIN_A1, MAX_A1);
  let a2 = randomNum(MIN_A2, MAX_A2);
  const pendulums: DoublePendulum[] = [];
  for (let i = 0; i < PENDULUM_COUNT; i++) {
    pendulums.push(
      new DoublePendulum({
        coords1: new PolarCoords(a1, r, new Vector(width / 2, height / 2)),
        coords2: new PolarCoords(a2, r),
        m1: M1,
        m2: M2,
        g: G,
        drag: DRAG,
      }),
    );
    a1 = a1 + PENDULUM_ANGLE_INCREMENT;
    a2 = a2 + PENDULUM_ANGLE_INCREMENT;
  }
  return pendulums;
}

export class DoublePendulumChaosSketch extends Sketch {
  public pendulums: DoublePendulum[] = [];
  private isRunning = false;

  public start(): void {
    this.isRunning = true;
  }

  public reset(): void {
    this.isRunning = false;
    this.pendulums = createPendulums(this.width, this.height);
  }

  protected setup(p: p5): void {
    super.setup(p);
    this.reset();
  }

  protected draw(p: p5): void {
    super.draw(p);

    p.background(0);
    if (this.pendulums && this.pendulums.length > 0) {
      this.pendulums.forEach((pendulum, index) => {
        const pos1 = pendulum.coords1.toCartesian();
        const pos2 = pendulum.coords2.toCartesian();

        p.strokeWeight(LINE_WIDTH);
        p.stroke(gradient[index]);
        p.line(pendulum.coords1.origin.x, pendulum.coords1.origin.y, pos1.x, pos1.y);
        p.line(pos1.x, pos1.y, pos2.x, pos2.y);
      });

      if (BOB_D > 0) {
        this.pendulums.forEach((pendulum, index) => {
          const pos1 = pendulum.coords1.toCartesian();
          const pos2 = pendulum.coords2.toCartesian();

          p.noStroke();
          p.fill(gradient[index]);
          p.circle(pos1.x, pos1.y, BOB_D);
          p.circle(pos2.x, pos2.y, BOB_D);
        });
      }
    }
    this.update();
  }

  private update(): void {
    if (this.isRunning) {
      this.pendulums?.forEach((pendulum) => {
        pendulum.update();
      })
    }
  }
}

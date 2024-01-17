import { Vector } from 'p5';
import { PolarCoords } from '../../utils';

export class DoublePendulum {
  public readonly coords1 = new PolarCoords();
  public readonly coords2 = new PolarCoords();
  public readonly canvasOrigin = new Vector(0, 0);
  public a1Vel = 0;
  public a1Acc = 0;
  public a2Vel = 0;
  public a2Acc = 0;
  public m1 = 1;
  public m2 = 1;
  public g = 1;
  public drag: number | null = 0.02;

  constructor(initialState?: Partial<DoublePendulum>) {
    if (initialState?.coords1) {
      this.coords1.set(initialState.coords1);
    }
    if (initialState?.coords2) {
      this.coords2.set(initialState.coords2);
    }
    if (initialState?.canvasOrigin) {
      this.canvasOrigin.set(initialState.canvasOrigin);
    }
    if (initialState?.a1Vel) {
      this.a1Vel = initialState.a1Vel;
    }
    if (initialState?.a1Acc) {
      this.a1Acc = initialState.a1Acc;
    }
    if (initialState?.a2Vel) {
      this.a2Vel = initialState.a2Vel;
    }
    if (initialState?.a2Acc) {
      this.a2Acc = initialState.a2Acc;
    }
    if (initialState?.m1) {
      this.m1 = initialState.m1;
    }
    if (initialState?.m2) {
      this.m2 = initialState.m2;
    }
    if (initialState?.g) {
      this.g = initialState.g;
    }
    if (initialState?.drag !== undefined) {
      this.drag = initialState.drag;
    }
    this.setA1(this.coords1.a);
  }

  public update(): void {
    const { a1Vel, a2Vel, m1, m2, g } = this;
    const { a: a1, r: r1 } = this.coords1;
    const { a: a2, r: r2 } = this.coords2;
    const { cos, sin } = Math;

    this.a1Acc = (-g * (2*m1 + m2) * sin(a1) - m2 * g * sin(a1 - 2*a2) - 2 * sin(a1 - a2) * m2 * (a2Vel*a2Vel * r2 + a1Vel*a1Vel * r1 * cos(a1 - a2)))
      / (r1 * (2*m1 + m2 - m2 * cos(2*a1 - 2*a2)));
    this.a2Acc = (2*sin(a1 - a2) * (a1Vel*a1Vel * r1 * (m1 + m2) + g * (m1 + m2) * cos(a1) + a2Vel*a2Vel * r2 * m2 * cos(a1 - a2)))
      / (r2 * (2*m1 + m2 - m2 * cos(2*a1 - 2*a2)));
    this.a1Vel = this.a1Vel + this.a1Acc;
    this.a2Vel = this.a2Vel + this.a2Acc;
    this.setA1(this.coords1.a + this.a1Vel);
    this.setA2(this.coords2.a + this.a2Vel);

    if (this.drag) {
      this.a1Vel = this.a1Vel * (1 - this.drag);
      this.a2Vel = this.a2Vel * (1 - this.drag);
    }
  }

  public setA1(a1: number): void {
    this.coords1.a = a1;
    this.coords2.origin.set(this.coords1.toCartesian());
  }

  public setA2(a2: number): void {
    this.coords2.a = a2;
  }
}

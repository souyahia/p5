import { Vector } from 'p5';
import { getPoint, PolarCoords } from '../../utils';
import { InteractiveShape } from '../../interactions';

const DOWNWARDS = new Vector(0, 1);

export class Pendulum {
  public readonly coords = new PolarCoords();
  public readonly canvasOrigin = new Vector(0, 0);
  public aVel = 0;
  public aAcc = 0;
  public g = 1;
  public drag: number | null = 0.02;
  public interactiveShape: InteractiveShape | null = null;
  public interactive = true;

  private isUserHoldingBob = false;

  constructor(initialState?: Partial<Pendulum>) {
    if (initialState?.coords) {
      this.coords.set(initialState.coords);
    }
    if (initialState?.canvasOrigin) {
      this.canvasOrigin.set(initialState.canvasOrigin);
    }
    if (initialState?.aVel) {
      this.aVel = initialState.aVel;
    }
    if (initialState?.aAcc) {
      this.aAcc = initialState.aAcc;
    }
    if (initialState?.g) {
      this.g = initialState.g;
    }
    if (initialState?.drag !== undefined) {
      this.drag = initialState.drag;
    }
    if (initialState?.interactive) {
      this.interactive = initialState.interactive;
    }
    if (initialState?.interactiveShape) {
      this.interactiveShape = initialState.interactiveShape;
      this.interactiveShape.moveTo(this.coords.toCartesian());
      this.interactiveShape.onPress = (event) => this.onPress(event);
      this.interactiveShape.onRelease = (event) => this.onRelease(event);
      this.interactiveShape.onDrag = (event) => this.onDrag(event);
    }
  }

  public update(): void {
    if (!this.interactive || !this.isUserHoldingBob) {
      this.aAcc = (-this.g / this.coords.r) * Math.sin(this.coords.a);
      this.aVel = this.aVel + this.aAcc;
      this.moveTo(this.coords.a + this.aVel);
      if (this.drag) {
        this.aVel = this.aVel * (1 - this.drag);
      }
    }
  }

  public moveTo(a: number): void {
    this.coords.a = a;
    this.interactiveShape?.moveTo(this.coords.toCartesian());
  }

  private onPress(event: MouseEvent): void {
    if (this.interactive) {
      this.isUserHoldingBob = true;
    }
  }

  private onRelease(event: MouseEvent): void {
    if (this.interactive) {
      this.isUserHoldingBob = false;
    }
  }

  private onDrag(event: MouseEvent): void {
    if (this.interactive) {
      const a = Vector.angleBetween(
        getPoint(event).sub(this.coords.origin),
        DOWNWARDS,
      );
      this.moveTo(a);
      this.aVel = 0;
    }
  }
}

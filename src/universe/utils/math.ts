import { Vector } from 'p5';

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomNum(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function coinFlip(successRate = 0.5): boolean {
  return Math.random() <= successRate;
}

export interface Scale {
  min: number;
  max: number;
}

export function changeScale(value: number, oldScale: Scale, newScale: Scale): number {
  return newScale.min + ((newScale.max - newScale.min) * (value - oldScale.min) / (oldScale.max - oldScale.min));
}

export class PolarCoords {
  constructor(
    public a = 0,
    public r = 0,
    public origin = new Vector(0, 0),
  ) {}

  public toCartesian(): Vector {
    return new Vector(
      this.origin.x + this.r * Math.sin(this.a),
      this.origin.y + this.r * Math.cos(this.a),
    );
  }

  public set(a: number, r?: number, origin?: Vector): void;
  public set(a: PolarCoords): void;
  public set(a: PolarCoords | number, r?: number, origin?: Vector): void {
    if (typeof a === 'number') {
      this.a = a;
      if (r !== undefined) {
        this.r = r;
      }
      if (origin) {
        this.origin.set(origin);
      }
    } else {
      this.a = a.a;
      this.r = a.r;
      this.origin.set(a.origin);
    }
  }
}

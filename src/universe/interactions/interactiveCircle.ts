import { InteractiveShape } from './interactiveShape';
import { Vector } from 'p5';

export class InteractiveCircle extends InteractiveShape {
  public r = 0;

  constructor(initialState?: Partial<InteractiveCircle>) {
    super(initialState);
    if (initialState?.r) {
      this.r = initialState.r;
    }
  }

  protected isInside(point: Vector): boolean {
    return Vector.add(this.pos, this.canvasOrigin).dist(point) <= this.r;
  }
}

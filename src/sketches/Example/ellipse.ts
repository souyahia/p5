export enum ExampleEllipseDirection {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
}

export class ExampleEllipse {
  public width = 0;
  public height = 0;
  public direction = ExampleEllipseDirection.HORIZONTAL;
  public increasing = true;

  constructor(public maxWidth: number, public maxHeight: number) {
    this.width = maxWidth / 2;
    this.height = maxHeight / 2;
  }

  public update(): void {
    let increment = 10;
    if (!this.increasing) {
      increment = -increment;
    }
    let nextValue = this.size + increment;
    if (nextValue > this.max) {
      this.size = this.max;
      this.increasing = !this.increasing;
    } else if (nextValue < 0) {
      this.size = 0;
      this.increasing = !this.increasing;
    } else {
      this.size = nextValue;
    }
  }

  private get size(): number {
    return this.direction === ExampleEllipseDirection.HORIZONTAL ? this.width : this.height;
  }

  private set size(value: number) {
    if (this.direction === ExampleEllipseDirection.HORIZONTAL) {
      this.width = value;
    } else {
      this.height = value;
    }
  }

  private get max(): number {
    return this.direction === ExampleEllipseDirection.HORIZONTAL ? this.maxWidth : this.maxHeight;
  }
}

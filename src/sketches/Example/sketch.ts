import p5 from 'p5';
import { ExampleEllipse, ExampleEllipseDirection } from './ellipse';
import { Sketch } from '../sketch';
import { randomInt } from '../../universe';

export class ExampleSketch extends Sketch {
  public color = ExampleSketch.randomColor();
  public ellipse: ExampleEllipse | null = null;

  public randomColor(): void {
    this.color = ExampleSketch.randomColor();
  }

  public changeDirection(): void {
    if (this.ellipse) {
      this.ellipse.direction = this.ellipse.direction === ExampleEllipseDirection.HORIZONTAL
        ? ExampleEllipseDirection.VERTICAL
        : ExampleEllipseDirection.HORIZONTAL;
    }
  }

  protected setup(p: p5): void {
    super.setup(p);
    this.ellipse = new ExampleEllipse(this.width, this.height);
  }

  protected draw(p: p5): void {
    super.draw(p);

    p.background(0);
    if (this.ellipse) {
      p.noStroke();
      p.fill(p.color(this.color));
      p.ellipse(this.width / 2, this.height / 2, this.ellipse.width, this.ellipse.height, 50);
      this.ellipse.update();
    }
  }

  private static randomColor(): number[] {
    return [
      randomInt(0, 255),
      randomInt(0, 255),
      randomInt(0, 255),
    ];
  }
}

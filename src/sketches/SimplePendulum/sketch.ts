import p5, { Vector } from 'p5';
import { Sketch } from '../sketch';
import { Pendulum, PolarCoords, randomNum } from '../../universe';
import { InteractionSystem, InteractiveCircle, InteractiveShape } from '../../universe/interactions';

const MIN_A = -Math.PI / 2;
const MAX_A = Math.PI / 2;
const G = 1;
const DRAG = 0.02;
const INTERACTIVE = true;

const BOB_D = 30;
const BOB_COLOR = 255;
const ANCHOR_D = 15;
const ANCHOR_COLOR = 230;
const CORD_WIDTH = 2;
const CORD_COLOR = 200;

export class SimplePendulumSketch extends Sketch {
  protected interactionSystem: InteractionSystem | null = new InteractionSystem();
  public pendulum: Pendulum | null = null;

  protected setup(p: p5): void {
    super.setup(p);
    this.pendulum = new Pendulum({
      coords: new PolarCoords(
        randomNum(MIN_A, MAX_A),
        (Math.min(this.width, this.height) / 2) - 2 * BOB_D,
        new Vector(this.width / 2, this.height / 2),
      ),
      g: G,
      drag: DRAG,
      interactiveShape: new InteractiveCircle({
        r: BOB_D / 2,
      }),
      interactive: INTERACTIVE,
    });
    if (this.interactionSystem) {
      this.interactionSystem.shapes.length = 0;
      this.interactionSystem.shapes.push(this.pendulum.interactiveShape as InteractiveShape);
    }
  }

  protected draw(p: p5): void {
    super.draw(p);

    p.background(0);
    p.noStroke();
    if (this.pendulum) {
      const pos = this.pendulum.coords.toCartesian();
      p.stroke(CORD_COLOR);
      p.strokeWeight(CORD_WIDTH);
      p.line(
        this.pendulum.coords.origin.x,
        this.pendulum.coords.origin.y,
        pos.x,
        pos.y,
      );
      p.noStroke();
      p.fill(ANCHOR_COLOR);
      p.circle(this.pendulum.coords.origin.x, this.pendulum.coords.origin.y, ANCHOR_D);
      p.fill(BOB_COLOR);
      p.circle(pos.x, pos.y, BOB_D);
    }
    this.update();
  }

  private update(): void {
    this.pendulum?.update();
    this.interactionSystem?.update();
  }
}

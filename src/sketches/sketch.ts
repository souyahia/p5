import p5 from 'p5';
import { Dimensions } from '../universe';
import { ComponentType } from 'react';
import { InteractionSystem } from '../universe/interactions';
import { FontLoader } from './fonts';

const CANVAS_PADDING = 30;

export enum CanvasAutoSize {
  SQUARE = 'square',
  FILL = 'fill',
}

export type CanvasSize = CanvasAutoSize | Dimensions;

let instance: Sketch | null = null;

export abstract class Sketch {
  protected size: CanvasSize = CanvasAutoSize.SQUARE;
  protected frameRate = 50;
  protected container: HTMLDivElement | null = null;
  protected p: p5 | null = null;
  protected interactionSystem: InteractionSystem | null = null;
  protected fonts: FontLoader | null = null;
  private _width: number | null = null;
  private _height: number | null = null;

  constructor() {
    if (instance) {
      instance.p?.remove();
    }
    instance = this;
  }

  public runSketch(container: HTMLDivElement | null): void {
    if (container) {
      this.container = container;
      if (this.interactionSystem) {
        this.interactionSystem.container = container;
      }
      this.updateCanvasDimensions(container);
      window.addEventListener('resize', () => {
        this.updateCanvasDimensions(container);
      });
      this.p = new p5(this.sketchFn, container);
    }
  }

  protected get sketchFn(): (p: p5) => void {
    return (p: p5) => {
      p.preload = () => {
        this.preload(p);
      };

      p.setup = () => {
        this.setup(p);
      };

      p.draw = () => {
        this.draw(p);
      };

      p.mousePressed = (event) => {
        this.mousePressed(p, event as MouseEvent);
      }

      p.mouseReleased = (event) => {
        this.mouseReleased(p, event as MouseEvent);
      }

      p.mouseClicked = (event) => {
        this.mouseClicked(p, event as MouseEvent);
      };

      p.mouseMoved = (event) => {
        this.mouseMoved(p, event as MouseEvent);
      };

      p.mouseDragged = (event) => {
        this.mouseDragged(p, event as MouseEvent);
      };
    };
  }

  protected preload(p: p5): void {
    if (this.fonts) {
      this.fonts.loadFonts((font) => p.loadFont(font));
    }
  }

  protected setup(p: p5): void {
    p.createCanvas(this.width, this.height, p.WEBGL);
    p.frameRate(this.frameRate);
  }

  protected draw(p: p5): void {
    p.translate(-this.width / 2, -this.height / 2);
  }

  protected mousePressed(p: p5, event: MouseEvent) {
    this.interactionSystem?.onMousePressed(event);
  }

  protected mouseReleased(p: p5, event: MouseEvent) {
    this.interactionSystem?.onMouseReleased(event);
  }

  protected mouseMoved(p: p5, event: MouseEvent) {
    this.interactionSystem?.onMouseMoved(event);
  }

  protected mouseClicked(p: p5, event: MouseEvent) {
    this.interactionSystem?.onMouseClicked(event);
  }

  protected mouseDragged(p: p5, event: MouseEvent) {
    this.interactionSystem?.onMouseDragged(event);
  }

  protected get width(): number {
    if (!this._width) {
      throw new Error('Canvas width is not defined yet!');
    }
    return this._width;
  }

  protected get height(): number {
    if (!this._height) {
      throw new Error('Canvas height is not defined yet!');
    }
    return this._height;
  }

  private updateCanvasDimensions(container: HTMLDivElement): void {
    if (this.size === CanvasAutoSize.FILL) {
      this._width = container.offsetWidth - 2 * CANVAS_PADDING;
      this._height = container.offsetHeight - 2 * CANVAS_PADDING;
      return;
    }
    if (this.size === CanvasAutoSize.SQUARE) {
      const min = Math.min(container.offsetWidth, container.offsetHeight);
      this._width = min - 2 * CANVAS_PADDING;
      this._height = min - 2 * CANVAS_PADDING;
      return;
    }
    this._width = this.size.width;
    this._height = this.size.height;
  }
}

export interface SketchControlPanelProps<T extends Sketch> {
  sketch: T;
}

export type SketchControlPanel<T extends Sketch> = ComponentType<SketchControlPanelProps<T>>;

export interface SketchDetails<T extends Sketch = Sketch> {
  name: string;
  create: () => T;
  controlPanel?: SketchControlPanel<T>;
}

export function id(sketch: SketchDetails): string {
  return sketch.name.toLowerCase().replaceAll(' ', '-');
}

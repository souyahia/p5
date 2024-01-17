import { Vector } from 'p5';
import { getPoint } from '../utils';

export abstract class InteractiveShape {
  public readonly pos = new Vector(0, 0);
  public readonly canvasOrigin = new Vector(0, 0);
  public lastKnownMousePos: Vector | null = null;
  public onPress: ((event: MouseEvent) => void) | null = null;
  public onRelease: ((event: MouseEvent) => void) | null = null;
  public onClick: ((event: MouseEvent) => void) | null = null;
  public onDrag: ((event: MouseEvent) => void) | null = null;

  private isMousePressed = false;
  private wasLastMousePressInShape = false;
  private isMouseOver = false;

  protected constructor(initialState?: Partial<InteractiveShape>) {
    if (initialState?.pos) {
      this.pos.set(initialState.pos);
    }
    if (initialState?.canvasOrigin) {
      this.canvasOrigin.set(initialState.canvasOrigin);
    }
  }

  public get isActive(): boolean {
    return this.isMouseOver;
  }

  public onMousePressed(event: MouseEvent): void {
    const isInside = this.isInside(getPoint(event));
    if (isInside) {
      this.isMousePressed = true;
      if (this.onPress) {
        this.onPress(event);
      }
    }
    this.wasLastMousePressInShape = isInside;
  }

  public onMouseReleased(event: MouseEvent): void {
    this.isMousePressed = false;
    if (this.wasLastMousePressInShape && this.onRelease) {
      this.onRelease(event);
    }
  }

  public onMouseMoved(event: MouseEvent): void {
    this.lastKnownMousePos = getPoint(event);
    this.isMouseOver = this.isInside(this.lastKnownMousePos);
  }

  public onMouseClicked(event: MouseEvent): void {
    if (this.isMouseOver && this.onClick) {
      this.onClick(event);
    }
  }

  public onMouseDragged(event: MouseEvent): void {
    if (this.wasLastMousePressInShape && this.onDrag) {
      this.onDrag(event);
    }
  }

  public moveTo(pos: Vector): void {
    this.pos.set(pos);
    if (this.lastKnownMousePos) {
      this.isMouseOver = this.isInside(this.lastKnownMousePos);
    }
  }

  protected abstract isInside(point: Vector): boolean;
}

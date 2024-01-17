import { InteractiveShape } from './interactiveShape';

export class InteractionSystem {
  public readonly shapes: InteractiveShape[] = [];
  public container: HTMLDivElement | null = null;

  constructor(initialState?: Partial<InteractionSystem>) {
    if (initialState?.shapes) {
      this.shapes = initialState.shapes;
    }
    if (initialState?.container) {
      this.container = initialState.container;
    }
  }

  public onMousePressed(event: MouseEvent): void {
    this.shapes.forEach((shape) => shape.onMousePressed(event));
  }

  public onMouseReleased(event: MouseEvent): void {
    this.shapes.forEach((shape) => shape.onMouseReleased(event));
  }

  public onMouseMoved(event: MouseEvent): void {
    this.shapes.forEach((shape) => shape.onMouseMoved(event));
  }

  public onMouseClicked(event: MouseEvent): void {
    this.shapes.forEach((shape) => shape.onMouseClicked(event));
  }

  public onMouseDragged(event: MouseEvent): void {
    this.shapes.forEach((shape) => shape.onMouseDragged(event));
  }

  public update(): void {
    if (this.container) {
      if (this.shapes.some((shape) => shape.isActive)) {
        this.container.style.cursor = 'pointer';
      } else {
        this.container.style.cursor = 'default';
      }
    }
  }
}

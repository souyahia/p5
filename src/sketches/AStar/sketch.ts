import p5 from 'p5';
import { Sketch } from '../sketch';
import {
  AStar,
  AStarGraph,
  AStarHeuristic,
  checkCircleRectangleCollision,
  Coords,
  diagonalDistance,
  DisplayableGrid,
} from '../../universe';
import { FontLoader, SketchFont } from '../fonts';

export enum AStarSketchMode {
  DEFAULT,
  ADDING_OBSTACLES,
  REMOVING_OBSTACLES,
  PLACING_START,
  PLACING_DESTINATION,
}

export enum AStarSketchPencilSize {
  SMALL = 15,
  MEDIUM = 50,
  BIG = 85,
}

const GRID_STROKE_WEIGHT = 2;
const GRID_COLOR = [150, 150, 150];
const PATH_COLOR = [30, 200, 30];
const START_COLOR = [30, 255, 30];
const DESTINATION_COLOR = [255, 30, 30];
const CLOSEST_FOUND_COLOR = [255, 150, 30];
const START_DEST_NO_GRID_DIAMETER = 30;
const OBSTACLE_COLOR = [35, 35, 35];
const ROAD_COLOR = [220, 220, 220];
const ADD_OBSTACLES_PENCIL_COLOR = [0, 0, 150];
const REMOVE_OBSTACLES_PENCIL_COLOR = [150, 0, 0];

function computePath(
  grid: DisplayableGrid<number>,
  start: Coords,
  destination: Coords,
  heuristic: AStarHeuristic,
  allowDiagonal: boolean,
): Promise<Coords[] | null> {
  return new Promise((resolve) => {
    const graph = new AStarGraph(grid.cells, grid.width, { allowDiagonalMovements: allowDiagonal });
    const startNode = graph.get(start.x, start.y);
    const destinationNode = graph.get(destination.x, destination.y);
    if (!startNode || !destinationNode) {
      resolve(null);
    } else {
      const nodes = AStar(
        graph,
        startNode,
        destinationNode,
        { closestIfNotFound: true, heuristic },
      );
      resolve([start, ...nodes.map((node) => ({ x: node.x, y: node.y }))]);
    }
  });
}

export class AStarSketch extends Sketch {
  public grid: DisplayableGrid<number> | null = null;
  public mode = AStarSketchMode.DEFAULT;
  public pencilSize = AStarSketchPencilSize.SMALL;
  public start: Coords | null = null;
  public destination: Coords | null = null;
  public closestFound: Coords | null = null;
  public path: Coords[] | null = null;
  public isComputingPath = false;
  public heuristic = diagonalDistance;
  public allowDiagonal = true;

  override fonts = new FontLoader([SketchFont.ROBOTO_MONO_REGULAR]);
  private isMouseInCanvas = false;

  public createNewGrid(width: number, height: number): void {
    this.path = null;
    this.start = null;
    this.destination = null;
    this.closestFound = null;
    this.grid = new DisplayableGrid({ width, height }, 1, { width: this.width, height: this.height });
  }

  public setMode(mode: AStarSketchMode): void {
    this.mode = mode;
  }

  public setPencilSize(pencilSize: AStarSketchPencilSize): void {
    this.pencilSize = pencilSize;
  }

  public setHeuristic(heuristic: AStarHeuristic): void {
    this.heuristic = heuristic;
  }

  public setAllowDiagonal(allowDiagonal: boolean): void {
    this.allowDiagonal = allowDiagonal;
  }

  public isComputePathAvailable(): boolean {
    return !!this.start && !!this.destination;
  }

  public async computePath(): Promise<void> {
    if (!this.grid || !this.start || !this.destination) {
      return Promise.resolve();
    }
    this.isComputingPath = true;
    this.closestFound = null;
    this.path = await computePath(
      this.grid,
      this.start,
      this.destination,
      this.heuristic,
      this.allowDiagonal,
    );

    if (this.path) {
      const arrival = this.path[this.path.length - 1];
      if (arrival.x !== this.destination.x || arrival.y !== this.destination.y) {
        this.closestFound = arrival;
      }
    }
    this.isComputingPath = false;
  }

  protected setup(p: p5): void {
    super.setup(p);
    p.frameRate(120);
    p.textSize(16);
    p.textAlign(p.CENTER);
    p.textFont(this.fonts.get(SketchFont.ROBOTO_MONO_REGULAR));
  }

  protected draw(p: p5): void {
    super.draw(p);

    p.background(ROAD_COLOR);
    if (this.grid) {
      this.drawGrid(p);
      this.drawPath(p);
      this.drawPencil(p);
      this.handleGridUserUpdate(p);
    } else {
      p.noStroke();
      p.fill(OBSTACLE_COLOR);
      p.text('Create a grid to start.', this.width / 2, this.height / 2);
    }
    this.updateContainerStyle();
  }

  private drawCell(p: p5, x: number, y: number, color?: number[]): void {
    if (color) {
      p.noStroke();
      p.fill(color);
    }
    if (this.grid) {
      const pos = this.grid.getCellDisplayCoords(x, y);
      p.rect(pos.x, pos.y, this.grid.cellWidth, this.grid.cellHeight);
    }
  }

  private showGridLines(): boolean {
    return !!this.grid
      && this.grid.cellWidth > 10 * GRID_STROKE_WEIGHT
      && this.grid.cellHeight > 10 * GRID_STROKE_WEIGHT;
  }

  private drawPathPoint(p: p5, px: number, py: number, color: number[]): void {
    p.noStroke();
    p.fill(color);
    if (this.showGridLines()) {
      this.drawCell(p, px, py);
    } else if (this.grid) {
      const { x, y } = this.grid.getCellDisplayCoords(px, py);
      p.circle(x + this.grid.cellWidth / 2, y + this.grid.cellHeight / 2, START_DEST_NO_GRID_DIAMETER);
    }
  }

  private drawGrid(p: p5): void {
    if (this.grid) {
      // Obstacles
      p.noStroke();
      p.fill(OBSTACLE_COLOR);
      for (let x = 0; x < this.grid.width; x++) {
        for (let y = 0; y < this.grid.height; y++) {
          if (this.grid.get(x, y) === 0) {
            this.drawCell(p, x, y);
          }
        }
      }

      // Start, destination and closest found
      if (this.start) {
        this.drawPathPoint(p, this.start.x, this.start.y, START_COLOR);
      }
      if (this.destination) {
        this.drawPathPoint(p, this.destination.x, this.destination.y, DESTINATION_COLOR);
      }
      if (this.closestFound) {
        this.drawPathPoint(p, this.closestFound.x, this.closestFound.y, CLOSEST_FOUND_COLOR);
      }

      // Grid lines
      if (this.showGridLines()) {
        p.stroke(GRID_COLOR);
        p.strokeWeight(GRID_STROKE_WEIGHT);
        for (let i = 0; i < this.grid.width; i++) {
          p.line(this.grid.cellWidth * i, 0, this.grid.cellWidth * i, this.height);
        }
        for (let j = 0; j < this.grid.height; j++) {
          p.line(0, this.grid.cellHeight * j, this.width, this.grid.cellHeight * j);
        }
      }
    }
  }

  private drawPath(p: p5): void {
    if (this.grid && this.path) {
      p.stroke(PATH_COLOR);
      p.strokeWeight(2);
      for (let i = 0; i < this.path.length - 1; i++) {
        const cell1 = this.grid.getCellDisplayCoords(this.path[i].x, this.path[i].y);
        const cell2 = this.grid.getCellDisplayCoords(this.path[i + 1].x, this.path[i + 1].y);
        p.line(
          cell1.x + this.grid.cellWidth / 2,
          cell1.y + this.grid.cellHeight / 2,
          cell2.x + this.grid.cellWidth / 2,
          cell2.y + this.grid.cellHeight / 2,
        );
      }
    }
  }

  private drawPencil(p: p5): void {
    if (
      [AStarSketchMode.ADDING_OBSTACLES, AStarSketchMode.REMOVING_OBSTACLES].includes(this.mode)
      && this.isMouseInCanvas
    ) {
      p.noFill();
      p.stroke(
        p.color(this.mode === AStarSketchMode.ADDING_OBSTACLES ? ADD_OBSTACLES_PENCIL_COLOR : REMOVE_OBSTACLES_PENCIL_COLOR)
      );
      p.strokeWeight(2);
      p.circle(p.mouseX, p.mouseY, this.pencilSize);
    }
  }

  private getCellsHoveredByPencil(p: p5): Coords[] {
    if (!this.grid) {
      return [];
    }

    const minX = Math.floor((p.mouseX - (this.pencilSize / 2)) / this.grid.cellWidth);
    const maxX = Math.ceil((p.mouseX + (this.pencilSize / 2)) / this.grid.cellWidth);
    const minY = Math.floor((p.mouseY - (this.pencilSize / 2)) / this.grid.cellHeight);
    const maxY = Math.ceil((p.mouseY + (this.pencilSize / 2)) / this.grid.cellHeight);
    const cells: Coords[] = [];

    for (let x = minX; x < maxX; x++) {
      for (let y = minY; y < maxY; y++) {
        const pos = this.grid.getCellDisplayCoords(x, y);
        if (
          checkCircleRectangleCollision(
            p.mouseX, p.mouseY, this.pencilSize / 2,
            pos.x, pos.y, this.grid.cellWidth, this.grid.cellHeight
          )
        ) {
          cells.push({ x, y });
        }
      }
    }

    return cells;
  }

  private getCellAtCursor(p: p5): Coords {
    if (!this.grid) {
      throw new Error('Unable to get cell at cursor because the grid is not defined!');
    }
    return {
      x: Math.floor(p.mouseX / this.grid.cellWidth),
      y: Math.floor(p.mouseY / this.grid.cellHeight),
    };
  }

  private deletePathEdgesIfAt(x: number, y: number): void {
    if (this.start && this.start.x === x && this.start.y === y) {
      this.start = null;
    }
    if (this.destination && this.destination.x === x && this.destination.y === y) {
      this.destination = null;
    }
  }

  private handleGridUserUpdate(p: p5): void {
    if (this.isMouseInCanvas && p.mouseIsPressed) {
      switch (this.mode) {
        case AStarSketchMode.ADDING_OBSTACLES:
          this.getCellsHoveredByPencil(p).forEach(({ x, y }) => {
            if (this.grid?.isValidCoords(x, y)) {
              this.grid?.set(x, y, 0);
              this.deletePathEdgesIfAt(x, y);
            }
          });
          break;
        case AStarSketchMode.REMOVING_OBSTACLES:
          this.getCellsHoveredByPencil(p).forEach(({ x, y }) => {
            if (this.grid?.isValidCoords(x, y)) {
              this.grid?.set(x, y, 1);
            }
          });
          break;
        case AStarSketchMode.PLACING_START:
          const start = this.getCellAtCursor(p);
          if (this.grid?.isValidCoords(start.x, start.y)) {
            if (!this.start || (this.start.x !== start.x && this.start.y !== start.y)) {
              this.path = null;
              this.closestFound = null;
            }
            this.start = start;
          }
          break;
        case AStarSketchMode.PLACING_DESTINATION:
          const destination = this.getCellAtCursor(p);
          if (this.grid?.isValidCoords(destination.x, destination.y)) {
            if (!this.destination || (this.destination.x !== destination.x && this.destination.y !== destination.y)) {
              this.path = null;
              this.closestFound = null;
            }
            this.destination = destination;
          }
          break;
        default:
          break;
      }
    }
  }

  override mouseMoved(p: p5) {
    this.isMouseInCanvas = p.mouseX >= 0
      && p.mouseX <= this.width
      && p.mouseY >= 0
      && p.mouseY <= this.height;
  }

  private updateContainerStyle(): void {
    if (this.container) {
      if (!this.grid) {
        this.container.style.cursor = 'default';
        return;
      }
      if (this.isComputingPath) {
        this.container.style.cursor = 'wait';
        return;
      }
      switch (this.mode) {
        case AStarSketchMode.DEFAULT:
          this.container.style.cursor = 'default';
          break;
        case AStarSketchMode.ADDING_OBSTACLES:
          this.container.style.cursor = 'none';
          break;
        case AStarSketchMode.REMOVING_OBSTACLES:
          this.container.style.cursor = 'none';
          break;
        case AStarSketchMode.PLACING_START:
          this.container.style.cursor = 'crosshair';
          break;
        case AStarSketchMode.PLACING_DESTINATION:
          this.container.style.cursor = 'crosshair';
          break;
        default:
            break;
      }
    }
  }
}

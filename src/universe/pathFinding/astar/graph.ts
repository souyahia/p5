export class AStarNode {
  public f = 0;
  public g = 0;
  public h = 0;
  public visited = false;
  public closed = false;
  public parent: AStarNode | null = null;

  constructor(public x: number, public y: number, public weight: number) {}

  public resetNode(): void {
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.visited = false;
    this.closed = false;
    this.parent = null;
  }

  public isObstacle(): boolean {
    return this.weight === 0;
  }

  public getWeight(fromNeighbor?: AStarNode): number {
    if (fromNeighbor && fromNeighbor.x !== this.x && fromNeighbor.y !== this.y) {
      return this.weight * Math.SQRT2;
    }
    return this.weight;
  }
}

export interface AStarGraphOptions {
  allowDiagonalMovements: boolean;
}

export const ASTAR_GRAPH_DEFAULT_OPTIONS: AStarGraphOptions = {
  allowDiagonalMovements: false,
}

export function getOptions(options?: Partial<AStarGraphOptions>): AStarGraphOptions {
  return {
    allowDiagonalMovements: options?.allowDiagonalMovements ?? ASTAR_GRAPH_DEFAULT_OPTIONS.allowDiagonalMovements,
  };
}

export class AStarGraph {
  public readonly options: AStarGraphOptions;
  private width: number;
  private height: number;
  private readonly nodes: AStarNode[] = [];
  private readonly dirtyNodes: AStarNode[] = [];

  constructor(grid: number[], width: number, options?: Partial<AStarGraphOptions>) {
    this.width = width;
    this.height = grid.length / this.width;
    this.options = getOptions(options);

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.nodes.push(new AStarNode(x, y, grid[this.index(x, y)]));
      }
    }
  }

  public resetDirtyNodes(): void {
    this.dirtyNodes.forEach((dirtyNode) => {
      dirtyNode.resetNode();
    });
    this.dirtyNodes.length = 0;
  }

  public getNeighbors(node: AStarNode): AStarNode[] {
    const neighbors = [
      [node.x - 1, node.y],
      [node.x, node.y - 1],
      [node.x + 1, node.y],
      [node.x, node.y + 1],
    ];

    if (this.options.allowDiagonalMovements) {
      neighbors.push(...[
        [node.x - 1, node.y - 1],
        [node.x - 1, node.y + 1],
        [node.x + 1, node.y - 1],
        [node.x + 1, node.y + 1],
      ]);
    }

    return neighbors.map(([x, y]) => this.get(x, y))
      .filter((node) => !!node) as AStarNode[];
  }

  public markNodeAsDirty(node: AStarNode): void {
    this.dirtyNodes.push(node);
  }

  public get(x: number, y: number): AStarNode | undefined {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return undefined;
    }
    return this.nodes[this.index(x, y)];
  }

  private index(x: number, y: number): number {
    return x + this.width * y;
  }
}

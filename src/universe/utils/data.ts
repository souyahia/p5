import { Coords, Dimensions } from './display';

export class Grid<T> {
  public readonly cells: T[] = [];
  private readonly dimensions: Dimensions = { width: 0, height: 0 };

  constructor(dimensions: Dimensions, initialValue: T) {
    this.dimensions.width = dimensions.width;
    this.dimensions.height = dimensions.height;
    for (let i = 0; i < this.width * this.height; i++) {
      this.cells[i] = initialValue;
    }
  }

  public get(x: number, y: number): T {
    this.assertValidCoords(x, y);
    return this.cells[x + this.width * y];
  }

  public set(x: number, y: number, value: T): void {
    this.assertValidCoords(x, y);
    this.cells[x + this.width * y] = value;
  }

  public isValidCoords(x: number, y: number): boolean {
    return x >= 0 && x <= (this.width - 1) && y >= 0 && y <= (this.height - 1);
  }

  public assertValidCoords(x: number, y: number): void {
    if (!this.isValidCoords(x, y)) {
      throw new Error(`Invalid grid coordinates : [${x},${y}]`);
    }
  }

  public get width(): number {
    return this.dimensions.width;
  }

  public get height(): number {
    return this.dimensions.height;
  }
}

export class DisplayableGrid<T> extends Grid<T> {
  private readonly displayDimensions: Dimensions = { width: 0, height: 0 };
  private readonly cellDimensions = { width: 0, height: 0 };

  constructor(
    dimensions: Dimensions,
    initialValue: T,
    displayDimensions: Dimensions,
  ) {
    super(dimensions, initialValue);
    this.displayDimensions.width = displayDimensions.width;
    this.displayDimensions.height = displayDimensions.height;
    this.cellDimensions.width = this.displayWidth / this.width;
    this.cellDimensions.height = this.displayHeight / this.height;
  }

  public getCellDisplayCoords(x: number, y: number): Coords {
    return { x: x * this.cellWidth, y: y * this.cellHeight };
  }

  public get displayWidth(): number {
    return this.displayDimensions.width;
  }

  public get displayHeight(): number {
    return this.displayDimensions.height;
  }

  public get cellWidth(): number {
    return this.cellDimensions.width;
  }

  public get cellHeight(): number {
    return this.cellDimensions.height;
  }
}

export enum HeapType {
  MIN_HEAP = 'min_heap',
  MAX_HEAP = 'max_heap',
}

export class BinaryHeap<T> {
  private readonly tree: T[] = [];

  constructor(private type: HeapType, private getValue: (element: T) => number) {}

  public size(): number {
    return this.tree.length;
  }

  public insert(element: T): void {
    this.tree.push(element);
    this.bubbleUp();
  }

  public extract(): T {
    const extractedElement = this.tree[0];

    this.tree[0] = this.tree[this.tree.length - 1];
    this.tree.length = this.tree.length - 1;

    if (this.tree.length > 0) {
      this.bubbleDown();
    }

    return extractedElement;
  }

  public reorderElement(element: T): void {
    const index = this.tree.indexOf(element);
    if (index === -1) {
      throw new Error('Unable to reorder element because it is not found in the BinaryHeap tree.');
    }

    const value = this.getValue(element);
    const parentIndex = BinaryHeap.getParentIndex(index);
    const rightChildIndex = BinaryHeap.getRightChildIndex(index);
    const leftChildIndex = rightChildIndex - 1;

    if (parentIndex >= 0 && this.isValue1AboveValue2(value, this.getValue(this.tree[parentIndex]))) {
      this.bubbleUp(index);
    } else if (
      leftChildIndex < this.tree.length
      && this.isValue1AboveValue2(this.getValue(this.tree[leftChildIndex]), value)
    ) {
      this.bubbleDown(index);
    } else if (
      rightChildIndex < this.tree.length
      && this.isValue1AboveValue2(this.getValue(this.tree[rightChildIndex]), value)
    ) {
      this.bubbleDown(index);
    }
  }

  private bubbleUp(index = this.tree.length - 1): void {
    const element = this.tree[index];

    const value = this.getValue(element);
    const parentIndex = BinaryHeap.getParentIndex(index);

    if (parentIndex >= 0) {
      const parent = this.tree[parentIndex];

      if (this.isValue1AboveValue2(value, this.getValue(parent))) {
        this.tree[parentIndex] = element;
        this.tree[index] = parent;
        this.bubbleUp(parentIndex);
      }
    }
  }

  private bubbleDown(index = 0): void {
    const element = this.tree[index];
    const value = this.getValue(element);

    const rightChildIndex = BinaryHeap.getRightChildIndex(index);
    const leftChildIndex = rightChildIndex - 1;
    const leftChild = this.tree[leftChildIndex];
    const rightChild = this.tree[rightChildIndex];
    let compareIndex = null;
    let compareValue = null;

    if (leftChild !== undefined) {
      compareIndex = leftChildIndex;
      compareValue = this.getValue(leftChild);
    }

    if (rightChild !== undefined && this.isValue1AboveValue2(this.getValue(rightChild), compareValue as number)) {
      compareIndex = rightChildIndex;
      compareValue = this.getValue(rightChild);
    }

    if (compareIndex !== null && compareValue !== null && this.isValue1AboveValue2(compareValue, value)) {
      this.tree[index] = this.tree[compareIndex];
      this.tree[compareIndex] = element;
      this.bubbleDown(compareIndex);
    }
  }

  private isValue1AboveValue2(value1: number, value2: number): boolean {
    if (this.type === HeapType.MIN_HEAP) {
      return value1 < value2;
    }
    return value1 > value2;
  }

  private static getParentIndex(index: number): number {
    return ((index + 1) >> 1) - 1;
  }

  private static getRightChildIndex(index: number): number {
    return (index + 1) << 1;
  }
}

import { AStarGraph, AStarNode } from './graph';
import { AStarHeuristic, diagonalDistance, manhattanDistance } from './heuristics';
import { BinaryHeap, HeapType } from '../../utils';

export interface AStarOptions {
  heuristic: AStarHeuristic;
  closestIfNotFound: boolean;
}

const ASTAR_DEFAULT_OPTIONS: Omit<AStarOptions, 'heuristic'> = {
  closestIfNotFound: false,
};

function getOptions(graph: AStarGraph, options?: Partial<AStarOptions>): AStarOptions {
  const defaultHeuristic = graph.options.allowDiagonalMovements ? diagonalDistance : manhattanDistance;
  return {
    heuristic: options?.heuristic ?? defaultHeuristic,
    closestIfNotFound: options?.closestIfNotFound ?? ASTAR_DEFAULT_OPTIONS.closestIfNotFound,
  };
}

function getPath(node: AStarNode): AStarNode[] {
  let currentNode = node;
  const path: AStarNode[] = [];
  while (currentNode.parent) {
    path.unshift(currentNode);
    currentNode = currentNode.parent;
  }
  return path;
}

export function AStar(
  graph: AStarGraph,
  start: AStarNode,
  destination: AStarNode,
  options?: AStarOptions,
) {
  const { heuristic, closestIfNotFound } = getOptions(graph, options);
  const openHeap = new BinaryHeap(HeapType.MIN_HEAP, (node: AStarNode) => node.f);
  let closestNode = start;

  graph.resetDirtyNodes();
  start.h = heuristic(start, destination);
  graph.markNodeAsDirty(start);
  openHeap.insert(start);

  while (openHeap.size() > 0) {
    const currentNode = openHeap.extract();

    if (currentNode === destination) {
      return getPath(currentNode);
    }

    currentNode.closed = true;
    const neighbors = graph.getNeighbors(currentNode);

    for (let i = 0; i < neighbors.length; ++i) {
      const neighbor = neighbors[i];

      if (neighbor.closed || neighbor.isObstacle()) {
        continue;
      }
      const g = currentNode.g + neighbor.getWeight(currentNode);
      const hasBeenVisited = neighbor.visited;

      if (!hasBeenVisited || g < neighbor.g) {
        neighbor.visited = true;
        neighbor.parent = currentNode;
        neighbor.h = neighbor.h || heuristic(neighbor, destination);
        neighbor.g = g;
        neighbor.f = neighbor.g + neighbor.h;
        graph.markNodeAsDirty(neighbor);
        if (closestIfNotFound) {
          if (neighbor.h < closestNode.h || (neighbor.h === closestNode.h && neighbor.g < closestNode.g)) {
            closestNode = neighbor;
          }
        }

        if (!hasBeenVisited) {
          openHeap.insert(neighbor);
        } else {
          openHeap.reorderElement(neighbor);
        }
      }
    }
  }

  return closestIfNotFound ? getPath(closestNode) : [];
}

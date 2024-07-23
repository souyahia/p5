import { AStarNode } from './graph';

/*
 * http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
 */

export type AStarHeuristic = (node1: AStarNode, node2: AStarNode) => number;

export function manhattanDistance(node1: AStarNode, node2: AStarNode, minDist = 1): number {
  const dx = Math.abs(node2.x - node1.x);
  const dy = Math.abs(node2.y - node1.y);
  return minDist * (dx + dy);
}

export function diagonalDistance(node1: AStarNode, node2: AStarNode, minDist = 1, minDiagDist = Math.SQRT2): number {
  const dx = Math.abs(node2.x - node1.x)
  const dy = Math.abs(node2.y - node1.y)
  return minDist * (dx + dy) + (minDiagDist - 2 * minDist) * Math.min(dx, dy);
}

export function euclideanDistance(node1: AStarNode, node2: AStarNode, minDist = 1): number {
  const dx = Math.abs(node2.x - node1.x);
  const dy = Math.abs(node2.y - node1.y);
  return minDist * Math.sqrt(dx * dx + dy * dy);
}

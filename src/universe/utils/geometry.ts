export function checkCircleRectangleCollision(
  cx: number,
  cy: number,
  cr: number,
  rx: number,
  ry: number,
  rw: number,
  rh: number,
): boolean {
  let closestCornerX = cx;
  let closestCornerY = cy;
  if (cx < rx) {
    closestCornerX = rx;
  } else if (cx > rx+rw) {
    closestCornerX = rx + rw;
  }
  if (cy < ry) {
    closestCornerY = ry;
  } else if (cy > ry+rh) {
    closestCornerY = ry + rh;
  }

  const distX = cx - closestCornerX;
  const distY = cy - closestCornerY;
  const distance = Math.sqrt((distX * distX) + distY * distY);

  return distance <= cr;
}

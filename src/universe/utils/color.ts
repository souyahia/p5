import p5, { Color } from 'p5';

export function getRGBA(color: Color | number[], p?: p5): number[] {
  const rgba: number[] = [];
  if (Array.isArray(color)) {
    rgba.push(color[0]);
    rgba.push(color[1]);
    rgba.push(color[2]);
    if (color.length > 3) {
      rgba.push(color[3]);
    }
  } else {
    if (!p) {
      throw new Error('Unable to process color without a p5 instance.');
    }
    rgba.push(p.red(color));
    rgba.push(p.green(color));
    rgba.push(p.blue(color));
    rgba.push(p.alpha(color));
  }
  return rgba;
}

export function brightness(color: number[]): number {
  return Math.sqrt(0.299 * color[0] * color[0] + 0.587 * color[1] * color[1] + 0.114 * color[2] * color[2]) / 255;
}

export function isLightColor(color: number[]): boolean {
  return brightness(color) > 0.4;
}

function exportColor(color: number[], p?: p5): number[] | Color {
  return p ? p.color(color) : color;
}

export function colorFromHash(hash: number, p: p5): Color;
export function colorFromHash(hash: number): number[];
export function colorFromHash(hash: number, p?: p5): number[] | Color {
  const colorCodes = [];
  for (let i = 0; i < 3; i++) {
    colorCodes.push((hash >> (i * 8)) & 0xff);
  }
  const color: number[] = [];
  color.push((hash >> 0) & 0xff);
  color.push((hash >> 8) & 0xff);
  color.push((hash >> 16) & 0xff);
  return p ? p.color(color) : color;
}

export function inverseColor(color: Color, p: p5): Color;
export function inverseColor(color: number[]): number[];
export function inverseColor(color: Color | number[], p?: p5): Color | number[] {
  const rgba = getRGBA(color, p);
  const inverted = [
    255 - rgba[0],
    255 - rgba[1],
    255 - rgba[2],
  ];
  if (rgba.length > 3) {
    inverted.push(rgba[3]);
  }
  return exportColor(inverted, p);
}

export function grayScale(color: Color, p: p5): Color;
export function grayScale(color: number[]): number[];
export function grayScale(color: Color | number[], p?: p5): Color | number[] {
  const rgba = getRGBA(color, p);
  const value = 0.299 * rgba[0] + 0.587 * rgba[1] + 0.114 * rgba[2];
  const grayScale = [value, value, value];
  if (rgba.length > 3) {
    grayScale.push(rgba[3]);
  }
  return exportColor(grayScale, p);
}

function componentToHex(value: number): string {
  let rounded = Math.round(value);
  rounded = rounded > 255 ? 255 : rounded;
  return rounded.toString(16).padStart(2, '0');
}

export function toHex(color: number[]): string {
  const r = componentToHex(color[0]);
  const g = componentToHex(color[1]);
  const b = componentToHex(color[2]);
  const a = color.length > 3 ? componentToHex(color[3]) : '';
  return `#${r}${g}${b}${a}`;
}

export function linearGradient(c1: number[], c2: number[], resolution = 10): number[][] {
  const rIncrement = (c2[0] - c1[0]) / resolution;
  const gIncrement = (c2[1] - c1[1]) / resolution;
  const bIncrement = (c2[2] - c1[2]) / resolution;
  const aIncrement = c1.length > 3 && c2.length > 3 ? ((c2[3] - c1[3]) / resolution) : null;

  const gradient: number[][] = [];
  for (let i = 0; i < resolution; i++) {
    const color = [c1[0] + i * rIncrement, c1[1] + i * gIncrement, c1[2] + i * bIncrement];
    if (aIncrement !== null) {
      color.push(c1[3] + i * aIncrement);
    }
    gradient.push(color);
  }
  return gradient;
}

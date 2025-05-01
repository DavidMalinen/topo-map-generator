export interface DitheredCellOptions {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  elevation: number;
  baseOpacity: number;
  cellSize: number;
}

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}
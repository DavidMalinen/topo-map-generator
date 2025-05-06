export type ElevationMatrix = number[][];

export interface TerrainOptions {
  rows: number;
  cols: number;
  maxHeight: number;
}

export interface TerrainCell {
  x: number;
  y: number;
  elevation: number;
}

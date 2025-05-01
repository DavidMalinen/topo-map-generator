import type { ElevationMatrix } from '../types';

abstract class BaseTerrainGenerator {
  protected rows: number;
  protected cols: number;
  protected maxHeight: number;
  protected elevationData: ElevationMatrix;

  constructor(rows: number, cols: number, maxHeight: number) {
    this.rows = rows;
    this.cols = cols;
    this.maxHeight = maxHeight;
    this.elevationData = Array.from({ length: rows }, () => Array(cols).fill(0));
  }

  abstract generate(): void;

  modifyElevation(x: number, y: number, amount: number): void {
    if (this.isInBounds(x, y)) {
      this.elevationData[y][x] = Math.max(0, this.elevationData[y][x] + amount);
    }
  }

  isInBounds(x: number, y: number): boolean {
    return x >= 0 && x < this.cols && y >= 0 && y < this.rows;
  }

  getElevation(x: number, y: number): number | null {
    if (this.isInBounds(x, y)) {
      return this.elevationData[y][x];
    }
    return null;
  }

  getElevationData(): ElevationMatrix {
    return this.elevationData;
  }
}

export default BaseTerrainGenerator;
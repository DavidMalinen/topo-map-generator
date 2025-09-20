import type { ElevationMatrix } from '@/types';

class ElevationData {
  private readonly rows: number;
  private readonly cols: number;
  private elevationData: ElevationMatrix;

  constructor(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;
    this.elevationData = Array.from({ length: rows }, () => Array(cols).fill(0));
  }

  getElevation(x: number, y: number): number | null {
    if (this.isValidCoordinate(x, y)) {
      return this.elevationData[y][x];
    }
    return null;
  }

  setElevation(x: number, y: number, value: number): void {
    if (this.isValidCoordinate(x, y)) {
      this.elevationData[y][x] = Math.max(0, value);
    }
  }

  modifyElevation(x: number, y: number, amount: number): void {
    if (this.isValidCoordinate(x, y)) {
      this.elevationData[y][x] = Math.max(0, this.elevationData[y][x] + amount);
    }
  }

  isValidCoordinate(x: number, y: number): boolean {
    return x >= 0 && x < this.cols && y >= 0 && y < this.rows;
  }

  clear(): void {
    this.elevationData = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
  }

  randomize(maxHeight: number): void {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        this.elevationData[y][x] = Math.floor(Math.random() * maxHeight);
      }
    }
  }

  setFromArray(data: ElevationMatrix): void {
    if (!data || data.length !== this.rows) return;

    for (let y = 0; y < this.rows; y++) {
      if (data[y] && data[y].length === this.cols) {
        for (let x = 0; x < this.cols; x++) {
          this.elevationData[y][x] = data[y][x];
        }
      }
    }
  }

  setData(data: ElevationMatrix): void {
    return void this.setFromArray(data);
  }

  getRawData(): ElevationMatrix {
    return this.elevationData;
  }
}

export default ElevationData;

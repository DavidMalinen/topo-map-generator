import BaseTerrainGenerator from './BaseTerrainGenerator';

import { ElevationMatrix } from '@/types';

class CityGridGenerator extends BaseTerrainGenerator {
  constructor(rows: number, cols: number, maxHeight: number) {
    super(rows, cols, maxHeight);
  }

  generate(): ElevationMatrix {
    this.elevationData = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
    const blockSize = 2;

    for (let by = 0; by < Math.ceil(this.rows / blockSize); by++) {
      for (let bx = 0; bx < Math.ceil(this.cols / blockSize); bx++) {
        if (Math.random() < 0.7) {
          const baseHeight = Math.random() * this.maxHeight * 0.8;

          for (let y = by * blockSize; y < Math.min((by + 1) * blockSize, this.rows); y++) {
            for (let x = bx * blockSize; x < Math.min((bx + 1) * blockSize, this.cols); x++) {
              this.elevationData[y][x] = baseHeight;
            }
          }
        }
      }
    }

    this.createStreets(blockSize);
    return this.elevationData;
  }

  createStreets(blockSize: number): void {
    for (let i = blockSize; i < this.rows; i += blockSize) {
      for (let x = 0; x < this.cols; x++) {
        if (Math.random() < 0.8) {
          this.elevationData[i][x] = 0;
        }
      }
    }

    for (let i = blockSize; i < this.cols; i += blockSize) {
      for (let y = 0; y < this.rows; y++) {
        if (Math.random() < 0.8) {
          this.elevationData[y][i] = 0;
        }
      }
    }
  }
}

export default CityGridGenerator;

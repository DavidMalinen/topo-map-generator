import BaseTerrainGenerator from './BaseTerrainGenerator';

import { ElevationMatrix } from '@/types';

class WavePatternGenerator extends BaseTerrainGenerator {
  constructor(rows: number, cols: number, maxHeight: number) {
    super(rows, cols, maxHeight);
  }

  generate(): ElevationMatrix {
    this.elevationData = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const wave1 = Math.sin(x / 3) * Math.cos(y / 2) * this.maxHeight / 3;
        const wave2 = Math.cos(x / 4) * Math.sin(y / 3) * this.maxHeight / 4;

        this.elevationData[y][x] = Math.abs(wave1 + wave2) + (Math.random() * 5);
        this.elevationData[y][x] = Math.floor(this.elevationData[y][x] / 8) * 8;
      }
    }

    return this.elevationData;
  }
}

export default WavePatternGenerator;

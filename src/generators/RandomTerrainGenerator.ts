import BaseTerrainGenerator from './BaseTerrainGenerator';

import { ElevationMatrix } from '@/types';

class RandomTerrainGenerator extends BaseTerrainGenerator {
  constructor(rows: number, cols: number, maxHeight: number) {
    super(rows, cols, maxHeight);
  }

  generate(): ElevationMatrix {
    this.elevationData = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () => Math.floor(Math.random() * this.maxHeight))
    );

    return this.elevationData;
  }
}

export default RandomTerrainGenerator;

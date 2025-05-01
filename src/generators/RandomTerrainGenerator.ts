import BaseTerrainGenerator from './BaseTerrainGenerator';

class RandomTerrainGenerator extends BaseTerrainGenerator {
  constructor(rows: number, cols: number, maxHeight: number) {
    super(rows, cols, maxHeight);
  }

  generate(): void {
    this.elevationData = Array.from({ length: this.rows }, () => 
      Array.from({ length: this.cols }, () => Math.floor(Math.random() * this.maxHeight))
    );
  }
}

export default RandomTerrainGenerator;
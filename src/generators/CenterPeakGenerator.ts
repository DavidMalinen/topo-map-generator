import BaseTerrainGenerator from './BaseTerrainGenerator';

class CenterPeakGenerator extends BaseTerrainGenerator {
  constructor(rows: number, cols: number, maxHeight: number) {
    super(rows, cols, maxHeight);
  }

  generate(): void {
    this.clearTerrain();
    this.createCenterPeak();
    this.terraceElevation();
  }

  clearTerrain(): void {
    this.elevationData = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
  }

  createCenterPeak(): void {
    const centerX = Math.floor(this.cols / 2);
    const centerY = Math.floor(this.rows / 2);
    const radius = Math.min(this.rows, this.cols) / 2;

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        if (distance <= radius) {
          const factor = 1 - (distance / radius);
          this.elevationData[y][x] = this.maxHeight * Math.pow(factor, 1.2);
        }
      }
    }
  }

  terraceElevation(): void {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        if (this.elevationData[y][x] > 0) {
          // Create terraces by rounding to multiples of 10
          this.elevationData[y][x] = Math.floor(this.elevationData[y][x] / 10) * 10;
        }
      }
    }
  }
}

export default CenterPeakGenerator;
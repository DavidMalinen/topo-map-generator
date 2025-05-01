import BaseTerrainGenerator from './BaseTerrainGenerator';
import { Point } from '../types';

interface SeedPoint extends Point {
  height: number;
}

class CrystalFormationGenerator extends BaseTerrainGenerator {
  constructor(rows: number, cols: number, maxHeight: number) {
    super(rows, cols, maxHeight);
  }

  generate(): void {
    this.elevationData = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
    const numPoints = 5;
    const seedPoints = this.createSeedPoints(numPoints);

    this.createCrystalFormations(seedPoints);
  }

  createSeedPoints(numPoints: number): SeedPoint[] {
    const seedPoints: SeedPoint[] = [];
    for (let i = 0; i < numPoints; i++) {
      seedPoints.push({
        x: Math.floor(Math.random() * this.cols),
        y: Math.floor(Math.random() * this.rows),
        height: Math.random() * this.maxHeight * 0.8 + this.maxHeight * 0.2
      });
    }
    return seedPoints;
  }

  createCrystalFormations(seedPoints: SeedPoint[]): void {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        let minDist = Infinity;
        let closestPoint: SeedPoint | null = null;

        for (const point of seedPoints) {
          const dist = Math.abs(x - point.x) + Math.abs(y - point.y);
          if (dist < minDist) {
            minDist = dist;
            closestPoint = point;
          }
        }

        if (minDist < 10 && closestPoint) {
          const factor = 1 - (minDist / 10);
          this.elevationData[y][x] = closestPoint.height * Math.pow(factor, 0.8);
          this.elevationData[y][x] = Math.floor(this.elevationData[y][x] / 15) * 15;
          
          if (Math.random() < 0.05 && this.elevationData[y][x] > 0) {
            this.elevationData[y][x] += Math.random() * 40;
          }
        }
      }
    }
  }
}

export default CrystalFormationGenerator;
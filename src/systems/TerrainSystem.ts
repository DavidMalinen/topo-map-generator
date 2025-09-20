import TerrainGeneratorFactory from '../factories/TerrainGeneratorFactory';
import ElevationData from '../models/ElevationData';

import { ElevationMatrix } from '@/types';

class TerrainSystem {
  private elevationData: ElevationData;
  private generatorFactory: TerrainGeneratorFactory;

  constructor(rows: number, cols: number) {
    this.elevationData = new ElevationData(rows, cols);
    this.generatorFactory = new TerrainGeneratorFactory();
  }

  getTerrainData(): ElevationMatrix {
    return this.elevationData.getRawData();
  }

  getElevation(x: number, y: number): number | null {
    return this.elevationData.getElevation(x, y);
  }

  modifyTerrainAt(x: number, y: number, amount: number): void {
    this.elevationData.modifyElevation(x, y, amount);
  }

  generateTerrain(generatorType: string, rows: number, cols: number, maxHeight: number): void {
    const generator = this.generatorFactory.createGenerator(generatorType, rows, cols, maxHeight);
    const terrainData = generator.generate();
    this.elevationData.setData(terrainData);
  }

  clearTerrain(): void {
    this.elevationData.clear();
  }
}

export default TerrainSystem;

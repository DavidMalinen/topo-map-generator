import TerrainGeneratorFactory from '../factories/TerrainGeneratorFactory';
import BaseTerrainGenerator from '../generators/BaseTerrainGenerator';
import ElevationData from '../models/ElevationData';
import { ElevationMatrix } from '../types';

class TerrainSystem {
  private elevationData: ElevationData;
  private generatorFactory: TerrainGeneratorFactory;
  
  constructor(rows: number, cols: number) {
    this.elevationData = new ElevationData(rows, cols);
    this.generatorFactory = new TerrainGeneratorFactory();
  }
  
  /**
   * Get the raw elevation data matrix
   */
  getTerrainData(): ElevationMatrix {
    return this.elevationData.getRawData();
  }
  
  /**
   * Get elevation at a specific grid position
   */
  getElevation(x: number, y: number): number | null {
    return this.elevationData.getElevation(x, y);
  }
  
  /**
   * Modify terrain at a specific position
   */
  modifyTerrainAt(x: number, y: number, amount: number): void {
    this.elevationData.modifyElevation(x, y, amount);
  }
  
  /**
   * Generate terrain using the specified generator type
   */
  generateTerrain(generatorType: string, rows: number, cols: number, maxHeight: number): void {
    const generator = this.generatorFactory.createGenerator(generatorType, rows, cols, maxHeight);
    const terrainData = generator.generate();
    this.elevationData.setData(terrainData);
  }
  
  /**
   * Clear all terrain data
   */
  clearTerrain(): void {
    this.elevationData.clear();
  }
  
  /**
   * Get a generator instance directly
   * @deprecated Use generateTerrain instead
   */
  getGenerator(generatorType: string, rows: number, cols: number, maxHeight: number): BaseTerrainGenerator {
    return this.generatorFactory.createGenerator(generatorType, rows, cols, maxHeight);
  }
}

export default TerrainSystem;
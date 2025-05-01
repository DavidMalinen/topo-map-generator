export type ElevationMatrix = number[][];

export interface TerrainOptions {
  rows: number;
  cols: number;
  maxHeight: number;
}

interface TerrainSystemInterface {
    getTerrainData(): ElevationMatrix;
    getElevation(x: number, y: number): number | null;
    modifyTerrainAt(x: number, y: number, amount: number): void;
    generateTerrain(generatorType: string, rows: number, cols: number, maxHeight: number): void;
    clearTerrain(): void;
}
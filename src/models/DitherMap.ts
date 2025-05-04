import { DitherPattern } from '../types';

class DitherMap {
  private cellSize: number;
  private ditherPatterns: DitherPattern[]; // Dynamic patterns generated for cells
  private predefinedPatterns: DitherPattern[]; // Static predefined patterns

  constructor(cellSize: number = 4) {
    this.cellSize = cellSize;
    this.ditherPatterns = [];

    // Bayer 4x4 predefined dither patterns
    this.predefinedPatterns = [
      // Standard pattern
      [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5],

      // Horizontal striping
      [0, 1, 2, 3, 12, 13, 14, 15, 0, 1, 2, 3, 12, 13, 14, 15],

      // Vertical striping
      [0, 8, 0, 8, 4, 12, 4, 12, 0, 8, 0, 8, 4, 12, 4, 12],

      // Checkerboard
      [0, 15, 0, 15, 15, 0, 15, 0, 0, 15, 0, 15, 15, 0, 15, 0]
    ];
  }

  /**
   * Generate dither maps for a grid of specified rows and columns
   */
  generateDitherMap(rows: number, cols: number): DitherPattern[] {
    this.ditherPatterns = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const index = y * cols + x;
        const cellMap = this.createDitherPattern();

        this.ditherPatterns[index] = cellMap;
      }
    }

    return this.ditherPatterns;
  }

  /**
   * Create a random dither pattern for a single cell
   */
  createDitherPattern(): DitherPattern {
    const dotsPerSide = this.cellSize / 2;
    const cellMap: number[] = [];

    for (let dy = 0; dy < dotsPerSide; dy++) {
      for (let dx = 0; dx < dotsPerSide; dx++) {
        cellMap.push(Math.random());
      }
    }

    return cellMap;
  }

  /**
   * Get a dynamically generated dither pattern for a specific cell
   */
  getDitherPattern(index: number): DitherPattern {
    return this.ditherPatterns[index] || [];
  }

  /**
   * Get a predefined dither pattern
   */
  getPattern(index: number): DitherPattern {
    return this.predefinedPatterns[index % this.predefinedPatterns.length];
  }

  /**
   * Generate a custom dither pattern based on a seed
   */
  generateCustomPattern(seed: number): DitherPattern {
    // Generate a custom dither pattern based on a seed
    const customPattern: DitherPattern = [];
    const rng = this.seededRandom(seed);

    for (let i = 0; i < 16; i++) {
      customPattern[i] = Math.floor(rng() * 16);
    }

    // Sort to ensure proper distribution
    customPattern.sort((a, b) => a - b);
    return customPattern;
  }

  /**
   * Set the cell size for dither patterns
   */
  setCellSize(size: number): void {
    this.cellSize = size;
  }

  /**
   * Create a deterministic random number generator based on a seed
   */
  private seededRandom(seed: number): () => number {
    return function () {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
  }
}

export default DitherMap;

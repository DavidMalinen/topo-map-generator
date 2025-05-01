import BaseEffect from './BaseEffect';
import DitherMap from '../models/DitherMap';
import { DitherPattern } from '../types';

class DitherEffect extends BaseEffect {
  private ditherMap: DitherMap;
  private patternCache: Map<string, DitherPattern>;

  constructor() {
    super();
    this.ditherMap = new DitherMap(4);
    this.patternCache = new Map();
  }

  initialize(): void {
    this.createDitherPatterns();
  }

  apply(ctx: CanvasRenderingContext2D, x: number, y: number, elevation: number,
    baseOpacity: number, cellSize: number): void {
    this.drawDitheredCell(ctx, x, y, elevation, baseOpacity, cellSize);
  }

  toggle(_active: boolean): void { }

  /**
   * Generate a complete dither map for the grid
   */
  generateDitherMap(rows: number, cols: number, cellSize: number): void {
    this.ditherMap.setCellSize(cellSize);
    this.ditherMap.generateDitherMap(rows, cols);
  }

  /**
   * Initialize different dither patterns for various use cases
   */
  createDitherPatterns(): void {
    // Cache predefined patterns
    for (let i = 0; i < 4; i++) {
      const pattern = this.ditherMap.getPattern(i);
      this.patternCache.set(`predefined_${i}`, pattern);
    }

    // Generate and cache some custom patterns with different seeds
    const seeds = [42, 123, 789, 555];
    seeds.forEach(seed => {
      const pattern = this.ditherMap.generateCustomPattern(seed);
      this.patternCache.set(`custom_${seed}`, pattern);
    });
  }

  /**
   * Draw a cell using dithering effect
   */
  drawDitheredCell(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    elevation: number,
    baseOpacity: number,
    cellSize: number
  ): void {
    const index = y * Math.ceil(ctx.canvas.width / cellSize) + x;
    let pattern: DitherPattern;

    // Choose appropriate pattern based on elevation
    if (elevation > 0.8) {
      // High mountains - dense pattern
      pattern = this.patternCache.get('custom_555') ||
        this.ditherMap.getDitherPattern(index);
    } else if (elevation > 0.5) {
      // Hills - medium pattern
      pattern = this.patternCache.get('custom_789') ||
        this.ditherMap.getDitherPattern(index);
    } else if (elevation > 0.3) {
      // Low elevation - sparse pattern
      pattern = this.patternCache.get('custom_42') ||
        this.ditherMap.getDitherPattern(index);
    } else {
      // Very low elevation - use grid's dynamic pattern
      pattern = this.ditherMap.getDitherPattern(index);
    }

    // Apply the dither pattern
    this.applyDitherPattern(ctx, x, y, pattern, baseOpacity, cellSize);
  }

  private applyDitherPattern(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    pattern: DitherPattern,
    opacity: number,
    cellSize: number
  ): void {
    const threshold = Math.min(1, opacity) * 16;
    const dotsPerSide = Math.floor(cellSize / 2);

    ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;

    // Apply dither pattern
    for (let dy = 0; dy < dotsPerSide; dy++) {
      for (let dx = 0; dx < dotsPerSide; dx++) {
        const dotValue = pattern[dy * dotsPerSide + dx] || 0;
        if (dotValue < threshold) {
          ctx.fillRect(
            x * cellSize + dx * 2,
            y * cellSize + dy * 2,
            1, 1
          );
        }
      }
    }
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.patternCache.clear();
  }
}

export default DitherEffect;

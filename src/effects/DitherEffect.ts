import BaseEffect from './BaseEffect';
import DitherMap from '../models/DitherMap';
import { DitherPattern, Point } from '../types';
import StateManager from '../controllers/StateManager';

class DitherEffect extends BaseEffect {
  private ditherMap: DitherMap;
  private isometricFaceCache: Map<string, { x: number, y: number, threshold: number }[]>;
  private initialized = false;
  private stateManager: StateManager;

  public constructor(stateManager: StateManager) {
    super();
    this.ditherMap = new DitherMap(4);
    this.isometricFaceCache = new Map();
    this.stateManager = stateManager;
  }

  public initialize(): void {
    if (this.initialized) return;

    // Run once at initialization and never again
    this.ditherMap.generateDitherMap(100, 100); // Generate a large enough map for all needs
    this.initialized = true;
  }

  public apply(ctx: CanvasRenderingContext2D, x: number, y: number,
    baseOpacity: number, cellSize: number): void {

    // Only apply top-down dithering when NOT in isometric view
    if (!this.stateManager.getState().isometric) {
      this.drawDitheredCell(ctx, x, y, baseOpacity, cellSize);
    }
  }

  public toggle(_active: boolean): void {
    // Keep toggle functionality in StateManager
    // This is just a placeholder for the BaseEffect interface
  }

  // This should only be called once during init
  public generateDitherMap(rows: number, cols: number, cellSize: number): void {
    if (this.initialized) return;

    this.ditherMap.setCellSize(cellSize);
    this.ditherMap.generateDitherMap(rows, cols);
    this.initialized = true;
  }

  public drawDitheredCell(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    baseOpacity: number,
    cellSize: number
  ): void {
    // Get a consistent pattern based on cell position
    const index = y * 100 + x; // Use x,y for consistent pattern selection
    const pattern = this.ditherMap.getDitherPattern(index % 10000); // Keep within bounds

    this.applyDitherPattern(ctx, x, y, pattern, baseOpacity, cellSize);
  }

  // Draw dithered isometric face with stable patterns
  public drawDitheredIsometricFace(
    ctx: CanvasRenderingContext2D,
    points: Point[],
    color: string,
    intensity: number
  ): void {
    // Only apply isometric dithering when IN isometric view
    if (!this.stateManager.getState().isometric) {
      return;
    }

    // Create a unique key for this face based on its points
    const faceKey = points.map(p => `${Math.round(p.x)},${Math.round(p.y)}`).join('|');

    // Create a base fill with low opacity
    ctx.fillStyle = color.replace(/[\d.]+\)$/g, "0.1)");
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    ctx.fill();

    // Check if we already have a dither map for this face
    if (!this.isometricFaceCache.has(faceKey)) {
      // Calculate bounding box
      let minX = Infinity, minY = Infinity;
      let maxX = -Infinity, maxY = -Infinity;

      for (const point of points) {
        minX = Math.min(minX, point.x);
        minY = Math.min(minY, point.y);
        maxX = Math.max(maxX, point.x);
        maxY = Math.max(maxY, point.y);
      }

      const width = maxX - minX;
      const height = maxY - minY;

      // Generate a new dither map for this face
      const dotSpacing = 4;
      const dotsX = Math.ceil(width / dotSpacing);
      const dotsY = Math.ceil(height / dotSpacing);

      const faceDitherMap: { x: number, y: number, threshold: number }[] = [];

      // Generate fixed threshold values for dot positions
      for (let dy = 0; dy <= dotsY; dy++) {
        for (let dx = 0; dx <= dotsX; dx++) {
          const dotX = minX + dx * dotSpacing;
          const dotY = minY + dy * dotSpacing;

          if (this.isPointInPolygon(dotX, dotY, points)) {
            // Use a hash of the dot position for consistent random values
            const hash = (dotX * 31 + dotY * 17) % 100;
            const threshold = hash / 100; // Normalized 0-1

            faceDitherMap.push({
              x: dotX,
              y: dotY,
              threshold: threshold
            });
          }
        }
      }

      this.isometricFaceCache.set(faceKey, faceDitherMap);
    }

    // Draw the dots with consistent pattern
    const faceDitherMap = this.isometricFaceCache.get(faceKey)!;
    const dotSize = 2;

    // Apply a consistent density scale
    // Cap intensity to prevent patterns from disappearing at extreme heights
    const density = 0.1 + (Math.min(intensity, 0.9) * 0.9);

    ctx.fillStyle = color;

    // Draw dots based on pre-generated thresholds
    faceDitherMap.forEach(dot => {
      if (dot.threshold < density) {
        ctx.fillRect(dot.x, dot.y, dotSize, dotSize);
      }
    });
  }

  private applyDitherPattern(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    pattern: DitherPattern,
    opacity: number,
    cellSize: number
  ): void {
    // Cap the threshold to ensure pattern remains visible
    const threshold = Math.min(Math.max(opacity * 16, 3), 15);
    const dotsPerSide = Math.floor(cellSize / 2);

    ctx.fillStyle = `rgba(198, 255, 0, ${opacity * 0.2})`;

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

  // Helper method to check if a point is inside a polygon
  private isPointInPolygon(x: number, y: number, polygon: Point[]): boolean {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x, yi = polygon[i].y;
      const xj = polygon[j].x, yj = polygon[j].y;

      const intersect = ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  public dispose(): void {
    this.isometricFaceCache.clear();
    this.initialized = false;
  }
}

export default DitherEffect;

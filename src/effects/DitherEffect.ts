import BaseEffect from './BaseEffect';
import StateManager from '../controllers/StateManager';
import DitherMap from '../models/DitherMap';

import { DitherPattern, DitherPoint, IsometricDitherDetail, Point } from '@/types';
import { ColorUtils } from '@/utils/ColorUtils';
import PolygonUtils from '@/utils/PolygonUtils';

class DitherEffect extends BaseEffect {
  private canvas: HTMLCanvasElement;
  private ditherMap: DitherMap;
  private stateManager: StateManager;
  private isometricDitherHandler: EventListener | null = null;

  public constructor(canvas: HTMLCanvasElement, cellSize: number, stateManager: StateManager) {
    super();
    this.canvas = canvas;
    this.ditherMap = new DitherMap(cellSize);
    this.stateManager = stateManager;
  }

  public initialize(): void {
    const rows = Math.floor(this.canvas.height / this.ditherMap.getCellSize());
    const cols = Math.floor(this.canvas.width / this.ditherMap.getCellSize());
    this.generateDitherMap(rows, cols);

    this.setupIsometricDitherHandler();
  }

  public apply(ctx: CanvasRenderingContext2D, x: number, y: number, cols: number, baseOpacity: number, cellSize: number): void {
    if (!this.stateManager.getState().isometric) {
      this.drawDitheredCell(ctx, x, y, cols, baseOpacity, cellSize);
    }
  }

  public toggle(active: boolean): void {
    this.stateManager.setDitherActive(active);

    if (!active) {
      this.dispose();
    }
  }

  private generateDitherMap(rows: number, cols: number): void {
    const ditherPatterns = this.ditherMap.generateDitherMap(rows, cols);
    this.stateManager.setDitherPatterns(ditherPatterns);
  }

  private drawDitheredCell(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    cols: number,
    opacity: number,
    cellSize: number
  ): void {
    if (this.stateManager.getState().isometric) return;

    const index = y * cols + x;
    const pattern: DitherPattern = this.ditherMap.getDitherPattern(index);

    const intensity = Math.min(1, opacity);
    const dotsPerSide = cellSize / 2;

    ctx.fillStyle = `rgba(198, 255, 0, ${opacity * 0.2})`;

    // Apply dither pattern
    for (let dy = 0; dy < dotsPerSide; dy++) {
      for (let dx = 0; dx < dotsPerSide; dx++) {
        const dotValue = pattern[dy * dotsPerSide + dx] || 0;
        if (dotValue < intensity) {
          ctx.fillRect(
            x * cellSize + dx * 2,
            y * cellSize + dy * 2,
            1, 1
          );
        }
      }
    }
  }

  private drawDitheredIsometricFace(
    ctx: CanvasRenderingContext2D,
    points: Point[],
    color: string,
    intensity: number
  ): void {
    // Create a unique key for this face based on its points
    const faceKey = points.map(p => `${Math.round(p.x)},${Math.round(p.y)}`).join('|');

    // Check if we already have a dither map for this face
    if (!this.stateManager.getState().isoFaceDitherMaps[faceKey]) {
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

      const faceDitherMap: DitherPoint[] = [];

      // Generate fixed threshold values for dot positions
      for (let dy = 0; dy <= dotsY; dy++) {
        for (let dx = 0; dx <= dotsX; dx++) {
          const dotX = minX + dx * dotSpacing;
          const dotY = minY + dy * dotSpacing;

          if (PolygonUtils.isPointInPolygon(dotX, dotY, points)) {
            const threshold = Math.random();

            faceDitherMap.push({
              x: dotX,
              y: dotY,
              threshold
            });
          }
        }
      }

      this.stateManager.setIsoFaceDitherMaps(faceKey, faceDitherMap);
    }

    const density = 0.1 + Math.min(0.9, intensity * 1.2);

    const dotSize = 2;
    const faceDitherMap = this.stateManager.getState().isoFaceDitherMaps[faceKey]!;

    ctx.fillStyle = color;
    faceDitherMap.forEach(dot => {
      if (dot.threshold < density) {
        ctx.fillRect(dot.x, dot.y, dotSize, dotSize);
      }
    });
  }

  private setupIsometricDitherHandler(): void {
    // Remove any existing handler first
    this.removeIsometricDitherHandler();

    // Create and store the handler for later cleanup
    this.isometricDitherHandler = ((e: CustomEvent<IsometricDitherDetail>) => {
      // Only proceed if we're in isometric view and dither is active
      if (!this.stateManager.getState().isometric ||
        !this.stateManager.getState().ditherActive) {
        return;
      }

      const detail = e.detail;
      const ctx = this.canvas.getContext('2d')!;
      const colorShiftActive = this.canvas.dataset.colorShiftActive === 'true';

      this.drawDitheredIsometricFace(
        ctx,
        detail.leftPoints,
        detail.leftColor || ColorUtils.getLeftFaceColor(
          detail.intensity, detail.height, detail.maxHeight, colorShiftActive
        ),
        detail.intensity * 0.7
      );

      this.drawDitheredIsometricFace(
        ctx,
        detail.rightPoints,
        detail.rightColor || ColorUtils.getRightFaceColor(
          detail.intensity, detail.height, detail.maxHeight, colorShiftActive
        ),
        detail.intensity * 0.5
      );

      this.drawDitheredIsometricFace(
        ctx,
        detail.frontLeftPoints,
        detail.frontLeftColor || ColorUtils.getFrontLeftFaceColor(
          detail.intensity, detail.height, detail.maxHeight, colorShiftActive
        ),
        detail.intensity * 0.4
      );

      this.drawDitheredIsometricFace(
        ctx,
        detail.frontRightPoints,
        detail.frontRightColor || ColorUtils.getFrontRightFaceColor(
          detail.intensity, detail.height, detail.maxHeight, colorShiftActive
        ),
        detail.intensity * 0.3
      );
    }) as EventListener;

    // Add the handler once
    this.canvas.addEventListener(
      'apply-isometric-dither',
      this.isometricDitherHandler
    );
  }

  private removeIsometricDitherHandler(): void {
    if (this.isometricDitherHandler) {
      this.canvas.removeEventListener(
        'apply-isometric-dither',
        this.isometricDitherHandler
      );
      this.isometricDitherHandler = null;
    }
  }

  public dispose(): void {
    this.removeIsometricDitherHandler();
  }
}

export default DitherEffect;

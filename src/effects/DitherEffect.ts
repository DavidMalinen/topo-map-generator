import BaseEffect from './BaseEffect';
import StateManager from '../controllers/StateManager';
import DitherMap from '../models/DitherMap';
import { DitherPattern, DitherPoint, IsometricDitherDetail, Point } from '../types';

import { ColorUtils } from '@/utils/ColorUtils';
import PolygonUtils from '@/utils/PolygonUtils';

class DitherEffect extends BaseEffect {
  private canvas: HTMLCanvasElement;
  private ditherMap: DitherMap;
  private stateManager: StateManager;

  public constructor(canvas: HTMLCanvasElement, cellSize: number, stateManager: StateManager) {
    super();
    this.canvas = canvas;
    this.ditherMap = new DitherMap(cellSize);
    this.stateManager = stateManager;
  }

  public initialize(): void { }

  public apply(ctx: CanvasRenderingContext2D, x: number, y: number, cols: number, baseOpacity: number, cellSize: number): void {
    this.drawDitheredCell(ctx, x, y, cols, baseOpacity, cellSize);
    this.drawIsometricDithering(this.canvas);
  }

  public toggle(active: boolean): void {
    this.stateManager.setDitherActive(active);
    if (!this.stateManager.getState().ditherActive) this.dispose()
  }

  public generateDitherMap(rows: number, cols: number): void {
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
    // Cap the threshold to ensure pattern remains visible
    const threshold = Math.min(Math.max(opacity * 16, 3), 15);
    const dotsPerSide = cellSize / 2;

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

  private drawDitheredIsometricFace(
    ctx: CanvasRenderingContext2D,
    points: Point[],
    color: string,
    intensity: number
  ): void {
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

    const dotSize = 2;
    const density = 0.1 + (intensity * 0.9);
    const faceDitherMap = this.stateManager.getState().isoFaceDitherMaps[faceKey]!;

    ctx.fillStyle = color;
    faceDitherMap.forEach(dot => {
      if (dot.threshold < density) {
        ctx.fillRect(dot.x, dot.y, dotSize, dotSize);
      }
    });
  }

  private drawIsometricDithering(canvas: HTMLCanvasElement): void {
    if (!this.stateManager.getState().isometric) return;
    canvas.addEventListener('apply-isometric-dither', ((e: CustomEvent<IsometricDitherDetail>) => {

      const detail = e.detail;
      const ctx = canvas.getContext('2d')!;
      const colorShiftActive = canvas.dataset.colorShiftActive === 'true';

      this.drawDitheredIsometricFace(
        ctx,
        detail.leftPoints,
        detail.leftColor || ColorUtils.getLeftFaceColor(detail.intensity, detail.height, detail.maxHeight, colorShiftActive),
        detail.intensity * 0.7
      );

      this.drawDitheredIsometricFace(
        ctx,
        detail.rightPoints,
        detail.rightColor || ColorUtils.getRightFaceColor(detail.intensity, detail.height, detail.maxHeight, colorShiftActive),
        detail.intensity * 0.5
      );

      this.drawDitheredIsometricFace(
        ctx,
        detail.frontLeftPoints,
        detail.frontLeftColor || ColorUtils.getFrontLeftFaceColor(detail.intensity, detail.height, detail.maxHeight, colorShiftActive),
        detail.intensity * 0.4
      );

      this.drawDitheredIsometricFace(
        ctx,
        detail.frontRightPoints,
        detail.frontRightColor || ColorUtils.getFrontRightFaceColor(detail.intensity, detail.height, detail.maxHeight, colorShiftActive),
        detail.intensity * 0.3
      );
    }) as EventListener);
  }

  public dispose(): void {
    this.canvas.removeEventListener('apply-isometric-dither', (() => this.drawIsometricDithering) as EventListener);
  }
}

export default DitherEffect;

import BaseRenderer from './BaseRenderer';
import type { ElevationMatrix, Point } from '../types';
import { ColorUtils } from '../utils/ColorUtils';

class IsometricRenderer extends BaseRenderer {
  constructor(canvas: HTMLCanvasElement, ctx?: CanvasRenderingContext2D) {
    super(canvas, ctx);
  }

  drawGrid(rows: number, cols: number, cellSize: number): void {
    this.gridRenderer.drawIsometricGrid(rows, cols, cellSize);
  }

  drawTerrain(elevationData: ElevationMatrix, maxHeight: number, cellSize: number): void {
    for (let y = 0; y < elevationData.length; y++) {
      for (let x = 0; x < elevationData[y].length; x++) {
        const elevation = elevationData[y][x];
        if (elevation > 0) {
          this.drawIsometricCube(x, y, elevation, maxHeight, cellSize);
        }
      }
    }
  }

  drawIsometricCube(x: number, y: number, height: number, maxHeight: number, cellSize: number): void {
    const intensity = height / maxHeight;
    
    // Calculate isometric position
    const isoX = this.offsetX + (x - y) * cellSize;
    const isoY = this.offsetY + (x + y) * cellSize / 2;
    
    // Calculate points for the cube faces
    const topPoints = this.calculateTopPoints(isoX, isoY, cellSize);
    const leftPoints = this.calculateLeftPoints(isoX, isoY, height, cellSize);
    const rightPoints = this.calculateRightPoints(isoX, isoY, height, cellSize);
    
    // Draw faces
    this.drawFace(rightPoints, ColorUtils.getRightFaceColor(intensity));
    this.drawFace(leftPoints, ColorUtils.getLeftFaceColor(intensity));
    this.drawFace(topPoints, ColorUtils.getTopFaceColor(intensity));
    
    // Draw elevation label for high terrain
    if (height > maxHeight * 0.5) {
      this.drawElevationLabel(isoX, isoY, Math.floor(height));
    }
  }

  calculateTopPoints(x: number, y: number, cellSize: number): Point[] {
    return [
      { x: x, y: y },
      { x: x + cellSize, y: y + cellSize / 2 },
      { x: x, y: y + cellSize },
      { x: x - cellSize, y: y + cellSize / 2 }
    ];
  }

  calculateLeftPoints(x: number, y: number, height: number, cellSize: number): Point[] {
    const heightPixels = height * 0.3;
    return [
      { x: x, y: y },
      { x: x - cellSize, y: y + cellSize / 2 },
      { x: x - cellSize, y: y + cellSize / 2 + heightPixels },
      { x: x, y: y + heightPixels }
    ];
  }

  calculateRightPoints(x: number, y: number, height: number, cellSize: number): Point[] {
    const heightPixels = height * 0.3;
    return [
      { x: x, y: y },
      { x: x + cellSize, y: y + cellSize / 2 },
      { x: x + cellSize, y: y + cellSize / 2 + heightPixels },
      { x: x, y: y + heightPixels }
    ];
  }

  drawFace(points: Point[], color: string): void {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }
    
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
  }

  drawElevationLabel(x: number, y: number, elevation: number): void {
    this.ctx.font = '10px monospace';
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(elevation.toString(), x, y - 5);
  }
}

export default IsometricRenderer;
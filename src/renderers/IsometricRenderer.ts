import BaseRenderer from './BaseRenderer';
import { ColorUtils } from '../utils/ColorUtils';

import { ElevationMatrix, Point, TerrainCell } from '@/types';

class IsometricRenderer extends BaseRenderer {
  private readonly colorShiftActive: boolean = false;

  constructor(canvas: HTMLCanvasElement, ctx?: CanvasRenderingContext2D) {
    super(canvas, ctx);
    this.colorShiftActive = canvas.dataset.colorShiftActive === 'true';
  }

  drawGrid(rows: number, cols: number, cellSize: number): void {
    this.gridRenderer.drawIsometricGrid(rows, cols, cellSize);
  }

  drawTerrain(elevationData: ElevationMatrix, maxHeight: number, cellSize: number): void {
    const cells: TerrainCell[] = [];

    for (let y = 0; y < elevationData.length; y++) {
      for (let x = 0; x < elevationData[y].length; x++) {
        const elevation = elevationData[y][x];
        if (elevation > 0) {
          cells.push({ x, y, elevation });
        }
      }
    }

    // Sort cells back to front for proper rendering
    cells.sort((a, b) => (a.x + a.y) - (b.x + b.y));

    for (const cell of cells) {
      this.drawIsometricCube(cell.x, cell.y, cell.elevation, maxHeight, cellSize);
    }
  }

  drawIsometricCube(x: number, y: number, height: number, maxHeight: number, cellSize: number): void {
    const intensity = Math.min(1, height / maxHeight);
    const heightPixels = (height / maxHeight) * (cellSize * 2);

    const isoX = this.offsetX + (x - y) * cellSize;
    const isoY = this.offsetY + (x + y) * cellSize / 2;

    const topPoints = this.calculateTopPoints(isoX, isoY - heightPixels, cellSize);
    const leftPoints = this.calculateLeftPoints(isoX, isoY, heightPixels, cellSize);
    const rightPoints = this.calculateRightPoints(isoX, isoY, heightPixels, cellSize);
    const frontLeftPoints = this.calculateFrontLeftPoints(isoX, isoY, heightPixels, cellSize);
    const frontRightPoints = this.calculateFrontRightPoints(isoX, isoY, heightPixels, cellSize);

    const ditherActive = this.canvas.dataset.ditherActive === 'true';

    const topColor = ColorUtils.getTopFaceColor(intensity, height, maxHeight, this.colorShiftActive);
    const leftColor = ColorUtils.getLeftFaceColor(intensity, height, maxHeight, this.colorShiftActive);
    const rightColor = ColorUtils.getRightFaceColor(intensity, height, maxHeight, this.colorShiftActive);
    const frontLeftColor = ColorUtils.getFrontLeftFaceColor(intensity, height, maxHeight, this.colorShiftActive);
    const frontRightColor = ColorUtils.getFrontRightFaceColor(intensity, height, maxHeight, this.colorShiftActive);

    if (ditherActive && height > maxHeight * 0.4) {
      // Use much lower opacity for base fills (0.1 like in the original)
      this.drawFace(leftPoints, leftColor.replace(/[\d.]+\)$/g, "0.01)"));
      this.drawFace(rightPoints, rightColor.replace(/[\d.]+\)$/g, "0.01)"));
      this.drawFace(frontLeftPoints, frontLeftColor.replace(/[\d.]+\)$/g, "0.01)"));
      this.drawFace(frontRightPoints, frontRightColor.replace(/[\d.]+\)$/g, "0.01)"));

      const event = new CustomEvent('apply-isometric-dither', {
        detail: {
          leftPoints: leftPoints,
          rightPoints: rightPoints,
          frontLeftPoints: frontLeftPoints,
          frontRightPoints: frontRightPoints,
          intensity: intensity,
          height: height,
          maxHeight: maxHeight,
          leftColor: leftColor,
          rightColor: rightColor,
          frontLeftColor: frontLeftColor,
          frontRightColor: frontRightColor
        }
      });
      this.canvas.dispatchEvent(event);
    } else {
      this.drawFace(leftPoints, leftColor);
      this.drawFace(rightPoints, rightColor);
      this.drawFace(frontLeftPoints, frontLeftColor);
      this.drawFace(frontRightPoints, frontRightColor);
    }

    this.drawFace(topPoints, topColor);

    if (height > maxHeight * 0.5) {
      this.drawElevationLabel(isoX, isoY - heightPixels, Math.floor(height));
    }

    this.drawWireframe(isoX, isoY, height, heightPixels, maxHeight, cellSize);
  }

  drawWireframe(isoX: number, isoY: number, elevation: number, heightPixels: number, maxHeight: number, cellSize: number): void {
    const outlineIntensity = Math.min(1, elevation / (maxHeight * 0.7));
    this.ctx.strokeStyle = ColorUtils.getColorWithShift(outlineIntensity * 0.8, elevation, maxHeight, this.colorShiftActive);
    this.ctx.lineWidth = Math.max(1, outlineIntensity * 1.5);

    // Top face
    this.ctx.beginPath();
    this.ctx.moveTo(isoX, isoY - heightPixels);
    this.ctx.lineTo(isoX + cellSize, isoY + cellSize / 2 - heightPixels);
    this.ctx.lineTo(isoX, isoY + cellSize - heightPixels);
    this.ctx.lineTo(isoX - cellSize, isoY + cellSize / 2 - heightPixels);
    this.ctx.closePath();
    this.ctx.stroke();

    // Side faces (vertical edges)
    this.ctx.beginPath();
    this.ctx.moveTo(isoX, isoY + cellSize - heightPixels);
    this.ctx.lineTo(isoX, isoY + cellSize);
    this.ctx.moveTo(isoX + cellSize, isoY + cellSize / 2 - heightPixels);
    this.ctx.lineTo(isoX + cellSize, isoY + cellSize / 2);
    this.ctx.moveTo(isoX - cellSize, isoY + cellSize / 2 - heightPixels);
    this.ctx.lineTo(isoX - cellSize, isoY + cellSize / 2);
    this.ctx.stroke();
  }

  calculateTopPoints(x: number, y: number, cellSize: number): Point[] {
    return [
      { x, y },                                    // Back point
      { x: x + cellSize, y: y + cellSize / 2 },    // Right point
      { x, y: y + cellSize },                      // Front point
      { x: x - cellSize, y: y + cellSize / 2 }     // Left point
    ];
  }

  calculateLeftPoints(x: number, y: number, heightPixels: number, cellSize: number): Point[] {
    // Left side face (connects top-left to bottom-left)
    return [
      { x: x - cellSize, y: y + cellSize / 2 - heightPixels }, // Top-left corner
      { x: x - cellSize, y: y + cellSize / 2 },                // Bottom-left corner
      { x, y },                                                // Bottom-back corner
      { x, y: y - heightPixels }                               // Top-back corner
    ];
  }

  calculateRightPoints(x: number, y: number, heightPixels: number, cellSize: number): Point[] {
    // Right side face (connects top-right to bottom-right)
    return [
      { x: x + cellSize, y: y + cellSize / 2 - heightPixels }, // Top-right corner
      { x: x + cellSize, y: y + cellSize / 2 },                // Bottom-right corner
      { x, y },                                                // Bottom-back corner
      { x, y: y - heightPixels }                               // Top-back corner
    ];
  }

  calculateFrontLeftPoints(x: number, y: number, heightPixels: number, cellSize: number): Point[] {
    // Front-left face (connects front-top to left side)
    return [
      { x, y: y + cellSize - heightPixels },                 // Top-front corner
      { x, y: y + cellSize },                                // Bottom-front corner
      { x: x - cellSize, y: y + cellSize / 2 },              // Bottom-left corner
      { x: x - cellSize, y: y + cellSize / 2 - heightPixels } // Top-left corner
    ];
  }

  calculateFrontRightPoints(x: number, y: number, heightPixels: number, cellSize: number): Point[] {
    // Front-right face (connects front-top to right side)
    return [
      { x, y: y + cellSize - heightPixels },                 // Top-front corner
      { x, y: y + cellSize },                                // Bottom-front corner
      { x: x + cellSize, y: y + cellSize / 2 },              // Bottom-right corner
      { x: x + cellSize, y: y + cellSize / 2 - heightPixels } // Top-right corner
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
    this.ctx.font = '10px JetBrains Mono, monospace';
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(elevation.toString(), x, y - 5);
  }
}

export default IsometricRenderer;

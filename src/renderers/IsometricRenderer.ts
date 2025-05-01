import BaseRenderer from './BaseRenderer';
import { ElevationMatrix, Point } from '../types';
import { ColorUtils } from '../utils/ColorUtils';

class IsometricRenderer extends BaseRenderer {
  constructor(canvas: HTMLCanvasElement, ctx?: CanvasRenderingContext2D) {
    super(canvas, ctx);
  }

  drawGrid(rows: number, cols: number, cellSize: number): void {
    this.gridRenderer.drawIsometricGrid(rows, cols, cellSize);
  }

  drawTerrain(elevationData: ElevationMatrix, maxHeight: number, cellSize: number): void {
    // Create an array of cells to sort
    const cells: { x: number; y: number; elevation: number }[] = [];

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

    // Draw each cell
    for (const cell of cells) {
      this.drawIsometricCube(cell.x, cell.y, cell.elevation, maxHeight, cellSize);
    }
  }

  drawIsometricCube(x: number, y: number, height: number, maxHeight: number, cellSize: number): void {
    const intensity = height / maxHeight;
    const heightPixels = height * (cellSize / maxHeight * 0.6);

    // Calculate isometric position
    const isoX = this.offsetX + (x - y) * cellSize;
    const isoY = this.offsetY + (x + y) * cellSize / 2;

    // Calculate points for the cube faces
    const topPoints = this.calculateTopPoints(isoX, isoY - heightPixels, cellSize);
    const leftPoints = this.calculateLeftPoints(isoX, isoY, heightPixels, cellSize);
    const rightPoints = this.calculateRightPoints(isoX, isoY, heightPixels, cellSize);
    const frontLeftPoints = this.calculateFrontLeftPoints(isoX, isoY, heightPixels, cellSize);
    const frontRightPoints = this.calculateFrontRightPoints(isoX, isoY, heightPixels, cellSize);

    // Apply different rendering based on height and dithering state
    const ditherActive = this.canvas.dataset.ditherActive === 'true';

    // Draw faces in correct visibility order (back to front)
    if (ditherActive && height > maxHeight * 0.4) {
      // For taller structures, use dithering on side faces
      // First, draw solid faces with slight opacity
      this.drawFace(leftPoints, ColorUtils.getLeftFaceColor(intensity * 0.3));
      this.drawFace(rightPoints, ColorUtils.getRightFaceColor(intensity * 0.2));
      this.drawFace(frontLeftPoints, ColorUtils.getLeftFaceColor(intensity * 0.25));
      this.drawFace(frontRightPoints, ColorUtils.getRightFaceColor(intensity * 0.2));

      // Then apply dithering through the effects system
      const event = new CustomEvent('apply-isometric-dither', {
        detail: {
          leftPoints: leftPoints,
          rightPoints: rightPoints,
          frontLeftPoints: frontLeftPoints,
          frontRightPoints: frontRightPoints,
          intensity: intensity,
          height: height,
          maxHeight: maxHeight
        }
      });
      this.canvas.dispatchEvent(event);
    } else {
      // Standard drawing for smaller structures or when dithering is off
      this.drawFace(leftPoints, ColorUtils.getLeftFaceColor(intensity));
      this.drawFace(rightPoints, ColorUtils.getRightFaceColor(intensity));
      this.drawFace(frontLeftPoints, ColorUtils.getLeftFaceColor(intensity * 0.8));
      this.drawFace(frontRightPoints, ColorUtils.getRightFaceColor(intensity * 0.7));
    }

    // Always draw top face last (without dithering for clean look)
    this.drawFace(topPoints, ColorUtils.getTopFaceColor(intensity));

    // Draw elevation label for high terrain
    if (height > maxHeight * 0.5) {
      this.drawElevationLabel(isoX, isoY - heightPixels, Math.floor(height));
    }
  }

  calculateTopPoints(x: number, y: number, cellSize: number): Point[] {
    // Top face (diamond shape)
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
    this.ctx.font = '10px monospace';
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(elevation.toString(), x, y - 5);
  }
}

export default IsometricRenderer;

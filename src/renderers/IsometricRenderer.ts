import BaseRenderer from './BaseRenderer';
import { ElevationMatrix, Point } from '../types';
import { ColorUtils } from '../utils/ColorUtils';

class IsometricRenderer extends BaseRenderer {
  private colorShiftActive: boolean = false;

  constructor(canvas: HTMLCanvasElement, ctx?: CanvasRenderingContext2D) {
    super(canvas, ctx);
    // Check for color shift state
    this.colorShiftActive = canvas.dataset.colorShiftActive === 'true';
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

    // Get colors with exact opacity per the reference implementation
    const topColor = ColorUtils.getTopFaceColor(intensity, height, maxHeight, this.colorShiftActive);
    const leftColor = ColorUtils.getLeftFaceColor(intensity, height, maxHeight, this.colorShiftActive);
    const rightColor = ColorUtils.getRightFaceColor(intensity, height, maxHeight, this.colorShiftActive);
    const frontLeftColor = ColorUtils.getFrontLeftFaceColor(intensity, height, maxHeight, this.colorShiftActive);
    const frontRightColor = ColorUtils.getFrontRightFaceColor(intensity, height, maxHeight, this.colorShiftActive);

    // Draw faces in correct visibility order (back to front)
    if (ditherActive && height > maxHeight * 0.4) {
      // For taller structures, use dithering on side faces
      // First, draw solid faces with slight opacity
      this.drawFace(leftPoints, leftColor.replace(/[\d.]+\)$/g, "0.3)")); // Low opacity base
      this.drawFace(rightPoints, rightColor.replace(/[\d.]+\)$/g, "0.2)")); // Low opacity base
      this.drawFace(frontLeftPoints, frontLeftColor.replace(/[\d.]+\)$/g, "0.25)")); // Low opacity base
      this.drawFace(frontRightPoints, frontRightColor.replace(/[\d.]+\)$/g, "0.2)")); // Low opacity base

      // Then apply dithering through the effects system
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
      // Standard drawing for smaller structures or when dithering is off
      this.drawFace(leftPoints, leftColor);
      this.drawFace(rightPoints, rightColor);
      this.drawFace(frontLeftPoints, frontLeftColor);
      this.drawFace(frontRightPoints, frontRightColor);
    }

    // Always draw top face last (without dithering for clean look)
    this.drawFace(topPoints, topColor);

    // Draw elevation label for high terrain
    if (height > maxHeight * 0.5) {
      this.drawElevationLabel(isoX, isoY - heightPixels, Math.floor(height));
    }

    // Draw wireframe outlines with intensity based on height
    this.drawWireframe(isoX, isoY, height, heightPixels, maxHeight, cellSize);
  }

  // New method to draw wireframe outlines like in topo-script.js
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

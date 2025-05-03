import BaseRenderer from './BaseRenderer';
import type { ElevationMatrix } from '../types';
import { ColorUtils } from '../utils/ColorUtils';

class TopDownRenderer extends BaseRenderer {
  private colorShiftActive: boolean = false;

  constructor(canvas: HTMLCanvasElement, ctx?: CanvasRenderingContext2D) {
    super(canvas, ctx);
    // Check for color shift state
    this.colorShiftActive = canvas.dataset.colorShiftActive === 'true';
  }

  drawGrid(rows: number, cols: number, cellSize: number): void {
    this.gridRenderer.drawTopDownGrid(cellSize, rows, cols);
  }

  calculateFillOpacity(elevation: number, maxHeight: number, intensity: number): number {
    if (elevation < maxHeight * 0.3) {
      return 0.1 + (intensity * 0.2); // Nearly transparent for low elevations
    } else if (elevation < maxHeight * 0.7) {
      return 0.3 + (intensity * 0.3); // Moderate opacity for mid elevations
    } else {
      return 0.6 + (intensity * 0.2); // More solid for high elevations
    }
  }

  drawTerrain(elevationData: ElevationMatrix, maxHeight: number, cellSize: number): void {
    if (!this.ctx) return;

    for (let y = 0; y < elevationData.length; y++) {
      for (let x = 0; x < elevationData[y].length; x++) {
        const elevation = elevationData[y][x];
        if (elevation > 0) {
          const intensity = Math.min(1, elevation / maxHeight);
          const fillOpacity = this.calculateFillOpacity(elevation, maxHeight, intensity);

          // Use the updated ColorUtils method
          this.ctx.fillStyle = ColorUtils.getColorWithShift(fillOpacity, elevation, maxHeight, this.colorShiftActive);
          this.ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);

          // Draw elevation label for high terrain
          if (elevation > maxHeight * 0.3) {
            this.drawElevationLabel(x, y, elevation, cellSize);
          }

          // Draw cell outline with intensity based on height
          this.drawCellOutline(x, y, elevation, maxHeight, cellSize);
        }
      }
    }
  }

  drawElevationLabel(x: number, y: number, elevation: number, cellSize: number): void {
    this.ctx.font = '10px monospace';
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(
      Math.floor(elevation).toString(),
      x * cellSize + cellSize / 2,
      y * cellSize + cellSize / 2 + 3
    );
  }

  // New method to draw cell outline like in topo-script.js
  drawCellOutline(x: number, y: number, elevation: number, maxHeight: number, cellSize: number): void {
    const intensity = Math.min(1, elevation / (maxHeight * 0.7));
    this.ctx.strokeStyle = ColorUtils.getColorWithShift(intensity * 0.8, elevation, maxHeight, this.colorShiftActive);
    this.ctx.lineWidth = Math.max(1, intensity * 2);

    this.ctx.beginPath();
    this.ctx.rect(x * cellSize, y * cellSize, cellSize, cellSize);
    this.ctx.stroke();
  }
}

export default TopDownRenderer;

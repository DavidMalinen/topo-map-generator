import BaseRenderer from './BaseRenderer';
import { ColorUtils } from '../utils/ColorUtils';
import type { ElevationMatrix } from '../types';

class TopDownRenderer extends BaseRenderer {
  constructor(canvas: HTMLCanvasElement, ctx?: CanvasRenderingContext2D) {
    super(canvas, ctx);
  }

  drawGrid(rows: number, cols: number, cellSize: number): void {
    this.gridRenderer.drawTopDownGrid(cellSize, rows, cols);
  }
  
  calculateFillOpacity(elevation: number, maxHeight: number, intensity: number): number {
    if (elevation < maxHeight * 0.3) {
      return 0.1 + (intensity * 0.2);
    } else if (elevation < maxHeight * 0.7) {
      return 0.3 + (intensity * 0.3);
    } else {
      return 0.6 + (intensity * 0.2);
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
          this.ctx.fillStyle = ColorUtils.getColorWithShift(fillOpacity, elevation, maxHeight);
          this.ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
          
          // Draw elevation label for high terrain
          if (elevation > maxHeight * 0.5) {
            this.drawElevationLabel(x, y, elevation, cellSize);
          }
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
}

export default TopDownRenderer;
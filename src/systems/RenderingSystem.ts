import IsometricRenderer from '../renderers/IsometricRenderer';
import TopDownRenderer from '../renderers/TopDownRenderer';

import { ElevationMatrix } from '@/types';

class RenderingSystem {
  readonly topDownRenderer: TopDownRenderer;
  readonly isometricRenderer: IsometricRenderer;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.topDownRenderer = new TopDownRenderer(canvas, ctx);
    this.isometricRenderer = new IsometricRenderer(canvas, ctx);
  }

  drawGrid(isIsometric: boolean, rows: number, cols: number, cellSize: number): void {
    if (isIsometric) {
      this.isometricRenderer.drawGrid(rows, cols, cellSize);
    } else {
      this.topDownRenderer.drawGrid(rows, cols, cellSize);
    }
  }

  drawTerrain(isIsometric: boolean, terrainData: ElevationMatrix, maxHeight: number, cellSize: number,
    rows: number, cols: number): void {
    if (isIsometric) {
      this.isometricRenderer.draw(terrainData, maxHeight, cellSize, rows, cols);
    } else {
      this.topDownRenderer.draw(terrainData, maxHeight, cellSize, rows, cols);
    }
  }

  clearCanvas(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.clearRect(0, 0, width, height);
  }
}

export default RenderingSystem;

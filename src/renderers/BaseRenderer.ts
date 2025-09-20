import GridRenderer from './GridRenderer';
import type { ElevationMatrix } from '../types';

abstract class BaseRenderer {
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;
  protected offsetX: number;
  protected offsetY: number;
  protected gridRenderer: GridRenderer;

  protected constructor(canvas: HTMLCanvasElement, ctx?: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx || canvas.getContext('2d') as CanvasRenderingContext2D;
    this.offsetX = canvas.width / 2;
    this.offsetY = canvas.height / 4;
    this.gridRenderer = new GridRenderer(canvas, this.ctx);
  }

  setupCanvas(): void {
    if (!this.canvas) return;

    // Set canvas dimensions to fill the container
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
  }

  clearCanvas(): void {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  draw(elevationData: ElevationMatrix, maxHeight: number, cellSize: number, rows: number, cols: number): void {
    this.clearCanvas();
    this.drawTerrain(elevationData, maxHeight, cellSize);
    this.drawGrid(rows, cols, cellSize);
  }

  abstract drawGrid(rows: number, cols: number, cellSize: number): void;

  abstract drawTerrain(elevationData: ElevationMatrix, maxHeight: number, cellSize: number): void;
}

export default BaseRenderer;

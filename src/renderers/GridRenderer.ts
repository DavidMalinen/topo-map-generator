import type { Point } from '@/types';

class GridRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private readonly offsetX: number;
  private readonly offsetY: number;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.offsetX = canvas.width / 2;
    this.offsetY = canvas.height / 4;
  }

  drawTopDownGrid(cellSize: number, rows: number, cols: number): void {
    this.ctx.strokeStyle = 'rgba(198, 255, 0, 0.1)';
    this.ctx.lineWidth = 1;

    // Draw vertical lines
    for (let x = 0; x <= cols; x++) {
      this.ctx.beginPath();
      this.ctx.moveTo(x * cellSize, 0);
      this.ctx.lineTo(x * cellSize, this.canvas.height);
      this.ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= rows; y++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y * cellSize);
      this.ctx.lineTo(this.canvas.width, y * cellSize);
      this.ctx.stroke();
    }
  }

  drawIsometricGrid(rows: number, cols: number, cellSize: number): void {
    this.ctx.strokeStyle = 'rgba(198, 255, 0, 0.15)';
    this.ctx.lineWidth = 1;

    // Create a list of lines to draw
    const gridLines: Point[][] = [];

    // Horizontal lines (diagonal in isometric view)
    for (let y = 0; y <= rows; y++) {
      const points: Point[] = [];
      for (let x = 0; x <= cols; x++) {
        // Calculate isometric projection (no height adjustment)
        const isoX = (x - y) * cellSize;
        const isoY = (x + y) * cellSize / 2;

        points.push({
          x: this.offsetX + isoX,
          y: this.offsetY + isoY
        });
      }
      gridLines.push(points);
    }

    // Vertical lines (diagonal in isometric view)
    for (let x = 0; x <= cols; x++) {
      const points: Point[] = [];
      for (let y = 0; y <= rows; y++) {
        // Calculate isometric projection (no height adjustment)
        const isoX = (x - y) * cellSize;
        const isoY = (x + y) * cellSize / 2;

        points.push({
          x: this.offsetX + isoX,
          y: this.offsetY + isoY
        });
      }
      gridLines.push(points);
    }

    // Draw the grid lines
    gridLines.forEach(points => {
      this.ctx.beginPath();
      this.ctx.moveTo(points[0].x, points[0].y);

      for (let i = 1; i < points.length; i++) {
        this.ctx.lineTo(points[i].x, points[i].y);
      }

      this.ctx.stroke();
    });
  }
}

export default GridRenderer;

class GridRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private cellSize: number;
  private rows: number;
  private cols: number;
  private offsetX: number;
  private offsetY: number;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, cellSize: number, rows: number, cols: number) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.cellSize = cellSize;
    this.rows = rows;
    this.cols = cols;
    this.offsetX = canvas.width / 2;
    this.offsetY = canvas.height / 4;
  }

  drawTopDownGrid(): void {
    this.ctx.strokeStyle = 'rgba(198, 255, 0, 0.1)';
    this.ctx.lineWidth = 1;

    // Draw vertical lines
    for (let x = 0; x <= this.cols; x++) {
      this.ctx.beginPath();
      this.ctx.moveTo(x * this.cellSize, 0);
      this.ctx.lineTo(x * this.cellSize, this.canvas.height);
      this.ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= this.rows; y++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y * this.cellSize);
      this.ctx.lineTo(this.canvas.width, y * this.cellSize);
      this.ctx.stroke();
    }
  }

  drawIsometricGrid(): void {
    this.ctx.strokeStyle = 'rgba(198, 255, 0, 0.1)';
    this.ctx.lineWidth = 1;

    // Draw horizontal grid lines
    for (let y = 0; y <= this.rows; y++) {
      this.ctx.beginPath();
      const startX = this.offsetX - this.cols * this.cellSize / 2;
      const startY = this.offsetY + y * this.cellSize / 2;
      this.ctx.moveTo(startX, startY);
      this.ctx.lineTo(startX + this.cols * this.cellSize, startY);
      this.ctx.stroke();
    }

    // Draw vertical grid lines
    for (let x = 0; x <= this.cols; x++) {
      this.ctx.beginPath();
      const startX = this.offsetX - this.cols * this.cellSize / 2 + x * this.cellSize;
      const startY = this.offsetY;
      this.ctx.moveTo(startX, startY);
      this.ctx.lineTo(startX, startY + this.rows * this.cellSize / 2);
      this.ctx.stroke();
    }
  }
}

export default GridRenderer;
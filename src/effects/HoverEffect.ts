class HoverEffect {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private cellSize: number;
  private rows: number;
  private cols: number;
  private offsetX: number;
  private offsetY: number;

  constructor(canvas: HTMLCanvasElement, cellSize: number) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.cellSize = cellSize;
    this.rows = Math.floor(canvas.height / cellSize);
    this.cols = Math.floor(canvas.width / cellSize);
    this.offsetX = canvas.width / 2;
    this.offsetY = canvas.height / 4;
  }

  drawHoverEffects(currentX: number, currentY: number, isometric = false): void {
    if (!this.isInBounds(currentX, currentY)) return;
    
    // Draw cross at the hovered cell
    this.highlightCell(currentX, currentY, 1.0, isometric);
    
    // Draw fainter highlight at surrounding cells
    const neighbors = [
      [currentX - 1, currentY], [currentX + 1, currentY], 
      [currentX, currentY - 1], [currentX, currentY + 1]
    ];
    
    for (const [nx, ny] of neighbors) {
      if (this.isInBounds(nx, ny)) {
        this.highlightCell(nx, ny, 0.4, isometric);
      }
    }
  }

  highlightCell(x: number, y: number, intensity: number, isometric: boolean): void {
    if (isometric) {
      this.highlightIsometricCell(x, y, intensity);
    } else {
      this.ctx.fillStyle = `rgba(198, 255, 0, ${intensity * 0.2})`;
      this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
    }
  }

  highlightIsometricCell(x: number, y: number, intensity: number): void {
    const isoX = this.offsetX + (x - y) * this.cellSize / 2;
    const isoY = this.offsetY + (x + y) * this.cellSize / 4;
    
    this.ctx.fillStyle = `rgba(198, 255, 0, ${intensity * 0.2})`;
    this.ctx.beginPath();
    this.ctx.moveTo(isoX, isoY);
    this.ctx.lineTo(isoX + this.cellSize/2, isoY - this.cellSize/4);
    this.ctx.lineTo(isoX, isoY - this.cellSize/2);
    this.ctx.lineTo(isoX - this.cellSize/2, isoY - this.cellSize/4);
    this.ctx.closePath();
    this.ctx.fill();
  }

  isInBounds(x: number, y: number): boolean {
    return x >= 0 && x < this.cols && y >= 0 && y < this.rows;
  }
}

export default HoverEffect;
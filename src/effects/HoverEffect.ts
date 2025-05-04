import BaseEffect from './BaseEffect';

class HoverEffect extends BaseEffect {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private cellSize: number;
  private isActive: boolean;

  constructor(canvas: HTMLCanvasElement, cellSize: number) {
    super();
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.cellSize = cellSize;
    this.isActive = false;
  }

  initialize(): void {
    // Nothing special needed for initialization
  }

  apply(x: number, y: number, isometric: boolean): void {
    if (this.isActive) {
      this.highlightCell(x, y, 0.8, isometric);
    }
  }

  toggle(active: boolean): void {
    this.isActive = active;
  }

  highlightCell(x: number, y: number, opacity: number, isometric: boolean): void {
    if (isometric) {
      this.highlightIsometricCell(x, y, opacity);
    } else {
      this.ctx.fillStyle = `rgba(198, 255, 0, ${opacity * 0.2})`;
      this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
    }
  }

  highlightIsometricCell(x: number, y: number, opacity: number): void {
    const offsetX = this.canvas.width / 2;
    const offsetY = this.canvas.height / 4;
    const isoX = offsetX + (x - y) * this.cellSize;
    const isoY = offsetY + (x + y) * this.cellSize / 2;

    this.ctx.beginPath();
    this.ctx.moveTo(isoX, isoY);
    this.ctx.lineTo(isoX + this.cellSize, isoY + this.cellSize / 2);
    this.ctx.lineTo(isoX, isoY + this.cellSize);
    this.ctx.lineTo(isoX - this.cellSize, isoY + this.cellSize / 2);
    this.ctx.closePath();

    this.ctx.fillStyle = `rgba(198, 255, 0, ${opacity * 0.2})`;
    this.ctx.fill();
  }

  dispose(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

export default HoverEffect;

abstract class BaseRenderer {
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;
  protected offsetX: number;
  protected offsetY: number;

  constructor(canvas: HTMLCanvasElement, ctx?: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx || canvas.getContext('2d') as CanvasRenderingContext2D;
    this.offsetX = canvas.width / 2;
    this.offsetY = canvas.height / 4;
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

  abstract draw(): void;
  
  abstract drawTerrain(elevationData: number[][], maxHeight: number, cellSize: number): void;
}

export default BaseRenderer;
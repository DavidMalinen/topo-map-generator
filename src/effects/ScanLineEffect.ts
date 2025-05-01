import BaseEffect from './BaseEffect';

class ScanLineEffect extends BaseEffect {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private position: number;
  private speed: number;
  private animationId: number | null;

  constructor(canvas: HTMLCanvasElement) {
    super();
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.position = 0;
    this.speed = 2;
    this.animationId = null;
  }

  initialize(): void {
    this.position = 0;
  }

  apply(): void {
    this.drawScanLine();
  }

  toggle(active: boolean): void {
    if (active) {
      this.start();
    } else {
      this.stop();
    }
  }

  start(): void {
    if (this.animationId !== null) return;

    const animate = (): void => {
      this.position += this.speed;
      if (this.position > this.canvas.height) {
        this.position = 0;
      }

      this.drawScanLine();
      this.animationId = requestAnimationFrame(animate);
    };

    this.animationId = requestAnimationFrame(animate);
  }

  stop(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  drawScanLine(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = 'rgba(198, 255, 0, 0.5)';
    this.ctx.fillRect(0, this.position, this.canvas.width, 2);
  }

  dispose(): void {
    this.stop();
  }
}

export default ScanLineEffect;

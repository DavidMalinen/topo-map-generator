class ScanLineEffect {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationFrameId: number | null;
  private position: number;
  private scanHeight: number;
  private speed: number;
  private scanLine: HTMLDivElement | null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.animationFrameId = null;
    this.position = 0;
    this.scanHeight = 2;
    this.speed = 1;
    
    // Create scan line element
    this.scanLine = document.createElement('div');
    this.scanLine.classList.add('scan-line');
    this.scanLine.style.display = 'none';
    this.scanLine.style.position = 'absolute';
    this.scanLine.style.height = `${this.scanHeight}px`;
    this.scanLine.style.width = '100%';
    this.scanLine.style.backgroundColor = 'rgba(198, 255, 0, 0.5)';
    this.scanLine.style.pointerEvents = 'none';
    this.canvas.parentElement?.appendChild(this.scanLine);
  }

  start(): void {
    if (!this.animationFrameId) {
      this.scanLine!.style.display = 'block';
      this.animate();
    }
  }

  stop(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
      this.scanLine!.style.display = 'none';
    }
  }

  animate(): void {
    this.position = (this.position + this.speed) % this.canvas.height;
    this.drawScanLine();
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  drawScanLine(): void {
    const canvasRect = this.canvas.getBoundingClientRect();
    this.scanLine!.style.top = `${canvasRect.top + this.position}px`;
    this.scanLine!.style.left = `${canvasRect.left}px`;
    this.scanLine!.style.width = `${canvasRect.width}px`;
  }

  clearScanLine(): void {
    if (this.scanLine && this.scanLine.parentNode) {
      this.scanLine.parentNode.removeChild(this.scanLine);
    }
  }
}

export default ScanLineEffect;
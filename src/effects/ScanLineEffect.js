class ScanLineEffect {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.scanPosition = 0;
        this.scanActive = false;
    }

    start() {
        this.scanActive = true;
        this.animate();
    }

    stop() {
        this.scanActive = false;
        this.clearScanLine();
    }

    animate() {
        if (!this.scanActive) return;

        this.clearScanLine();
        this.drawScanLine();
        this.scanPosition += 2;

        if (this.scanPosition > this.canvas.height) {
            this.scanPosition = 0;
        }

        requestAnimationFrame(this.animate.bind(this));
    }

    drawScanLine() {
        this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.scanPosition);
        this.ctx.lineTo(this.canvas.width, this.scanPosition);
        this.ctx.stroke();
    }

    clearScanLine() {
        this.ctx.clearRect(0, this.scanPosition - 2, this.canvas.width, 4);
    }
}

export default ScanLineEffect;
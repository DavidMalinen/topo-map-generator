class HoverEffect {
    constructor(canvas, cellSize) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.cellSize = cellSize;
        this.hoverRadius = 2;
    }

    drawHoverEffects(currentX, currentY, isometric = false) {
        for (let j = -this.hoverRadius; j <= this.hoverRadius; j++) {
            for (let i = -this.hoverRadius; i <= this.hoverRadius; i++) {
                if (i === 0 && j === 0) continue;

                const targetX = currentX + i;
                const targetY = currentY + j;

                if (this.isInBounds(targetX, targetY)) {
                    const distance = Math.sqrt(i * i + j * j);
                    if (distance <= this.hoverRadius) {
                        const intensity = 1 - (distance / this.hoverRadius);
                        this.highlightCell(targetX, targetY, intensity, isometric);
                    }
                }
            }
        }
    }

    highlightCell(x, y, intensity, isometric) {
        if (isometric) {
            this.highlightIsometricCell(x, y, intensity);
        } else {
            this.ctx.fillStyle = `rgba(198, 255, 0, ${intensity * 0.2})`;
            this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
        }
    }

    highlightIsometricCell(x, y, intensity) {
        const offsetX = this.canvas.width / 2;
        const offsetY = this.canvas.height / 4;

        const isoX = (x - y) * this.cellSize;
        const isoY = (x + y) * this.cellSize / 2;

        this.ctx.strokeStyle = `rgba(198, 255, 0, ${intensity * 0.5})`;
        this.ctx.lineWidth = 2;

        this.ctx.beginPath();
        this.ctx.moveTo(offsetX + isoX, offsetY + isoY);
        this.ctx.lineTo(offsetX + isoX + this.cellSize, offsetY + isoY + this.cellSize / 2);
        this.ctx.lineTo(offsetX + isoX, offsetY + isoY + this.cellSize);
        this.ctx.lineTo(offsetX + isoX - this.cellSize, offsetY + isoY + this.cellSize / 2);
        this.ctx.closePath();
        this.ctx.stroke();
    }

    isInBounds(x, y) {
        return x >= 0 && x < this.canvas.width / this.cellSize && y >= 0 && y < this.canvas.height / this.cellSize;
    }
}

export default HoverEffect;
class UIController {
    constructor(canvas, ctx, statusElement, coordinatesElement, heightValueElement) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.statusElement = statusElement;
        this.coordinatesElement = coordinatesElement;
        this.heightValueElement = heightValueElement;
        this.state = {
            isometric: false,
            maxHeight: 100,
            currentX: -1,
            currentY: -1,
            isDragging: false,
            hoverActive: false,
            colorShiftActive: false,
            activeButtons: {}
        };
        this.cellSize = 40;
        this.rows = Math.floor(canvas.height / this.cellSize);
        this.cols = Math.floor(canvas.width / this.cellSize);
    }

    updateStatus(message) {
        this.statusElement.textContent = message;
    }

    updateCoordinates(x, y) {
        this.coordinatesElement.textContent = `X: ${x} Y: ${y}`;
    }

    updateMaxHeight(value) {
        this.state.maxHeight = parseInt(value);
        this.heightValueElement.textContent = this.state.maxHeight;
    }

    toggleIsometricView() {
        this.state.isometric = !this.state.isometric;
    }

    setCurrentPosition(x, y) {
        this.state.currentX = x;
        this.state.currentY = y;
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawGrid() {
        if (this.state.isometric) {
            this.drawIsometricGrid();
        } else {
            this.drawTopDownGrid();
        }
    }

    drawIsometricGrid() {
        const offsetX = this.canvas.width / 2;
        const offsetY = this.canvas.height / 4;
        const gridLines = [];

        for (let y = 0; y <= this.rows; y++) {
            const points = [];
            for (let x = 0; x <= this.cols; x++) {
                const isoX = (x - y) * this.cellSize;
                const isoY = (x + y) * this.cellSize / 2;
                points.push({ x: offsetX + isoX, y: offsetY + isoY });
            }
            gridLines.push(points);
        }

        for (let x = 0; x <= this.cols; x++) {
            const points = [];
            for (let y = 0; y <= this.rows; y++) {
                const isoX = (x - y) * this.cellSize;
                const isoY = (x + y) * this.cellSize / 2;
                points.push({ x: offsetX + isoX, y: offsetY + isoY });
            }
            gridLines.push(points);
        }

        gridLines.forEach(points => {
            this.ctx.beginPath();
            this.ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                this.ctx.lineTo(points[i].x, points[i].y);
            }
            this.ctx.strokeStyle = 'rgba(198, 255, 0, 0.15)';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        });
    }

    drawTopDownGrid() {
        for (let x = 0; x <= this.cols; x++) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = 'rgba(198, 255, 0, 0.1)';
            this.ctx.lineWidth = 1;
            this.ctx.moveTo(x * this.cellSize, 0);
            this.ctx.lineTo(x * this.cellSize, this.canvas.height);
            this.ctx.stroke();
        }

        for (let y = 0; y <= this.rows; y++) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = 'rgba(198, 255, 0, 0.1)';
            this.ctx.lineWidth = 1;
            this.ctx.moveTo(0, y * this.cellSize);
            this.ctx.lineTo(this.canvas.width, y * this.cellSize);
            this.ctx.stroke();
        }
    }
}

export default UIController;
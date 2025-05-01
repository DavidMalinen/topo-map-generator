class GridRenderer {
    constructor(canvas, ctx, cellSize, rows, cols) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.cellSize = cellSize;
        this.rows = rows;
        this.cols = cols;
    }

    drawTopDownGrid() {
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

    drawIsometricGrid() {
        const offsetX = this.canvas.width / 2;
        const offsetY = this.canvas.height / 4;

        // Create a list of lines to draw
        const gridLines = [];

        // Horizontal lines (diagonal in isometric view)
        for (let y = 0; y <= this.rows; y++) {
            const points = [];
            for (let x = 0; x <= this.cols; x++) {
                const isoX = (x - y) * this.cellSize;
                const isoY = (x + y) * this.cellSize / 2;

                points.push({
                    x: offsetX + isoX,
                    y: offsetY + isoY
                });
            }
            gridLines.push(points);
        }

        // Vertical lines (diagonal in isometric view)
        for (let x = 0; x <= this.cols; x++) {
            const points = [];
            for (let y = 0; y <= this.rows; y++) {
                const isoX = (x - y) * this.cellSize;
                const isoY = (x + y) * this.cellSize / 2;

                points.push({
                    x: offsetX + isoX,
                    y: offsetY + isoY
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
            this.ctx.strokeStyle = 'rgba(198, 255, 0, 0.15)';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        });
    }
}

export default GridRenderer;
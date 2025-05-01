class BaseRenderer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx || (canvas && canvas.getContext('2d'));
    }

    setupCanvas() {
        if (!this.canvas) return;
        
        // Set canvas dimensions to fill the container
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
    }

    clearCanvas() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    draw() {
        throw new Error('Draw method must be implemented in subclasses');
    }
    
    drawTerrain() {
        throw new Error('drawTerrain method must be implemented in subclasses');
    }
}

export default BaseRenderer;
import BaseRenderer from './BaseRenderer.js';
import { ColorUtils } from '../utils/ColorUtils.js';

class TopDownRenderer extends BaseRenderer {
    constructor(canvas, ctx) {
        super(canvas, ctx);
    }

    drawGrid(cellSize, rows, cols) {
        this.ctx.strokeStyle = 'rgba(198, 255, 0, 0.1)';
        this.ctx.lineWidth = 1;

        // Draw vertical lines
        for (let x = 0; x <= cols; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * cellSize, 0);
            this.ctx.lineTo(x * cellSize, this.canvas.height);
            this.ctx.stroke();
        }

        // Draw horizontal lines
        for (let y = 0; y <= rows; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * cellSize);
            this.ctx.lineTo(this.canvas.width, y * cellSize);
            this.ctx.stroke();
        }
    }

    calculateFillOpacity(elevation, maxHeight, intensity) {
        if (elevation < maxHeight * 0.3) {
            return 0.1 + (intensity * 0.2);
        } else if (elevation < maxHeight * 0.7) {
            return 0.3 + (intensity * 0.3);
        } else {
            return 0.6 + (intensity * 0.2);
        }
    }

    drawTerrain(elevationData, cellSize, maxHeight) {
        if (!this.ctx) return;

        for (let y = 0; y < elevationData.length; y++) {
            for (let x = 0; x < elevationData[y].length; x++) {
                const elevation = elevationData[y][x];
                if (elevation > 0) {
                    const intensity = Math.min(1, elevation / maxHeight);
                    const fillOpacity = this.calculateFillOpacity(elevation, maxHeight, intensity);
                    this.ctx.fillStyle = ColorUtils.getColorWithShift(fillOpacity, elevation, maxHeight);
                    this.ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);

                    // Draw elevation label for high terrain
                    if (elevation > maxHeight * 0.5) {
                        this.drawElevationLabel(x, y, elevation, cellSize);
                    }
                }
            }
        }
    }

    drawElevationLabel(x, y, elevation, cellSize) {
        this.ctx.font = '10px monospace';
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
            Math.floor(elevation), 
            x * cellSize + cellSize / 2, 
            y * cellSize + cellSize / 2 + 3
        );
    }
}

export default TopDownRenderer;
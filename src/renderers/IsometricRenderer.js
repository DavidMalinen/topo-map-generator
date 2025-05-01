import BaseRenderer from './BaseRenderer.js';
import { ColorUtils } from '../utils/ColorUtils.js';
import PolygonUtils from '../utils/PolygonUtils.js';

class IsometricRenderer extends BaseRenderer {
    constructor(canvas, ctx) {
        super(canvas, ctx);
        this.faceDitherMaps = {};
    }

    drawIsometricGrid(rows, cols, cellSize) {
        const gridLines = [];

        for (let y = 0; y <= rows; y++) {
            const points = [];
            for (let x = 0; x <= cols; x++) {
                const isoX = (x - y) * cellSize;
                const isoY = (x + y) * cellSize / 2;

                points.push({
                    x: this.offsetX + isoX,
                    y: this.offsetY + isoY
                });
            }
            gridLines.push(points);
        }

        for (let x = 0; x <= cols; x++) {
            const points = [];
            for (let y = 0; y <= rows; y++) {
                const isoX = (x - y) * cellSize;
                const isoY = (x + y) * cellSize / 2;

                points.push({
                    x: this.offsetX + isoX,
                    y: this.offsetY + isoY
                });
            }
            gridLines.push(points);
        }

        this.drawGridLines(gridLines);
    }

    drawGridLines(gridLines) {
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

    drawTerrain(elevationData, maxHeight, cellSize) {
        if (!this.ctx) return;
        
        const offsetX = this.canvas.width / 2;
        const offsetY = this.canvas.height / 4;
        
        // Collect cells with elevation for proper sorting
        const cells = [];
        const rows = elevationData.length;
        const cols = elevationData[0].length;
        
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                if (elevationData[y][x] > 0) {
                    cells.push({ x, y, elevation: elevationData[y][x] });
                }
            }
        }
        
        // Sort for proper rendering order (back to front)
        cells.sort((a, b) => (a.x + a.y) - (b.x + b.y));
        
        // Draw each cell
        cells.forEach(cell => {
            const { x, y, elevation } = cell;
            const height = (elevation / maxHeight) * (cellSize * 2);
            
            // Calculate isometric coordinates
            const isoX = (x - y) * cellSize;
            const isoY = (x + y) * cellSize / 2;
            
            // Define the cell faces
            const topFace = [
                { x: offsetX + isoX, y: offsetY + isoY - height },
                { x: offsetX + isoX + cellSize, y: offsetY + isoY + cellSize / 2 - height },
                { x: offsetX + isoX, y: offsetY + isoY + cellSize - height },
                { x: offsetX + isoX - cellSize, y: offsetY + isoY + cellSize / 2 - height }
            ];
            
            const leftFace = [
                { x: offsetX + isoX - cellSize, y: offsetY + isoY + cellSize / 2 - height },
                { x: offsetX + isoX, y: offsetY + isoY + cellSize - height },
                { x: offsetX + isoX, y: offsetY + isoY + cellSize },
                { x: offsetX + isoX - cellSize, y: offsetY + isoY + cellSize / 2 }
            ];
            
            const rightFace = [
                { x: offsetX + isoX, y: offsetY + isoY + cellSize - height },
                { x: offsetX + isoX + cellSize, y: offsetY + isoY + cellSize / 2 - height },
                { x: offsetX + isoX + cellSize, y: offsetY + isoY + cellSize / 2 },
                { x: offsetX + isoX, y: offsetY + isoY + cellSize }
            ];
            
            // Draw faces with different shades
            this.drawFace(topFace, ColorUtils.getColorWithShift(1, elevation, maxHeight));
            this.drawFace(leftFace, ColorUtils.getColorWithShift(0.7, elevation, maxHeight));
            this.drawFace(rightFace, ColorUtils.getColorWithShift(0.85, elevation, maxHeight));
            
            // Draw elevation label for high terrain
            if (elevation > maxHeight * 0.7) {
                this.drawElevationLabel(
                    offsetX + isoX, 
                    offsetY + isoY - height, 
                    elevation
                );
            }
        });
    }

    drawFace(points, color) {
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
            this.ctx.lineTo(points[i].x, points[i].y);
        }
        
        this.ctx.closePath();
        this.ctx.fillStyle = color;
        this.ctx.fill();
        
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.lineWidth = 0.5;
        this.ctx.stroke();
    }

    drawElevationLabel(x, y, elevation) {
        this.ctx.font = '10px monospace';
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(Math.floor(elevation), x, y - 5);
    }
}

export default IsometricRenderer;
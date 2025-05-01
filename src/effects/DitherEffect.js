class DitherEffect {
    constructor() {
        this.ditherMap = [];
    }

    generateDitherMap(rows, cols, cellSize) {
        this.ditherMap = [];
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const cellMap = [];
                const dotsPerSide = cellSize / 2;

                for (let dy = 0; dy < dotsPerSide; dy++) {
                    for (let dx = 0; dx < dotsPerSide; dx++) {
                        cellMap.push(Math.random());
                    }
                }

                const index = y * cols + x;
                this.ditherMap[index] = cellMap;
            }
        }
    }

    drawDitheredCell(ctx, x, y, elevation, baseOpacity, cellSize) {
        const dotSize = 2;
        const intensity = Math.min(1, elevation);
        const dotsPerSide = cellSize / 2;

        const index = y * Math.floor(ctx.canvas.width / cellSize) + x;
        const cellMap = this.ditherMap[index];

        if (!cellMap) return;

        const density = 0.2 + (intensity * 0.8);

        let mapIndex = 0;
        for (let dy = 0; dy < dotsPerSide; dy++) {
            for (let dx = 0; dx < dotsPerSide; dx++) {
                if (cellMap[mapIndex] < density) {
                    const dotX = x * cellSize + dx * dotSize * 2;
                    const dotY = y * cellSize + dy * dotSize * 2;

                    ctx.fillStyle = `rgba(198, 255, 0, ${baseOpacity + 0.3})`;
                    ctx.fillRect(dotX, dotY, dotSize, dotSize);
                }
                mapIndex++;
            }
        }
    }
}

export default DitherEffect;
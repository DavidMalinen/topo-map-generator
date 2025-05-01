export class DitherMap {
    constructor(cellSize) {
        this.cellSize = cellSize;
        this.ditherPatterns = [];
    }

    generateDitherMap(rows, cols) {
        this.ditherPatterns = [];
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const cellMap = this.createDitherPattern();
                this.ditherPatterns[y * cols + x] = cellMap;
            }
        }
    }

    createDitherPattern() {
        const dotsPerSide = this.cellSize / 2;
        const cellMap = [];

        for (let dy = 0; dy < dotsPerSide; dy++) {
            for (let dx = 0; dx < dotsPerSide; dx++) {
                cellMap.push(Math.random());
            }
        }

        return cellMap;
    }

    getDitherPattern(index) {
        return this.ditherPatterns[index] || [];
    }
}

export default DitherMap;
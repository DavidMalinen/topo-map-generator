class BaseTerrainGenerator {
    constructor(rows, cols, maxHeight) {
        this.rows = rows;
        this.cols = cols;
        this.maxHeight = maxHeight;
        this.elevationData = Array.from({ length: rows }, () => Array(cols).fill(0));
    }

    generate() {
        throw new Error("Generate method must be implemented in subclasses.");
    }

    modifyElevation(x, y, amount) {
        if (this.isInBounds(x, y)) {
            this.elevationData[y][x] = Math.max(0, this.elevationData[y][x] + amount);
        }
    }

    isInBounds(x, y) {
        return x >= 0 && x < this.cols && y >= 0 && y < this.rows;
    }

    getElevation(x, y) {
        if (this.isInBounds(x, y)) {
            return this.elevationData[y][x];
        }
        return null;
    }

    getElevationData() {
        return this.elevationData;
    }
}

export default BaseTerrainGenerator;
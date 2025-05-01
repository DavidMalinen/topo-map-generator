class TerrainModel {
    constructor(rows, cols, maxHeight) {
        this.rows = rows;
        this.cols = cols;
        this.maxHeight = maxHeight;
        this.elevationData = Array.from({ length: rows }, () => Array(cols).fill(0));
    }

    modifyElevation(x, y, amount) {
        if (this.isValidCoordinate(x, y)) {
            this.elevationData[y][x] = Math.max(0, this.elevationData[y][x] + amount);
        }
    }

    getElevation(x, y) {
        if (this.isValidCoordinate(x, y)) {
            return this.elevationData[y][x];
        }
        return null;
    }

    isValidCoordinate(x, y) {
        return x >= 0 && x < this.cols && y >= 0 && y < this.rows;
    }

    randomizeTerrain() {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                this.elevationData[y][x] = Math.floor(Math.random() * this.maxHeight);
            }
        }
    }

    createCenterPeak() {
        const centerX = Math.floor(this.cols / 2);
        const centerY = Math.floor(this.rows / 2);
        const radius = Math.min(this.rows, this.cols) / 2;

        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
                if (distance <= radius) {
                    const factor = 1 - (distance / radius);
                    this.elevationData[y][x] = this.maxHeight * Math.pow(factor, 1.2);
                }
            }
        }
    }
}

export default TerrainModel;
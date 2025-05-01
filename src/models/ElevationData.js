class ElevationData {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.elevationData = Array.from({ length: rows }, () => Array(cols).fill(0));
    }

    getElevation(x, y) {
        if (this.isValidCoordinate(x, y)) {
            return this.elevationData[y][x];
        }
        return null;
    }

    setElevation(x, y, value) {
        if (this.isValidCoordinate(x, y)) {
            this.elevationData[y][x] = Math.max(0, value);
        }
    }

    modifyElevation(x, y, amount) {
        if (this.isValidCoordinate(x, y)) {
            this.elevationData[y][x] = Math.max(0, this.elevationData[y][x] + amount);
        }
    }

    isValidCoordinate(x, y) {
        return x >= 0 && x < this.cols && y >= 0 && y < this.rows;
    }

    clear() {
        this.elevationData = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
    }
    
    randomize(maxHeight) {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                this.elevationData[y][x] = Math.floor(Math.random() * maxHeight);
            }
        }
    }
    
    setFromArray(data) {
        if (!data || data.length !== this.rows) return;
        
        for (let y = 0; y < this.rows; y++) {
            if (data[y] && data[y].length === this.cols) {
                for (let x = 0; x < this.cols; x++) {
                    this.elevationData[y][x] = data[y][x];
                }
            }
        }
    }
    
    getRawData() {
        return this.elevationData;
    }
}

export default ElevationData;
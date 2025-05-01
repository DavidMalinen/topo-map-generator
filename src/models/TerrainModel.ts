import { ElevationMatrix, TerrainOptions } from '../types';

class TerrainModel implements TerrainOptions {
    rows: number;
    cols: number;
    maxHeight: number;
    elevationData: ElevationMatrix;

    constructor(rows: number, cols: number, maxHeight: number) {
        this.rows = rows;
        this.cols = cols;
        this.maxHeight = maxHeight;
        this.elevationData = Array.from({ length: rows }, () => Array(cols).fill(0));
    }

    modifyElevation(x: number, y: number, amount: number): void {
        if (this.isValidCoordinate(x, y)) {
            this.elevationData[y][x] = Math.max(0, this.elevationData[y][x] + amount);
        }
    }

    getElevation(x: number, y: number): number | null {
        if (this.isValidCoordinate(x, y)) {
            return this.elevationData[y][x];
        }
        return null;
    }

    isValidCoordinate(x: number, y: number): boolean {
        return x >= 0 && x < this.cols && y >= 0 && y < this.rows;
    }

    randomizeTerrain(): void {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                this.elevationData[y][x] = Math.floor(Math.random() * this.maxHeight);
            }
        }
    }

    createCenterPeak(): void {
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
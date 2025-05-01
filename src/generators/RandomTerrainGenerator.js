import BaseTerrainGenerator from './BaseTerrainGenerator.js';

class RandomTerrainGenerator extends BaseTerrainGenerator {
    constructor(rows, cols, maxHeight) {
        super(rows, cols, maxHeight);
    }

    generate() {
        this.elevationData = Array.from({ length: this.rows }, () => 
            Array.from({ length: this.cols }, () => Math.floor(Math.random() * this.maxHeight))
        );
    }
}

export default RandomTerrainGenerator;
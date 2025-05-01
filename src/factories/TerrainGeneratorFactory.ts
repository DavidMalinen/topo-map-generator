import BaseTerrainGenerator from '../generators/BaseTerrainGenerator';
import CenterPeakGenerator from '../generators/CenterPeakGenerator';
import CityGridGenerator from '../generators/CityGridGenerator';
import CrystalFormationGenerator from '../generators/CrystalFormationGenerator';
import RandomTerrainGenerator from '../generators/RandomTerrainGenerator';
import WavePatternGenerator from '../generators/WavePatternGenerator';

class TerrainGeneratorFactory {
  readonly RandomTerrainGenerator: typeof RandomTerrainGenerator;
  readonly CenterPeakGenerator: typeof CenterPeakGenerator;
  readonly CityGridGenerator: typeof CityGridGenerator;
  readonly CrystalFormationGenerator: typeof CrystalFormationGenerator;
  readonly WavePatternGenerator: typeof WavePatternGenerator;
  
  constructor() {
    this.RandomTerrainGenerator = RandomTerrainGenerator;
    this.CenterPeakGenerator = CenterPeakGenerator;
    this.CityGridGenerator = CityGridGenerator;
    this.CrystalFormationGenerator = CrystalFormationGenerator;
    this.WavePatternGenerator = WavePatternGenerator;
  }

  createGenerator(type: string, rows: number, cols: number, maxHeight: number): BaseTerrainGenerator {
    switch (type) {
    case 'random':
      return new RandomTerrainGenerator(rows, cols, maxHeight);
    case 'centerPeak':
      return new CenterPeakGenerator(rows, cols, maxHeight);
    case 'cityGrid':
      return new CityGridGenerator(rows, cols, maxHeight);
    case 'crystal':
      return new CrystalFormationGenerator(rows, cols, maxHeight);
    case 'wave':
      return new WavePatternGenerator(rows, cols, maxHeight);
    default:
      throw new Error(`Unknown generator type: ${type}`);
    }
  }
}

export default TerrainGeneratorFactory;
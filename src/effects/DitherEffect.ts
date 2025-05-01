import DitherMap from '../models/DitherMap';

class DitherEffect {
  private ditherMap: DitherMap;
  private canvasCache: Record<string, HTMLCanvasElement>;
  
  constructor() {
    // Create a DitherMap instance instead of hardcoding patterns
    this.ditherMap = new DitherMap();
    this.canvasCache = {};
  }

  /**
   * Generate persistent dither patterns once at initialization
   * This matches the behavior in the original topo-script.js
   */
  generateDitherMap(rows: number, cols: number, cellSize: number): void {
    // Set cellSize before generating patterns
    this.ditherMap.setCellSize(cellSize);
    
    // Generate persistent patterns that will be reused
    this.ditherMap.generateDitherMap(rows, cols);
  }

  drawDitheredCell(
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    elevation: number, 
    baseOpacity: number, 
    cellSize: number
  ): void {
    const threshold = elevation / 5;
    const cacheKey = `dither_${x}_${y}_${Math.floor(threshold)}_${baseOpacity.toFixed(2)}`;
    
    if (!this.canvasCache[cacheKey]) {
      const canvas = document.createElement('canvas');
      canvas.width = cellSize;
      canvas.height = cellSize;
      const ditherCtx = canvas.getContext('2d')!;
      
      // Draw base
      ditherCtx.fillStyle = `rgba(198, 255, 0, ${baseOpacity * 0.2})`;
      ditherCtx.fillRect(0, 0, cellSize, cellSize);
      
      // Apply dither pattern using our persistent patterns
      ditherCtx.fillStyle = `rgba(198, 255, 0, 0.05)`;
      
      const tileSize = 4;
      const cols = Math.floor(ctx.canvas.width / cellSize);
      const index = y * cols + x;
      
      // Get the pre-generated dither pattern for this cell
      const cellDitherPattern = this.ditherMap.getDitherPattern(index);
      const dotSize = 2;
      const dotsPerSide = Math.floor(cellSize / 2);
      
      // Only apply dithering if we have a pattern
      if (cellDitherPattern && cellDitherPattern.length > 0) {
        const density = 0.2 + (Math.min(1, elevation / 100) * 0.8);
        
        let mapIndex = 0;
        for (let dy = 0; dy < dotsPerSide; dy++) {
          for (let dx = 0; dx < dotsPerSide; dx++) {
            // Use the persistent random value from our pattern
            if (cellDitherPattern[mapIndex] < density) {
              const dotX = dx * dotSize * 2;
              const dotY = dy * dotSize * 2;
              ditherCtx.fillRect(dotX, dotY, dotSize, dotSize);
            }
            mapIndex = (mapIndex + 1) % cellDitherPattern.length;
          }
        }
      }
      
      this.canvasCache[cacheKey] = canvas;
    }
    
    ctx.drawImage(this.canvasCache[cacheKey], x * cellSize, y * cellSize);
  }
  
  clearCache(): void {
    this.canvasCache = {};
  }
}

export default DitherEffect;
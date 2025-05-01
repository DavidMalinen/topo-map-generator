import BaseEffect from '../effects/BaseEffect';
import DitherEffect from '../effects/DitherEffect';
import HoverEffect from '../effects/HoverEffect';
import ScanLineEffect from '../effects/ScanLineEffect';
import EffectsFactory from '../factories/EffectsFactory';
import { ElevationMatrix } from '../types';

class EffectsSystem {
  private effects: Map<string, BaseEffect>;
  private effectsFactory: EffectsFactory;

  constructor(canvas: HTMLCanvasElement, cellSize: number) {
    this.effectsFactory = new EffectsFactory();
    this.effects = new Map();

    // Create and store standard effects
    this.effects.set('scanline', this.effectsFactory.createEffect('scanline', canvas, cellSize));
    this.effects.set('hover', this.effectsFactory.createEffect('hover', canvas, cellSize));
    this.effects.set('dither', this.effectsFactory.createEffect('dither', canvas, cellSize));
  }

  // Access effects with type safety
  get scanLineEffect(): ScanLineEffect {
    return this.effects.get('scanline') as ScanLineEffect;
  }

  get hoverEffect(): HoverEffect {
    return this.effects.get('hover') as HoverEffect;
  }

  get ditherEffect(): DitherEffect {
    return this.effects.get('dither') as DitherEffect;
  }

  initDitherMap(rows: number, cols: number, cellSize: number): void {
    this.ditherEffect.generateDitherMap(rows, cols, cellSize);
  }

  applyDitherEffect(ctx: CanvasRenderingContext2D, terrainData: ElevationMatrix,
    rows: number, cols: number, maxHeight: number, cellSize: number): void {
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const elevation = terrainData[y][x];
        if (elevation > 0) {
          const baseOpacity = elevation / maxHeight;
          this.ditherEffect.drawDitheredCell(ctx, x, y, elevation, baseOpacity, cellSize);
        }
      }
    }
  }

  drawHoverEffects(x: number, y: number, isometric: boolean): void {
    this.hoverEffect.highlightCell(x, y, 0.8, isometric);
  }

  toggleScanLine(active: boolean): void {
    if (active) {
      this.scanLineEffect.start();
    } else {
      this.scanLineEffect.stop();
    }
  }

  toggleEffect(effectName: string, active: boolean): void {
    switch (effectName) {
    case 'scan':
      this.toggleScanLine(active);
      break;
    case 'dither':
      // Dither effect doesn't need runtime toggle, just redraw
      break;
    case 'hover':
      // Hover effect doesn't need runtime toggle, just redraw
      break;
      // Add other effects as needed
    }
  }
}

export default EffectsSystem;

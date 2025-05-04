import StateManager from '../controllers/StateManager';
import BaseEffect from '../effects/BaseEffect';
import DitherEffect from '../effects/DitherEffect';
import HoverEffect from '../effects/HoverEffect';
import ScanLineEffect from '../effects/ScanLineEffect';
import EffectsFactory from '../factories/EffectsFactory';
import { ElevationMatrix } from '../types';
class EffectsSystem {
  private effects: Map<string, BaseEffect>;
  private effectsFactory: EffectsFactory;
  private stateManager: StateManager;

  constructor(canvas: HTMLCanvasElement, cellSize: number, stateManager: StateManager) {
    this.stateManager = stateManager;
    this.effectsFactory = new EffectsFactory();
    this.effects = new Map();
    this.stateManager = stateManager;

    // Create and store standard effects
    this.effects.set('scanline', this.effectsFactory.createEffect('scanline', canvas, cellSize, stateManager));
    this.effects.set('hover', this.effectsFactory.createEffect('hover', canvas, cellSize, stateManager));
    this.effects.set('dither', this.effectsFactory.createEffect('dither', canvas, cellSize, stateManager));

    // Initialize effects
    this.effects.forEach((effect) => {
      effect.initialize();
    });
  }

  // Access effects with type safety
  get scanLineEffect(): ScanLineEffect {
    return this.effects.get('scanline') as ScanLineEffect;
  }

  get hoverEffect(): HoverEffect {
    return this.effects.get('hover') as HoverEffect;
  }

  get ditherEffectInstance(): DitherEffect {
    return this.effects.get('dither') as DitherEffect;
  }

  public generateDitherMap(rows: number, cols: number): void {
    if (!this.ditherEffectInstance) return;
    this.ditherEffectInstance.generateDitherMap(rows, cols);
  }

  drawDitherEffect(ctx: CanvasRenderingContext2D, terrainData: ElevationMatrix, rows: number, cols: number, maxHeight: number, cellSize: number): void {
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const elevation = terrainData[y][x];
        if (elevation > 0) {
          const baseOpacity = elevation / maxHeight;
          this.ditherEffectInstance.apply(ctx, x, y, cols, baseOpacity, cellSize);
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
        this.scanLineEffect.toggle(active);
        break;
      case 'dither':
        this.stateManager.setDitherActive(active);
        break;
      case 'hover':
        // Hover effect doesn't need runtime toggle, just redraw
        break;
      // Add other effects as needed
    }
  }
}

export default EffectsSystem;

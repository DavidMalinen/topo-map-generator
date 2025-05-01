import BaseEffect from '../effects/BaseEffect';
import DitherEffect from '../effects/DitherEffect';
import HoverEffect from '../effects/HoverEffect';
import ScanLineEffect from '../effects/ScanLineEffect';
import StateManager from '../controllers/StateManager';

class EffectsFactory {
  readonly DitherEffect: typeof DitherEffect;
  readonly HoverEffect: typeof HoverEffect;
  readonly ScanLineEffect: typeof ScanLineEffect;

  constructor() {
    this.DitherEffect = DitherEffect;
    this.HoverEffect = HoverEffect;
    this.ScanLineEffect = ScanLineEffect;
  }

  createEffect(type: string, canvas: HTMLCanvasElement, cellSize: number, stateManager: StateManager): BaseEffect {
    switch (type) {
      case 'dither':
        return this.createDitherEffect(stateManager);
      case 'hover':
        return this.createHoverEffect(canvas, cellSize);
      case 'scanline':
        return this.createScanLineEffect(canvas);
      default:
        throw new Error(`Unknown effect type: ${type}`);
    }
  }

  private createDitherEffect(stateManager: StateManager): DitherEffect {
    const effect = new DitherEffect(stateManager);
    effect.initialize();
    return effect;
  }

  private createHoverEffect(canvas: HTMLCanvasElement, cellSize: number): HoverEffect {
    const effect = new HoverEffect(canvas, cellSize);
    effect.initialize();
    return effect;
  }

  private createScanLineEffect(canvas: HTMLCanvasElement): ScanLineEffect {
    const effect = new ScanLineEffect(canvas);
    effect.initialize();
    return effect;
  }
}

export default EffectsFactory;

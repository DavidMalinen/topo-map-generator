import BaseEffect from '../effects/BaseEffect';
import DitherEffect from '../effects/DitherEffect';
import HoverEffect from '../effects/HoverEffect';
import ScanLineEffect from '../effects/ScanLineEffect';

class EffectsFactory {
  createEffect(type: string, canvas: HTMLCanvasElement, cellSize: number): BaseEffect {
    let effect: BaseEffect;

    switch (type) {
    case 'dither':
      effect = new DitherEffect();
      break;
    case 'hover':
      effect = new HoverEffect(canvas, cellSize);
      break;
    case 'scanline':
      effect = new ScanLineEffect(canvas);
      break;
    default:
      throw new Error(`Unknown effect type: ${type}`);
    }

    // Initialize the effect
    effect.initialize();
    return effect;
  }
}

export default EffectsFactory;

import StateManager from '../controllers/StateManager';
import BaseEffect from '../effects/BaseEffect';
import DitherEffect from '../effects/DitherEffect';
import HoverEffect from '../effects/HoverEffect';
import ScanLineEffect from '../effects/ScanLineEffect';
import EffectsFactory from '../factories/EffectsFactory';
import { ElevationMatrix, Point } from '../types';

import { ColorUtils } from '@/utils/ColorUtils';

// Define the interface
interface IsometricDitherDetail {
  leftPoints: Point[];
  rightPoints: Point[];
  frontLeftPoints: Point[];
  frontRightPoints: Point[];
  intensity: number;
  height: number;
  maxHeight: number;
  leftColor?: string;
  rightColor?: string;
  frontLeftColor?: string;
  frontRightColor?: string;
}

class EffectsSystem {
  private effects: Map<string, BaseEffect>;
  private effectsFactory: EffectsFactory;
  private stateManager: StateManager;
  private ditherEffect: DitherEffect;

  constructor(canvas: HTMLCanvasElement, cellSize: number, stateManager: StateManager) {
    this.stateManager = stateManager;
    this.effectsFactory = new EffectsFactory();
    this.effects = new Map();
    this.ditherEffect = new DitherEffect(stateManager);
    this.stateManager = stateManager;

    // Create and store standard effects
    this.effects.set('scanline', this.effectsFactory.createEffect('scanline', canvas, cellSize, stateManager));
    this.effects.set('hover', this.effectsFactory.createEffect('hover', canvas, cellSize, stateManager));
    this.effects.set('dither', this.effectsFactory.createEffect('dither', canvas, cellSize, stateManager));

    this.setupIsometricDithering(canvas);
  }

  // Access effects with type safety
  get scanLineEffect(): ScanLineEffect {
    return this.effects.get('scanline') as ScanLineEffect;
  }

  get hoverEffect(): HoverEffect {
    return this.effects.get('hover') as HoverEffect;
  }

  get ditherEffectInstance(): DitherEffect {
    return this.ditherEffect;
  }

  initDitherMap(rows: number, cols: number, cellSize: number): void {
    this.ditherEffect.generateDitherMap(rows, cols, cellSize);
  }

  applyDitherEffect(ctx: CanvasRenderingContext2D, terrainData: ElevationMatrix,
    rows: number, cols: number, maxHeight: number, cellSize: number): void {

    // Don't apply top-down dithering when in isometric view
    if (this.stateManager.getState().isometric) {
      return;
    }

    // Only process if dither effect is active
    if (!this.stateManager.getState().ditherActive) {
      return;
    }

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const elevation = terrainData[y][x];
        if (elevation > 0) {
          const baseOpacity = elevation / maxHeight;
          this.ditherEffect.drawDitheredCell(ctx, x, y, baseOpacity, cellSize);
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
      this.stateManager.setDitherActive(active);
      break;
    case 'hover':
      // Hover effect doesn't need runtime toggle, just redraw
      break;
      // Add other effects as needed
    }
  }

  setupIsometricDithering(canvas: HTMLCanvasElement): void {
    canvas.addEventListener('apply-isometric-dither', ((e: CustomEvent<IsometricDitherDetail>) => {
      // Only apply if dithering is active AND we're in isometric view
      if (!this.stateManager.getState().isometric) return;

      const detail = e.detail;
      const ctx = canvas.getContext('2d')!;
      const colorShiftActive = canvas.dataset.colorShiftActive === 'true';

      // Use the colors provided in the event
      this.ditherEffect.drawDitheredIsometricFace(
        ctx,
        detail.leftPoints,
        detail.leftColor || ColorUtils.getLeftFaceColor(detail.intensity, detail.height, detail.maxHeight, colorShiftActive),
        detail.intensity * 0.7
      );

      this.ditherEffect.drawDitheredIsometricFace(
        ctx,
        detail.rightPoints,
        detail.rightColor || ColorUtils.getRightFaceColor(detail.intensity, detail.height, detail.maxHeight, colorShiftActive),
        detail.intensity * 0.5
      );

      this.ditherEffect.drawDitheredIsometricFace(
        ctx,
        detail.frontLeftPoints,
        detail.frontLeftColor || ColorUtils.getFrontLeftFaceColor(detail.intensity, detail.height, detail.maxHeight, colorShiftActive),
        detail.intensity * 0.4
      );

      this.ditherEffect.drawDitheredIsometricFace(
        ctx,
        detail.frontRightPoints,
        detail.frontRightColor || ColorUtils.getFrontRightFaceColor(detail.intensity, detail.height, detail.maxHeight, colorShiftActive),
        detail.intensity * 0.3
      );
    }) as EventListener);
  }
}

export default EffectsSystem;

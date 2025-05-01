import type { AppState } from '../types';

class StateManager {
  private state: AppState;

  constructor() {
    this.state = {
      isometric: false,
      maxHeight: 100,
      currentX: -1,
      currentY: -1,
      isDragging: false,
      brushStrength: 10,
      scanActive: false,
      scanPosition: 0,
      ditherActive: false,
      hoverActive: false,
      colorShiftActive: false,
      activeButtons: {},
      ditherMap: [],
      isoFaceDitherMaps: {},
      cellSize: 40
    };
  }

  updateMaxHeight(value: number): void {
    this.state.maxHeight = value;
  }

  toggleIsometric(): void {
    this.state.isometric = !this.state.isometric;
  }

  setCurrentPosition(x: number, y: number): void {
    this.state.currentX = x;
    this.state.currentY = y;
  }

  toggleDragging(): void {
    this.state.isDragging = !this.state.isDragging;
  }

  toggleScanActive(): void {
    this.state.scanActive = !this.state.scanActive;
  }

  setDitherActive(active: boolean): void {
    this.state.ditherActive = active;
  }

  setHoverActive(active: boolean): void {
    this.state.hoverActive = active;
  }

  setColorShiftActive(active: boolean): void {
    this.state.colorShiftActive = active;
  }

  toggleButton(buttonId: string): boolean {
    this.state.activeButtons[buttonId] = !this.state.activeButtons[buttonId];
    return this.state.activeButtons[buttonId];
  }

  getState(): AppState {
    return this.state;
  }
}

export default StateManager;
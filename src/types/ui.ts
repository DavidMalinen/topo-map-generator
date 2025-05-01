import BaseTerrainGenerator from '../generators/BaseTerrainGenerator';

export interface UIElements {
  maxHeightSlider: HTMLInputElement | null;
  heightValue: HTMLElement | null;
  toggleViewBtn: HTMLElement | null;
  resetBtn: HTMLElement | null;
  coordinates: HTMLElement | null;
  valueLabel: HTMLElement | null;
  status: HTMLElement | null;
}

export interface GeneratorButton {
  id: string;
  Generator: new (rows: number, cols: number, maxHeight: number) => BaseTerrainGenerator;
}

export interface EffectButton {
  id: string;
  effectName: string;
  toggleMethod: string;
  requiresRedraw: boolean;
  onActivate?: () => void;
  onDeactivate?: () => void;
}
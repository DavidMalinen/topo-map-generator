import BaseTerrainGenerator from '../generators/BaseTerrainGenerator.ts';

export interface Point {
  x: number;
  y: number;
}

export interface Cell {
  x: number;
  y: number;
  elevation: number;
}

// New type for polygon operations
export type Polygon = Point[];

export interface AppState {
  isometric: boolean;
  maxHeight: number;
  currentX: number;
  currentY: number;
  isDragging: boolean;
  brushStrength: number;
  scanActive: boolean;
  scanPosition: number;
  ditherActive: boolean;
  hoverActive: boolean;
  colorShiftActive: boolean;
  activeButtons: Record<string, boolean>;
  ditherMap: number[][];
  isoFaceDitherMaps: Record<string, number[]>;
  cellSize: number;
}

export interface EventHandlers {
  onCoordsChange?: (x: number, y: number) => void;
  onTerrainModify?: (x: number, y: number, amount: number) => void;
}

export type ElevationMatrix = number[][];

export type DitherPattern = number[];

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

// Additional interfaces for effect operations
export interface DitheredCellOptions {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  elevation: number;
  baseOpacity: number;
  cellSize: number;
}

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface IsometricCubeOptions {
  x: number;
  y: number;
  height: number;
  maxHeight: number;
  cellSize: number;
}

// New interface for terrain model operations
export interface TerrainOptions {
  rows: number;
  cols: number;
  maxHeight: number;
}
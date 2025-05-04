import { DitherPattern, IsoFaceDitherMaps } from "./dither";

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
  ditherMap: DitherPattern[];
  isoFaceDitherMaps: IsoFaceDitherMaps;
  cellSize: number;
}

import { Point } from "./geometry";

export interface DitherPoint {
  x: number;
  y: number;
  threshold: number;
}

export interface DitheredCellOptions {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  elevation: number;
  baseOpacity: number;
  cellSize: number;
}

export interface IsometricDitherDetail {
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

export type DitherPattern = number[];
export type IsoFaceDitherMaps = Record<string, DitherPoint[]>;

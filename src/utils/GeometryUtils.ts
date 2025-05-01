import { Point } from '../types';

class GeometryUtils {
  static distance(p1: Point, p2: Point): number {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }
  
  static manhattanDistance(p1: Point, p2: Point): number {
    return Math.abs(p2.x - p1.x) + Math.abs(p2.y - p1.y);
  }
  
  static cartesianToIsometric(x: number, y: number): Point {
    return {
      x: x - y,
      y: (x + y) / 2
    };
  }
  
  static isometricToCartesian(isoX: number, isoY: number): Point {
    return {
      x: (2 * isoY + isoX) / 2,
      y: (2 * isoY - isoX) / 2
    };
  }
  
  static findGridCell(screenX: number, screenY: number, cellSize: number, offsetX: number, offsetY: number): Point {
    // Convert screen coordinates to isometric grid coordinates
    const cartX = (screenX - offsetX) / cellSize;
    const cartY = (screenY - offsetY) / cellSize;
    
    const isoPos = this.isometricToCartesian(cartX, cartY);
    return {
      x: Math.floor(isoPos.x),
      y: Math.floor(isoPos.y)
    };
  }
}

export default GeometryUtils;
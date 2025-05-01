export interface Point {
  x: number;
  y: number;
}

export interface Cell {
  x: number;
  y: number;
  elevation: number;
}

// Type for polygon operations
export type Polygon = Point[];
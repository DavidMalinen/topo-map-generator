export interface EventHandlers {
  onCoordsChange?: (x: number, y: number) => void;
  onTerrainModify?: (x: number, y: number, amount: number) => void;
}
import type { AppState, EventHandlers } from '../types';
import UIController from './UIController';

class InputController {
  private canvas: HTMLCanvasElement;
  private state: AppState;
  private uiController: UIController;
  private cellSize: number;
  private currentX: number;
  private currentY: number;
  private isDragging: boolean;
  private handlers: EventHandlers;

  constructor(canvas: HTMLCanvasElement, state: AppState, uiController: UIController) {
    this.canvas = canvas;
    this.state = state;
    this.uiController = uiController;
    this.cellSize = state.cellSize || 40;

    this.currentX = -1;
    this.currentY = -1;
    this.isDragging = false;
    
    // Add callback handlers
    this.handlers = {
      onCoordsChange: undefined,
      onTerrainModify: undefined
    };
    
    // Initialize built-in listeners
    this.initEventListeners();
  }

  // Method to set up external handlers
  setupListeners(handlers: EventHandlers): void {
    if (handlers) {
      this.handlers = {
        ...this.handlers,
        ...handlers
      };
    }
    
    // For debugging
    console.log("Handlers set up:", !!this.handlers.onCoordsChange, !!this.handlers.onTerrainModify);
  }

  initEventListeners(): void {
    if (!this.canvas) {
      console.error("Canvas not available for event listeners");
      return;
    }
    
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    document.addEventListener('mouseup', () => this.handleMouseUp());
    this.canvas.addEventListener('wheel', (e) => this.handleWheel(e));
  }

  handleMouseMove(event: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    // Use cellSize from this object rather than state
    const cellSize = this.state.cellSize || this.cellSize;
    const x = Math.floor((event.clientX - rect.left) / cellSize);
    const y = Math.floor((event.clientY - rect.top) / cellSize);

    if (x !== this.currentX || y !== this.currentY) {
      this.currentX = x;
      this.currentY = y;
      
      // Update state
      this.state.currentX = x;
      this.state.currentY = y;
      
      // Call external handler if provided
      if (typeof this.handlers.onCoordsChange === 'function') {
        try {
          this.handlers.onCoordsChange(x, y);
        } catch (error) {
          console.error('Error in onCoordsChange handler:', error);
        }
      }
      
      // Also call UI controller method if available
      if (this.uiController && typeof this.uiController.updateCoordinates === 'function') {
        this.uiController.updateCoordinates(x, y);
      }
    }
    
    // Handle terrain modification during dragging
    if (this.isDragging && this.isValidCoordinate(x, y)) {
      this.modifyTerrainAt(x, y, this.state.brushStrength || 10);
    }
  }

  handleMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    const rect = this.canvas.getBoundingClientRect();
    const cellSize = this.state.cellSize || this.cellSize;
    const x = Math.floor((event.clientX - rect.left) / cellSize);
    const y = Math.floor((event.clientY - rect.top) / cellSize);
    
    this.modifyTerrainAt(x, y, this.state.brushStrength || 10);
  }

  handleMouseUp(): void {
    this.isDragging = false;
  }

  handleWheel(event: WheelEvent): void {
    event.preventDefault();
    const delta = Math.sign(event.deltaY);
    
    // Update max height in state
    const currentMaxHeight = this.state.maxHeight || 100;
    this.state.maxHeight = Math.max(10, currentMaxHeight - delta * 5);
    
    // Update UI if the method exists
    if (this.uiController && typeof this.uiController.updateHeightValue === 'function') {
      this.uiController.updateHeightValue(this.state.maxHeight);
    } else {
      console.warn("UIController.updateHeightValue is not defined");
    }
  }
  
  modifyTerrainAt(x: number, y: number, amount: number): void {
    if (this.isValidCoordinate(x, y)) {
      // Call external handler if provided
      if (typeof this.handlers.onTerrainModify === 'function') {
        try {
          this.handlers.onTerrainModify(x, y, amount);
        } catch (error) {
          console.error('Error in onTerrainModify handler:', error);
        }
      }
    }
  }
  
  isValidCoordinate(x: number, y: number): boolean {
    const cellSize = this.state.cellSize || this.cellSize;
    const cols = Math.floor(this.canvas.width / cellSize);
    const rows = Math.floor(this.canvas.height / cellSize);
    return x >= 0 && x < cols && y >= 0 && y < rows;
  }
}

export default InputController;
import InputController from '../controllers/InputController';
import StateManager from '../controllers/StateManager';
import UIController from '../controllers/UIController';
import UIManager from '../controllers/UIManager';
import TerrainGeneratorFactory from '../factories/TerrainGeneratorFactory';
import ElevationData from '../models/ElevationData';
import EffectsSystem from '../systems/EffectsSystem';
import RenderingSystem from '../systems/RenderingSystem';
import { AppState, ElevationMatrix } from '../types';

class TopoApp {
  // DOM elements
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;

  // Systems
  readonly stateManager: StateManager;
  readonly state: AppState;
  readonly rendering: RenderingSystem;
  readonly effects: EffectsSystem;
  readonly generatorFactory: TerrainGeneratorFactory;

  // Controllers
  readonly uiController: UIController;
  readonly inputController: InputController;
  readonly uiManager: UIManager;

  // Grid properties
  readonly cellSize: number;
  readonly rows: number;
  readonly cols: number;

  // Data models
  elevationData: ElevationData;

  constructor() {
    // Initialize canvas
    this.canvas = this.initCanvas();
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

    // Initialize dimensions
    this.cellSize = 40;
    this.rows = Math.floor(this.canvas.height / this.cellSize);
    this.cols = Math.floor(this.canvas.width / this.cellSize);

    // Initialize state
    this.stateManager = new StateManager();
    this.state = this.stateManager.getState();

    // Initialize systems
    this.rendering = new RenderingSystem(this.canvas, this.ctx);
    this.effects = new EffectsSystem(this.canvas, this.cellSize, this.stateManager);
    this.generatorFactory = new TerrainGeneratorFactory();

    // Initialize data
    this.elevationData = new ElevationData(this.rows, this.cols);

    // Initialize controllers
    this.uiController = this.initUIController();
    this.inputController = new InputController(this.canvas, this.state, this.uiController);
    this.uiManager = new UIManager(this);

    // Setup
    this.effects.initDitherMap(this.rows, this.cols, this.cellSize);
    this.uiManager.setupEventListeners();
    this.init();
  }

  private initCanvas(): HTMLCanvasElement {
    const canvas = document.getElementById('topo-canvas') as HTMLCanvasElement;
    if (!canvas) throw new Error('Canvas element not found');

    canvas.width = 800;
    canvas.height = 600;
    return canvas;
  }

  private initUIController(): UIController {
    return new UIController(
      document.getElementById('status'),
      document.getElementById('coordinates'),
      document.getElementById('value-label')
    );
  }

  init(): void {
    this.clearCanvas();
    this.drawGrid();
    this.updateStatus("STATUS: INITIALIZED");
  }

  clearCanvas(): void {
    this.rendering.clearCanvas(this.ctx, this.canvas.width, this.canvas.height);
  }

  modifyTerrainAt(x: number, y: number, amount: number): void {
    this.elevationData.modifyElevation(x, y, amount);
  }

  drawGrid(): void {
    this.rendering.drawGrid(this.state.isometric, this.rows, this.cols, this.cellSize);
  }

  updateStatus(message: string): void {
    this.uiManager.updateStatus(message);
  }

  drawTopo(): void {
    // Update dither state on the canvas for IsometricRenderer to access
    this.canvas.dataset.ditherActive = this.state.ditherActive.toString();

    // Get raw data from the model
    const terrainData: ElevationMatrix = this.elevationData.getRawData();

    // Draw terrain
    this.rendering.drawTerrain(this.state.isometric, terrainData, this.state.maxHeight,
      this.cellSize, this.rows, this.cols);

    // Apply effects
    if (this.state.ditherActive) {
      this.effects.applyDitherEffect(this.ctx, terrainData, this.rows, this.cols,
        this.state.maxHeight, this.cellSize);
    }

    if (this.state.hoverActive) {
      this.effects.drawHoverEffects(this.state.currentX, this.state.currentY,
        this.state.isometric);
    }
  }

  // Interface for UIManager to access terrain generators
  getTerrainGeneratorFactory(): TerrainGeneratorFactory {
    return this.generatorFactory;
  }
}

export default TopoApp;

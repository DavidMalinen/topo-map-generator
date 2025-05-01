import InputController from '../controllers/InputController';
import StateManager from '../controllers/StateManager';
import UIController from '../controllers/UIController';
import UIManager from '../controllers/UIManager';
import DitherEffect from '../effects/DitherEffect';
import HoverEffect from '../effects/HoverEffect';
import ScanLineEffect from '../effects/ScanLineEffect';
import CenterPeakGenerator from '../generators/CenterPeakGenerator';
import CityGridGenerator from '../generators/CityGridGenerator';
import CrystalFormationGenerator from '../generators/CrystalFormationGenerator';
import RandomTerrainGenerator from '../generators/RandomTerrainGenerator';
import WavePatternGenerator from '../generators/WavePatternGenerator';
import ElevationData from '../models/ElevationData';
import IsometricRenderer from '../renderers/IsometricRenderer';
import TopDownRenderer from '../renderers/TopDownRenderer';
import type { AppState, ElevationMatrix } from '../types';

class TopoApp {
  // DOM elements
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  
  // State management
  readonly stateManager: StateManager;
  readonly state: AppState;
  
  // Grid properties
  readonly cellSize: number;
  readonly rows: number;
  readonly cols: number;
  
  // Data models
  elevationData: ElevationData;
  
  // Renderers
  readonly topDownRenderer: TopDownRenderer;
  readonly isometricRenderer: IsometricRenderer;
  
  // Generator classes
  readonly RandomTerrainGenerator: typeof RandomTerrainGenerator;
  readonly CenterPeakGenerator: typeof CenterPeakGenerator;
  readonly CityGridGenerator: typeof CityGridGenerator;
  readonly CrystalFormationGenerator: typeof CrystalFormationGenerator;
  readonly WavePatternGenerator: typeof WavePatternGenerator;
  
  // Controllers
  readonly uiController: UIController;
  readonly inputController: InputController;
  readonly uiManager: UIManager;
  
  // Effects
  readonly scanLineEffect: ScanLineEffect;
  readonly hoverEffect: HoverEffect;
  readonly ditherEffect: DitherEffect;
  
  constructor() {
    // Get canvas and initialize context
    const canvas = document.getElementById('topo-canvas') as HTMLCanvasElement;
    if (!canvas) throw new Error('Canvas element not found');
    
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2D context');
    
    this.ctx = ctx;
    
    // Set canvas dimensions
    this.canvas.width = 800;
    this.canvas.height = 600;
    
    // Create state manager
    this.stateManager = new StateManager();
    this.state = this.stateManager.getState();
    
    // Grid properties
    this.cellSize = 40;
    this.rows = Math.floor(this.canvas.height / this.cellSize);
    this.cols = Math.floor(this.canvas.width / this.cellSize);
    
    // Initialize data model
    this.elevationData = new ElevationData(this.rows, this.cols);
    
    // Initialize renderers
    this.topDownRenderer = new TopDownRenderer(this.canvas, this.ctx);
    this.isometricRenderer = new IsometricRenderer(this.canvas, this.ctx);
    
    // Make generator classes available to UIManager
    this.RandomTerrainGenerator = RandomTerrainGenerator;
    this.CenterPeakGenerator = CenterPeakGenerator;
    this.CityGridGenerator = CityGridGenerator;
    this.CrystalFormationGenerator = CrystalFormationGenerator;
    this.WavePatternGenerator = WavePatternGenerator;
    
    // Initialize UI controller
    this.uiController = new UIController(
      document.getElementById('status'),
      document.getElementById('coordinates'),
      document.getElementById('value-label')
    );

    // Initialize input controller
    this.inputController = new InputController(
      this.canvas, 
      this.state,
      this.uiController
    );
    
    // Initialize effects
    this.scanLineEffect = new ScanLineEffect(this.canvas);
    this.hoverEffect = new HoverEffect(this.canvas, this.cellSize);
    this.ditherEffect = new DitherEffect();
    this.ditherEffect.generateDitherMap(this.rows, this.cols, this.cellSize);
    
    // Initialize UI Manager
    this.uiManager = new UIManager(this);
    
    // Set up event handlers through the UI Manager
    this.uiManager.setupEventListeners();
    
    // Init application
    this.init();
  }

  init(): void {
    this.clearCanvas();
    this.drawGrid();
    this.updateStatus("STATUS: INITIALIZED");
  }

  clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  modifyTerrainAt(x: number, y: number, amount: number): void {
    this.elevationData.modifyElevation(x, y, amount);
  }
  
    drawGrid(): void {
        if (this.state.isometric) {
            this.isometricRenderer.drawGrid(this.rows, this.cols, this.cellSize);
        } else {
            this.topDownRenderer.drawGrid(this.rows, this.cols, this.cellSize);
        }
    }

  updateStatus(message: string): void {
    this.uiManager.updateStatus(message);
  }

    drawTopo(): void {
        // Get raw data from the model
        const terrainData: ElevationMatrix = this.elevationData.getRawData();

        if (this.state.isometric) {
            this.isometricRenderer.draw(
                terrainData,
                this.state.maxHeight,
                this.cellSize,
                this.rows,
                this.cols
            );
        } else {
            this.topDownRenderer.draw(
                terrainData,
                this.state.maxHeight,
                this.cellSize,
                this.rows,
                this.cols
            );
        }

        if (this.state.ditherActive) {
            this.applyDitherEffect();
        }

        if (this.state.hoverActive) {
            this.hoverEffect.drawHoverEffects(
                this.state.currentX,
                this.state.currentY,
                this.state.isometric
            );
        }
    }

  applyDitherEffect(): void {
    const terrainData = this.elevationData.getRawData();
    
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const elevation = terrainData[y][x];
        if (elevation > 0) {
          const baseOpacity = elevation / this.state.maxHeight;
          this.ditherEffect.drawDitheredCell(
            this.ctx, 
            x, 
            y, 
            elevation, 
            baseOpacity, 
            this.cellSize
          );
        }
      }
    }
  }
}

export default TopoApp;
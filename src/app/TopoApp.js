import TopDownRenderer from '../renderers/TopDownRenderer.js';
import IsometricRenderer from '../renderers/IsometricRenderer.js';
import RandomTerrainGenerator from '../generators/RandomTerrainGenerator.js';
import CenterPeakGenerator from '../generators/CenterPeakGenerator.js';
import CityGridGenerator from '../generators/CityGridGenerator.js';
import CrystalFormationGenerator from '../generators/CrystalFormationGenerator.js';
import WavePatternGenerator from '../generators/WavePatternGenerator.js';
import InputController from '../controllers/InputController.js';
import UIController from '../controllers/UIController.js';
import StateManager from '../controllers/StateManager.js';
import ScanLineEffect from '../effects/ScanLineEffect.js';
import HoverEffect from '../effects/HoverEffect.js';
import DitherEffect from '../effects/DitherEffect.js';
import ElevationData from '../models/ElevationData.js';
import UIManager from '../controllers/UIManager.js';

class TopoApp {
    constructor() {
        // Get canvas and initialize context
        this.canvas = document.getElementById('topo-canvas');
        this.ctx = this.canvas.getContext('2d');
        
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

    init() {
        this.clearCanvas();
        this.drawGrid();
        this.updateStatus("STATUS: INITIALIZED");
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    modifyTerrainAt(x, y, amount) {
        this.elevationData.modifyElevation(x, y, amount);
    }
    
    drawGrid() {
        if (this.state.isometric) {
            this.isometricRenderer.drawIsometricGrid(this.rows, this.cols, this.cellSize);
        } else {
            this.topDownRenderer.drawGrid(this.cellSize, this.rows, this.cols);
        }
    }

    updateStatus(message) {
        this.uiManager.updateStatus(message);
    }

    drawTopo() {
        this.clearCanvas();

        // Get raw data from the model
        const terrainData = this.elevationData.getRawData();

        if (this.state.isometric) {
            this.isometricRenderer.drawTerrain(
                terrainData,
                this.state.maxHeight,
                this.cellSize
            );
        } else {
            this.topDownRenderer.drawTerrain(
                terrainData,
                this.cellSize,
                this.state.maxHeight
            );
        }

        this.drawGrid();
        
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

    applyDitherEffect() {
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
import TopDownRenderer from '../renderers/TopDownRenderer.js';
import IsometricRenderer from '../renderers/IsometricRenderer.js';
import { DitherMap } from '../models/DitherMap.js';
import RandomTerrainGenerator from '../generators/RandomTerrainGenerator.js';
import CenterPeakGenerator from '../generators/CenterPeakGenerator.js';
import CityGridGenerator from '../generators/CityGridGenerator.js';
import CrystalFormationGenerator from '../generators/CrystalFormationGenerator.js';


// import { PerlinNoise } from '../utils/PerlinNoise.js';
// import { SimplexNoise } from '../utils/SimplexNoise.js';
// import { DiamondSquare } from '../utils/DiamondSquare.js';
// import { Voronoi } from '../utils/Voronoi.js';
// import { CellularAutomata } from '../utils/CellularAutomata.js';
class TopoApp {
    constructor() {
        // Get canvas and initialize context
        this.canvas = document.getElementById('topo-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas dimensions
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        // Initialize application state
        this.state = {
            isometric: false,
            maxHeight: 100,
            currentX: -1,
            currentY: -1,
            isDragging: false,
            brushStrength: 10,
            scanActive: false,
            scanPosition: 0,
            ditherActive: false,
            hoverActive: false,
            colorShiftActive: false,
            activeButtons: {},
            ditherMap: []
        };
        
        // Grid properties
        this.cellSize = 40;
        this.rows = Math.floor(this.canvas.height / this.cellSize);
        this.cols = Math.floor(this.canvas.width / this.cellSize);
        
        // Elevation data
        this.elevationData = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
        
        // Initialize renderers
        this.topDownRenderer = new TopDownRenderer(this.canvas, this.ctx);
        this.isometricRenderer = new IsometricRenderer(this.canvas, this.ctx);
        
        // Initialize dither map
        this.ditherMap = new DitherMap(this.cellSize);
        
        // Set up event handlers
        this.setupEventListeners();
        
        // Init application
        this.init();
    }

    init() {
        this.clearCanvas();
        this.ditherMap.generateDitherMap(this.rows, this.cols);
        this.drawGrid();
        this.updateStatus("STATUS: INITIALIZED");
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    setupEventListeners() {
        // Max height slider
        const maxHeightSlider = document.getElementById('max-height');
        if (maxHeightSlider) {
            maxHeightSlider.addEventListener('input', (e) => {
                this.state.maxHeight = parseInt(e.target.value);
                document.getElementById('height-value').textContent = this.state.maxHeight;
                this.drawTopo();
            });
        }
        
        // Toggle view button
        const toggleViewBtn = document.getElementById('toggle-view');
        if (toggleViewBtn) {
            toggleViewBtn.addEventListener('click', () => {
                this.state.isometric = !this.state.isometric;
                this.drawTopo();
            });
        }
        
        // Randomize button
        const randomizeBtn = document.getElementById('randomize');
        if (randomizeBtn) {
            randomizeBtn.addEventListener('click', () => {
                const generator = new RandomTerrainGenerator(this.rows, this.cols, this.state.maxHeight);
                generator.generate();
                this.elevationData = generator.getElevationData();
                this.drawTopo();
            });
        }
        
        // Reset button
        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.elevationData = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
                this.drawTopo();
            });
        }
        
        // Canvas mouse events
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    }
    
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / this.cellSize);
        const y = Math.floor((e.clientY - rect.top) / this.cellSize);
        
        if (x !== this.state.currentX || y !== this.state.currentY) {
            this.state.currentX = x;
            this.state.currentY = y;
            
            // Update coordinates display
            document.getElementById('coordinates').textContent = `X: ${x} Y: ${y}`;
            
            // Update value display
            const elevation = this.isValidCoordinate(x, y) ? this.elevationData[y][x] : 0;
            document.getElementById('value-label').textContent = `ELEVATION: ${Math.floor(elevation)}`;
            
            // Redraw if hover effects are active
            if (this.state.hoverActive) {
                this.drawTopo();
            }
        }
        
        // Handle terrain modification during dragging
        if (this.state.isDragging && this.isValidCoordinate(x, y)) {
            this.modifyTerrainAt(x, y, this.state.brushStrength);
            this.drawTopo();
        }
    }
    
    handleMouseDown(e) {
        this.state.isDragging = true;
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / this.cellSize);
        const y = Math.floor((e.clientY - rect.top) / this.cellSize);
        
        if (this.isValidCoordinate(x, y)) {
            this.modifyTerrainAt(x, y, this.state.brushStrength);
            this.drawTopo();
        }
    }
    
    handleMouseUp() {
        this.state.isDragging = false;
    }
    
    modifyTerrainAt(x, y, amount) {
        if (this.isValidCoordinate(x, y)) {
            this.elevationData[y][x] = Math.max(0, this.elevationData[y][x] + amount);
        }
    }
    
    isValidCoordinate(x, y) {
        return x >= 0 && x < this.cols && y >= 0 && y < this.rows;
    }

    drawGrid() {
        if (this.state.isometric) {
            this.drawIsometricGrid();
        } else {
            this.drawTopDownGrid();
        }
    }

    drawTopDownGrid() {
        for (let x = 0; x <= this.cols; x++) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = 'rgba(198, 255, 0, 0.1)';
            this.ctx.lineWidth = 1;
            this.ctx.moveTo(x * this.cellSize, 0);
            this.ctx.lineTo(x * this.cellSize, this.canvas.height);
            this.ctx.stroke();
        }

        for (let y = 0; y <= this.rows; y++) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = 'rgba(198, 255, 0, 0.1)';
            this.ctx.lineWidth = 1;
            this.ctx.moveTo(0, y * this.cellSize);
            this.ctx.lineTo(this.canvas.width, y * this.cellSize);
            this.ctx.stroke();
        }
    }

    drawIsometricGrid() {
        const offsetX = this.canvas.width / 2;
        const offsetY = this.canvas.height / 4;
        const gridLines = [];

        // Horizontal lines (diagonal in isometric view)
        for (let y = 0; y <= this.rows; y++) {
            const points = [];
            for (let x = 0; x <= this.cols; x++) {
                // Calculate isometric projection
                const isoX = (x - y) * this.cellSize;
                const isoY = (x + y) * this.cellSize / 2;
                points.push({ x: offsetX + isoX, y: offsetY + isoY });
            }
            gridLines.push(points);
        }

        // Vertical lines (diagonal in isometric view)
        for (let x = 0; x <= this.cols; x++) {
            const points = [];
            for (let y = 0; y <= this.rows; y++) {
                // Calculate isometric projection
                const isoX = (x - y) * this.cellSize;
                const isoY = (x + y) * this.cellSize / 2;
                points.push({ x: offsetX + isoX, y: offsetY + isoY });
            }
            gridLines.push(points);
        }

        // Draw the grid lines
        gridLines.forEach(points => {
            this.ctx.beginPath();
            this.ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                this.ctx.lineTo(points[i].x, points[i].y);
            }
            this.ctx.strokeStyle = 'rgba(198, 255, 0, 0.15)';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        });
    }

    updateStatus(message) {
        const statusElement = document.getElementById('status');
        if (statusElement) {
            statusElement.textContent = message;
        }
    }

    drawTopo() {
        this.clearCanvas();

        if (this.state.isometric) {
            this.isometricRenderer.drawTerrain(
                this.elevationData,
                this.state.maxHeight,
                this.cellSize
            );
        } else {
            this.topDownRenderer.drawTerrain(
                this.elevationData,
                this.cellSize,
                this.state.maxHeight
            );
        }

        this.drawGrid();
        
        if (this.state.hoverActive) {
            this.drawHoverEffects(this.state.currentX, this.state.currentY);
        }
    }

    drawHoverEffects(x, y) {
        if (!this.isValidCoordinate(x, y)) return;
        
        const hoverRadius = 2;
        
        for (let j = -hoverRadius; j <= hoverRadius; j++) {
            for (let i = -hoverRadius; i <= hoverRadius; i++) {
                if (i === 0 && j === 0) continue;
                
                const targetX = x + i;
                const targetY = y + j;
                
                if (!this.isValidCoordinate(targetX, targetY)) continue;
                
                const distance = Math.sqrt(i * i + j * j);
                
                if (distance <= hoverRadius) {
                    const intensity = 1 - (distance / hoverRadius);
                    
                    if (this.state.isometric) {
                        this.highlightIsometricCell(targetX, targetY, intensity);
                    } else {
                        this.ctx.fillStyle = `rgba(198, 255, 0, ${intensity * 0.2})`;
                        this.ctx.fillRect(
                            targetX * this.cellSize, 
                            targetY * this.cellSize, 
                            this.cellSize, 
                            this.cellSize
                        );
                    }
                }
            }
        }
    }

    highlightIsometricCell(x, y, intensity) {
        const offsetX = this.canvas.width / 2;
        const offsetY = this.canvas.height / 4;
        const elevation = this.elevationData[y][x];
        const height = (elevation / this.state.maxHeight) * (this.cellSize * 2);
        
        // Calculate isometric coordinates
        const isoX = (x - y) * this.cellSize;
        const isoY = (x + y) * this.cellSize / 2;
        
        // Draw highlight
        this.ctx.strokeStyle = `rgba(198, 255, 0, ${intensity * 0.5})`;
        this.ctx.lineWidth = 2;
        
        this.ctx.beginPath();
        this.ctx.moveTo(offsetX + isoX, offsetY + isoY - height);
        this.ctx.lineTo(offsetX + isoX + this.cellSize, offsetY + isoY + this.cellSize / 2 - height);
        this.ctx.lineTo(offsetX + isoX, offsetY + isoY + this.cellSize - height);
        this.ctx.lineTo(offsetX + isoX - this.cellSize, offsetY + isoY + this.cellSize / 2 - height);
        this.ctx.closePath();
        this.ctx.stroke();
    }
}

export default TopoApp;
class InputController {
    constructor(canvas, state, uiController) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.state = state;
        this.uiController = uiController;
        this.cellSize = state.cellSize || 40; // Get from state or use default

        this.currentX = -1;
        this.currentY = -1;
        this.isDragging = false;
        
        // Add callback handlers
        this.handlers = {
            onCoordsChange: null,
            onTerrainModify: null
        };
        
        // Initialize built-in listeners
        this.initEventListeners();
    }

    // Method to set up external handlers
    setupListeners(handlers) {
        if (handlers) {
            this.handlers = {
                ...this.handlers,
                ...handlers
            };
        }
        
        // For debugging
        console.log("Handlers set up:", !!this.handlers.onCoordsChange, !!this.handlers.onTerrainModify);
    }

    initEventListeners() {
        if (!this.canvas) {
            console.error("Canvas not available for event listeners");
            return;
        }
        
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        document.addEventListener('mouseup', () => this.handleMouseUp());
        this.canvas.addEventListener('wheel', (e) => this.handleWheel(e));
    }

    handleMouseMove(event) {
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

    handleMouseDown(event) {
        this.isDragging = true;
        const rect = this.canvas.getBoundingClientRect();
        const cellSize = this.state.cellSize || this.cellSize;
        const x = Math.floor((event.clientX - rect.left) / cellSize);
        const y = Math.floor((event.clientY - rect.top) / cellSize);
        
        this.modifyTerrainAt(x, y, this.state.brushStrength || 10);
    }

    handleMouseUp() {
        this.isDragging = false;
    }

    handleWheel(event) {
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
    
    modifyTerrainAt(x, y, amount) {
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
    
    isValidCoordinate(x, y) {
        const cellSize = this.state.cellSize || this.cellSize;
        const cols = Math.floor(this.canvas.width / cellSize);
        const rows = Math.floor(this.canvas.height / cellSize);
        return x >= 0 && x < cols && y >= 0 && y < rows;
    }
}

export default InputController;
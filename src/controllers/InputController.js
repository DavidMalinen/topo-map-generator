class InputController {
    constructor(canvas, state, uiController) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.state = state;
        this.uiController = uiController;

        this.currentX = -1;
        this.currentY = -1;
        this.isDragging = false;

        this.initEventListeners();
    }

    initEventListeners() {
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        document.addEventListener('mouseup', () => this.handleMouseUp());
        this.canvas.addEventListener('wheel', (e) => this.handleWheel(e));
    }

    handleMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left) / this.state.cellSize);
        const y = Math.floor((event.clientY - rect.top) / this.state.cellSize);

        if (x !== this.currentX || y !== this.currentY) {
            this.currentX = x;
            this.currentY = y;
            this.uiController.updateCoordinates(x, y);
            if (this.state.hoverActive) {
                this.uiController.drawHoverEffects(x, y);
            }
        }
    }

    handleMouseDown(event) {
        this.isDragging = true;
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left) / this.state.cellSize);
        const y = Math.floor((event.clientY - rect.top) / this.state.cellSize);
        this.uiController.modifyElevation(x, y, this.state.brushStrength);
    }

    handleMouseUp() {
        this.isDragging = false;
    }

    handleWheel(event) {
        event.preventDefault();
        const delta = Math.sign(event.deltaY);
        this.state.maxHeight = Math.max(0, this.state.maxHeight - delta);
        this.uiController.updateHeightValue(this.state.maxHeight);
        this.uiController.drawTopo();
    }
}

export default InputController;
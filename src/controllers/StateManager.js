class StateManager {
    constructor() {
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
            ditherMap: [],
            isoFaceDitherMaps: {}
        };
    }

    updateMaxHeight(value) {
        this.state.maxHeight = value;
    }

    toggleIsometric() {
        this.state.isometric = !this.state.isometric;
    }

    setCurrentPosition(x, y) {
        this.state.currentX = x;
        this.state.currentY = y;
    }

    toggleDragging() {
        this.state.isDragging = !this.state.isDragging;
    }

    toggleScanActive() {
        this.state.scanActive = !this.state.scanActive;
    }

    setDitherActive(active) {
        this.state.ditherActive = active;
    }

    setHoverActive(active) {
        this.state.hoverActive = active;
    }

    setColorShiftActive(active) {
        this.state.colorShiftActive = active;
    }

    toggleButton(buttonId) {
        if (this.state.activeButtons[buttonId]) {
            this.state.activeButtons[buttonId] = false;
        } else {
            this.state.activeButtons[buttonId] = true;
        }
        return this.state.activeButtons[buttonId];
    }

    getState() {
        return this.state;
    }
}

export default StateManager;
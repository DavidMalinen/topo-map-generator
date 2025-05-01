class UIController {
    constructor(statusElement, coordinatesElement, valueElement) {
        this.statusElement = statusElement || document.getElementById('status');
        this.coordinatesElement = coordinatesElement || document.getElementById('coordinates');
        this.valueElement = valueElement || document.getElementById('value-label');
        this.heightValueElement = document.getElementById('height-value');
    }

    updateStatus(message) {
        if (this.statusElement) {
            this.statusElement.textContent = message;
        }
    }

    updateCoordinates(x, y) {
        if (this.coordinatesElement) {
            this.coordinatesElement.textContent = `X: ${x} Y: ${y}`;
        }
    }

    updateElevationValue(value) {
        if (this.valueElement) {
            this.valueElement.textContent = `ELEVATION: ${Math.floor(value)}`;
        }
    }

    updateHeightValue(value) {
        if (this.heightValueElement) {
            this.heightValueElement.textContent = value.toString();
            
            const maxHeightSlider = document.getElementById('max-height');
            if (maxHeightSlider) {
                maxHeightSlider.value = value;
            }
        }
    }
}

export default UIController;
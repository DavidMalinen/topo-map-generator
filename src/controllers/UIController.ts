class UIController {
  private statusElement: HTMLElement | null;
  private coordinatesElement: HTMLElement | null;
  private valueElement: HTMLElement | null;
  private heightValueElement: HTMLElement | null;

  constructor(
    statusElement: HTMLElement | null,
    coordinatesElement: HTMLElement | null,
    valueElement: HTMLElement | null
  ) {
    this.statusElement = statusElement || document.getElementById('status');
    this.coordinatesElement = coordinatesElement || document.getElementById('coordinates');
    this.valueElement = valueElement || document.getElementById('value-label');
    this.heightValueElement = document.getElementById('height-value');
  }

  updateStatus(message: string): void {
    if (this.statusElement) {
      this.statusElement.textContent = message;
    }
  }

  updateCoordinates(x: number, y: number): void {
    if (this.coordinatesElement) {
      this.coordinatesElement.textContent = `X: ${x} Y: ${y}`;
    }
  }

  updateElevationValue(value: number): void {
    if (this.valueElement) {
      this.valueElement.textContent = `ELEVATION: ${Math.floor(value)}`;
    }
  }

  updateHeightValue(value: number): void {
    if (this.heightValueElement) {
      this.heightValueElement.textContent = value.toString();
      
      const maxHeightSlider = document.getElementById('max-height') as HTMLInputElement | null;
      if (maxHeightSlider) {
        maxHeightSlider.value = value.toString();
      }
    }
  }
}

export default UIController;
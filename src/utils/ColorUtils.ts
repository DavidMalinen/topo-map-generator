export class ColorUtils {
  // Main color method with color shift support
  static getColorWithShift(opacity: number, elevation: number, maxHeight: number, colorShiftActive: boolean = false): string {
    if (!colorShiftActive) {
      return `rgba(198, 255, 0, ${opacity})`;
    }

    // Color shift based on elevation
    const normalizedElevation = Math.min(1, elevation / maxHeight);

    if (normalizedElevation < 0.3) {
      // Low areas - blue tones
      return `rgba(0, 200, 255, ${opacity})`;
    } else if (normalizedElevation < 0.7) {
      // Mid areas - acid green
      return `rgba(198, 255, 0, ${opacity})`;
    } else {
      // High areas - red/orange
      return `rgba(255, 51, 51, ${opacity})`;
    }
  }

  // Get opacity for isometric faces based on elevation and face type
  static calculateFaceOpacity(elevation: number, maxHeight: number, intensity: number, faceType: 'top' | 'left' | 'right'): number {
    if (elevation < maxHeight * 0.2) {
      // Low heights - minimal visibility
      switch (faceType) {
      case 'top': return 0.1 + (intensity * 0.1);
      case 'left':
      case 'right': return 0; // No fill, just outline
      }
    } else if (elevation < maxHeight * 0.5) {
      // Middle heights - some visibility
      switch (faceType) {
      case 'top': return 0.3 + (intensity * 0.2);
      case 'left': return 0.1;
      case 'right': return 0.05;
      }
    } else {
      // Tall structures - full presence
      switch (faceType) {
      case 'top': return 0.6 + (intensity * 0.2);
      case 'left': return 0.4;
      case 'right': return 0.3;
      }
    }
  }

  // Face color helpers that use the elevation-based opacity calculation
  static getTopFaceColor(intensity: number, elevation: number = 0, maxHeight: number = 0, colorShiftActive: boolean = false): string {
    const opacity = this.calculateFaceOpacity(elevation, maxHeight, intensity, 'top');
    return this.getColorWithShift(opacity, elevation, maxHeight, colorShiftActive);
  }

  static getRightFaceColor(intensity: number, elevation: number = 0, maxHeight: number = 0, colorShiftActive: boolean = false): string {
    const opacity = this.calculateFaceOpacity(elevation, maxHeight, intensity, 'right');
    return this.getColorWithShift(opacity, elevation, maxHeight, colorShiftActive);
  }

  static getLeftFaceColor(intensity: number, elevation: number = 0, maxHeight: number = 0, colorShiftActive: boolean = false): string {
    const opacity = this.calculateFaceOpacity(elevation, maxHeight, intensity, 'left');
    return this.getColorWithShift(opacity, elevation, maxHeight, colorShiftActive);
  }

  // Methods for front faces with slightly reduced opacity
  static getFrontLeftFaceColor(intensity: number, elevation: number = 0, maxHeight: number = 0, colorShiftActive: boolean = false): string {
    const leftOpacity = this.calculateFaceOpacity(elevation, maxHeight, intensity, 'left');
    return this.getColorWithShift(leftOpacity * 0.8, elevation, maxHeight, colorShiftActive);
  }

  static getFrontRightFaceColor(intensity: number, elevation: number = 0, maxHeight: number = 0, colorShiftActive: boolean = false): string {
    const rightOpacity = this.calculateFaceOpacity(elevation, maxHeight, intensity, 'right');
    return this.getColorWithShift(rightOpacity * 0.7, elevation, maxHeight, colorShiftActive);
  }
}

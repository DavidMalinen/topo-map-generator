export class ColorUtils {
  static getColorWithShift(opacity: number, elevation: number, maxHeight: number): string {
    // const baseColor = 'rgb(198, 255, 0)';
    // const fadeColor = 'rgb(0, 187, 255)';
    
    // Calculate color blend based on elevation
    const blend = Math.min(1, elevation / maxHeight);
    const r = Math.round(198 * (1 - blend) + 0 * blend);
    const g = Math.round(255 * (1 - blend) + 187 * blend);
    const b = Math.round(0 * (1 - blend) + 255 * blend);
    
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  static getTopFaceColor(intensity: number): string {
    return `rgba(198, 255, 0, ${0.1 + intensity * 0.5})`;
  }
  
  static getRightFaceColor(intensity: number): string {
    return `rgba(149, 191, 0, ${0.1 + intensity * 0.4})`;
  }
  
  static getLeftFaceColor(intensity: number): string {
    return `rgba(99, 127, 0, ${0.1 + intensity * 0.3})`;
  }
  
  static generateColorPalette(baseColor: string, numColors: number): string[] {
    const palette: string[] = [];
    const rgbBase = this.hexToRgb(baseColor);
    
    if (!rgbBase) return palette;
    
    for (let i = 0; i < numColors; i++) {
      const factor = i / (numColors - 1);
      const r = Math.round(rgbBase.r + (255 - rgbBase.r) * factor);
      const g = Math.round(rgbBase.g + (255 - rgbBase.g) * factor);
      const b = Math.round(rgbBase.b + (255 - rgbBase.b) * factor);
      
      palette.push(`rgb(${r}, ${g}, ${b})`);
    }
    
    return palette;
  }
  
  static hexToRgb(hex: string): { r: number, g: number, b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
}
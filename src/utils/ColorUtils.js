export class ColorUtils {
    static getColorWithShift(opacity = 1, elevation = 0, maxHeight) {
        if (opacity < 0) opacity = 0;
        if (opacity > 1) opacity = 1;

        const normalizedElevation = Math.min(1, elevation / maxHeight);

        if (normalizedElevation < 0.3) {
            return `rgba(0, 200, 255, ${opacity})`; // Low areas - blue tones
        } else if (normalizedElevation < 0.7) {
            return `rgba(198, 255, 0, ${opacity})`; // Mid areas - acid green
        } else {
            return `rgba(255, 51, 51, ${opacity})`; // High areas - red/orange
        }
    }
}
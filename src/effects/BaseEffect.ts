abstract class BaseEffect {
  /**
   * Initialize the effect
   */
  public abstract initialize(...args: unknown[]): void;

  /**
   * Apply the effect to the canvas
   */
  public abstract apply(...args: unknown[]): void;

  /**
   * Enable or disable the effect
   */
  public abstract toggle(active: boolean): void;

  /**
   * Clean up any resources used by the effect
   */
  public dispose(): void {
    // Default implementation does nothing
    // Override this in derived classes if needed
  }
}

export default BaseEffect;

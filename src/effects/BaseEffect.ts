abstract class BaseEffect {
  public abstract initialize(...args: unknown[]): void;
  public abstract apply(...args: unknown[]): void;
  public abstract toggle(active: boolean): void;
  public abstract dispose(): void;
}

export default BaseEffect;

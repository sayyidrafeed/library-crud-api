export abstract class BaseModel<T> {
  protected data: T;
  private observers: Set<(data: T) => void> = new Set();
  
  constructor(initialData: T) {
    this.data = initialData;
  }
  
  getData(): T {
    return { ...this.data };
  }
  
  protected update(updates: Partial<T>): void {
    this.data = { ...this.data, ...updates };
    this.notify();
  }
  
  subscribe(observer: (data: T) => void): () => void {
    this.observers.add(observer);
    return () => this.observers.delete(observer);
  }
  
  protected notify(): void {
    this.observers.forEach(observer => observer(this.getData()));
  }
  
  abstract toJSON(): object;
}

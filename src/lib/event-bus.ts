// Simple EventEmitter for cross-component communication
type Listener<T extends any[]> = (...args: T) => void;

class EventEmitter<EventMap extends Record<string, any[]>> {
  private listeners: { [K in keyof EventMap]?: Listener<EventMap[K]>[] } = {};

  on<K extends keyof EventMap>(event: K, listener: Listener<EventMap[K]>) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
  }

  off<K extends keyof EventMap>(event: K, listener: Listener<EventMap[K]>) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event]!.filter(l => l !== listener);
  }

  emit<K extends keyof EventMap>(event: K, ...args: EventMap[K]) {
    if (!this.listeners[event]) return;
    this.listeners[event]!.forEach(l => l(...args));
  }
}

export const eventBus = new EventEmitter<{
  toggleTheme: [];
}>();

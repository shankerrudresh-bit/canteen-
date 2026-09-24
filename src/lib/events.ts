type Listener = () => void;

const listeners = new Set<Listener>();

/** Subscribe to store mutations. Returns an unsubscribe function. */
export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function notify(): void {
  listeners.forEach((listener) => listener());
}
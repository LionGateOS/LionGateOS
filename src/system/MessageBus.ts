export type OSMessagePayload = unknown;

export interface OSMessage<T = OSMessagePayload> {
  type: string;
  source?: string;
  target?: string;
  payload?: T;
}

type Handler = (message: OSMessage) => void;

const handlers = new Set<Handler>();

export function subscribe(handler: Handler): () => void {
  handlers.add(handler);
  return () => {
    handlers.delete(handler);
  };
}

export function publish(message: OSMessage): void {
  // In a future phase this can be extended with routing, logging, etc.
  handlers.forEach((handler) => handler(message));
}

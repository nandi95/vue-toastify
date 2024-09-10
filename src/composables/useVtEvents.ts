import type { Coordinates } from './useDraggable';

/**
 * Event name mapping to the payload of the type.
 */
type EventMap = {
    vtDragFinished: { id: string; position: Coordinates };
    vtBeingDragged: { id: string; position: Coordinates };
    vtDragStarted: { id: string; position: Coordinates };
    vtDismissed: { id: string };
    vtStarted: { id: string };
    vtFinished: { id: string };
    vtLoadStop: { id: string };
    vtPromptResponse: { id: string; response: any };
    vtPaused: { id: string };
    vtResumed: { id: string };
};

export type EventName = keyof EventMap;

type Events = {
    on: <T extends EventName>(event: T, callback: (payload: EventMap[T]) => void) => void;
    once: <T extends EventName>(event: T, callback: (payload: EventMap[T]) => void) => void;
    off: <T extends EventName>(event: T, callback?: (payload: EventMap[T]) => void) => void;
    emit: <T extends EventName>(event: T, payload: EventMap[T]) => void;
};

const events: Record<keyof EventMap, CallableFunction[]> = {
    vtDragFinished: [],
    vtBeingDragged: [],
    vtDragStarted: [],
    vtDismissed: [],
    vtStarted: [],
    vtFinished: [],
    vtLoadStop: [],
    vtPromptResponse: [],
    vtPaused: [],
    vtResumed: []
};

export default function useVtEvents(): Events {
    return {
        on(event, callback) {
            if (!events[event]) {
                events[event] = [];
            }

            events[event].push(callback);
        },
        once(event, callback) {
            const onceCallback = (payload: EventMap[typeof event]) => {
                callback(payload);
                this.off(event, onceCallback);
            };

            this.on(event, onceCallback);
        },
        off(event, callback) {
            if (!events[event]) {
                return;
            }

            if (callback) {
                events[event] = events[event].filter(cb => cb !== callback);
            } else {
                events[event] = [];
            }
        },
        emit(event, payload) {
            if (!events[event]) {
                return;
            }

            events[event].forEach(callback => callback(payload));
        }
    };
}

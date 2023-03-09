import { onMounted, onBeforeUnmount, getCurrentInstance, ref, computed, ComputedRef } from 'vue';
import useVtEvents from "./useVtEvents";

export function xPos(event: TouchEvent | MouseEvent): number {
    return 'targetTouches' in event && event.targetTouches.length > 0
        ? event.targetTouches[0].clientX
        : (event as MouseEvent).clientX;
}
export function yPos(event: TouchEvent | MouseEvent): number {
    return 'targetTouches' in event && event.targetTouches.length > 0
        ? event.targetTouches[0].clientY
        : (event as MouseEvent).clientY;
}

export type Coordinates = {
    x: number;
    y: number;
};

type Draggable = {
    hasMoved: ComputedRef<boolean>;
    draggableStyles: ComputedRef<Partial<CSSStyleDeclaration>>;
};

export default function useDraggable(props): Draggable {
    const instance = getCurrentInstance()!;
    const dragStartPos = ref<Coordinates>();
    const dragPos = ref<Coordinates>();
    const isDragged = ref(false);
    const startingClientRect = ref<DOMRect>();
    const events = useVtEvents();

    const element = computed(() => instance.proxy?.$el as HTMLDivElement);
    const hasMoved = computed(() => {
        return !!dragPos.value && dragStartPos.value?.x !== dragPos.value.x;
    });
    const dragXDistance = computed(() => {
        return isDragged.value ? dragPos.value!.x - dragStartPos.value!.x : 0;
    });
    const removalDistance = computed(() => {
        if (!startingClientRect.value) {
            return 15;
        }

        return startingClientRect.value.width * props.status.dragThreshold;
    });
    const draggableStyles = computed<Partial<CSSStyleDeclaration>>(() => {
        if (!isDragged.value || dragStartPos.value!.x === dragPos.value!.x || !hasMoved.value) {
            return {};
        }

        let opacity = 1 - Math.abs(dragXDistance.value / removalDistance.value);
        opacity = isNaN(opacity) ? 1 : opacity;

        return {
            transform: `translateX(${dragXDistance.value}px)`,
            opacity: String(opacity),
            userSelect: 'none'
        };
    });

    const dragStarted = (event: TouchEvent | MouseEvent) => {
        element.value.classList.toggle('vt-will-change');
        isDragged.value = true;
        dragStartPos.value = { x: xPos(event), y: yPos(event) };
        startingClientRect.value = element.value.getBoundingClientRect();
    };
    const beingDragged = (event: TouchEvent | MouseEvent) => {
        // prevent page scroll
        event.preventDefault();
        if (isDragged.value) {
            dragPos.value = { x: xPos(event), y: yPos(event) };
            if (!hasMoved.value) {
                events.emit('vtDragStarted', {
                    id: this.status.id,
                    position: dragStartPos.value!
                });
            } else {
                events.emit('vtBeingDragged', {
                    id: this.status.id,
                    position: dragPos.value
                });
            }
        }
    };
    const dragFinished = () => {
        if (hasMoved.value) {
            events.emit('vtDragFinished', {
                id: this.status.id,
                position: dragPos.value!
            });
            // todo if at least 75% of the notification is out of the window (in case of mobile)
            // eslint-disable-next-line no-unused-vars
            const isAlmostOffRight =
                element.value.getBoundingClientRect().right > window.innerWidth &&
                element.value.getBoundingClientRect().right - window.innerWidth >
                startingClientRect.value.width * 0.75;
            // eslint-disable-next-line no-unused-vars
            const isAlmostOffLeft =
                element.value.getBoundingClientRect().right < startingClientRect.value.width * 0.25;
            if (
                Math.abs(startingClientRect.value.left - element.value.getBoundingClientRect().left) >
                this.removalDistance
            ) {
                this.closeNotification();
            }
            isDragged.value = false;
            // execute after the next event cycle
            setTimeout(() => {
                dragPos.value = undefined;
                dragStartPos.value = undefined;
                startingClientRect.value = undefined;
                element.value.classList.toggle('vt-will-change');
            });
        }
    };

    if (canDrag) {
        onMounted(() => {
            element.value.addEventListener('touchstart', dragStarted);
            element.value.addEventListener('mousedown', dragStarted);
            addEventListener('touchmove', beingDragged);
            addEventListener('mousemove', beingDragged);
            addEventListener('touchend', dragFinished);
            addEventListener('mouseup', dragFinished);
        });
        onBeforeUnmount(() => {
            element.value.removeEventListener('touchstart', dragStarted);
            element.value.removeEventListener('mousedown', dragStarted);
            removeEventListener('touchmove', beingDragged);
            removeEventListener('mousemove', beingDragged);
            removeEventListener('touchend', dragFinished);
            removeEventListener('mouseup', dragFinished);
        });
    }

    return {
        hasMoved,
        draggableStyles
    };
}

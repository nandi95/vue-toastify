<template>
    <div>
        <div v-cloak
             class="vt-backdrop-hidden"
             :class="{
                 'vt-backdrop-visible': toasts.length > 0 && settings.withBackdrop
             }"
             :style="{
                 backgroundColor: settings.backdrop
             }" />
        <VtTransition class="vt-notification-container"
                      :class="positionClasses"
                      :style="flexDirection"
                      :transition="getTransition"
                      :position="settings.position">
            <VtToast v-for="status in toasts"
                     :key="status.id"
                     :status="status"
                     :delayed="!!status.delayed || false"
                     :base-icon-class="settings.baseIconClass"
                     @vt-remove="remove(status.id)" />
        </VtTransition>
    </div>
</template>

<script lang="ts">
export default {
    name:'VueToastify'
};
</script>

<script setup lang="ts">
// todo backdrop to transition with dragging if that's the only one left in the toasts and next isn't queued?
// todo: create 3 containers and create a manager that manages the queue to push to the correct container
//  (each container has 3 positions)
//  (position will be held on the status) this will allow for separated transitions
import VtToast from './VtToast.vue';
import { isBetween, isBoolean, uuidV4 } from '../utils';
import VtTransition from './VtTransition.vue';
import { computed, CSSProperties, nextTick, ref, watch } from 'vue';
import type { ContainerMethods, ToastOptions, Toast } from '../type';
import useVtEvents from '../composables/useVtEvents';
import useSettings from '../composables/useSettings';

const temp = {} as { orderLatest?: boolean };

const toasts = ref<(Toast & { delayed?: boolean })[]>([]);
const queue = ref<(Toast & { delayed?: boolean })[]>([]);
const { settings, updateSettings } = useSettings();
const events = useVtEvents();

/**
 * Return the appropriate transition
 * based on the position.
 */
const getTransition = computed(() => {
    if (settings.transition) {
        return settings.transition;
    }

    const position = settings.position.split('-');

    if (position[1] === 'left') {
        return 'vt-left';
    }

    if (position[1] === 'center') {
        return 'vt-' + position[0];
    }

    return 'vt-right';
});
/**
 * Return a style object for determining
 * the toasts order.
 * todo - simplify this
 */
const flexDirection = computed<CSSProperties>(() => {
    return {
        flexDirection:
            settings.orderLatest &&
            settings.position.split('-')[0] === 'bottom'
                ? 'column'
                : 'column-reverse'
    };
});
/**
 * Return the appropriate classes
 * based on the position.
 */
const positionClasses = computed(() => {
    const position = settings.position.split('-');
    const classes: Record<string, boolean> = {};
    if (position[0] === position[1]) {
        classes['vt-center-center'] = true;
        return classes;
    }
    classes[
        position[0] === 'center' ? 'vt-centerY' : 'vt-' + position[0]
    ] = true;
    classes[
        position[1] === 'center' ? 'vt-centerX' : 'vt-' + position[1]
    ] = true;
    return classes;
});

/**
 * Find the toast with the given id in the toasts
 * and return its index from the array
 */
const findToast = (id: Toast['id']) => {
    return toasts.value.findIndex(toast => {
        return toast.id === id;
    });
};
/**
 * Find the toast with the given id in the queue
 * and return its index from the array
 */
const findQueuedToast = (id: Toast['id']) => {
    return queue.value.findIndex(toast => {
        return toast.id === id;
    });
};
/**
 * Figure out the title from the status object.
 */
const getTitle = (status: ToastOptions) => {
    if (status.title) {
        return status.title;
    }

    if (status.mode === 'prompt' || status.mode === 'loader') {
        return '';
    }

    if (
        (
            isBoolean(status.defaultTitle) && status.defaultTitle
            || isBoolean(settings.defaultTitle) && settings.defaultTitle
        )
        && status.type
    ) {
        return status.type.charAt(0).toUpperCase() + status.type.slice(1);
    }

    return '';
};
/**
 * Check if the toast already is being displayed.
 */
const arrayHasType = (status: ToastOptions) => {
    return !!toasts.value.find(toast =>
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        toast.mode && toast.mode === status.mode || toast.type && toast.type === status.type
    );
};

/**
 * Dismiss the loader for the given ids
 * or all of the loaders. Return
 * the count of the dismissed
 * loaders.
 */
const stopLoader: ContainerMethods['stopLoader'] = (id) => {
    const ids = [];
    if (typeof id === 'string') {
        ids.push(id);
    } else if (Array.isArray(id)) {
        ids.push(...id);
    } else {
        //get all loaders
        ids.push(...toasts.value.filter(toast => toast.mode === 'loader').map(toast => toast.id));
    }
    ids.forEach(id => {
        events.emit('vtLoadStop', { id: id });
        remove(id);
    });
    return ids.length;
};
/**
 * Add a new toast object to the toasts
 * or queue respectively with all
 * the parameters assigned.
 * Return the uuid.
 */
const add: ContainerMethods['add'] = (status) => {
    // copy object
    const toast = Object.assign(
        {},
        status,
        {
            id: uuidV4()
        }
    ) as Toast; //todo update to deep copy
    // if object doesn't have default values, set them
    toast.duration = settings.warningInfoDuration;

    if (Number(status.duration) > 0) {
        toast.duration = Number(status.duration);
    } else if (status.type) {
        toast.duration =
            status.type === 'error'
                ? settings.errorDuration
                : status.type === 'success'
                    ? settings.successDuration
                    : settings.warningInfoDuration;
    }

    toast.answers =
        status.answers && Object.keys(status.answers).length > 0
            ? status.answers
            : { Yes: true, No: false };
    toast.pauseOnHover = isBoolean(status.pauseOnHover)
        ? status.pauseOnHover
        : settings.pauseOnHover;
    toast.pauseOnFocusLoss = isBoolean(status.pauseOnFocusLoss)
        ? status.pauseOnFocusLoss
        : settings.pauseOnFocusLoss;
    toast.hideProgressbar = isBoolean(status.hideProgressbar)
        ? status.hideProgressbar
        : settings.hideProgressbar;
    toast.title = getTitle(status);
    toast.canTimeout = isBoolean(status.canTimeout)
        ? status.canTimeout
        : settings.canTimeout;
    toast.iconEnabled = isBoolean(status.iconEnabled)
        ? status.iconEnabled
        : settings.iconEnabled;
    toast.enableHtmlInterpretation = isBoolean(status.enableHtmlInterpretation)
        ? status.enableHtmlInterpretation
        : settings.enableHtmlInterpretation;

    if (status.mode === 'prompt' || status.mode === 'loader') {
        toast.draggable = false;
    } else {
        toast.draggable = isBoolean(status.draggable)
            ? status.draggable
            : settings.draggable;
    }

    toast.dragThreshold = status.dragThreshold && isBetween(status.dragThreshold, 0, 5)
        ? status.dragThreshold
        : settings.dragThreshold;

    if (status.mode === 'prompt' || status.mode === 'loader') {
        toast.canTimeout = false;
    }

    toast.theme = status.theme ? status.theme : settings.theme;

    if (
        // if singular and there's 1 already showing
        settings.singular && toasts.value.length > 0 ||
        // if oneType turned on and that type already showing
        settings.oneType && arrayHasType(toast) ||
        // if it exceeds the max number of displayed toasts
        toasts.value.length >= settings.maxToasts
    ) {
        if (toast.delay) {
            setTimeout(() => {
                queue.value.push({ ...toast, delayed: true });
            }, toast.delay);
        } else {
            queue.value.push({ ...toast, delayed: true });
        }

        return toast.id;
    }

    if (toast.delay) {
        setTimeout(() => {
            toasts.value.push(toast);
        }, toast.delay);
    } else {
        toasts.value.push(toast);
    }

    return toast.id;
};
/**
 * Find the toast from the toast
 * or the queue, if not found
 * return false, otherwise
 * return all.
 */
const get: ContainerMethods['get'] = (id) => {
    if (id) {
        return toasts.value.find(toast => toast.id === id) ?? queue.value.find(toast => toast.id === id);
    }

    return [
        ...toasts.value,
        ...queue.value
    ] as ReturnType<ContainerMethods['get']>;
};
/**
 * Update toast by merging the
 * argument and the existing status.
 * Returns whether the update was
 * successful or not.
 */
const set: ContainerMethods['set'] = (id, status) => {
    const toast = get(id);

    if (!toast) {
        return false;
    }

    if (findToast(id) !== -1) {
        toasts.value = toasts.value.map(toast => {
            if (toast.id === id) {
                return Object.assign(toast, status);
            }

            return toast;
        });
        return true;
    }

    toasts.value[findQueuedToast(id)] = Object.assign(toast, status);
    return true;
};
/**
 * If id given, removes the corresponding
 * toast else remove all. If id not
 * found returns false, otherwise
 * an array of ids currently
 * visible to the user.
 */
const remove: ContainerMethods['remove'] = (id) => {
    if (id) {
        let index = findQueuedToast(id);

        if (settings.singular && index !== -1) {
            queue.value.splice(index, 1)[0].callback?.();

            return 1;
        }

        index = findToast(id);

        if (index !== -1) {
            toasts.value.splice(index, 1)[0].callback?.();

            return 1;
        }

        return 0;
    }

    const removeCount = toasts.value.length + queue.value.length;

    toasts.value.forEach(toast => toast.callback?.());
    queue.value.forEach(toast => toast.callback?.());

    toasts.value = [];
    queue.value = [];

    return removeCount;
};

watch(() => settings, (newSettings, oldSettings) => {
    // if singular turned off release all queued toasts
    if (!newSettings.singular) {
        for (let i = 0; i < newSettings.maxToasts - 1; i++) {
            if (!queue.value[i]) {
                continue;
            }

            if (!arrayHasType(queue.value[i])) {
                toasts.value.push(queue.value.splice(i, 1)[0]);
            }
        }
        if (isBoolean(temp.orderLatest)) {
            updateSettings({ orderLatest: temp.orderLatest });
            delete temp.orderLatest;
        }
        return;
    }

    temp.orderLatest = oldSettings.orderLatest;
    updateSettings({ orderLatest: false });
});

watch(
    () => toasts.value,
    async newValue => {
    // if there's anything at all in the queue
        if (queue.value.length !== 0) {
            await nextTick();

            // if singular than oneType and maxToasts isn't a concern
            if (settings.singular) {
            // todo - doesn't currently work with
                if (newValue.length === 0) {
                    // fixme - this will re-trigger the watch?
                    toasts.value.push({
                        ...queue.value.shift()!,
                        delayed: true
                    });
                }
                return;
            }

            if (settings.oneType) {
                return queue.value.forEach((status, index) => {
                    if (
                        !arrayHasType(status) &&
                    toasts.value.length < settings.maxToasts
                    ) {
                        toasts.value.push({
                            ...queue.value.splice(index, 1)[0],
                            delayed: true
                        });
                    }
                });
            }

            if (toasts.value.length < settings.maxToasts) {
                toasts.value.push({
                    ...queue.value.shift()!,
                    delayed: true
                });
            }
        }
    },
    { deep: true }
);

defineExpose<ContainerMethods>({ add, get, set, remove, stopLoader });
</script>

<style lang="scss">
@use "../assets/base";
.vt-notification-container {
    pointer-events: none;
    box-sizing: border-box;
    position: fixed;
    display: flex;
    flex-direction: column;
    margin: 10px;
    width: auto;
    height: auto;
    z-index: 9999;
}

.vt-backdrop-hidden {
    transition: all 150ms ease-out;
    opacity: 0;
    visibility: hidden;
    z-index: 50;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: fixed;
}

.vt-backdrop-visible {
    opacity: 1;
    visibility: visible;
}

.vt-top {
    top: 0;
}

.vt-centerY {
    top: 50%;
    transform: translateY(-50%);
}

.vt-bottom {
    bottom: 0;
}

.vt-left {
    left: 0;
}

.vt-centerX {
    left: 50%;
    transform: translateX(-50%);
}

.vt-right {
    right: 0;
}

.vt-center-center {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>

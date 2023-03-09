<template>
    <div>
        <div
            v-cloak
            class="vt-backdrop-hidden"
            :class="{
                'vt-backdrop-visible': toasts.length > 0 && settings.withBackdrop
            }"
            :style="{
                backgroundColor: settings.backdrop
            }" />
        <vt-transition
            class="vt-notification-container"
            :class="positionClasses"
            :style="flexDirection"
            :transition="getTransition"
            :position="settings.position">
            <vt-toast
                v-for="status in toasts"
                :key="status.id"
                :status="status"
                :base-icon-class="settings.baseIconClass" />
        </vt-transition>
    </div>
</template>

<script lang="ts">
// todo backdrop to transition with dragging if that's the only one left in the toasts and next isn't queued?
// todo: create 3 containers and create a manager that manages the queue to push to the correct container
//  (each container having 3 positions)
//  ( position will be held on the status ) this will allow for separated transitions
import { default as VtToast } from './Toast.vue';
import { isBetween, isBoolean, uuidV4 } from '../utils';
import VTTransition from './VTTransition.vue';
import { computed, defineComponent, ref, UnwrapRef } from 'vue';
import { FullToast, MaybeArray, Position, Toast as ToastType, ToastOptions } from "../type";
import useVtEvents from "../composables/useVtEvents";

let temp = {};

export default defineComponent({
    name: 'VueToastify',
    components: {
        VtToast,
        VTTransition
    },

    props: {
        singular: { type: Boolean, default: false },
        withBackdrop: { type: Boolean, default: false },
        backdrop: { type: String, default: 'rgba(0, 0, 0, 0.2)' },
        position: {
            validator: (value: Position) => {
                // The value must match one of these strings
                return (
                    [
                        'top-left',
                        'top-center',
                        'top-right',
                        'center-left',
                        'center-center',
                        'center-right',
                        'bottom-left',
                        'bottom-center',
                        'bottom-right'
                    ].indexOf(value) !== -1
                );
            },

            default: 'bottom-right'
        },

        defaultTitle: { type: Boolean, default: true },
        pauseOnHover: { type: Boolean, default: true },
        canTimeout: { type: Boolean, default: true },
        iconEnabled: { type: Boolean, default: true },
        draggable: { type: Boolean, default: true },
        dragThreshold: {
            type: Number,
            default: 0.75,
            validator: (value: number) => isBetween(value, 0, 5)
        },

        hideProgressbar: { type: Boolean, default: false },
        errorDuration: { type: Number, default: 8000 },
        successDuration: { type: Number, default: 4000 },
        warningInfoDuration: { type: Number, default: 6000 },
        theme: { type: String, default: 'dark' },
        baseIconClass: { type: String, default: '' },
        orderLatest: { type: Boolean, default: true },
        transition: { type: [String, Object], default: () => ({}) },
        oneType: { type: Boolean, default: false },
        maxToasts: { type: Number, default: 6 }
    },

    setup: (_, ctx) => {
        const toasts = ref<ToastType[]>([]);
        const queue = ref<ToastType[]>([]);
        const settings = ref({
            singular: false,
            withBackdrop: false,
            backdrop: 'rgba(0, 0, 0, 0.2)',
            position: 'bottom-right',
            defaultTitle: true,
            canTimeout: true,
            pauseOnHover: false,
            iconEnabled: true,
            draggable: true,
            dragThreshold: 0.75,
            hideProgressbar: false,
            errorDuration: 8000,
            successDuration: 4000,
            warningInfoDuration: 6000,
            theme: 'dark',
            baseIconClass: '',
            orderLatest: true,
            transition: null,
            oneType: false,
            maxToasts: 6
        });
        const events = useVtEvents();

        /**
         * Return the appropriate transition
         * based on the position.
         *
         * @return {String}
         */
        const getTransition = computed(() => {
            if (settings.value.transition) {
                return settings.value.transition;
            }
            const position = settings.value.position.split('-');
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
         *
         * @return {Object}
         */
        const flexDirection = computed<Partial<CSSStyleDeclaration>>(() => {
            return {
                flexDirection:
                    settings.value.orderLatest &&
                    settings.value.position.split('-')[0] === 'bottom'
                        ? 'column'
                        : 'column-reverse'
            };
        });
        /**
         * Return the appropriate classes
         * based on the position.
         *
         * @return {Object}
         */
        const positionClasses = computed(() => {
            const position = settings.value.position.split('-');
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
         * Returns the ids of all the toasts
         * currently visible to the user.
         * @return {String[]}
         */
        const currentlyShowing = computed(() => {
            return toasts.value.map(toast => toast.id);
        });

        /**
         * Find the toast with the given id in the toasts
         * and return its index from the array
         *
         * @return {Number}
         */
        const findToast = (id: ToastType['id']) => {
            return toasts.value.findIndex(toast => {
                return toast.id === id;
            });
        };
        /**
         * Find the toast with the given id in the queue
         * and return its index from the array
         *
         * @return {Number}
         */
        const findQueuedToast = (id: ToastType['id']) => {
            return queue.value.findIndex(toast => {
                return toast.id === id;
            });
        };
        /**
         * Figure out the title from the status object.
         *
         * @param {Object} status
         *
         * @return {String}
         */
        const getTitle = (status: ToastOptions) => {
            if (status.title) {
                return status.title;
            }
            if (isBoolean(status.defaultTitle)) {
                if (status.defaultTitle) {
                    if (status.mode === 'prompt' || status.mode === 'loader') {
                        return '';
                    }
                    if (status.type) {
                        return status.type.charAt(0).toUpperCase() + status.type.slice(1);
                    }
                } else {
                    return '';
                }
            }
            if (settings.value.defaultTitle) {
                if (status.mode === 'prompt' || status.mode === 'loader') {
                    return '';
                }
                if (status.type) {
                    return status.type.charAt(0).toUpperCase() + status.type.slice(1);
                }
            }
            return 'Info';
        };
        /**
         * Check if the toast already is being displayed.
         *
         * @param {Object} status
         *
         * @return {Boolean}
         */
        const arrayHasType = (status: ToastOptions) => {
            return !!toasts.value.find(
                toast =>
                    toast.mode && toast.mode === status.mode ||
                    toast.type && toast.type === status.type
            );
        };

        /**
         * Merges the passed in settings where the key exists
         * in the original. If no argument merge refresh
         * from the original settings.
         *
         * @param {Object} settings
         *
         * @return {Object<*>}
         */
        const setSettings = (settings?: keyof UnwrapRef<typeof settings>) => {
            if (settings) {
                Object.keys(settings.value).forEach(key => {
                    if (settings[key] !== undefined) {
                        this.$set(settings.value, key, settings[key]);
                    }
                });
            } else {
                settings.value = Object.assign({}, this._props);
            }
            return settings.value;
        };
        /**
         * If argument set return the given setting,
         * else return the settings object.
         *
         * @param {String} setting
         *
         * @return {Object|*}
         */
        const getSettings = (setting?: keyof UnwrapRef<typeof settings>) => {
            if (!setting) {
                return settings.value;
            }

            return settings.value[setting] ? settings.value[setting] : settings.value;
        };
        /**
         * Dismiss the loader for the given ids
         * or all of the loaders. Return
         * the count of the dismissed
         * loaders.
         *
         * @param {String|String[]} id
         *
         * @return {Number}
         */
        const stopLoader = (id?: MaybeArray<ToastType['id']>) =>{
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
            });
            return ids.length;
        };
        /**
         * Add a new toast object to the toasts
         * or queue respectively with all
         * the parameters assigned.
         * Return the uuid.
         *
         * @param {Object} status
         *
         * @return {String}
         */
        const add = (status: FullToast) => {
            // copy object
            const toast: Omit<ToastType, 'id'> & { id?: ToastType['id'] } = Object.assign({}, status); //todo update to deep copy
            // if object doesn't have default values, set them
            toast.duration = settings.value.warningInfoDuration;
            if (Number(status.duration) > 0) {
                toast.duration = Number(status.duration);
            } else if (status.type) {
                toast.duration =
                    status.type === 'error'
                        ? settings.value.errorDuration
                        : status.type === 'success'
                            ? settings.value.successDuration
                            : settings.value.warningInfoDuration;
            }
            toast.answers =
                status.answers && Object.keys(status.answers).length > 0
                    ? status.answers
                    : { Yes: true, No: false };
            toast.pauseOnHover = isBoolean(status.pauseOnHover) ? status.pauseOnHover : settings.value.pauseOnHover;
            toast.hideProgressbar = isBoolean(status.hideProgressbar)
                ? status.hideProgressbar
                : settings.value.hideProgressbar;
            toast.id = uuidV4();
            toast.title = getTitle(status);
            toast.canTimeout = isBoolean(status.canTimeout)
                ? status.canTimeout
                : settings.value.canTimeout;
            toast.iconEnabled = isBoolean(status.iconEnabled)
                ? status.iconEnabled
                : settings.value.iconEnabled;
            if (['prompt', 'loader'].indexOf(status.mode) === -1) {
                toast.draggable = isBoolean(status.draggable)
                    ? status.draggable
                    : settings.value.draggable;
            } else {
                toast.draggable = false;
            }
            toast.dragThreshold = isBetween(status.dragThreshold, 0, 5)
                ? status.dragThreshold
                : settings.value.dragThreshold;
            if (status.mode === 'prompt' || status.mode === 'loader') {
                toast.canTimeout = false;
            }

            toast.theme = status.theme ? status.theme : settings.value.theme;
            if (
                // if singular and there's 1 already showing
                settings.value.singular && toasts.value.length > 0 ||
                // if oneType turned on and that type already showing
                settings.value.oneType && arrayHasType(toast) ||
                // if it would exceed the max number of displayed toasts
                toasts.value.length >= settings.value.maxToasts
            ) {
                this.$set(queue.value, queue.value.length, toast);
                return toast.id;
            }
            this.$set(toasts.value, toasts.value.length, toast);
            return toast.id;
        };
        /**
         * Find the toast from the toast
         * or the queue, if not found
         * return false, otherwise
         * return all.
         *
         * @param {String} id
         *
         * @return {Boolean|Object|Object[]}
         */
        const get = (id = null) => {
            if (id) {
                let toast = toasts.value.find(toast => {
                    return toast.id === id;
                });
                if (!toast) {
                    toast = queue.value.find(toast => {
                        return toast.id === id;
                    });
                }
                if (!toast) {
                    return false;
                }
                return toast;
            }
            return toasts.value.concat(queue.value);
        };
        /**
         * Update a toast by merging the
         * argument and the existing status.
         * Returns whether the update was
         * successful or not.
         *
         * @param {String} id
         * @param {Object} status
         *
         * @return {Boolean}
         */
        const set = (id: ToastType['id'], status) => {
            let toast = get(id);
            if (!toast || toast instanceof Array) {
                return false;
            }
            if (findToast(id) !== -1) {
                this.$set(toasts.value, findToast(id), Object.assign(toast, status));
                return true;
            }
            this.$set(toasts.value, findQueuedToast(id), Object.assign(toast, status));
            return true;
        };
        /**
         * If id giver, removes the corresponding
         * toast else remove all. If id not
         * found returns false, otherwise
         * an array of ids currently
         * visible to the user.
         *
         * @param {String} id
         * @return {Boolean|Array}
         */
        const remove = (id = null) => {
            if (id) {
                let index = findQueuedToast(id);
                if (settings.value.singular && index !== -1) {
                    this.$delete(queue.value, index);
                    return currentlyShowing.value;
                }
                index = findToast(id);
                if (index !== -1) {
                    this.$delete(toasts.value, index);
                    return currentlyShowing.value;
                }
                return false;
            }
            toasts.value = [];
            return currentlyShowing.value;
        };
    },

    watch: {
        settings: {
            handler: function(newSettings, oldSettings) {
                if (isBoolean(newSettings.singular)) {
                    // if singular turned off release all queued toasts
                    if (!newSettings.singular) {
                        for (let i = 0; i < settings.value.maxToasts - 1; i++) {
                            if (!queue.value[i]) {
                                continue;
                            }
                            if (!this.arrayHasType(queue.value[i])) {
                                this.$set(
                                    toasts.value,
                                    toasts.value.length,
                                    queue.value.splice(i, 1)[0]
                                );
                            }
                        }
                        if (isBoolean(temp.orderLatest)) {
                            newSettings.orderLatest = temp.orderLatest;
                            delete temp.orderLatest;
                        }
                        return;
                    }
                    temp.orderLatest = oldSettings.orderLatest;
                    newSettings.orderLatest = false;
                }
            },

            deep: true
        },

        toasts: {
            handler: function(newValue) {
                // if there's anything at all in the queue
                if (queue.value.length !== 0) {
                    this.$nextTick(() => {
                        // if singular than oneType and maxToasts isn't a concern
                        if (settings.value.singular) {
                            if (newValue.length === 0) {
                                this.$set(toasts.value, toasts.value.length, {
                                    ...queue.value.shift(),
                                    delayed: true
                                });
                            }
                            return;
                        }
                        if (settings.value.oneType) {
                            return queue.value.forEach((status, index) => {
                                if (
                                    !this.arrayHasType(status) &&
                                    toasts.value.length < settings.value.maxToasts
                                ) {
                                    this.$set(toasts.value, toasts.value.length, {
                                        ...queue.value.splice(index, 1)[0],
                                        delayed: true
                                    });
                                }
                            });
                        }
                        if (toasts.value.length < settings.value.maxToasts) {
                            this.$set(toasts.value, toasts.value.length, {
                                ...queue.value.shift(),
                                delayed: true
                            });
                        }
                    });
                }
            },

            deep: true
        }
    },

    beforeDestroy() {
        this.$root.$off([
            'vtFinished',
            'vtDismissed',
            'vtPromptResponse',
            'vtLoadStop'
        ]);
    }
});
</script>

<style lang="scss">
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
@import "../assets/toast";
</style>

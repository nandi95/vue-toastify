import { RouteLocationRaw } from 'vue-router';
import { uuidV4 } from "./utils";

type AnchorTagAttributes = Pick<HTMLAnchorElement, 'href' | 'download' | 'referrerPolicy' | 'rel' | 'target'>;

type XPosition = 'left' | 'center' | 'right';
type YPosition = 'top' | 'center' | 'bottom';
export type Position = `${XPosition}-${YPosition}`;

export type MaybeArray<T> = T | T[];

export interface Icon {
    tag?: keyof HTMLElementTagNameMap;
    ligature?: string;
    icon?: string;
}

export interface BaseSettings {
    /**
     * Whether the toast disappears after a time.
     *
     * @default true
     */
    canTimeout?: boolean;

    /**
     * Whether the toast can be paused by hovering over the toast.
     *
     * @default true
     */
    pauseOnHover?: boolean;

    /**
     * Whether a default title should be shown if no title is supplied.
     *
     * @default true
     */
    defaultTitle?: boolean;

    /**
     * Whether the progressbar should be shown on the notification or not.
     *
     * @default false
     */
    hideProgressbar?: boolean;

    /**
     * What theme should be displaying. By default, there's `light` and `dark`.
     *
     * @default 'dark'
     */
    theme?: string;

    /**
     * If string supplied this will apply the usual transition classes (eg.: .name-enter-active).
     * If object supplied it expect a `name` and optionally a `moveClass` (this class has to use `!important` for its rules) attribute.
     * The name will be applied as above. The move class applied when the notifications adjust their position.
     */
    transition?: string | { name: string; moveClass?: string };

    /**
     * If set to false, no icon will be shown on the notification.
     *
     * @default true
     */
    iconEnabled?: boolean;

    /**
     * Whether to enable dismissing the notification by dragging or not.
     *
     * @default true
     */
    draggable?: boolean;

    /**
     * A number between 0 - 5 representing how far the notification should be dragged to dismiss.
     *
     * @default 0.75
     */
    dragThreshold?: number;

    /**
     * Whether new notifications should display on top of the stack or not.
     *
     * @default true
     */
    orderLatest?: boolean;
}

export interface Settings extends BaseSettings {
    /**
     * Only display one toast at a time.
     */
    singular?: boolean;

    /**
     * Show a backdrop that blocks the rest of the page.
     */
    withBackdrop?: boolean;

    /**
     * The color of the backdrop.
     *
     * @default rgba(0, 0, 0, 0.2)
     */
    backdrop?: string;

    /**
     * The position of the toast.
     *
     * @default bottom-right
     */
    position?: string;

    /**
     * The duration in milliseconds the error notification should be visible for.
     *
     * @default 8000
     */
    errorDuration?: number;

    /**
     * The duration in milliseconds the success notification should be visible for.
     *
     * @default 4000
     */
    successDuration?: number;

    /**
     * The duration in milliseconds the warning and info notification should be visible for.
     *
     * @default 6000
     */
    warningInfoDuration?: number;

    /**
     * If string is set, this will be appended to every user supplied icon's class.
     */
    baseIconClass?: string;

    /**
     * Defines how many toasts should be visible at a time. Others are queued.
     *
     * @default 6
     */
    maxToasts?: number;

    /**
     * If turned on, only toasts with unique mode/type will be show. Others are queued.
     *
     * @default false
     */
    oneType?: boolean;

    customNotifications?: Record<string, any>;
}

export interface ToastOptions extends BaseSettings {
    /**
     * The time the notification is displayed for in milliseconds regardless of its type. (this cannot be updated later)
     */
    duration?: number;

    /**
     * String to display or alternatively a html string.
     */
    body: string;

    /**
     * Title to display for the toast.
     */
    title?: string;

    /**
     * todo - update this description
     * Defines what notification type should be showing available types: "success", "warning", "info", "error" defaults to "success".
     * This can only be set if you're using `this.$vtNotify()`
     * Alternatively you may use the methods: `this.$vToastify.warning("more readable")`
     *
     * @default 'success'
     */
    type?: 'info' | 'warning' | 'error' | 'success';

    /**
     * If set the notification will be shown in the given mode: loader, prompt.
     * Alternatively you may use the methods: `this.$vToastify.loader("more readable")`
     */
    mode?: 'loader' | 'prompt';

    /**
     * If the type is prompt the object keys will display to the user and the value will be returned to the promise.
     *
     * @default {{ Yes: true, No: false }}
     */
    answers?: Record<string, any>;

    /**
     * If set, clicking on the notification will take the user to the given location.
     * If it's a string and used with router and route not found this will be ignored.
     * If giving an object then you can either define attributes of the anchor tag like: { href: "https//google.com", target="_blank" } or pass the object you would pass to the router.push() function.
     */
    url?: string | RouteLocationRaw | AnchorTagAttributes;

    /**
     * This will be displayed instead of the default icons. If is a string the string will be assigned to the class unless it is an svg.
     */
    icon?: string | Icon;

    /**
     * This function will be called when the notification has been dismissed or the timeout has finished.
     */
    callback?: CallableFunction;

    /**
     * Delay the notification by the given number of milliseconds.
     */
    delay?: number;
}

export type Status = string | ToastOptions;

export interface Toast extends ToastOptions {
    /**
     * v4 uuid.
     */
    id: ReturnType<typeof uuidV4>;
}

export interface CustomMethods {
}

export type ContainerMethods = {
    add: (status: ToastOptions) => Toast;
    /**
     * Remove a toast by id.
     * @param id
     */
    remove: (id?: Toast['id']) => number;
    get: <T extends Toast['id']>(id?: T) => T extends undefined ? Toast[] : Toast | undefined;
    set: (id: string, toast: ToastOptions) => boolean;
    stopLoader: (id?: Toast['id']) => number;
};

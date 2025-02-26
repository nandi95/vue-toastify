export type XPosition = 'left' | 'center' | 'right';
export type YPosition = 'top' | 'center' | 'bottom';
export type Position = `${YPosition}-${XPosition}`;

export type MaybeArray<T> = T | T[];

export interface Icon {
    /**
     * The html element name to use.
     */
    tag?: keyof HTMLElementTagNameMap;
    /**
     * The html to use.
     */
    ligature?: string;
    icon?: string;
}

/**
 * Settings that can be applied to both toasts and global settings.
 */
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
     * The theme that should be displaying.
     * By default, there's `light` and `dark` theme.
     *
     * @default 'dark'
     */
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    theme?: 'light' | 'dark' | string;

    /**
     * If string supplied this will apply the usual transition classes (eg.: .name-enter-active).
     * If an object is supplied, it expects a `name` and optionally a `moveClass`
     *   (this class has to use `!important` for its rules) attribute.
     * The name will be applied as above. The move class is applied when the notifications adjust their position.
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
     * A number between 0-5 representing how far the notification should be dragged to dismiss.
     *
     * @default 0.75
     */
    // todo - 5 is probably an option for too high value
    dragThreshold?: number;

    /**
     * Whether the toast should pause when the window loses focus.
     *
     * @default true
     */
    pauseOnFocusLoss?: boolean;
}

export interface Settings extends BaseSettings {
    /**
     * Only display one toast at a time.
     */
    singular?: boolean;

    /**
     * Whether new notifications should display on top of the stack or not.
     *
     * @default true
     */
    orderLatest?: boolean;

    /**
     * Show a backdrop that blocks the rest of the page.
     *
     * @default false
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
    position?: Position;

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
     * If string is set, this will be appended to every user-supplied icon's class.
     */
    baseIconClass?: string;

    /**
     * Defines how many toasts should be visible at a time. Others are queued.
     *
     * @default 6
     */
    maxToasts?: number;

    /**
     * If turned on, only toasts with unique mode/type will be shown.
     * Others are queued.
     *
     * @default false
     */
    oneType?: boolean;

    customNotifications?: Record<string, ToastOptions>;
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
     * Defines what notification type should be showing available types:
     * "success", "warning", "info", "error".
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
     * This will be displayed instead of the default icons.
     * If is a string the string will be assigned to the class unless it is a svg.
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

export type RequireSome<T, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>;

export interface Toast extends RequireSome<ToastOptions, Exclude<keyof BaseSettings, 'customNotifications'>> {
    /**
     * v4 uuid.
     */
    id: string;
}

export type ContainerMethods = {
    /**
     * Add new toast.
     * @param status
     */
    add: (status: ToastOptions) => Toast['id'];
    /**
     * Remove toast by id or all toasts (queued included) if no id given.
     * @param id
     */
    remove: (id?: Toast['id']) => number;
    /**
     * Get toast by id or all toasts (queued included) if no id given.
     * @param id
     */
    get: <T extends Toast['id']>(id?: T) => T extends undefined ? Toast[] : Toast | undefined;
    /**
     * Update toast by id.
     * @param id
     * @param toast
     */
    set: (id: string, toast: ToastOptions) => boolean;
    /**
     * Stop the loader toast by id or all loaders if no id given.
     * @param id
     */
    stopLoader: (id?: MaybeArray<Toast['id']>) => number;
};

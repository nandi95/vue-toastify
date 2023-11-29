import Vue, { CreateElement, VNode } from 'vue';

declare module 'vue-toastify' {
  export interface VueToastifyOptions {
    /**
     * Only allow one notification on the screen at a time, others will be queued up for showing later.
     */
    singular?: boolean;
    /**
     * 	Enables backdrop to be shown.
     */
    withBackdrop?: boolean;
    /**
     * The rgba value for the backdrop.
     */
    backdrop?: string;
    /**
     * Defines where the notifications should be showing on the screen.
     * @default 'bottom-right'
     */
    position?: ToastPosition;
    /**
     * The duration in milliseconds the error notification should be visible for.
     * @default 8000
     */
    errorDuration?: number;
    /**
     * The duration in milliseconds the success notification should be visible for.
     * @default 4000
     */
    successDuration?: number;
    /**
     * 	The duration in milliseconds the warning and info notification should be visible for.
     * @default 6000
     */
    warningInfoDuration?: number;
    /**
     * Whether the notifications disappears after the set time.
     */
    canTimeout?: boolean;
    /**
     * Whether the notifications can be paused by hovering over them.
     */
    canPause?: boolean;
    /**
     * Whether the progressbar should be shown on the notification or not.
     */
    hideProgressBar?: boolean;
    /**
     * Whether a default title should be shown if no title is supplied.
     */
    defaultTitle?: boolean;
    /**
     * 	What theme should be displaying. By default there's light and dark.
     */
    theme?: 'light' | 'dark';
    /**
     * 	Whether new notifications should display on top of the stack or not.
     */
    orderLatest?: boolean;
    /**
     * If a string is supplied this will apply the usual transition classes (eg.: .name-enter-active),
     *
     * if an object is supplied it expects a name and optionally a moveClass
     * (this class has to use !important for its rules) attribute.
     * The name will be applied as above. The move class applied when the notifications adjust their position.
     */
    transition?: string | { name: string; moveClass?: string };
    /**
     * If set to false, no icon will be shown on the notification.
     */
    iconEnabled?: boolean;
    /**
     * 	Whether to enable dismissing the notification by dragging or not.
     */
    draggable?: boolean;
    /**
     * 	A number between 0 - 5 representing how far the notification should be dragged to dismiss.
     */
    dragThreshold?: number;
    /**
     * 	If string is set, this will be appended to every user supplied icon's class.
     */
    baseIconClass?: string | null;
    /**
     * Defines how many toasts should be visible at a time. Others are queued.
     * @default 6
     */
    maxToasts?: number;
    /**
     * 	If turned on, only toasts with unique mode/type will be show. Others are queued.
     */
    oneType?: boolean;
  }
  export type ToastPosition =
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'center-left'
    | 'center-center'
    | 'center-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
  export type ToastType = 'success' | 'warning' | 'info' | 'error';

  export type ToastMode = 'loader' | 'mode';

  export type ToastBody = string | VNode | ((h: CreateElement) => VNode);

  interface BaseToastOptions {
    /**
     * Required parameter, you may pass html to this
     */
    body: ToastBody;
    /**
     * Enables pausing of the laoder and the timeout on hover
     */
    title?: string;
    /**
     * Defines what notification type should be showing. defaults to `"success"`. This can only be set if you're using `this.$vtNotify()` Alternatively you may use the methods: this.$vToastify.warning("more readable")
     */
    type?: ToastType;
    /**
     * The time the notification is displayed for in milliseconds regardless of its type. (this cannot be updated later)
     */
    duration?: number;
  }
  export interface ToastOptions extends BaseToastOptions {
    /**
     * If set the notification will be shown in the given mode: `loader`, `prompt`. Alternatively you may use the methods: `this.$vToastify.loader("more readable")`
     */
    mode?: 'loader';
    /**
     * If set, clicking on the notification will take the user to the given location. If its a string and used with router and route not found this will be ignored. If giving an object then you can either define attributes of the anchor tag like: `{ href: "https//google.com", target="_blank" }` or pass the object you would pass to the `router.push()` function.
     */
    url?: import('vue-router').RawLocation | { href: string };
    /**
     * If set, this will be displayed instead of the default icons. If is a string the string will be assigned to the class unless it is an svg.
     */
    icon?: string | { tag: string; ligature: string; icon: string };
    /**
     * This function will be called when the notification has been dismissed or the timeout has finished.
     */
    callback?: () => void;
  }

  export type Toast = { id: number } & Required<BaseToastOptions> &
    Omit<ToastOptions, keyof BaseToastOptions>;

  export type FullToastOptions = ToastOptions &
    Pick<
      VueToastifyOptions,
      | 'canTimeout'
      | 'canPause'
      | 'defaultTitle'
      | 'theme'
      | 'hideProgressBar'
      | 'transition'
      | 'iconEnabled'
      | 'draggable'
      | 'dragThreshold'
      | 'orderLatest'
    >;

  export type TypedToastOptions = Omit<FullToastOptions, 'type' | 'mode'>;

  export interface PromptOptions<Response = boolean> extends TypedToastOptions {
    mode: 'prompt';
    /**
     * If the type is prompt the object keys will display to the user and the value will be returned in the promise.
     * (Note: to include special characters like space, `-`, `_`, etc use quotation marks: `"my key"`:
     * @default {Yes: true, No: false}
     */
    answers?: Record<string, Response>;
  }

  export type ToastifyEvents =
    | 'vtFinished'
    | 'vtDismissed'
    | 'vtStarted'
    | 'vtPaused'
    | 'vtResumed'
    | 'vtDragStarted'
    | 'vtBeingDragged'
    | 'vtDragFinished';

  type ListenerPayload<Ev extends ToastifyEvents> = Ev extends
    | 'vtDragStarted'
    | 'vtBeingDragged'
    | 'vtDragFinished'
    ? { id: number; position: { x: number; y: number } }
    : { id: number };

  export interface VueToastify {
    getSettings<Key extends keyof VueToastifyOptions>(
      key: Key,
    ): VueToastifyOptions[Key];
    getSettings(): VueToastifyOptions;
    setSettings(settings: Partial<VueToastifyOptions>): void;
    listen<Ev extends ToastifyEvents>(
      event: Ev,
      callback: (payload: ListenerPayload<Ev>) => void,
    ): void;
    listenOnce<Ev extends ToastifyEvents>(
      event: ToastifyEvents,
      callback: (payload: ListenerPayload<Ev>) => void,
    ): void;
    success(options: TypedToastOptions | ToastBody, title?: string): number;
    info(options: TypedToastOptions | ToastBody, title?: string): number;
    warning(options: TypedToastOptions | ToastBody, title?: string): number;
    error(options: TypedToastOptions | ToastBody, title?: string): number;
    loader(options: TypedToastOptions | ToastBody, title?: string): number;
    /**
     * A loader cannot be dismissed, you'll have to manually stop the loader yourself.
     *
     * This will stops the loader with the given id or loaders if array of ids given.
     * If no id provided, all loaders will be closed. It will return the count of the loaders stopped.
     * @param id The id of the notification to dismiss
     */
    stopLoader(id: number | number[]): void;
    prompt<Response = boolean>(
      options: Omit<PromptOptions<Response>, 'mode'> | ToastBody,
      title?: string,
    ): Promise<Response>;
    /**
     * This if found returns the notification object from the visible ones or queued toasts otherwise all of the notification objects in an array from both the visible and queued toasts. If not found returns false.
     * @param id
     */
    getToast(id: number): Toast | false;
    /**
     * This will remove the notification if the `id` is given otherwise it will remove all of the notifications.
     *
     * If `id` is supplied and not found between the queued or currently displaying notifications, it will return false,
     * otherwise it returns the ids of the currently visible notifications.
     * @param id
     */
    removeToast(id?: number): false | number[];
    /**
     * For updating the notification object during run-time
     *
     * This will merge the object you pass in and the existing notification. It will return true if successfully updated and false if the notification isn't found.
     * @param id
     * @param options
     */
    changeToast(id: number, options?: Partial<ToastOptions>): boolean;
  }

  export type VTNotify = (
    options: ToastOptions | string,
    title?: string,
  ) => number;

  declare const VueToastify: VueToastify;
  export default VueToastify;
}

declare module 'vue/types/vue.js' {
  import { VueToastify, VTNotify } from 'vue-toastify';
  export interface Vue {
    $vToastify: VueToastify;
    $vtNotify: VTNotify;
  }
  export interface VueConstructor {
    $vToastify: VueToastify;
    $vtNotify: VTNotify;
  }
}

export {};

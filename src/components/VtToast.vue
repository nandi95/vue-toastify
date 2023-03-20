<template>
    <component :is="tag"
               v-bind="urlTarget"
               class="vt-notification"
               :style="draggableStyles"
               :class="notificationClass"
               draggable="false"
               @click="dismiss"
               @mouseenter="isHovered = true"
               @mouseleave="isHovered = false"
               @touchstart="isHovered = true"
               @touchend="isHovered = false">
        <ProgressBar v-if="isNotification && status.canTimeout"
                     :id="status.id"
                     :ref="'progress-' + status.id"
                     :can-pause="status.pauseOnHover"
                     :duration="status.duration"
                     :is-hovered="isHovered"
                     :hide-progressbar="status.hideProgressbar"
                     @vt-finished="closeNotification" />
        <div class="vt-content">
            <h2 v-if="status.title" class="vt-title" v-text="status.title" />
            <p class="vt-paragraph" v-html="status.body" />
        </div>
        <VtIcon v-if="status.iconEnabled"
                :mode="status.mode"
                :type="status.type"
                :icon="status.icon"
                :base-icon-class="baseIconClass" />
        <div v-if="status.mode === 'prompt'" class="vt-buttons">
            <button v-for="(value, answerProperty, index) in status.answers"
                    :key="index"
                    @click="respond(value)"
                    v-text="answerProperty" />
        </div>
    </component>
</template>

<script lang="ts">
import ProgressBar from './ProgressBar.vue';
import VtIcon from './VtIcon.vue';
import useDraggable from '../composables/useDraggable';
import { computed, defineComponent, onMounted, PropType, ref } from 'vue';
import { isObject, isString } from '../utils';
import { Toast } from '../type';
import useVtEvents from '../composables/useVtEvents';

export default defineComponent({
    name: 'VtToast',

    components: { ProgressBar, VtIcon },

    props: {
        status: {
            type: Object as PropType<Toast>,
            required: true
        },

        baseIconClass: {
            type: String,
            default: ''
        }
    },

    setup: (props) => {
        const isHovered = ref(false);
        const events = useVtEvents();

        const notificationClass = computed(() => {
            const obj: Record<string, boolean> = {};
            if (hasUrl.value) {
                obj['vt-cursor-pointer'] = true;
            } else if (props.status.mode === 'loader') {
                obj['vt-cursor-wait'] = true;
            }
            obj['vt-theme-' + props.status.theme!] = true;
            return obj;
        });
        const isNotification = computed(() => ['prompt', 'loader'].indexOf(props.status.mode) === -1);
        const tag = computed(() => {
            if (!hasUrl.value) {
                return 'div';
            }
            return 'a';
        });
        const hasUrl = computed(() => {
            return (
                isString(props.status.url) && props.status.url.length > 0 ||
                isObject(props.status.url) &&
                (routerRouteExits.value || !!props.status.url.href)
            );
        });
        const urlTarget = computed(() => {
            if (props.status.url) {
                if (isString(props.status.url)) {
                    if (!routerRouteExits.value) {
                        return { href: props.status.url };
                    }
                    return {
                        href: this.$vtRouter.resolve(props.status.url).href
                    };
                }
                if (isObject(props.status.url)) {
                    if (!isRouterLinkObject.value && props.status.url.href) {
                        return props.status.url;
                    }

                    if (routerRouteExits.value) {
                        return {
                            href: this.$vtRouter.resolve(props.status.url).href
                        };
                    }
                    return {};
                }
            }
            return {};
        });
        const isRouterLinkObject = computed(() => {
            return !!props.status.url.path || !!props.status.url.name;
        });
        const routerRouteExits = computed(() => {
            if (this.$vtRouter) {
                return !!this.$vtRouter.options.routes.find(
                    route =>
                        route.path === '/' + props.status.url.path ||
                        route.path === props.status.url.path ||
                        route.name === props.status.url.name
                );
            }
            return false;
        });

        const closeNotification = () => {
            const progress = Math.ceil(
                this.$refs['progress-' + props.status.id]
                    ? this.$refs['progress-' + props.status.id].progress
                    : undefined
            );

            // if notification manually dismissed before the timeout or in case if it cannot timeout AND isn't prompt or loader
            if ((isNaN(progress) || progress < 100) && isNotification.value) {
                events.emit('vtDismissed', { id: props.status.id });
                props.status.callback ? props.status.callback() : null;
            }
            // if the notification has finished displaying
            if (progress >= 100 && isNotification.value) {
                events.emit('vtFinished', { id: props.status.id });
                props.status.callback ? props.status.callback() : null;
            }
        };
        const { hasMoved, draggableStyles } = useDraggable(props, closeNotification);
        const dismiss = (event: Event) => {
            if (isNotification.value && !hasMoved.value) {
                closeNotification();
            }
            handleRedirect(event);
        };
        const respond = (response: any) => {
            closeNotification();
            events.emit('vtPromptResponse', {
                id: props.status.id,
                response: response
            });
        };
        const handleRedirect = (event: Event) => {
            if (hasUrl.value) {
                // if it's a browser level link
                if (
                    isObject(props.status.url) && props.status.url.href ||
                    isString(props.status.url) && !routerRouteExits.value
                ) {
                    return;
                }
                event.preventDefault();
                if (this.$vtRouter) {
                    this.$vtRouter.push(props.status.url);
                }
            }
        };

        onMounted(() => {
            if (props.status.mode === 'loader') {
                events.once('vtLoadStop', payload => {
                    if (payload.id === props.status.id) {
                        closeNotification();
                    }
                });
            }
        });

        return {
            isHovered,
            notificationClass,
            tag,
            hasUrl,
            urlTarget,
            isNotification,
            closeNotification,
            respond,
            dismiss,
            draggableStyles
        };
    }
});
</script>

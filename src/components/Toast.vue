<template>
    <component :is="tag"
               v-bind="urlTarget"
               class="vt-notification"
               :style="draggableStyles"
               :class="notificationClass"
               draggable="false"
               @mouseenter="isHovered = true"
               @mouseleave="isHovered = false"
               @touchstart="isHovered = true"
               @touchend="isHovered = false">
        <ProgressBar v-if="isNotification && status.canTimeout"
                     :id="status.id"
                     :ref="'progress-' + status.id"
                     :can-pause="status.canPause"
                     :duration="status.duration"
                     :is-hovered="isHovered"
                     :hide-progressbar="status.hideProgressbar"
                     @vt-finished="closeNotification" />
        <div class="vt-content">
            <h2 v-if="status.title" class="vt-title" v-text="status.title" />
            <p class="vt-paragraph" v-html="status.body" />
        </div>
        <Icon v-if="status.iconEnabled"
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
import Icon from './Icon.vue';
import draggable from './draggable.ts';
import { computed, defineComponent, onBeforeUnmount, onMounted, PropType, ref } from 'vue';
import { isObject, isString } from '../utils';
import { Toast } from '../type';

export default defineComponent({
    name: 'Toast',

    components: { ProgressBar, Icon },

    mixins: [draggable],

    props: {
        status: {
            type: Object as PropType<Toast & { id: string }>,
            required: true
        },

        baseIconClass: {
            type: String,
            default: ''
        }
    },

    setup: (props) => {
        const isHovered = ref(false);
        const dragStartPos = ref<{ x: number; y: number }>();
        const dragPos = ref<{ x: number; y: number }>();
        const isDragged = ref(false);
        const boundingClientRect = ref<DOMRect>();

        const notificationClass = computed(() => {
            const obj = {};
            if (hasUrl.value) {
                obj['vt-cursor-pointer'] = true;
            } else if (props.status.mode === 'loader') {
                obj['vt-cursor-wait'] = true;
            }
            obj['vt-theme-' + props.status.theme] = true;
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
        const hasMoved = computed(() => {
            return dragPos.value && dragStartPos.value?.x !== dragPos.value.x;
        });
        const dragXDistance = computed(() => {
            return isDragged.value ? dragPos.value.x - dragStartPos.value.x : 0;
        });
        const removalDistance = computed(() => {
            return boundingClientRect.value.width * props.status.dragThreshold;
        });
        const draggableStyles = computed(() => {
            if (dragStartPos.value.x === dragPos.value.x || !this.hasMoved) {
                return {};
            }

            let opacity = 1 - Math.abs(dragXDistance.value / removalDistance.value);
            opacity = isNaN(opacity) ? 1 : opacity;

            return {
                transform: 'translateX(' + dragXDistance.value + 'px)',
                opacity: opacity,
                'user-select': 'none'
            };
        });

        const closeNotification = () => {
            const progress = Math.ceil(
                this.$refs['progress-' + props.status.id]
                    ? this.$refs['progress-' + props.status.id].progress
                    : undefined
            );

            // if notification manually dismissed before the timeout or in case if it cannot timeout AND isn't prompt or loader
            if ((isNaN(progress) || progress < 100) && this.isNotification) {
                this.$root.$emit('vtDismissed', { id: props.status.id });
                props.status.callback ? props.status.callback() : null;
            }
            // if the notification has finished displaying
            if (progress >= 100 && this.isNotification) {
                this.$root.$emit('vtFinished', { id: props.status.id });
                props.status.callback ? props.status.callback() : null;
            }
        };
        const dismiss = (event: Event) => {
            if (isNotification.value && !hasMoved.value) {
                closeNotification();
            }
            handleRedirect(event);
        };
        const respond = (response) => {
            closeNotification();
            this.$root.$emit('vtPromptResponse', {
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
            this.$el.addEventListener('click', dismiss);
            if (props.status.mode === 'loader') {
                this.$root.$once('vtLoadStop', payload => {
                    //if all loaders should stop or only this
                    if (payload.id) {
                        if (payload.id === props.status.id) {
                            this.closeNotification();
                        }
                    } else {
                        this.closeNotification();
                    }
                });
            }
        });
        onBeforeUnmount(() => {
            this.$el.removeEventListener('click', this.dismiss);
        });

        return {
            isHovered,
            notificationClass,
            tag,
            hasUrl,
            urlTarget,
            isNotification,
            closeNotification,
            respond
        };
    }
});
</script>

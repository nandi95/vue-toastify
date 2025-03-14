<template>
    <div class="vt-notification"
         :role="status.type === 'error' || status.type === 'warning' ? 'alert' : 'status'"
         :style="draggableStyles"
         :class="notificationClass"
         draggable="false"
         :aria-label="status.title || `${status.type || 'info'} notification`"
         :data-delayed="delayed"
         @click="dismiss"
         @mouseenter="isHovered = true"
         @mouseleave="isHovered = false"
         @touchstart="isHovered = true"
         @touchend="isHovered = false">
        <ProgressBar v-if="isNotification && status.canTimeout"
                     v-show="!status.hideProgressbar"
                     :id="status.id"
                     ref="progressBar"
                     :duration="status.duration"
                     :is-paused="status.pauseOnHover && isHovered || !hasFocus || isDragged"
                     @vt-finished="finish" />
        <div class="vt-content">
            <h2 v-if="status.title" class="vt-title" v-text="status.title" />
            <template v-if="status.body">
                <div v-if="isJSXBody" class="vt-paragraph">
                    <Node :node="status.body" />
                </div>
                <p v-else-if="status.enableHtmlInterpretation" class="vt-paragraph" v-html="status.body" />
                <p v-else class="vt-paragraph">
                    {{ status.body }}
                </p>
            </template>
        </div>
        <VtIcon v-if="status.iconEnabled"
                :mode="status.mode"
                :type="status.type"
                :icon="status.icon"
                :base-icon-class="baseIconClass"
                :enable-html="status.enableHtmlInterpretation" />
        <div v-if="status.mode === 'prompt'" class="vt-buttons">
            <button v-for="(answer, i) in answers"
                    :key="i"
                    @click="respond(status.answers![answer])"
                    v-text="answer" />
        </div>
    </div>
</template>

<script lang="ts">
import ProgressBar from './ProgressBar.vue';
import VtIcon from './VtIcon.vue';
import useDraggable from '../composables/useDraggable';
import { computed, defineComponent, isVNode, onMounted, onUnmounted, ref } from 'vue';
import type { PropType } from 'vue';
import type { Toast } from '../type';
import useVtEvents from '../composables/useVtEvents';
import Node from './Node';
export default defineComponent({
    name: 'VtToast',

    components: { ProgressBar, VtIcon, Node },

    props: {
        status: {
            type: Object as PropType<Toast>,
            required: true
        },

        baseIconClass: {
            type: String,
            default: ''
        },

        delayed: {
            type: Boolean,
            default: false
        }
    },

    emits: ['vtRemove'],

    setup: (props, ctx) => {
        const isHovered = ref(false);
        const hasFocus = ref(true);
        const events = useVtEvents();
        const progressBar = ref<{ progress: number }>();

        const notificationClass = computed(() => {
            const obj: Record<string, boolean> = {};

            if (props.status.mode === 'loader') {
                obj['vt-cursor-wait'] = true;
            }

            obj['vt-theme-' + props.status.theme] = true;

            return obj;
        });
        const isNotification = computed(() => ['prompt', 'loader'].indexOf(props.status.mode!) === -1);
        const isJSXBody = computed(() => isVNode(props.status.body));

        const answers = computed(() => {
            return props.status.answers ? Object.keys(props.status.answers) : [];
        });

        const dismiss = () => {
            if (isNotification.value && !hasMoved.value) {
                events.emit('vtDismissed', { id: props.status.id });
                ctx.emit('vtRemove');
            }
        };
        const dismissedByDrag = () => {
            if (isNotification.value && hasMoved.value) {
                events.emit('vtDismissed', { id: props.status.id });
                ctx.emit('vtRemove');
            }
        };
        const respond = (response: any) => {
            events.emit('vtPromptResponse', {
                id: props.status.id,
                response: response
            });
            ctx.emit('vtRemove');
        };
        const finish = () => {
            const progress = Math.ceil(progressBar.value?.progress ?? NaN);

            // if the notification has finished displaying
            if (progress >= 100 && isNotification.value) {
                events.emit('vtFinished', { id: props.status.id });
                ctx.emit('vtRemove');
            }
        };

        const { hasMoved, draggableStyles, isDragged } = useDraggable(props, dismissedByDrag);

        const onBlur = () => hasFocus.value = false;
        const onFocus = () => hasFocus.value = true;

        onMounted(() => {
            if (props.status.pauseOnFocusLoss) {
                addEventListener('blur', onBlur);
                addEventListener('focus', onFocus);
            }
        });

        onUnmounted(() => {
            if (props.status.pauseOnFocusLoss) {
                removeEventListener('blur', onBlur);
                removeEventListener('focus', onFocus);
            }
        });

        return {
            isHovered,
            notificationClass,
            isNotification,
            isJSXBody,
            respond,
            dismiss,
            draggableStyles,
            progressBar,
            answers,
            finish,
            isDragged,
            hasFocus
        };
    }
});
</script>

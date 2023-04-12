<template>
    <div class="vt-notification"
         :style="draggableStyles"
         :class="notificationClass"
         draggable="false"
         :data-delay="!!status.delay"
         @click="dismiss"
         @mouseenter="isHovered = true"
         @mouseleave="isHovered = false"
         @touchstart="isHovered = true"
         @touchend="isHovered = false">
        <ProgressBar v-if="isNotification && status.canTimeout"
                     :id="status.id"
                     ref="progressBar"
                     :pause-on-hover="status.pauseOnHover"
                     :duration="status.duration"
                     :is-hovered="isHovered"
                     :hide-progressbar="status.hideProgressbar"
                     @vt-finished="finish" />
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
            <button v-for="(answer, i) in answers"
                    :key="i"
                    @click="respond(status.answers[answer])"
                    v-text="answer" />
        </div>
    </div>
</template>

<script lang="ts">
import ProgressBar from './ProgressBar.vue';
import VtIcon from './VtIcon.vue';
import useDraggable from '../composables/useDraggable';
import { computed, defineComponent, PropType, ref } from 'vue';
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

    emits: ['vtRemove'],

    setup: (props, ctx) => {
        const isHovered = ref(false);
        const events = useVtEvents();
        const progressBar = ref<{ progress: number }>();

        const notificationClass = computed(() => {
            const obj: Record<string, boolean> = {};

            if (props.status.mode === 'loader') {
                obj['vt-cursor-wait'] = true;
            }

            obj['vt-theme-' + props.status.theme!] = true;

            return obj;
        });
        const isNotification = computed(() => ['prompt', 'loader'].indexOf(props.status.mode!) === -1);

        const answers = computed(() => {
            return Object.keys(props.status.answers);
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
            // todo - will this work considering every toast has the same ref name?
            const progress = Math.ceil(progressBar.value?.progress ?? NaN);

            // if the notification has finished displaying
            if (progress >= 100 && isNotification.value) {
                events.emit('vtFinished', { id: props.status.id });
                ctx.emit('vtRemove');
            }
        };

        const { hasMoved, draggableStyles } = useDraggable(props, dismissedByDrag);

        return {
            isHovered,
            notificationClass,
            isNotification,
            respond,
            dismiss,
            draggableStyles,
            progressBar,
            answers,
            finish
        };
    }
});
</script>

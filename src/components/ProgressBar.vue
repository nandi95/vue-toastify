<template>
    <div v-show="!hideProgressbar" class="vt-progress-bar">
        <div class="vt-progress" :style="{ width: progress + '%' }" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, onBeforeUnmount } from 'vue';
import useVtEvents from '../composables/useVtEvents';

export default defineComponent({
    name: 'ProgressBar',
    props: {
        pauseOnHover: { type: Boolean },
        isHovered: { type: Boolean },
        hideProgressbar: { type: Boolean },
        duration: { type: Number, default: 0 },
        id: { type: String, required: true }
    },

    emits: ['vtFinished'],

    expose: ['progress'],

    setup: (props, ctx) => {
        const progress = ref(0);
        const progressId = ref<ReturnType<typeof requestAnimationFrame>>();
        const timerId = ref<ReturnType<typeof setTimeout>>();
        // start of the timer (a constant)
        const timerStartedAt = ref(new Date());
        // initial time to calculate with on the first start
        const timerPausedAt = ref(new Date());
        const timerFinishesAt = ref(new Date(props.duration + Date.now()));
        const events = useVtEvents();

        const timerStart = () => {
            if (props.pauseOnHover) {
                timerStartedAt.value = new Date(
                    timerStartedAt.value.getTime() + (Date.now() - timerPausedAt.value.getTime())
                );

                // new future date = future date + elapsed time since pausing
                timerFinishesAt.value = new Date(
                    timerFinishesAt.value.getTime() + (Date.now() - timerPausedAt.value.getTime())
                );

                if (!timerId.value && progress.value > 0) {
                    events.emit('vtResumed', { id: props.id });
                }

                // set new timeout
                timerId.value = window.setTimeout(
                    () => ctx.emit('vtFinished'),
                    timerFinishesAt.value.getTime() - Date.now()
                );
                // animation start
                progressId.value = requestAnimationFrame(progressBar);
            }
        };
        const timerPause = () => {
            if (props.pauseOnHover) {
                // stop notification from closing
                window.clearTimeout(timerId.value);
                // set to null so animation won't stay in a loop
                timerId.value = undefined;
                // stop loader animation from progressing
                cancelAnimationFrame(progressId.value!);
                progressId.value = undefined;
                events.emit('vtPaused', { id: props.id });
                timerPausedAt.value = new Date();
            }
        };
        const progressBar = () => {
            if (progress.value < 100) {
                const wholeTime = timerFinishesAt.value.getTime() - timerStartedAt.value.getTime();
                const elapsed = Date.now() - timerStartedAt.value.getTime();

                progress.value = elapsed / wholeTime * 100;

                // if timer is running
                if (timerId.value) {
                    progressId.value = requestAnimationFrame(progressBar);
                }
            } else {
                cancelAnimationFrame(progressId.value!);
                progressId.value = undefined;
            }
        };

        watch(() => props.isHovered, boolean => boolean ? timerPause(): timerStart());

        onMounted(() => {
            events.emit('vtStarted', { id: props.id });

            if (!props.pauseOnHover) {
                // set new timeout
                timerId.value = window.setTimeout(
                    () => ctx.emit('vtFinished'),
                    timerFinishesAt.value.getTime() - Date.now()
                );
                // animation start
                progressId.value = requestAnimationFrame(progressBar);
            }
            timerStart();
        });

        onBeforeUnmount(() => {
            progress.value = 0;
            window.clearTimeout(timerId.value);
            if (progressId.value) {
                cancelAnimationFrame(progressId.value);
                progressId.value = undefined;
            }
        });

        return {
            progress
        };
    }
});
</script>

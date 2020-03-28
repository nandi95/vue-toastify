<template>
    <component
        :is="tag"
        v-bind="urlTarget"
        class="vt-notification"
        :style="draggableStyles"
        :class="notificationClass"
        draggable="false"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
        @touchstart="isHovered = true"
        @touchend="isHovered = false"
    >
        <ProgressBar
            v-if="isNotification && status.canTimeout"
            :can-pause="status.canPause"
            :duration="status.duration"
            :is-hovered="isHovered"
            :hide-progressbar="status.hideProgressbar"
            :id="status.id"
            :ref="'progress-' + status.id"
            @vtFinished="closeNotification"
        />
        <div class="vt-content">
            <h2 class="vt-title" v-if="status.title" v-text="status.title" />
            <p class="vt-paragraph" v-html="status.body" />
        </div>
        <Icon
            v-if="status.iconEnabled"
            :mode="status.mode"
            :type="status.type"
            :icon="status.icon"
            :base-icon-class="baseIconClass"
        />
        <div class="vt-buttons" v-if="status.mode === 'prompt'">
            <button
                v-for="(value, answerProperty, index) in status.answers"
                :key="index"
                @click="respond(value)"
                v-text="answerProperty"
            />
        </div>
    </component>
</template>

<script>
import ProgressBar from "./ProgressBar.vue";
import Icon from "./Icon.vue";
import draggable from "./draggable.js";
import linkable from "./linkable";

export default {
    name: "Toast",
    components: { ProgressBar, Icon },
    props: {
        status: { type: Object },
        baseIconClass: { type: String, default: "" }
    },
    mixins: [draggable, linkable],
    data() {
        return {
            isHovered: false
        };
    },
    mounted() {
        this.$el.addEventListener("click", this.dismiss);
        if (this.status.mode === "loader") {
            this.$root.$once("vtLoadStop", payload => {
                //if all loaders should stop or only this
                if (payload.id) {
                    if (payload.id === this.status.id) {
                        this.closeNotification();
                    }
                } else {
                    this.closeNotification();
                }
            });
        }
    },
    computed: {
        notificationClass() {
            let obj = {};
            if (this.hasUrl) {
                obj["vt-cursor-pointer"] = true;
            } else if (this.status.mode === "loader") {
                obj["vt-cursor-wait"] = true;
            }
            obj["vt-theme-" + this.status.theme] = true;
            return obj;
        },
        isNotification() {
            return ["prompt", "loader"].indexOf(this.status.mode) === -1;
        }
    },
    methods: {
        closeNotification() {
            const progress = Math.ceil(
                this.$refs["progress-" + this.status.id]
                    ? this.$refs["progress-" + this.status.id].progress
                    : undefined
            );

            // if notification manually dismissed before the the timeout or in case if it cannot timeout AND isn't prompt or loader
            if ((isNaN(progress) || progress < 100) && this.isNotification) {
                this.$root.$emit("vtDismissed", { id: this.status.id });
                this.status.callback ? this.status.callback() : null;
            }
            // if the notification has finished displaying
            if (progress >= 100 && this.isNotification) {
                this.$root.$emit("vtFinished", { id: this.status.id });
                this.status.callback ? this.status.callback() : null;
            }
        },
        dismiss(event) {
            if (this.isNotification && !this.hasMoved) {
                this.closeNotification();
            }
            this.handleRedirect(event);
        },
        respond(response) {
            this.closeNotification();
            this.$root.$emit("vtPromptResponse", {
                id: this.status.id,
                response: response
            });
        }
    },
    beforeDestroy() {
        this.$el.removeEventListener("click", this.dismiss);
    }
};
</script>

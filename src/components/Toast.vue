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
            :id="status.id"
            :ref="'progress-' + status.id"
            :can-pause="status.canPause"
            :duration="status.duration"
            :is-hovered="isHovered"
            :hide-progressbar="status.hideProgressbar"
            @vtFinished="closeNotification"
        />
        <div class="vt-content">
            <h2 v-if="status.title" class="vt-title" v-text="status.title" />
            <div v-if="isJSXBody" class="vt-paragraph">
                <Node :node="status.body" />
            </div>
            <p v-else class="vt-paragraph" v-html="status.body" />
        </div>
        <Icon
            v-if="status.iconEnabled"
            :mode="status.mode"
            :type="status.type"
            :icon="status.icon"
            :base-icon-class="baseIconClass"
        />
        <div v-if="status.mode === 'prompt'" class="vt-buttons">
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
import Node from "./Node.js";

export default {
    name: "Toast",
    components: { ProgressBar, Icon, Node },
    mixins: [draggable, linkable],
    props: {
        status: { type: Object },
        baseIconClass: { type: String, default: "" }
    },
    data() {
        return {
            isHovered: false
        };
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
        },
        isJSXBody() {
            const body = this.status.body;
            // basic duck-typing check for jsx VNode
            if (typeof body === 'function' || typeof body === "object" && body.tag != null) {
                return true;
            }
            return false;
        }
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
    beforeDestroy() {
        this.$el.removeEventListener("click", this.dismiss);
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
    }
};
</script>

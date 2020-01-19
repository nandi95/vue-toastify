<template>
  <component
    :is="tag"
    v-bind="urlTarget"
    class="vt-notification"
    :style="draggableStyles"
    :class="notificationClass"
    @click="dismiss()"
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
export default {
  name: "Toast",
  components: { ProgressBar, Icon },
  props: {
    status: { type: Object },
    baseIconClass: { type: String, default: "" }
  },
  mixins: [draggable],
  data() {
    return {
      isHovered: false
    };
  },
  mounted() {
    //if there is an initial notification
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
    tag() {
      if (!this.status.url || this.status.url.length === 0) {
        return "div";
      }
      // if (this.hasRouter && this.status.url.length > 0) { // todo = notification doesn't show if has router
      //   return "router-link";
      // }
      return "a";
    },
    urlTarget() {
      if (!this.status.url || this.status.url.length === 0) {
        return {};
      }
      // if (this.hasRouter) {
      //   return { to: this.status.url };
      // }
      return { href: this.status.url };
    },
    // hasRouter() {
    //   return !!this.$root.$options._base._installedPlugins.find(entry => {
    //     return entry.hasOwnProperty("name") && entry.name === "VueRouter";
    //   });
    // }
    notificationClass() {
      let obj = {};
      if (this.status.url && this.status.url.length > 0) {
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
    dismiss() {
      if (this.isNotification && !this.hasMoved) {
        this.closeNotification();
      }
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

<template>
  <transition :name="transition">
    <component
      :is="tag"
      v-bind="urlTarget"
      v-if="isVisible"
      class="vt-notification"
      :style="notificationStyle"
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
        @vtFinished="toggleVisibility"
      />
      <div class="vt-content" :style="{ maxWidth: bodyMaxWidth }">
        <h2 class="vt-title" v-if="status.title" v-text="status.title" />
        <p class="vt-paragraph" v-html="status.body" />
      </div>
      <div class="vt-icon-container" v-if="status.icon">
        <div v-html="status.icon"></div>
      </div>
      <div v-else-if="status.mode === 'loader'" class="vt-icon-container">
        <div class="vt-spinner"></div>
      </div>
      <div
        v-else-if="status.mode === 'prompt'"
        class="vt-icon-container vt-circle vt-prompt"
      >
        <div class="vt-icon">
          <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path
              d="M10,19H13V22H10V19M12,2C17.35,2.22 19.68,7.62 16.5,11.67C15.67,12.67 14.33,13.33 13.67,14.17C13,15 13,16 13,17H10C10,15.33 10,13.92 10.67,12.92C11.33,11.92 12.67,11.33 13.5,10.67C15.92,8.43 15.32,5.26 12,5A3,3 0 0,0 9,8H6A6,6 0 0,1 12,2Z"
            />
          </svg>
        </div>
      </div>
      <div v-else class="vt-icon-container vt-circle" :class="colorClass">
        <div v-if="colorClass['vt-success']" class="vt-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
          >
            <path
              d="M9 16.2l-3.5-3.5c-.39-.39-1.01-.39-1.4 0-.39.39-.39 1.01 0 1.4l4.19 4.19c.39.39 1.02.39 1.41 0L20.3 7.7c.39-.39.39-1.01 0-1.4-.39-.39-1.01-.39-1.4 0L9 16.2z"
            />
          </svg>
        </div>
        <div v-if="colorClass['vt-error']" class="vt-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
          >
            <path
              d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"
            />
          </svg>
        </div>
        <div v-if="colorClass['vt-warning']" class="vt-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="19" r="2" />
            <path
              d="M12 3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2s2-.9 2-2V5c0-1.1-.9-2-2-2z"
            />
          </svg>
        </div>
        <div v-if="colorClass['vt-info']" class="vt-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style="transform: rotate(180deg)"
            width="36"
            height="36"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2s2-.9 2-2V5c0-1.1-.9-2-2-2z"
            />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </div>
      </div>
      <div class="vt-buttons" v-if="status.mode === 'prompt'">
        <button
          v-for="(value, answerProperty, index) in status.answers"
          :key="index"
          @click="respond(value)"
          v-text="answerProperty"
        />
      </div>
    </component>
  </transition>
</template>

<script>
import ProgressBar from "./ProgressBar";

export default {
  name: "Toast",
  components: { ProgressBar },
  props: {
    status: { type: Object, default: null },
    bodyMaxWidth: { type: String, default: "250px" }, //todo expose to the user
    transition: {
      validator: function(value) {
        // The value must match one of these strings
        return (
          ["top", "left", "center", "right", "bottom"].indexOf(value) !== -1
        );
      },
      default: "right"
    },
    containerAdjustment: { type: Number, required: true }
  },
  data() {
    return {
      notificationStyle: {},
      transitionName: "",
      isVisible: false,
      isHovered: false
    };
  },
  mounted() {
    //if there is an initial notification
    this.toggleVisibility();
    if (this.status.mode === "loader") {
      this.$root.$once("vtLoadStop", payload => {
        //if all loaders should stop or only this
        if (payload.hasOwnProperty("id") && payload.id !== null) {
          if (payload.id === this.status.id) {
            this.toggleVisibility();
          }
        } else {
          this.toggleVisibility();
        }
      });
    }
  },
  beforeMount() {
    if (this.status.hasOwnProperty("url") && this.status.url.length > 0) {
      this.notificationStyle["cursor"] = "pointer";
    }

    //dynamic positioning
    this.notificationStyle["minWidth"] =
      "calc(100% + " + this.containerAdjustment + "px)";
  },
  computed: {
    tag() {
      if (!this.status.hasOwnProperty("url") || this.status.url.length === 0) {
        return "div";
      }
      // if (this.hasRouter && this.status.url.length > 0) { // todo = notification doesn't show if has router
      //   return "router-link";
      // }
      return "a";
    },
    urlTarget() {
      if (!this.status.hasOwnProperty("url") || this.status.url.length === 0) {
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
    colorClass() {
      let obj = {};
      obj["vt-" + (this.status.type ? this.status.type : "info")] = true;
      return obj;
    },
    notificationClass() {
      let obj = {};
      // added only to include the styles at build, todo - review webpack tree-shaking
      obj["vt-theme-dark"] = false;
      obj["vt-theme-light"] = false;
      obj["vt-theme-" + this.status.theme] = true;
      obj["vt-cursor-loading"] = this.status.mode === "loader";
      return obj;
    },
    isNotification() {
      return (
        ["prompt", "loader"].indexOf(this.status.mode) === -1
      );
    }
  },
  methods: {
    toggleVisibility() {
      const progress = Math.ceil(
        this.$refs["progress-" + this.status.id]
          ? this.$refs["progress-" + this.status.id].progress
          : undefined
      );

      // if notification manually dismissed AND is visible AND isn't prompt or loader
      if (
        (progress < 100 || this.status.canTimeout === false) &&
        this.isVisible &&
        this.isNotification
      ) {
        this.$root.$emit("vtDismissed", { id: this.status.id });
        this.status.callback ? this.status.callback() : null;
      }
      // if the notification has finished displaying
      if (progress < 100 && this.isNotification) {
        this.$root.$emit("vtFinished", { id: this.status.id });
        this.status.callback ? this.status.callback() : null;
      }
      this.isVisible = !this.isVisible;
    },
    dismiss() {
      if (this.isNotification) {
        this.toggleVisibility();
      }
    },
    respond(response) {
      this.toggleVisibility();
      this.$root.$emit("vtPromptResponse", {
        id: this.status.id,
        response: response
      });
    }
  }
};
</script>

<style lang="scss">
@import "../assets/toast";
</style>

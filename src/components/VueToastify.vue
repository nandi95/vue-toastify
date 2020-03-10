<template>
  <div>
    <div
      v-cloak
      class="vt-backdrop-hidden"
      :class="{
        'vt-backdrop-visible': toasts.length > 0 && settings.withBackdrop
      }"
      :style="{
        backgroundColor: settings.backdrop
      }"
    ></div>
    <vt-transition
      class="vt-notification-container"
      :class="positionClasses"
      :style="flexDirection"
      :transition="getTransition"
      :position="settings.position"
    >
      <Toast
        v-for="status in toasts"
        v-bind:key="status.id"
        :status="status"
        :base-icon-class="settings.baseIconClass"
      />
    </vt-transition>
  </div>
</template>

<script>
// todo: create 3 containers and create a manager that manages the queue to push to the correct container (each container having 3 positions) ( position will be held on the status ) this will allow for separated transitions
import Toast from "./Toast.vue";
import { between, isBoolean } from "../js/utils";
import Transition from "./Transition.vue";

let temp = {};

export default {
  name: "VueToastify",
  components: {
    Toast,
    "vt-transition": Transition
  },
  props: {
    singular: { type: Boolean, default: true },
    withBackdrop: { type: Boolean, default: false },
    backdrop: {
      type: String,
      default: "rgba(0, 0, 0, 0.2)"
    },
    position: {
      validator: function(value) {
        // The value must match one of these strings
        return (
          [
            "top-left",
            "top-center",
            "top-right",
            "center-left",
            "center-center",
            "center-right",
            "bottom-left",
            "bottom-center",
            "bottom-right"
          ].indexOf(value) !== -1
        );
      },
      default: "bottom-right"
    },
    defaultTitle: { type: Boolean, default: true },
    canPause: { type: Boolean, default: true },
    canTimeout: { type: Boolean, default: true },
    iconEnabled: { type: Boolean, default: true },
    draggable: { type: Boolean, default: true },
    dragThreshold: {
      type: Number,
      default: 0.75,
      validator: value => between(0, 5, value)
    },
    hideProgressbar: { type: Boolean, default: false },
    errorDuration: { type: Number, default: 8000 },
    successDuration: { type: Number, default: 4000 },
    warningInfoDuration: { type: Number, default: 6000 },
    theme: { type: String, default: "dark" },
    baseIconClass: { type: String, default: "" },
    orderLatest: { type: Boolean, default: true },
    transition: { type: [String, Object], default: null },
    oneType: { type: Boolean, default: false },
    maxToasts: { type: Number, default: 6 }
  },
  data() {
    return {
      toasts: [],
      queue: [],
      settings: {
        singular: false,
        withBackdrop: false,
        backdrop: "rgba(0, 0, 0, 0.2)",
        position: "bottom-right",
        defaultTitle: true,
        canTimeout: true,
        canPause: false,
        iconEnabled: true,
        draggable: true,
        dragThreshold: 0.75,
        hideProgressbar: false,
        errorDuration: 8000,
        successDuration: 4000,
        warningInfoDuration: 6000,
        theme: "dark",
        baseIconClass: "",
        orderLatest: true,
        transition: null,
        oneType: false,
        maxToasts: 6
      }
    };
  },
  mounted() {
    this.setSettings();
    // listen for notification event
    this.$root.$on(
      ["vtFinished", "vtDismissed", "vtPromptResponse", "vtLoadStop"],
      payload => {
        if (typeof payload.id === "string") {
          this.remove(payload.id);
        }
      }
    );
    if (
      window.notification &&
      window.notification.type &&
      window.notification.body
    ) {
      const delay = window.notification.delay ? window.notification.delay : 0;
      setTimeout(() => {
        this.add(window.notification);
      }, delay);
    }
  },
  methods: {
    // Internal methods
    findToast(id) {
      return this.toasts.findIndex(toast => {
        return toast.id === id;
      });
    },
    findQueuedToast(id) {
      return this.queue.findIndex(toast => {
        return toast.id === id;
      });
    },
    uuidv4() {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
      );
    },
    getTitle(status) {
      if (status.title) {
        return status.title;
      }
      if (isBoolean(status.defaultTitle)) {
        if (status.defaultTitle) {
          if (status.mode === "prompt" || status.mode === "loader") {
            return "";
          }
          if (status.type) {
            return status.type.charAt(0).toUpperCase() + status.type.slice(1);
          }
        } else {
          return "";
        }
      }
      if (this.settings.defaultTitle) {
        if (status.mode === "prompt" || status.mode === "loader") {
          return "";
        }
        if (status.type) {
          return status.type.charAt(0).toUpperCase() + status.type.slice(1);
        }
      }
      return "Info";
    },
    arrayHasType(status) {
      return !!this.toasts.find(
        toast =>
          (toast.mode && toast.mode === status.mode) ||
          (toast.type && toast.type === status.type)
      );
    },

    // API methods
    setSettings(settings = null) {
      if (settings) {
        Object.keys(this.settings).forEach(key => {
          if (settings[key] !== undefined) {
            this.$set(this.settings, key, settings[key]);
          }
        });
      } else {
        this.settings = Object.assign({}, this._props);
      }
      return this.settings;
    },
    getSettings() {
      return this.settings;
    },
    stopLoader(id = null) {
      let ids = id;
      if (typeof id === "string") {
        ids = [id];
      } else if (Array.isArray(id)) {
        ids = id;
      } else {
        //get all loaders
        ids = this.toasts.map(toast => {
          if (toast.mode === "loader") {
            return toast.id;
          }
        });
      }
      ids.forEach(id => {
        this.$root.$emit("vtLoadStop", { id: id });
      });
    },
    add(status) {
      // copy object
      let toast = Object.assign({}, status); //todo update to deep copy
      // if object doesn't have default values, set them
      //todo update these to object merger
      toast.duration = this.settings.warningInfoDuration;
      if (Number(status.duration) > 0) {
        toast.duration = Number(status.duration);
      } else if (status.type) {
        toast.duration =
          status.type === "error"
            ? this.settings.errorDuration
            : status.type === "success"
            ? this.settings.successDuration
            : this.settings.warningInfoDuration;
      }
      toast.answers =
        status.answers && Object.keys(status.answers).length > 0
          ? status.answers
          : { Yes: true, No: false };
      toast.canPause = isBoolean(status.canPause)
        ? status.canPause
        : this.settings.canPause;
      toast.hideProgressbar = isBoolean(status.hideProgressbar)
        ? status.hideProgressbar
        : this.settings.hideProgressbar;
      toast.id = this.uuidv4();
      toast.title = this.getTitle(status);
      toast.canTimeout = isBoolean(status.canTimeout)
        ? status.canTimeout
        : this.settings.canTimeout;
      toast.iconEnabled = isBoolean(status.iconEnabled)
        ? status.iconEnabled
        : this.settings.iconEnabled;
      if (["prompt", "loader"].indexOf(status.mode) === -1) {
        toast.draggable = isBoolean(status.draggable)
          ? status.draggable
          : this.settings.draggable;
      } else {
        toast.draggable = false;
      }
      toast.dragThreshold = between(0, 5, status.dragThreshold)
        ? status.dragThreshold
        : this.settings.dragThreshold;
      if (status.mode === "prompt" || status.mode === "loader") {
        toast.canTimeout = false;
      }

      toast.theme = status.theme ? status.theme : this.settings.theme;
      if (
        // if singular and there's 1 already showing
        (this.settings.singular && this.toasts.length > 0) ||
        // if oneType turned on that type already showing
        (this.settings.oneType && this.arrayHasType(toast)) ||
        // if it would exceed the max number of displayed toasts
        this.toasts.length >= this.settings.maxToasts
      ) {
        this.$set(this.queue, this.queue.length, toast);
        return toast.id;
      }
      this.$set(this.toasts, this.toasts.length, toast);
      return toast.id;
    },
    get(id = null) {
      if (id) {
        let toast = this.toasts.find(toast => {
          return toast.id === id;
        });
        if (toast) {
          return toast;
        }
        toast = this.queue.find(toast => {
          return toast.id === id;
        });
      }
      return this.toasts.concat(this.queue);
    },
    set(id, status) {
      let toast = this.get(id);
      if (toast instanceof Array) {
        return false;
      }
      if (this.findToast(id) !== -1) {
        this.$set(
          this.toasts,
          this.findToast(id),
          Object.assign(toast, status)
        );
        return true;
      }
      this.$set(
        this.toasts,
        this.findQueuedToast(id),
        Object.assign(toast, status)
      );
      return true;
    },
    remove(id = null) {
      if (id) {
        let index = this.findQueuedToast(id);
        if (this.settings.singular && index !== -1) {
          this.$delete(this.queue, index);
          return this.currentlyShowing;
        }
        index = this.findToast(id);
        if (index !== -1) {
          this.$delete(this.toasts, index);
          return this.currentlyShowing;
        }
        return false;
      }
      this.toasts = [];
      return this.currentlyShowing;
    }
  },
  computed: {
    getTransition: function() {
      if (this.settings.transition) {
        return this.settings.transition;
      }
      const position = this.settings.position.split("-");
      if (position[1] === "left") {
        return "vt-left";
      }
      if (position[1] === "center") {
        return "vt-" + position[0];
      }
      return "vt-right";
    },
    flexDirection: function() {
      return {
        "flex-direction":
          this.settings.orderLatest &&
          this.settings.position.split("-")[0] === "bottom"
            ? "column"
            : "column-reverse"
      };
    },
    positionClasses: function() {
      const position = this.settings.position.split("-");
      let classes = {};
      if (position[0] === position[1]) {
        classes["vt-center-center"] = true;
        return classes;
      }
      classes[
        position[0] === "center" ? "vt-centerY" : "vt-" + position[0]
      ] = true;
      classes[
        position[1] === "center" ? "vt-centerX" : "vt-" + position[1]
      ] = true;
      return classes;
    },
    currentlyShowing: function() {
      return this.toasts.map(toast => toast.id);
    }
  },
  watch: {
    settings: {
      handler: function(newSettings, oldSettings) {
        if (isBoolean(newSettings.singular)) {
          // if singular turned off release all queued toasts
          if (!newSettings.singular) {
            for (let i = 0; i < this.settings.maxToasts - 1; i++) {
              if (!this.arrayHasType(this.queue[i])) {
                this.queue.splice()
                this.$set(this.toasts, this.toasts.length, this.queue.shift());
              }
              // todo - if onetype then only appropriate ones
            }
            if (isBoolean(temp.orderLatest)) {
              newSettings.orderLatest = temp.orderLatest;
              delete temp.orderLatest;
            }
            return;
          }
          temp.orderLatest = oldSettings.orderLatest;
          newSettings.orderLatest = false;
        }
      },
      deep: true
    },
    toasts: {
      handler: function(newValue) {
        // if there's anything at all in the queue
        if (this.queue.length !== 0) {
          this.$nextTick(() => {
            // if singular than oneType and maxToasts isn't a concern
            if (this.settings.singular) {
              if (newValue.length === 0) {
                this.$set(this.toasts, this.toasts.length, {
                  ...this.queue.shift(),
                  delayed: true
                });
              }
              return;
            }
            if (this.settings.oneType) {
              return this.queue.forEach((status, index) => {
                if (
                  !this.arrayHasType(status) &&
                  this.toasts.length < this.settings.maxToasts
                ) {
                  this.$set(this.toasts, this.toasts.length, {
                    ...this.queue.splice(index, 1)[0],
                    delayed: true
                  });
                }
              });
            }
            if (this.toasts.length < this.settings.maxToasts) {
              this.$set(this.toasts, this.toasts.length, {
                ...this.queue.shift(),
                delayed: true
              });
            }
          });
        }
      },
      deep: true
    }
  },
  beforeDestroy() {
    this.$root.$off([
      "vtFinished",
      "vtDismissed",
      "vtPromptResponse",
      "vtLoadStop"
    ]);
  }
};
</script>

<style lang="scss">
.vt-notification-container {
  pointer-events: none;
  box-sizing: border-box;
  position: fixed;
  display: flex;
  flex-direction: column;
  margin: 10px;
  width: auto;
  height: auto;
  z-index: 9999;
}
.vt-backdrop-hidden {
  transition: all 150ms ease-out;
  opacity: 0;
  visibility: hidden;
  z-index: 50;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: fixed;
}
.vt-backdrop-visible {
  opacity: 1;
  visibility: visible;
}
.vt-top {
  top: 0;
}
.vt-centerY {
  top: 50%;
  transform: translateY(-50%);
}
.vt-bottom {
  bottom: 0;
}

.vt-left {
  left: 0;
}
.vt-centerX {
  left: 50%;
  transform: translateX(-50%);
}
.vt-right {
  right: 0;
}

.vt-center-center {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
@import "../assets/toast";
</style>

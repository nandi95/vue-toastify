<template>
  <div
    v-cloak
    :class="{
      'vt-backdrop': toasts.length > 0 && settings.withBackdrop
    }"
    :style="{
      backgroundColor: settings.backdrop
    }"
  >
    <div class="vt-notification-container" :style="internalSettings.styles">
      <Toast
        v-for="status in toasts"
        :key="status.id"
        :status="status"
        :transition="getTransition"
        :class="{
          'vt-cursor-loading':
            status.hasOwnProperty('mode') && status.mode === 'loader'
        }"
        :container-adjustment="internalSettings.containerAdjustment"
      />
    </div>
  </div>
</template>

<script>
import Toast from "./Toast";

export default {
  //todo - max on screen
  name: "VueToastify",
  components: {
    Toast
  },
  props: {
    singular: { type: Boolean, default: false },
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
      default: "center-center"
    }
  },
  data() {
    return {
      toasts: [],
      queue: [],
      settings: {
        singular: false,
        withBackdrop: false,
        backdrop: "rgba(0, 0, 0, 0.2)",
        position: "bottom-right"
      },
      internalSettings: {
        styles: {},
        containerAdjustment: 50 // don't judge, it works, for now...
      }
    };
  },
  mounted() {
    this.setSettings();
    // listen for notification event
    this.$root.$on("vtNotify", status => {
      if (status.body) {
        this.toasts.push(status);
      } else if (
        status.hasOwnProperty("status") &&
        status.hasOwnProperty("statusText")
      ) {
        // http error expected to be passed in
        this.toasts.push({
          title: status.status.toString(),
          body: status.statusText,
          type: "error"
        });
      }
    });
    this.$root.$on(
      ["vtFinished", "vtDismissed", "vtPromptResponse", "vtLoadStop"],
      payload => {
        if (payload.hasOwnProperty("id")) {
          this.remove(payload.id);
        }
      }
    );
  },
  methods: {
    setSettings(settings = null) {
      if (settings instanceof Object) {
        Object.keys(this.settings).forEach(key => {
          if (settings.hasOwnProperty(key)) {
            this.$set(this.settings, key, settings[key]);
          }
        });
      } else {
        this.settings = Object.assign({}, this._props);
      }
    },
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
    stopLoader(id = null) {
      let ids;
      if (id instanceof String) {
        ids = [id];
      } else {
        //get all loaders
        ids = this.toasts.map(toast => {
          if (toast.hasOwnProperty("mode") && toast.mode === "loader") {
            return toast.id;
          }
        });
      }
      ids.forEach(id => {
        this.$root.$emit("vtLoadStop", { id: id });
      });
    },
    add(status) {
      let toast = Object.assign({}, status); //todo update to deep copy
      toast.id = this.uuidv4();
      if (this.singular && this.toasts.length !== 0) {
        this.queue.push(toast);
        return this.currentlyShowing;
      }
      this.toasts.push(toast);
      return toast.id;
    },
    get(id = null) {
      if (id) {
        return this.toasts.find(toast => {
          return toast.id === id;
        });
      }
      return this.toasts;
    },
    set(id, status) {
      this.$set(this.toasts, this.findToast(id), status);
    },
    remove(id = null) {
      if (id) {
        if (this.singular) {
          const index = this.findQueuedToast(id);
          if (index !== -1) {
            this.$delete(this.queue, index);
          }
        }
        setTimeout(() => {
          this.$delete(this.toasts, this.findToast(id));
        }, 200); // 200ms for the animation
        return this.currentlyShowing;
      }
      this.toasts = [];
      return this.toasts;
    }
  },
  computed: {
    getTransition: function() {
      const position = this.position.split("-");
      if (position[1] === "left") {
        return "left";
      }
      if (position[1] === "center") {
        return position[0];
      }
      return "right";
    },
    currentlyShowing: function() {
      return this.toasts.map(toast => toast.id);
    }
  },
  watch: {
    settings: {
      handler: function(newSettings) {
        if (newSettings.hasOwnProperty("position")) {
          const position = newSettings.position.split("-");
          // remove values
          this.$delete(this.internalSettings.styles, "left");
          this.$delete(this.internalSettings.styles, "right");
          this.$delete(this.internalSettings.styles, "top");
          this.$delete(this.internalSettings.styles, "bottom");

          let styles = {};
          if (position[0] === "center") {
            styles.top = "50%";
            styles.transform = "translateY(-50%)";
          } else if (position[0] === "bottom") {
            styles.bottom = "0";
          } else {
            styles.top = "0";
          }

          if (position[1] === "center") {
            styles.left = "50%";
            styles.transform = styles.transform
              ? "translate(-50%, -50%)"
              : "translateX(-50%)";
          } else if (position[1] === "right") {
            styles.right =
              this.internalSettings.containerAdjustment.toString() + "px";
          } else {
            styles.left = "0";
          }
          this.internalSettings.styles = styles;
        }
      },
      deep: true
    },
    toasts: {
      handler: function(newValue) {
        if (this.singular && newValue.length === 0 && this.queue.length !== 0) {
          this.$nextTick(() => {
            this.$set(this.toasts, this.toasts.length, this.queue.shift());
          });
        }
      },
      deep: true
    }
  }
};
</script>

<style scoped lang="scss">
.vt-notification-container {
  position: fixed;
  display: block;
  margin: 10px;
  width: auto;
  height: auto;
}
.vt-backdrop {
  transition: background-color 0.2s ease-out;
  z-index: 50;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: fixed;
}
.vt-cursor-loading {
  cursor: wait;
}
</style>

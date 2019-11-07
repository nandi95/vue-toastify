<template>
  <div
    :class="{
      'vt-backdrop': currentlyShowing.length > 0 && settings.withBackdrop
    }"
    :style="{
      backgroundColor: 'rgba(0, 0, 0,' + settings.backdropOpacity + ')'
    }"
  >
    <div class="vt-notification-container" :style="internalSettings.styles">
      <Toast
        v-for="(status, index) in toasts"
        :key="index"
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
  name: "VueToastify",
  components: {
    Toast
  },
  //todo: older cancels double but not the other way around
  //todo: singular feature / one type on screen at a time
  props: {
    singular: { type: Boolean, default: false },
    withBackdrop: { type: Boolean, default: false },
    backdropOpacity: {
      type: Number,
      default: 0.2,
      validator: function(value) {
        return 0 < value && 1 >= value;
      }
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
      default: "center-right"
    },
    history: { type: Boolean, default: false }
  },
  data() {
    return {
      toasts: [],
      currentlyShowing: [],
      settings: {
        singular: false,
        withBackdrop: false,
        backdropOpacity: 0.2,
        history: false,
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
      } else if (status.status && status.statusText) {
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
        this.remove(payload.id); // todo history mode
      }
    );
  },
  methods: {
    setSettings(settings = null) {
      if (settings instanceof Object) {
        Object.keys(this.settings).forEach(key => {
          if (settings.hasOwnProperty(key)) {
            this.settings[key] = settings[key];
          }
        });
      } else {
        for (let [key, value] of Object.entries(this._props)) {
          this.settings[key] = value;
        }
      }
    },
    findToast(id) {
      return this.toasts.findIndex(toast => {
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
      status.id = this.uuidv4();
      this.toasts.push(status);
      this.currentlyShowing.push(status.id);
      return status.id;
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
        console.log(this.toasts.map(toast => toast.id));
        this.currentlyShowing = this.currentlyShowing.filter(
          showingId => showingId !== id
        );
        this.toasts = this.toasts.filter(toast => toast.id !== id);
        return this.toasts;
      }
      this.currentlyShowing = [];
      this.toasts = [];
      return this.toasts;
    },
    queueHasMode(mode) {
      return !!this.toasts.find(toast => {
        return (
          this.currentlyShowing.includes(toast.id) &&
          toast.hasOwnProperty("mode") &&
          toast.mode === mode
        );
      });
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
    }
  },
  watch: {
    internalSettings: {
      handler: function(newSettings) {
        if (newSettings.styles.hasOwnProperty("left")) {
          this.internalSettings.containerAdjustment = Number(
            newSettings.styles.left.slice(0, -2)
          );
        }
        if (newSettings.styles.hasOwnProperty("right")) {
          this.internalSettings.containerAdjustment = Number(
            newSettings.styles.right.slice(0, -2)
          );
        }
      },
      deep: true
    },
    settings: {
      handler: function(newSettings) {
        if (newSettings.hasOwnProperty("position")) {
          const position = newSettings.position.split("-");
          // remove values
          this.$delete(this.internalSettings.styles, "left");
          this.$delete(this.internalSettings.styles, "right");
          this.$delete(this.internalSettings.styles, "top");
          this.$delete(this.internalSettings.styles, "bottom");

          if (position[0] === "center") {
            this.internalSettings.styles["top"] = "50%";
            this.internalSettings.styles["transform"] = "translateY(-50%)";
          } else if (position[0] === "bottom") {
            this.internalSettings.styles["bottom"] = "0";
          } else {
            this.internalSettings.styles["top"] = "0";
          }

          if (position[1] === "center") {
            this.internalSettings.styles["left"] = "50%";
            this.internalSettings.styles["transform"] = "translateX(-50%)";
          } else if (position[1] === "right") {
            this.internalSettings.styles["right"] =
              this.internalSettings.containerAdjustment.toString() + "px";
          } else {
            this.internalSettings.styles["left"] = "0";
          }
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

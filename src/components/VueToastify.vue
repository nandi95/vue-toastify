<template>
  <div
    :class="{
      'vt-backdrop': currentlyShowing.length > 0 && settings.withBackdrop,
      'vt-cursor-loading':
        currentlyShowing.length > 0 && settings.withBackdrop && hasLoader
    }"
    :style="{
      backgroundColor: 'rgba(0, 0, 0,' + settings.backdropOpacity + ')'
    }"
  >
    <div class="vt-notification-container">
      <toast
        v-for="(status, index) in toasts"
        :key="index"
        :status="status"
      ></toast>
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
  //todo: container messing up the toast width
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
        history: false
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
        let index = this.currentlyShowing.indexOf(payload.id);
        if (index !== -1) {
          this.currentlyShowing.splice(index, 1);
        }
        if (!this.settings.history) {
          setTimeout(() => {
            this.toasts.splice(this.findToast(payload.id), 1);
          }, 200);
        }
      }
    );
  },
  methods: {
    setSettings(settings = null) {
      if (settings) {
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
    getToast(id) {
      return this.toasts.find(toast => {
        return toast.id === id;
      });
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
      if (id) {
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
      this.$set(this.toasts, this.toasts.length, status);
      this.currentlyShowing.push(status.id);
      return status.id;
    },
    get(id = null) {
      if (id) {
        return this.getToast(id);
      }
      return this.toasts;
    },
    set(id, status) {
      this.$set(this.toasts, this.findToast(id), status);
    }
  },
  computed: {
    hasLoader: function() {
      return !!this.toasts.find(toast => {
        return (
          this.currentlyShowing.includes(toast.id) &&
          toast.hasOwnProperty("mode") &&
          toast.mode === "loader"
        );
      });
    }
  }
};
</script>

<style scoped lang="scss">
.vt-notification-container {
  position: fixed;
  /*display: flex;*/
  /*align-items: flex-end;*/
  /*justify-content: center;*/
  /*  todo: this to be controlled by dynamic positioning */
  bottom: 10px;
  right: 10px;
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

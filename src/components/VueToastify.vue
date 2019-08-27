<template>
  <div :class="{ backdrop: toasts.length > 0 && withBackdrop }">
    <toast
      v-for="(status, index) in toasts"
      :key="index"
      :status="status"
      :event-handler="eventHandler"
      :event-suffix="status.id ? '-' + status.id : ''"
    ></toast>
  </div>
</template>

<script>
import Toast from "./Toast";
export default {
  name: "VueToastify",
  components: {
    Toast
  },
  props: {
    alerts: { type: Array, required: false },
    initialDelay: { type: Number, default: 750 },
    eventHandler: { type: String, default: "EventBus" },
    singular: { type: Boolean, default: false },
    withBackdrop: { type: Boolean, default: false },
    backdropOpacity: { type: Number, default: 0.2 }
  },
  data() {
    return {
      toasts: []
    };
  },
  // todo prompt promise?
  mounted() {
    //delay to make sure the client fully loads the page
    setTimeout(() => {
      this.toasts = this.alerts;
    }, this.initialDelay);
    // listen for notification event
    window[this.eventHandler].$on("vtNotify", status => {
      if (status.body) {
        // only 1 loader at a time
        if (typeof this.getLoader() === "boolean") {
          this.toasts.push(status);
        }
      } else if (status.status && status.statusText) {
        // http error expected to be passed in
        this.toasts.push({
          title: status.status.toString(),
          body: status.statusText,
          type: "error"
        });
      }
      // listen for loader end event
      if (status.mode === "loader") {
        window[this.eventHandler].$once("vtLoadStop", () => {
          // loader on second vtLoaderStop fires twice
          this.toasts.slice(this.getLoader(), 1);
        });
      }
    });
  },
  methods: {
    //get loader position else return false
    getLoader() {
      let value = false;
      this.toasts.map((status, index) => {
        if (status.type === "loader") {
          value = index;
        }
      });
      return value;
    }
  }
};
</script>

<style scoped lang="scss">
.backdrop {
  transition: background-color 0.2s ease-out;
  z-index: 50;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.2);
}
</style>

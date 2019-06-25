<template>
  <transition :name="transitionName">
    <div
      v-if="isVisible"
      class="notification"
      :style="positionStyle"
      :class="{ 'theme-light': lightTheme, 'theme-dark': !lightTheme }"
      @click="toggleVisibility()"
      @mouseenter="timerPause()"
      @mouseleave="timerStart()"
    >
      <div v-if="timesOut" class="progress-bar">
        <div class="progress" :style="{ width: this.progress + '%' }"></div>
      </div>
      <div class="vt-content" :style="{ maxWidth: bodyMaxWidth + 'px' }">
        <h2 class="vt-title">{{ title | capitalise }}</h2>
        <p class="vt-paragraph" v-html="body"></p>
      </div>
      <div class="vt-icon-container" v-if="status.icon" :class="colorClass">
        <div class="vt-icon" v-html="status.icon"></div>
      </div>
      <div v-else class="vt-icon-container" :class="colorClass">
        <div v-if="colorClass.success" class="vt-icon">
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
        <div v-if="colorClass.error" class="vt-icon">
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
        <div v-if="colorClass.alert" class="vt-icon">
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
        <div v-if="colorClass.info" class="vt-icon">
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
    </div>
  </transition>
</template>

<script>
const requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame;
const cancelAnimationFrame =
  window.cancelAnimationFrame || window.mozCancelAnimationFrame;
export default {
  name: "VueToastify",
  filters: {
    capitalise(value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  },
  props: {
    status: { type: Object, default: null },
    eventHandler: { type: String, default: "EventBus" },
    eventName: { type: String, default: "notify" },
    lightTheme: { type: Boolean, default: false },
    defaultTitle: { type: Boolean, default: true },
    errorDuration: { type: Number, default: 8000 },
    successDuration: { type: Number, default: 4000 },
    alertInfoDuration: { type: Number, default: 6000 },
    delay: { type: Number, default: 750 },
    canPause: { type: Boolean, default: false },
    bodyMaxWidth: { type: Number, default: 250 },
    position: {
      validator: function(value) {
        // The value must match one of these strings
        return (
          ["top-left", "top-right", "bottom-left", "bottom-right"].indexOf(
            value
          ) !== -1
        );
      },
      default: "bottom-right"
    },
    positionXDistance: { type: String, default: "10px" },
    positionYDistance: { type: String, default: "10px" }
  },
  data() {
    return {
      colorClass: {},
      positionStyle: {},
      transitionName: "",
      title: "",
      body: "",
      isVisible: false,
      pausable: false,
      timesOut: true,
      titleToDefault: true,
      duration: null,
      progress: 0,
      progressId: null,
      timerId: null,
      timerStartedAt: null,
      timerPausedAt: null,
      timerFinishesAt: null
    };
  },
  mounted() {
    //if there is an initial alert
    if (this.status) {
      //delay to make sure the client fully loads the page
      this.startController(this.delay);
    }

    // listen for notification event
    window[this.eventHandler].$on(this.eventName, status => {
      const notification = status;
      if (notification.body) {
        this.setData(notification);
      } else {
        // http error expected to be passed in
        this.setData({
          title: status.status.toString(),
          body: status.statusText,
          type: "error"
        });
      }
      this.startController();
    });
  },
  beforeMount() {
    if (this.status) {
      this.setData(this.status);
    }
    //dynamic positioning
    this.positionStyle[this.position.split("-")[0]] = this.positionYDistance;
    this.positionStyle[this.position.split("-")[1]] = this.positionXDistance;
    this.transitionName = this.position.split("-")[1];
  },
  methods: {
    startController(delay = 0) {
      setTimeout(() => {
        this.toggleVisibility();
        if (this.timesOut) {
          window[this.eventHandler].$emit("notificationStarted");
          // start of the timer (a constant)
          this.timerStartedAt = new Date();
          // initial time to calculate with on the first start
          this.timerPausedAt = new Date();

          if (!this.pausable) {
            // set new timeout
            this.timerId = window.setTimeout(
              this.toggleVisibility,
              this.timerFinishesAt.getTime() - Date.now()
            );
            // animation start
            this.progressId = requestAnimationFrame(this.progressBar);
          }
          this.timerStart();
        }
      }, delay);
    },
    toggleVisibility() {
      // if notification manually dismissed
      if ((this.progress < 100 || this.timesOut === false) && this.isVisible) {
        window[this.eventHandler].$emit("notificationDismissed");
      }
      if (this.progress === 100) {
        window[this.eventHandler].$emit("notificationFinished");
      }
      this.isVisible = !this.isVisible;
      this.progress = 0;
      //if there's one clear it
      window.clearTimeout(this.timerId);
      this.timerId = null;
      if (this.progressId) {
        cancelAnimationFrame(this.progressId);
        this.progressId = null;
      }
      // set to null so upcoming notification durations will be the expected values
      if (!this.isVisible) {
        this.duration = null;
      }
    },
    decideTitle(status) {
      let title = "";
      if (status.title) {
        title = status.title;
      } else {
        if (status.type) {
          if (typeof status.defaultTitle === "undefined") {
            title = this.titleToDefault ? status.type : "";
          } else {
            title = status.defaultTitle ? status.type : "";
          }
        } else {
          if (typeof status.defaultTitle === "undefined") {
            title = this.titleToDefault ? "info" : "";
          } else {
            title = status.defaultTitle ? "info" : "";
          }
        }
      }
      return title;
    },
    setData(status) {
      this.title = this.decideTitle(status);
      this.body = status.body;
      this.pausable = status.canPause === true ? status.canPause : false;
      this.timesOut = status.canTimeout === false ? status.canTimeout : true;
      this.titleToDefault =
        typeof status.defaultTitle !== "undefined" ? status.defaultTitle : true;
      // clear any pre-existing classes
      this.colorClass = {};
      this.colorClass[status.type ? status.type : "info"] = true;
      // making sure duration is only overwriting if present in the status
      this.duration = status.duration ? Number(status.duration) : null;
      let duration = this.duration
        ? this.duration
        : status.type === "error"
        ? this.errorDuration
        : status.type === "success"
        ? this.successDuration
        : this.alertInfoDuration;
      this.timerFinishesAt = new Date(duration + Date.now() + this.delay);
    },
    timerStart() {
      if (this.pausable) {
        this.timerStartedAt = new Date(
          this.timerStartedAt.getTime() +
            (Date.now() - this.timerPausedAt.getTime())
        );

        // new future date = future date + elapsed time since pausing
        this.timerFinishesAt = new Date(
          this.timerFinishesAt.getTime() +
            (Date.now() - this.timerPausedAt.getTime())
        );

        if (!this.timerId && this.progress > 0) {
          window[this.eventHandler].$emit("notificationResumed");
        }

        // set new timeout
        this.timerId = window.setTimeout(
          this.toggleVisibility,
          this.timerFinishesAt.getTime() - Date.now()
        );
        // animation start
        this.progressId = requestAnimationFrame(this.progressBar);
      }
    },
    timerPause() {
      if (this.pausable) {
        // stop notification from closing
        window.clearTimeout(this.timerId);
        // set to null so animation won't stay in a loop
        this.timerId = null;
        // stop loader animation from progressing
        cancelAnimationFrame(this.progressId);
        this.progressId = null;
        window[this.eventHandler].$emit("notificationPaused");
        this.timerPausedAt = new Date();
      }
    },
    progressBar() {
      if (this.progress < 100) {
        const wholeTime =
          this.timerFinishesAt.getTime() - this.timerStartedAt.getTime();
        const elapsed = Date.now() - this.timerStartedAt.getTime();

        this.progress = Math.ceil((elapsed / wholeTime) * 100);

        // if timer is running
        if (this.timerId) {
          this.progressId = requestAnimationFrame(this.progressBar);
        }
      } else {
        this.progressId = cancelAnimationFrame(this.progressId);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.success {
  & > .vt-icon > svg {
    fill: #199919;
  }
  border-color: #199919;
}
.info {
  & > .vt-icon > svg {
    fill: #003bc8;
  }
  border-color: #003bc8;
}
.alert {
  & > .vt-icon > svg {
    fill: #ffb300;
  }
  border-color: #ffb300;
}
.error {
  & > .vt-icon > svg {
    fill: #b11414;
  }
  border-color: #b11414;
}
.notification {
  box-shadow: 0 0 10px 0.5px rgba(0, 0, 0, 0.35);
  padding: 1% 2%;
  width: auto;
  border-radius: 5px;
  cursor: pointer;

  z-index: 9999;
  position: fixed;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: wrap row;
  align-content: center;
  & > .progress-bar {
    height: 3px;
    width: 100%;
    margin-bottom: 5px;
    & > .progress {
      max-width: 100%;
      height: 3px;
    }
  }
  & > .vt-content {
    width: auto;
    height: 100%;
    margin-right: 5px;
    word-break: break-word;
    & > .vt-title {
      font-size: 1.4rem;
      margin: 0;
    }
    & > .vt-paragraph {
      font-size: 1rem;
      margin: 0.5rem 0;
    }
  }
  & > .vt-icon-container {
    margin-left: 5px;
    margin-bottom: 0;
    border-style: solid;
    border-width: 2px;
    width: 65px;
    height: 65px;
    border-radius: 50%;
    position: relative;
    & > .vt-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}

.theme-dark {
  $backgroundColor: #1d1d1d;
  background-color: $backgroundColor;
  & > .progress-bar {
    background-color: lighten($backgroundColor, 10%);
    & > .progress {
      background-color: lighten($backgroundColor, 30%);
    }
  }
  & > .vt-content {
    & > .vt-title {
      color: lighten($backgroundColor, 75%);
    }
    & > .vt-paragraph {
      color: lighten($backgroundColor, 75%);
    }
  }
}
.theme-light {
  $backgroundColor: #ffffff;
  $borderColor: darken($backgroundColor, 30%);
  background-color: $backgroundColor;
  & > .progress-bar {
    background-color: darken($backgroundColor, 15%);
    & > .progress {
      background-color: darken($backgroundColor, 40%);
    }
  }
  & > .vt-content {
    & > .vt-title {
      color: darken($backgroundColor, 70%);
    }
    & > .vt-paragraph {
      color: darken($backgroundColor, 75%);
    }
  }
}

.right-enter-active,
.right-leave-active {
  transition: all 0.2s ease-in;
}
.right-enter, .right-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translateX(50px);
  opacity: 0;
}

.left-enter-active,
.left-leave-active {
  transition: all 0.2s ease-in;
}
.left-enter, .left-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translateX(-50px);
  opacity: 0;
}
</style>

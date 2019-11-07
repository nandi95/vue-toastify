<template>
  <div>
    <transition :name="transition">
      <div
        v-if="isVisible"
        class="vt-notification"
        :style="notificationStyle"
        :class="{
          'vt-theme-light': lightTheme,
          'vt-theme-dark': !lightTheme,
          'vt-cursor-loading': mode === 'loader'
        }"
        @click="dismiss()"
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
        <div class="vt-icon-container" v-if="status !== null && status.icon">
          <div class="vt-icon" v-html="status.icon"></div>
        </div>
        <div v-else-if="mode === 'loader'" class="vt-icon-container">
          <div class="vt-spinner"></div>
        </div>
        <div
          v-else-if="mode === 'prompt'"
          class="vt-icon-container vt-circle"
          :class="{ promptDark: !lightTheme, promptLight: lightTheme }"
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
        <div class="vt-buttons" v-if="mode === 'prompt'">
          <button
            v-for="(value, answerProperty, index) in promptAnswers"
            :key="index"
            @click="respond(value)"
            v-text="answerProperty"
          ></button>
        </div>
      </div>
    </transition>
  </div>
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
  name: "Toast",
  filters: {
    capitalise(value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  },
  props: {
    // todo - move to the container
    status: { type: Object, default: null },
    lightTheme: { type: Boolean, default: false },
    defaultTitle: { type: Boolean, default: true },
    errorDuration: { type: Number, default: 8000 },
    successDuration: { type: Number, default: 4000 },
    alertInfoDuration: { type: Number, default: 6000 },
    withBackdrop: { type: Boolean, default: false },
    canPause: { type: Boolean, default: false },
    bodyMaxWidth: { type: Number, default: 250 },
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
      colorClass: {},
      notificationStyle: {},
      transitionName: "",
      title: "",
      body: "",
      mode: "",
      promptAnswers: null,
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
    if (this.status !== null) {
      this.startController();
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
    }
  },
  beforeMount() {
    if (this.status !== null) {
      this.setData(this.status);
    }
    //dynamic positioning
    this.notificationStyle["minWidth"] =
      "calc(100% + " + this.containerAdjustment + "px)";
  },
  methods: {
    startController() {
      this.toggleVisibility();
      if (this.timesOut) {
        this.$root.$emit("vtStarted", { id: this.status.id });
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
    },
    toggleVisibility() {
      // if notification manually dismissed AND is visible AND isn't prompt or loader
      if (
        ((Math.ceil(this.progress) < 100 && this.progress !== 0) ||
          this.timesOut === false) &&
        this.isVisible &&
        ["prompt", "loader"].indexOf(this.mode) === -1
      ) {
        this.$root.$emit("vtDismissed", { id: this.status.id });
      }
      // if the loader has finished
      if (
        Math.ceil(this.progress) === 100 &&
        ["prompt", "loader"].indexOf(this.mode) === -1
      ) {
        this.$root.$emit("vtFinished", { id: this.status.id });
      }
      this.isVisible = !this.isVisible;
      this.progress = 0;

      //if there's one, clear it
      window.clearTimeout(this.timerId);
      this.timerId = null;
      if (this.progressId) {
        cancelAnimationFrame(this.progressId);
        this.progressId = null;
      }
      // set to null in case it is in history mode and will be re-used
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
          if (status.defaultTitle === true) {
            title =
              this.titleToDefault &&
              (status.mode !== "prompt" && status.mode !== "loader")
                ? "info"
                : "";
          } else {
            title =
              status.defaultTitle &&
              (status.mode !== "prompt" && status.mode !== "loader")
                ? "info"
                : "";
          }
        }
      }
      return title;
    },
    setData(status) {
      this.body = status.body;
      this.pausable = status.canPause === true ? status.canPause : false;
      this.mode = status.mode;
      this.promptAnswers =
        status.answers && Object.keys(status.answers).length > 0
          ? status.answers
          : { Yes: true, No: false };
      this.timesOut =
        status.mode === "prompt" || status.mode === "loader"
          ? false
          : status.canTimeout !== false;
      this.notificationStyle["cursor"] =
        status.mode === "loader" ? "wait" : "default";
      this.titleToDefault =
        status.defaultTitle === true &&
        (status.mode !== "prompt" || status.mode !== "loader");
      this.title = this.decideTitle(status);
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
      this.timerFinishesAt = new Date(duration + Date.now());
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
          this.$root.$emit("vtResumed", { id: this.status.id });
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
        this.$root.$emit("vtPaused", { id: this.status.id });
        this.timerPausedAt = new Date();
      }
    },
    progressBar() {
      if (this.progress < 100) {
        const wholeTime =
          this.timerFinishesAt.getTime() - this.timerStartedAt.getTime();
        const elapsed = Date.now() - this.timerStartedAt.getTime();

        this.progress = (elapsed / wholeTime) * 100;

        // if timer is running
        if (this.timerId) {
          this.progressId = requestAnimationFrame(this.progressBar);
        }
      } else {
        this.progressId = cancelAnimationFrame(this.progressId);
      }
    },
    dismiss() {
      if (this.mode !== "prompt" && this.mode !== "loader") {
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
.vt-notification {
  box-shadow: 0 0 10px 0.5px rgba(0, 0, 0, 0.35);
  padding: 5% 2%;
  max-width: max-content;
  width: auto;
  border-radius: 5px;
  margin: 2.5px auto;
  z-index: 9999;
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
      overflow: hidden;
      transition: max-width 1ms ease-in-out;
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
  & > .vt-circle {
    border-style: solid;
    border-width: 2px;
    width: 65px;
    height: 65px;
    border-radius: 50%;
    margin: 5px !important;
  }
  & > .vt-icon-container {
    margin: 0 20px;
    position: relative;
    & > .vt-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  & > .vt-buttons {
    flex-basis: 100%;
    display: flex;
    flex-flow: row wrap;
    align-content: center;
    align-items: center;
    justify-content: space-evenly;
    margin: 5px -23px 0;
    & > button {
      flex-basis: 48%;
      width: auto;
      margin-bottom: 4px;
      border-radius: 4px;
    }
  }
}
.vt-cursor-loading {
  cursor: wait;
}

.vt-spinner {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: transparent;
  animation: 1s spin linear infinite;
}

@-webkit-keyframes spin {
  from {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes spin {
  from {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

.vt-theme-dark {
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
  & > .vt-buttons {
    & > button {
      border: solid 1px lighten($backgroundColor, 10%);
      background-color: lighten($backgroundColor, 10%);
      color: lighten($backgroundColor, 75%);
      transition: all 0.2s ease-out;
      &:hover {
        background-color: lighten($backgroundColor, 65%);
        color: lighten($backgroundColor, 5%);
        transition: all 0.2s ease-out;
      }
    }
  }
  & > .promptDark {
    & > .vt-icon > svg {
      fill: lighten($backgroundColor, 70%);
    }
    border-color: lighten($backgroundColor, 70%);
  }
  & > .vt-icon-container > .vt-spinner {
    border: 2px solid lighten($backgroundColor, 30%);
    border-top: 2px solid lighten($backgroundColor, 90%);
  }
}
.vt-theme-light {
  $backgroundColor: #f0f0f0;
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
  & > .vt-buttons {
    & > button {
      border: solid 1px darken($backgroundColor, 10%);
      background-color: darken($backgroundColor, 20%);
      color: darken($backgroundColor, 75%);
      transition: all 0.2s ease-out;
      &:hover {
        background-color: darken($backgroundColor, 55%);
        color: darken($backgroundColor, 5%);
        transition: all 0.2s ease-out;
      }
    }
  }
  & > .promptLight {
    & > .vt-icon > svg {
      fill: darken($backgroundColor, 70%);
    }
    border-color: darken($backgroundColor, 70%);
  }
  & > .vt-icon-container > .vt-spinner {
    border: 2px solid darken($backgroundColor, 30%);
    border-top: 2px solid darken($backgroundColor, 90%);
  }
}

.right-enter-active,
.left-enter-active,
.bottom-enter-active,
.top-enter-active,
.center-enter-active {
  transition: all 0.2s ease-out;
}

.right-leave-active,
.left-leave-active,
.bottom-leave-active,
.top-leave-active,
.center-leave-active {
  transition: all 0.2s ease-in;
}

.right-enter,
.right-leave-to {
  transform: translateX(50px);
  opacity: 0;
}

.left-enter,
.left-leave-to {
  transform: translateX(-50px);
  opacity: 0;
}

.bottom-enter,
.bottom-leave-to {
  margin-bottom: -50px;
  opacity: 0;
}

.top-enter,
.top-leave-to {
  margin-top: -50px;
  opacity: 0;
}

.center-enter,
.center-leave-to {
  opacity: 0;
}
</style>

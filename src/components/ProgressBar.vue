<template>
  <div class="vt-progress-bar" v-show="!hideProgressbar">
    <div class="vt-progress" :style="{ width: this.progress + '%' }"></div>
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
  name: "ProgressBar",
  props: {
    canPause: { type: Boolean },
    canTimeout: { type: Boolean },
    isHovered: { type: Boolean },
    hideProgressbar: { type: Boolean },
    duration: { type: Number },
    id: { type: String }
  },
  beforeMount() {
    this.timerFinishesAt = new Date(this.duration + Date.now());
  },
  mounted() {
    this.$root.$emit("vtStarted", { id: this.id });
    // start of the timer (a constant)
    this.timerStartedAt = new Date();
    // initial time to calculate with on the first start
    this.timerPausedAt = new Date();

    if (!this.canPause) {
      // set new timeout
      this.timerId = window.setTimeout(
        () => this.$emit("vtFinished"),
        this.timerFinishesAt.getTime() - Date.now()
      );
      // animation start
      this.progressId = requestAnimationFrame(this.progressBar);
    }
    this.timerStart();
  },
  data() {
    return {
      progress: 0,
      progressId: null,
      timerId: null,
      timerStartedAt: null,
      timerPausedAt: null,
      timerFinishesAt: null
    };
  },
  methods: {
    timerStart() {
      if (this.canPause) {
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
          this.$root.$emit("vtResumed", { id: this.id });
        }

        // set new timeout
        this.timerId = window.setTimeout(
          () => this.$emit("vtFinished"),
          this.timerFinishesAt.getTime() - Date.now()
        );
        // animation start
        this.progressId = requestAnimationFrame(this.progressBar);
      }
    },
    timerPause() {
      if (this.canPause) {
        // stop notification from closing
        window.clearTimeout(this.timerId);
        // set to null so animation won't stay in a loop
        this.timerId = null;
        // stop loader animation from progressing
        cancelAnimationFrame(this.progressId);
        this.progressId = null;
        this.$root.$emit("vtPaused", { id: this.id });
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
    }
  },
  watch: {
    isHovered: function(boolean) {
      if (boolean) {
        this.timerPause();
      } else {
        this.timerStart();
      }
    }
  },
  beforeDestroy() {
    this.progress = 0;
    window.clearTimeout(this.timerId);
    if (this.progressId) {
      cancelAnimationFrame(this.progressId);
      this.progressId = null;
    }
  }
};
</script>

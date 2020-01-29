<template>
  <transition-group
    :name="transition.name ? transition.name : transition"
    v-bind:css="true"
    tag="div"
    :move-class="transition.moveClass ? transition.moveClass : 'vt-move'"
    @leave="leave"
    @before-enter="beforeEnter"
    @after-enter="afterEnter"
    @before-leave="beforeLeave"
  >
    <slot />
  </transition-group>
</template>

<script>
export default {
  name: "Transition",
  props: {
    transition: { type: [String, Object], required: true },
    position: { type: String, required: true }
  },
  methods: {
    leave(el) {
      const position = this.position.split("-");
      // https://forum.vuejs.org/t/transition-group-move-class-not-occuring-in-the-array/6381/5
      // these rules ensure the toast stays where it is
      const { height, width, marginBottom } = window.getComputedStyle(el);
      // when the last toast removed the container collapses hence the need for the width subtraction
      el.style.left =
        (el.offsetLeft -
          (el.parentNode.childNodes.length === 1 ? parseInt(width) : 0)) /
          2 +
        "px";
      el.style.top = el.offsetTop + "px";
      if (position[0] === "center") {
        el.style.top =
          parseInt(el.style.top) -
          parseInt(height) / 2 -
          parseInt(marginBottom) / 2 +
          "px";
      }
      if (position[0] === "bottom") {
        el.style.top =
          parseInt(el.style.top) -
          parseInt(height) -
          parseInt(marginBottom) +
          "px";
      }
      // absolute position may messes with the width so lets set to initial
      el.style.width = width;
      el.style.position = "absolute";
    },
    beforeEnter() {
      // no delay on making space for notification
      this.$el.childNodes.forEach(node => delete node.dataset.delayed);
    },
    afterEnter(el) {
      el.classList.add("vt-default-position");
    },
    beforeLeave(el) {
      // this ensures that notifications won't move until the other has been removed
      for (let i = 0; i < el.parentNode.childNodes.length; i++) {
        if (el.parentNode.childNodes[i].isSameNode(el)) {
          continue;
        }
        el.parentNode.childNodes[i].dataset.delayed = true;
      }
      el.classList.remove("vt-default-position");
    }
  }
};
</script>

<template>
  <transition-group
    :name="transition.name ? transition.name : transition"
    v-bind:css="true"
    tag="div"
    :move-class="transition.moveClass ? transition.moveClass : 'vt-move'"
    @leave="setAbsolutePosition"
  >
    <slot></slot>
  </transition-group>
</template>

<script>
export default {
  name: "Transition",
  props: {
    transition: { type: [String, Object], required: true }
  },
  methods: {
    setAbsolutePosition(el) {
      // https://forum.vuejs.org/t/transition-group-move-class-not-occuring-in-the-array/6381/5
      // these rules ensure the toast stays where it is
      const { height, width, marginBottom } = window.getComputedStyle(el);
      // when the last toast removed the container collapses hence the need for the width subtraction
      el.style.left =
        el.offsetLeft -
        (el.parentNode.childNodes.length === 1 ? parseInt(width) : 0) +
        "px";
      el.style.top =
        el.offsetTop - parseInt(height) - parseInt(marginBottom) + "px";

      el.style.position = "absolute";
    }
  }
};
</script>

<style>
.vt-move {
  transition-timing-function: ease-out;
  transition-property: all;
  transition-duration: 200ms;
}
</style>

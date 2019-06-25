import VueToastify from "./VueToastify.vue";

export default {
  install(Vue) {
    Vue.component("vue-toastify", VueToastify);
  }
};

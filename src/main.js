import Vue from "vue";
import App from "./App.vue";
import "tailwindcss/tailwind.css";

Vue.config.productionTip = false;
window.EventBus = new Vue();

new Vue({
  render: h => h(App)
}).$mount("#app");

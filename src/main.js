import Vue from "vue";
import App from "./App.vue";
import VueToastify from "vue-toastify";
import "@/assets/styles/main.css";

Vue.config.productionTip = false;
Vue.config.performance = true;

Vue.use(VueToastify);

new Vue({
    render: h => h(App)
}).$mount("#app");

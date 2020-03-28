import Vue from "vue";
import App from "./App.vue";
import "tailwindcss/tailwind.css";
import VueToastify from "./VueToastify";

Vue.config.productionTip = false;
Vue.config.performance = true;

Vue.use(VueToastify);

new Vue({
    render: h => h(App)
}).$mount("#app");

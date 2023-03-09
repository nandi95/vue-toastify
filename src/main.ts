import { createApp } from 'vue';
import App from './App.vue';
import VueToastify from './VueToastify';
import './assets/style.scss';

createApp(App).use(VueToastify).mount('#app');

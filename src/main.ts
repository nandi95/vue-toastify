import { createApp } from 'vue';
import App from './App.vue';
import plugin from './index';
import './assets/style.scss';

createApp(App).use(plugin).mount('#app');

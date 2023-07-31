import { createApp } from 'vue';
import App from './App.vue';
import plugin from './index';
import './assets/index.scss';
import './assets/toast.scss';

createApp(App).use(plugin).mount('#app');

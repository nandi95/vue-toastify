import { createApp } from 'vue';
import App from './App.vue';
import plugin from './index';

createApp(App).use(plugin).mount('#app');

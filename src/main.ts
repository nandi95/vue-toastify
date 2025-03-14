import { createApp } from 'vue';
import App from './App.vue';
import plugin from './index';
import type { Settings } from './type';
import './assets/toast.scss';
import './assets/themes/dark.scss';
import './assets/themes/light.scss';

createApp(App).use<Settings>(plugin, {}).mount('#app');

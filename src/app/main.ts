import { createApp } from 'vue';

import '@arco-design/web-vue/dist/arco.css';

import { ArcoVue } from './providers/arco';
import { pinia } from './providers/pinia';
import { router } from './router';
import App from './App.vue';

import '@shared/styles/global.css';
import '@shared/styles/arco-theme.css';

createApp(App).use(pinia).use(router).use(ArcoVue).mount('#app');

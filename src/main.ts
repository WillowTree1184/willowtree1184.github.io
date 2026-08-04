import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import Vue3Marquee from 'vue3-marquee';

import './style/main.scss';

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('SW registered'))
        .catch((err) => console.error('SW failed', err));
}

const app = createApp(App);

app.use(router);
app.use(Vue3Marquee);

app.mount('#app');

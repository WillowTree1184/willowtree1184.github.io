import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            name: 'Home',
            path: '/',
            component: () => import('@/views/HomeView.vue'),
        },
        {
            name: 'Personal philosophy',
            path: '/philosophy',
            component: () => import('@/views/PhilosophyView.vue'),
        },
    ],
});

export default router;

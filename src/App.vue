<script setup lang="ts">
import Lenis from 'lenis';
import { ref } from 'vue';
import LoadingView from './component/LoadingView.vue';
import TransitionView from './component/TransitionView.vue';

const lenis = new Lenis({
    autoRaf: false,
    autoResize: true,
});

function raf(time: number) {
    lenis.raf(time * (ready ? 1 : 1));
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

const ready = ref(false);
</script>

<template>
    <!-- <header class="center-content flex justify-between">
        <div class="text-level-4">
            <p>WillowTree1184#1184</p>
        </div>
        <div class="text-level-4">
            <a target="_blank" href="https://github.com/WillowTree1184">GitHub</a>
        </div>
    </header> -->
    <div class="center-content">
        <RouterView></RouterView>
        <LoadingView @ready="ready = true"></LoadingView>
        <TransitionView v-if="ready"></TransitionView>
    </div>
</template>

<style scoped>
.center-content {
    max-width: 36em;
    margin: auto;
    padding-left: 2em;
    padding-right: 2em;
}

/* header {
    padding: 1.5em 0;
} */
</style>

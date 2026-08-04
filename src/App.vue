<script setup lang="ts">
import Lenis from 'lenis';
import { ref } from 'vue';
import Loading from './component/Loading.vue';

const lenis = new Lenis({
    autoRaf: false,
    autoResize: true,
});

function raf(time: number) {
    lenis.raf(time * 2 * (ready ? 1 : 0));
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
        <Loading @ready="ready = true"></Loading>
        <div class="gap-left-px-1 gap-top-em-1"></div>
        <div class="gap-left-px-1 gap-top-em-1">
            <b class="text-4 text-level-3 uppercase">Coming Soon</b>
            <p>网站正在构建中</p>
        </div>
        <div class="gap-left-px-1 gap-top-em-1"></div>
    </div>
</template>

<style scoped>
.center-content {
    max-width: 44em;
    margin: auto;
    padding-left: 4em;
    padding-right: 4em;
}

/* header {
    padding: 1.5em 0;
} */
</style>

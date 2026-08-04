
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { preloadImages, preloadFonts, waitForWindowLoad } from '@/utils/preload'
import { Vue3Marquee } from 'vue3-marquee'

const visible = ref(true)
const progress = ref(0)
const log = ref<{ status: string; msg: string }>()

const emit = defineEmits(['ready'])

function addLog(status: string, msg: string) {
    log.value = { status, msg };
}

async function boot() {
    const startTime = Date.now()
    const MIN_LOAD_TIME = 800

    performance.clearResourceTimings()

    addLog('INFO', 'System initializing...')
    progress.value = 10
    await new Promise(r => setTimeout(r, 100))

    // Wait Resources
    await waitForWindowLoad()
    addLog('DONE', 'Core modules loaded')
    progress.value = 30
    await new Promise(r => setTimeout(r, 100))

    // Wait Fonts
    addLog('INFO', 'Loading fonts...')
    await preloadFonts()
    addLog('DONE', 'Font assets loaded')
    progress.value = 50
    await new Promise(r => setTimeout(r, 100))

    // Wait Images
    addLog('INFO', 'Decoding image assets...')
    await preloadImages()
    addLog('DONE', 'Image textures ready')
    progress.value = 80
    await new Promise(r => setTimeout(r, 100))

    addLog('INFO', 'Rendering interface...')
    progress.value = 95
    const elapsed = Date.now() - startTime
    const remain = Math.max(0, MIN_LOAD_TIME - elapsed)
    if (remain > 0) await new Promise(r => setTimeout(r, remain))

    progress.value = 100
    addLog('DONE', 'System ready')

    await new Promise(r => setTimeout(r, 800)) // 让用户看到 100%
    visible.value = false
}

function onAfterLeave() {
    emit('ready')
    // 恢复滚动
    document.body.style.height = '';
    document.body.style.overflowY = ''
}

onMounted(() => {
    // 加载期间禁止滚动
    document.body.style.height = '100svh';
    document.body.style.overflowY = 'hidden'
    boot()
})
</script>

<template>
    <Transition name="loading-fade" @after-leave="onAfterLeave">
        <div v-if="visible" class="component" aria-busy="true" aria-label="加载中">
            <div class="container text-level-2">
                <p class="text-2">initializing</p>
                <h1>
                    <p>WillowTree1184's</p>
                    <p>Personal Website</p>
                </h1>
                <p class="gap-top-8 text-level-4 flex justify-between align-baseline">
                    <span>
                        <span class="text-3 nowap">{{ log?.status }} |&nbsp;</span>
                        <span class="gap-left-px-4">{{ log?.msg }}&nbsp;</span>
                    </span>
                    <span class="progress-text">{{ progress.toFixed(0) }}%</span>
                </p>

                <div class="loading-progress">
                    <div class="progress-track">
                    <div class="progress-bar" :style="{ width: `${progress}%` }" />
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.component {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    inset: 0;
    background: var(--background-1);
    z-index: 9999;
}

.container {
    width: 100%;
    max-width: 25em;
}

.loading-progress {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.progress-track {
    flex: 1;
    height: 2px;
    background: var(--background-4);
    position: relative;
    overflow: hidden;
}

.progress-bar {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background: var(--text-1);
    transition: width 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

/* 过渡动画 */
.loading-fade-leave-active {
    transition: opacity 0.6s ease, transform 0.6s ease, filter 0.6s ease;
}

.loading-fade-leave-to {
    opacity: 0;
    transform: scale(0.98);
    filter: blur(15px);
}
</style>